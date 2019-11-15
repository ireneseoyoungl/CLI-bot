require("dotenv").config();
const keys = require("./keys.js");
const Spotify = require('node-spotify-api');
const spotify = new Spotify(keys.spotify);
const axios = require('axios');
const moment = require('moment');
const fs = require('fs');
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
                    let venue = allEvents[i].venue.name
                    let venueLoc = `${allEvents[i].venue.city}, ${allEvents[i].venue.country}`;
                    let dateRaw = allEvents[i].datetime.slice(0, 10);
                    //let date = moment(dateRaw, "M/DD/YYYY");
                    let date = moment(allEvents[i].datetime).format("L").replace(/\//g, "-");
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

    const callOMDB = (param) => {
        axios({
            method: 'get',
            url: `http://www.omdbapi.com/?apikey=trilogy&t=${param === "" ? "Mr. Nobody" : param}`,
            responseType: 'json'
        })
            .then(function (response) {
                let data = response.data;
                let ratings = data.Ratings;
                let IMDBRating = 'N/A';
                let RTRating = 'N/A';
                ratings.forEach(rating => {
                    switch (rating.Source) {
                        case 'Internet Movie Database':
                            IMDBRating = rating.Value;
                            break;
                        case 'Rotten Tomatoes':
                            RTRating = rating.Value;
                            break;
                    }
                });
                console.log(`* Title: ${data.Title}
* Year: ${data.Year}
* IMDB Rating: ${IMDBRating}
* Rotten Tomatoes Rating of the movie: ${RTRating}
* Country where the movie was produced: ${data.Country}
* Language of the movie: ${data.Language}
* Plot of the movie: ${data.Plot}
* Actors in the movie: ${data.Actors}`);
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    const run = (command, param) => {
        switch (command) {
            case "spotify-this-song":
                callSpotify(param);
                break;
            case "concert-this":
                callBandInTown(param);
                break;
            case "movie-this":
                callOMDB(param);
                break;
            case "do-what-it-says":
                fs.readFile('random.txt', 'utf8', (err, data) => {
                    if (err) throw err;
                    command = data.split(",")[0]
                    song = data.split(",")[1]
                    run(command, song);
                });
                break;
        }
    };

    run(command, param);
}
catch (err) {
    console.log('error', err);
};



