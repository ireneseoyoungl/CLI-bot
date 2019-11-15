require("dotenv").config();
const keys = require("./keys.js");
const Spotify = require('node-spotify-api');

const spotify = new Spotify(keys.spotify);
try {
    const command = process.argv[2];
    const param = process.argv.slice(3, process.argv.length).join(" ");
    const call_spotify = (param) => {
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
    }

    switch (command) {
        case "spotify-this-song":
            call_spotify(param);
            break;
        case "concert-this":
            break;
        case "movie-this":
            break;
        case "do-what-it-says":
            break;
    };
}
catch (err) {
    console.log('error', err);

}



