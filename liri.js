require("dotenv").config();

var fs = require("fs");
var keys = require("./keys.js");
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var request = require("request");

var input = process.argv;
var action = process.argv[2];
var arg2 = "";

// Combining the command line arguments to pass them through as either a song or movie
for (var j = 3; j < input.length; j++) {
  arg2 = arg2 + " " + input[j];
}

// determining which function to run based off argv[2]
if (action == "movie-this") {
  console.log("finally something went right");
  // if movie title was given, send arg2 if not, send Mr. Nobody
  if (arg2) {
    movieThis(arg2);
  } else {
    var nobody = "Mr. Nobody";
    movieThis(nobody);
  }
} else if (action == "my-tweets") {
  console.log("Printing Tweets");
  console.log("----------------");
  twitter();
} else if (action == "spotify-this-song") {
  console.log("SPOTIFY SONG");
  // if arg2 exists, run spotifySong with arg2 as the value
  if (arg2) {
    spotifySong(arg2);
  } else {
    //if there is no arg2, us The Sign as the default value
    var defaultSong = "The Sign";
    spotifySong(defaultSong);
  }
} else if (action == "do-what-it-says") {
  doWhat();
}

// calling the twitter response for statuses and timelines
function twitter() {
  var client = new Twitter(keys.twitter);
  var params = { screen_name: "feartheturtle88" };
  client.get("statuses/user_timeline", params, function(
    error,
    tweets,
    response
  ) {
    // If there are less than 20 tweets available - run a for loop and show as many as possible
    if (!error && tweets.length < 20) {
      for (i = 0; i < tweets.length; i++) {
        console.log("----------------------");
        console.log(tweets[i].text);
      }
    } else {
      //if there are more than 20 tweets available - only show last 20
      for (i = 0; i < 20; i++) {
        console.log("------------------------");
        console.log(tweets[i].text);
      }
    }
  });
}

//get movie JSON from OMDP if arg1 === movie-this
// movieName = combined command line values (arg2)
function movieThis(movieName) {
  var queryUrl =
    "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

  request(queryUrl, function(error, response, body) {
    // If the request is successful
    if (!error && response.statusCode === 200) {
      // Console log all necessary data points
      console.log(JSON.parse(body));
      console.log("Title: " + JSON.parse(body).Title);
      console.log("Release Year: " + JSON.parse(body).Year);
      console.log("Rated: " + JSON.parse(body).Rated);
      console.log(
        "Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value
      );
      console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
      console.log("Produced In: " + JSON.parse(body).Country);
      console.log("Laguage: " + JSON.parse(body).Language);
      console.log("Plot: " + JSON.parse(body).Plot);
      console.log("Actors: " + JSON.parse(body).Actors);
    }
  });
}

function spotifySong(song) {
  var spotify = new Spotify(keys.spotify);

  spotify.search({ type: "track", query: song, limit: 1 }, function(err, data) {
    if (err) {
      return console.log("Error occurred: " + err);
    }
    console.log("      Spotify      ");
    console.log("-----------------");
    console.log("Artist: " + data.tracks.items[0].artists[0].name);
    console.log("-----------------");
    console.log("Song: " + data.tracks.items[0].name);
    console.log("-----------------");
    console.log("Track: " + data.tracks.href);
    console.log("-----------------");
    console.log("Album: " + data.tracks.items[0].album.name);
    console.log("-----------------");
  });
}

function doWhat() {
  fs.readFile("random.txt", "utf8", function(err, data) {
    if (err) {
      return console.log(err);
    }

    // Break the string down by comma separation and store the contents into the output array.
    var output = data.split(",");
    var array = [];

    // Loop Through the newly created output array
    for (var i = 0; i < output.length; i++) {
      // push the split data to an array
      array.push(output[i]);
    }
    // the second value is the song, pass it to spotify function
    spotifySong(array[1]);
  });
}
