// BEGIN QUERY SELECTORS
var movieInputEl = document.querySelector("#movie-search");
var searchMovieBtn = document.querySelector("#searchMovie");
var modalEl = document.querySelector(".modal");
var modalContentEl = document.querySelector(".modal-content");
var modalCloseBtn = document.querySelector(".modal-close");
// END QUERY SELECTORS



// BEGIN GLOBAL VARIABLES
var apiKeysArr = ["k_ch8rhqcw", "k_uf9wr72x", "k_r6e2bkjn"];
var apiKeyTracker = 0;
var apiKey = apiKeysArr[apiKeyTracker];
var currentActorObj = {};
var currentMovieObj = {};
var resultsArr = [];
var savedActorsArr = [];
var savedMoviesArr = [];
var chosenActor = {fullName: "Russell Crowe"};
var chosenMovie = null;
var fullCast = null;
var movieID = null;
var posterUrl = null;
var actorID = null;
var actorImg = null;
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
    // Resets resultsArr
    resultsArr = [];
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
                                fullName: data.results[i].title,
                                id: data.results[i].id,
                                description: data.results[i].description
                            };
                            // Adds the newly created object into the resultsArr array (this is the same array that receives the movie search results, so this function should only be used after we're done with the actor results)
                            resultsArr.push(actorResultObj);
                        };
                        // Cycles to the next API key in the array
                        apiKeyCycler();
                        console.log(resultsArr);
                    });
            };
        });
};

// For use when the user is presented with the actor search results. It will set the object containing the important information for the actor they chose in a global variable.
var actorChoice = function (id) {
    // Loops through the resultsArr to search for the correct object containing the actor id
    for (i = 0; i < resultsArr.length; i++) {
        if (resultsArr[i].id === id) {
            // Saves the object with the actor's information
            chosenActor = resultsArr[i];
            console.log(chosenActor);
        };
    };
    // Checks if savedActorsArr is not null
    if (savedActorsArr) {
        if (checkSavedActorsArr(chosenActor) == false) {
            // Adds the actor to the savedActorsArr so that it can be added to local storage in order to decrease future API calls
            savedActorsArr.push(chosenActor);
            // Saves the savedActorsArr in local storage
            saveHistory();
        }
    }

    // Creates a new array if savedActorsArr was null
    else {
        savedActorsArr = [chosenActor];
        // Saves the savedActorsArr in local storage
        saveHistory();
    }
};

// Searches for a movie using the IMDb API. Only use this after we're done with the searchActor() and actorChoice() functions
var searchMovie = function (movie) {
    // Resets resultsArr
    resultsArr = [];
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
                        console.log(resultsArr);
                        modalEl.classList.add("is-active");
                        clearModal();
                        createResultBtns("movie");
                    });
            };
        });
};

// For use when the user is presented with the movie search results. It will return the object containing the important information for the movie they chose.
var movieChoice = function (id) {
    // Loops through the resultsArr to search for the correct object containing the movie id
    for (i = 0; i < resultsArr.length; i++) {
        if (resultsArr[i].id === id) {
            // Saves the object with the movie's information
            chosenMovie = resultsArr[i];
            console.log(chosenMovie);
        };
    };
    // Checks if savedMoviesArr is not null
    if (savedMoviesArr) {
        if (checkSavedMoviesArr(chosenMovie) == false) {
            // Adds the Movie to the savedMoviesArr so that it can be added to local storage in order to decrease future API calls
            savedMoviesArr.push(chosenMovie);
            // Saves the savedMoviesArr in local storage
            saveHistory();
        }
    }

    // Creates a new array if savedMoviesArr was null
    else {
        savedMoviesArr = [chosenMovie];
        // Saves the savedMoviesArr in local storage
        saveHistory();
    }
    displayChoice();
};

// Gets the full cast of a movie and saves it in an array for comparison
var getFullCast = function (movieID) {
    // Creates the url by inserting one of the API keys and the movie ID that was passed into the function
    fetch("https://imdb-api.com/en/API/FullCast/" + apiKey + "/" + movieID)
        // Runs an anonymous function on the response
        .then(function (response) {
            // Checks if the response was okay
            if (response.ok) {
                // Converts it to a JSON object
                response.json()
                    // Runs an anonymous function to handle the fetched data
                    .then(function (data) {
                        console.log(data);
                        console.log(data.actors);
                        // Sets the returned cast data to the fullCast variable
                        fullCast = data.actors;
                        // Cycles to the next API key in the array
                        apiKeyCycler();
                    });
            };
        });
};

// Checks if an actor is listed in the full cast
var checkFullCast = function (name) {
    // Runs through the full cast and returns true (ending the function) if the name is found
    for (i = 0; i < fullCast.length; i++) {
        if (fullCast[i].name == name) {
            return true;
        };
    };

    // If the name wasn't found, the function will return false
    return false;
};

