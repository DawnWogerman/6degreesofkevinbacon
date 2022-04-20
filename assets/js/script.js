// BEGIN QUERY SELECTORS

// END QUERY SELECTORS



// BEGIN GLOBAL VARIABLES
var apiKeysArr = ["k_ch8rhqcw", "k_uf9wr72x", "k_r6e2bkjn"];
var apiKeyTracker = 1;
var apiKey = apiKeysArr[apiKeyTracker];
var currentActorObj = {};
var currentMovieObj = {};
var resultsArr = [];
var savedActorsArr = [];
var savedMoviesArr = [];
// END GLOABAL VARIABLES



// BEGIN FUNCTION DECLARATIONS
// Function for cycling through the available API keys
var apiKeyCycler = function () {
    // Increments the apiKeyTracker variable after the first two positions
    if (apiKeyTracker < 2) {
        apiKeyTracker++;
    }

    // Returns the apiKeyTracker variable to zero after the last position
    else {
        apiKeyTracker = 0;
    }
    // Reassigns the apiKey variable
    apiKey = apiKeysArr[apiKeyTracker];
    console.log(apiKey);
};

// Searches for an actor using the IMDb API. Only use this after we're done with the searchmovie() and movieChoice() functions
var searchActor = function (name) {
    // Creates the url by inserting one of the API keys and the name that was passed into the function
    fetch("https://imdb-api.com/en/API/SearchName/" + apiKey + "/" + name)
        // Runs an anonymous function on the response
        .then(function (response) {
            // Checks if the response was okay
            if (response.ok) {
                // Converts it to a JSON object
                response.json()
                    // Runs an anonymous function to handle the fetched data
                    .then(function (data) {
                        console.log(data);
                        // Loops through the results from the actor search and assigns the important information to the properties of an object
                        for (i = 0; i < data.results.length; i++) {
                            var actorResultObj = {
                                imgUrl: data.results[i].image,
                                fullName: data.results[i].title
                            };
                            // Adds the newly created object into the resultsArr array (this is the same array that receives the movie search results, so this function should only be used after we're done with the actor results)
                            resultsArr.push(actorResultObj);
                        };
                        // Cycles to the next API key in the array
                        apiKeyCycler();
                    });
            };
        });
};

// For use when the user is presented with the actor search results. It will return the object containing the important information for the actor they chose.
var actorChoice = function (name) {
    // Loops through the resultsArr to search for the correct object containing the actor name
    for (i = 0; i < resultsArr.length; i++) {
        if (resultsArr[i].fullName == name) {
            // Adds the actor to the savedActorsArr so that it can be added to local storage in order to decrease future API calls
            savedActorsArr.push(resultsArr[i]);
            // Returns the object with the actor's name and a url for a picture. Should be captured by a variable for use elsewhere.
            return resultsArr[i];
        };
    };
};

// Searches for a movie using the IMDb API. Only use this after we're done with the searchActor() and actorChoice() functions
var searchMovie = function (movie) {
    // Creates the url by inserting one of the API keys and the movie title that was passed into the function
    fetch("https://imdb-api.com/en/API/SearchMovie/" + apiKey + "/" + movie)
        // Runs an anonymous function on the response
        .then(function (response) {
            // Checks if the response was okay
            if (response.ok) {
                // Converts it to a JSON object
                response.json()
                    // Runs an anonymous function to handle the fetched data
                    .then(function (data) {
                        console.log(data);
                        // Loops through the results from the movie search and assigns the important information to the properties of an object
                        for (i = 0; i < data.results.length; i++) {
                            var movieResultObj = {
                                description: data.results[i].description,
                                id: data.results[i].id,
                                imgUrl: data.results[i].image,
                                title: data.results[i].title
                            };
                            // Adds the newly created object into the resultsArr array (this is the same array that receives the actor search results, so this function should only be used after we're done with the actor results)
                            resultsArr.push(movieResultObj);
                        };
                        // Cycles to the next API key in the array
                        apiKeyCycler();
                    });
            };
        });
};

// For use when the user is presented with the movie search results. It will return the object containing the important information for the movie they chose.
var movieChoice = function (movie) {
    // Loops through the resultsArr to search for the correct object containing the movie title
    for (i = 0; i < resultsArr.length; i++) {
        if (resultsArr[i].title == movie) {
            // Adds the movie to the savedMoviesArr so that it can be added to local storage in order to decrease future API calls
            savedMoviesArr.push(resultsArr[i]);
            // Returns the object with the movie's title and a url for a picture. Should be captured by a variable for use elsewhere.
            return resultsArr[i];
        };
    };
};

// Function for saving movie and actor search results
var saveHistory = function () {
    localStorage.setItem("Movies", JSON.stringify(savedMoviesArr));
    localStorage.setItem("Actors", JSON.stringify(savedActorsArr));
};

// Function for loading movie and actor search results
var loadHistory = function () {
    savedMoviesArr = localStorage.getItem("Movies");
    savedActorsArr = localStorage.getItem("Actors");
};
// END FUNCTION DECLARATIONS



// BEGIN EVENT LISTENERS

// END EVENT LISTENERS



// BEGIN FUNCTIONS TO RUN ON LOAD
console.log(apiKey);
// END FUNCTIONS TO RUN ON LOAD