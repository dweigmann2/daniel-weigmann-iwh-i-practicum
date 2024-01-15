const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = 'pat-eu1-07a17175-8861-4ab0-95d3-c27ed356c2c5';

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.
app.get('/', async (req, res) => {
    const gamesEndpoint = 'https://api.hubspot.com/crm/v3/objects/games?properties=name&properties=release_date&properties=publisher';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }

    try {
        const response = await axios.get(gamesEndpoint, { headers });
        const games = response.data.results || [];
        //console.log('games',games);
        res.render('homepage', { title: 'Homepage', games });
    } catch (error) {
        console.error(error);
    }
});


// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.
app.get('/update-cob', async (req, res) => {
    const games = 'https://api.hubspot.com/crm/v3/objects/games';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        const response = await axios.get(games, { headers });
        const data = response.data.results;
        res.render('updates', { title: 'Update Custom Object Form | Integrating With HubSpot I Practicum', game: data[0].properties.game }); 
    } catch (error) {
        console.error(error);
    }
});

// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.
app.post('/update-cob', async (req, res) => {
    const update = {
        properties: {
            "name": req.body.gameName,
            "release_date": req.body.releaseDate,
            "publisher": req.body.publisher
        }
    };

    //console.log('properties', update);
    const updateGames = 'https://api.hubspot.com/crm/v3/objects/games';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try { 
        await axios.post(updateGames, update, { headers });
        res.redirect('/');
    } catch(err) {
        console.error(err);
        res.status(500).send('Error.');
    }
});

app.listen(3000, () => console.log('Listening on http://localhost:3000'));
