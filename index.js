require("dotenv").config();
const keys = require("./keys.js");
const Spotify = require('node-spotify-api');
const spotify = new Spotify(keys.spotify);
const axios = require('axios');
const moment = require('moment');
moment().format();

try {
    const command = process.argv[2];
    const param = process.argv.slice(3, process.argv.length).join(" ");

    const callSpotify = (param) => {
        spotify.search({ type: 'track', query: param, limit: 1 })
            .then(response => {
                let data = response.tracks.items[0];
                let artists = data.artists[0].name;
                let song = data.name;
                let preview = data.external_urls.spotify;
                let album = data.album.name;
                console.log(`Artist: ${artists} \nSong: ${song} \nLink to Preview: ${preview} \nAlbum: ${album}`);
            })
            .catch(err => console.log(`Error is ${err}`)
            );
    };

    const callBandInTown = (param) => {
        axios({
            method: 'get',
            url: `https://rest.bandsintown.com/artists/${param}/events?app_id=codingbootcamp`,
            responseType: 'json'
        })
            .then(function (response) {
                let allEvents = response.data;
                for (let i = 0; i < allEvents.length; i++) {
                    let venue = allEvents[0].venue.name
                    let venueLoc = `${allEvents[0].venue.city}, ${allEvents[0].venue.country}`;
                    let dateRaw = allEvents[0].datetime.slice(0, 10);
                    //let date = moment(dateRaw, "M/DD/YYYY");
                    let date = moment(allEvents[0].datetime).format("L").replace(/\//g, "-");
                    console.log(`Event ${i + 1}:
    venue: ${venue}
    location: ${venueLoc}
    date: ${date}`);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    switch (command) {
        case "spotify-this-song":
            callSpotify(param);
            break;
        case "concert-this":
            callBandInTown(param);
            break;
        case "movie-this":
            break;
        case "do-what-it-says":
            break;
    };
}
catch (err) {
    console.log('error', err);
};