// Runs the checkFullCast function and will run different functions depending on the result
var checkFullCastHandler = function (name) {
    // Checks if checkFullCast returned true
    if (checkFullCast(name)) {
        console.log("true");
        correctChoiceHandler();
    }

    // Runs if checkFullCast returned false
    else {
        console.log("false");
    };
};

var correctChoiceHandler = function () {
    clearModal();
    var correctEl = document.createElement("h3");
    correctEl.classList.add("is-size-2", "has-text-centerd", "my-3");
    correctEl.textContent = "You got that right!";
    modalContentEl.appendChild(correctEl);
    var userChoiceEl = document.createElement("p");
    userChoiceEl.classList.add("has-text-centerd", "my-3");
    userChoiceEl.textContent = chosenActor.fullName + " was in \"" + chosenMovie.title + "\"";
    modalContentEl.appendChild(userChoiceEl);
}

// Checks if an object (the chosenActor object) is already saved in savedActorsArr
var checkSavedActorsArr = function (obj) {
    // Checks that savedActorsArr actually has anything in it
    if (savedActorsArr !== null) {
        // Loops through each object in the savedActorsArr array
        for (i = 0; i < savedActorsArr.length; i++) {
            // Checks if the ID's match
            if (savedActorsArr[i].id === obj.id) {
                // Returns true, ending the function, if it finds a match
                return true;
            }
        }
    };

    // If no match was found
    return false;
};

// Checks if an object (the chosenMovie object) is already saved in savedMoviesArr
var checkSavedMoviesArr = function (obj) {
    // Checks that savedMoivesArr actually has anything in it
    if (savedMoviesArr !== null) {
        // Loops through each object in the savedMoviesArr array
        for (i = 0; i < savedMoviesArr.length; i++) {
            // Checks if the ID's match
            if (savedMoviesArr[i].id === obj.id) {
                // Returns true, ending the function, if it finds a match
                return true;
            }
        }
    };

    // If no match was found
    return false;
};

// Function for saving movie and actor search results
var saveHistory = function () {
    localStorage.setItem("Movies", JSON.stringify(savedMoviesArr));
    localStorage.setItem("Actors", JSON.stringify(savedActorsArr));
};

// Function for loading movie and actor search results
var loadHistory = function () {
    savedMoviesArr = JSON.parse(localStorage.getItem("Movies"));
    savedActorsArr = JSON.parse(localStorage.getItem("Actors"));
};

var searchMovieBtnHandler = function () {
    var name = movieInputEl.value;
    console.log(name);
    searchMovie(name);
    movieInputEl.value = "";
    searchMovieBtn.classList.add("is-loading");
};

var clearModal = function () {
    var child = modalContentEl.lastElementChild;
    while (child) {
        child.remove();
        child = modalContentEl.lastElementChild;
    };
};

var createResultBtns = function (specialClass) {
    for (i = 0; i < resultsArr.length; i++) {
        var resultBtnEl = document.createElement("button");
        resultBtnEl.classList.add("button", "is-fullwidth", "m-1", specialClass);
        resultBtnEl.textContent = resultsArr[i].title + " " + resultsArr[i].description;
        resultBtnEl.setAttribute("data-id", resultsArr[i].id);
        resultBtnEl.setAttribute("data-url", resultsArr[i].imgUrl);
        modalContentEl.appendChild(resultBtnEl);
    };
    searchMovieBtn.classList.remove("is-loading");
};

var closeModal = function () {
    clearModal();
    modalEl.classList.remove("is-active");
};

var modalBtnHandler = function (event) {
    if (event.target.classList.contains("button") && event.target.classList.contains("movie")) {
        event.target.classList.add("is-loading");
        movieID = event.target.dataset.id;
        posterUrl = event.target.dataset.url;
        movieChoice(movieID);
        getFullCast(movieID);
    };

    if (event.target.classList.contains("button") && event.target.classList.contains("check-full-cast")) {
        checkFullCastHandler(chosenActor.fullName);
    }
}

var displayChoice = function () {
    clearModal();
    var choiceEl = document.createElement("h3");
    choiceEl.classList.add("is-size-2", "has-text-centerd", "my-3");
    choiceEl.textContent = "You have chosen " + chosenMovie.title + " " + chosenMovie.description;
    modalContentEl.appendChild(choiceEl);
    var continueBtn = document.createElement("button");
    continueBtn.classList.add("button", "is-fullwidth", "check-full-cast");
    continueBtn.textContent = "Check";
    modalContentEl.appendChild(continueBtn);
};
// END FUNCTION DECLARATIONS



// BEGIN EVENT LISTENERS
searchMovieBtn.addEventListener("click", searchMovieBtnHandler);
modalCloseBtn.addEventListener("click", closeModal);
modalContentEl.addEventListener("click", modalBtnHandler);
// END EVENT LISTENERS



// BEGIN FUNCTIONS TO RUN ON LOAD
loadHistory();
console.log(apiKey);
console.log(savedActorsArr);
// END FUNCTIONS TO RUN ON LOAD