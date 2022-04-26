// BEGIN QUERY SELECTORS
var movieInputEl = document.querySelector("#movie-search");
var searchMovieBtn = document.querySelector("#searchMovie");
var fromActorEl = document.querySelector("#fromActor");
var fromActorLabelEl = document.querySelector("#fromActorLabel");
var posterEl = document.querySelector("#poster");
var actorInputEl = document.querySelector("#actor-search");
var posterLabelEl = document.querySelector("#posterLabel");
var searchActorBtn = document.querySelector("#searchActor");
var toActorEl = document.querySelector("#toActor");
var toActorLabelEl = document.querySelector("#toActorLabel");
var modalEl = document.querySelector(".modal");
var modalContentEl = document.querySelector(".modal-content");
var modalCloseBtn = document.querySelector(".modal-close");
// END QUERY SELECTORS



// BEGIN GLOBAL VARIABLES
var apiKeysArr = ["k_ch8rhqcw", "k_uf9wr72x", "k_r6e2bkjn"];
var apiKeyTracker = 2;
var apiKey = apiKeysArr[apiKeyTracker];
var currentActorObj = {};
var currentMovieObj = {};
var resultsArr = [];
var savedActorsArr = [{ imgUrl: "https://imdb-api.com/images/original/MV5BMTQyMTExNTMxOF5BMl5BanBnXkFtZTcwNDg1NzkzNw@@._V1_Ratio0.7273_AL_.jpg", name: "Russell Crowe", id: "nm0000128", description: "(Actor, Les Misérables (2012))" }, { imgUrl: "https://imdb-api.com/images/original/MV5BMjQ2NTM4MzI4M15BMl5BanBnXkFtZTcwOTkxMjcxNA@@._V1_Ratio0.7273_AL_.jpg", name: "Djimon Hounsou", id: "nm0005023", description: "(Actor, Blood Diamond (2006))" }, { imgUrl: "https://imdb-api.com/images/original/MV5BMTU5NjEwOTgwMF5BMl5BanBnXkFtZTgwOTEzMDk1NTM@._V1_Ratio0.7273_AL_.jpg", name: "Zachary Levi", id: "nm1157048", description: "(Actor, Shazam! (2019))" }, { imgUrl: "https://imdb-api.com/images/original/MV5BNzEzMTI2NjEyNF5BMl5BanBnXkFtZTcwNTA0OTE4OA@@._V1_Ratio0.7273_AL_.jpg", name: "Idris Elba", id: "nm0252961", description: "(Actor, Beasts of No Nation (2015))" }, { imgUrl: "https://imdb-api.com/images/original/MV5BMTk0NjM2MTE5M15BMl5BanBnXkFtZTcwODIxMzcyNw@@._V1_Ratio0.7273_AL_.jpg", name: "Michael Fassbender", id: "nm1055413", description: "(I) (Actor, Shame (2011))" }, { imgUrl: "https://imdb-api.com/images/original/MV5BOTQxMTEyMjI0NV5BMl5BanBnXkFtZTgwODE4ODAzMjE@._V1_Ratio0.7273_AL_.jpg", name: "Kevin Bacon", id: "nm0000102", description: "(I) (Actor, Footloose (1984))" }, { imgUrl: "https://imdb-api.com/images/original/MV5BOTU3NDE5MDQ4MV5BMl5BanBnXkFtZTgwMzE5ODQ3MDI@._V1_Ratio0.7273_AL_.jpg", name: "Jennifer Lawrence", id: "nm2225369", description: "(III) (Actress, The Hunger Games (2012))" }, { imgUrl: "https://imdb-api.com/images/original/MV5BMTY1ODkwMTQxOF5BMl5BanBnXkFtZTcwNzkwNDcyMw@@._V1_Ratio0.7273_AL_.jpg", name: "Kevin Costner", id: "nm0000126", description: "(Actor, The Postman (1997))" }, { imgUrl: "https://imdb-api.com/images/original/MV5BMTk1MjM3NTU5M15BMl5BanBnXkFtZTcwMTMyMjAyMg@@._V1_Ratio0.7727_AL_.jpg", name: "Tom Cruise", id: "nm0000129", description: "(Actor, Top Gun (1986))" }, { imgUrl: "https://imdb-api.com/images/original/MV5BMTg2NTk2MTgxMV5BMl5BanBnXkFtZTgwNjcxMjAzMTI@._V1_Ratio0.7273_AL_.jpg", name: "Amy Adams", id: "nm0010736", description: "(III) (Actress, Arrival (2016))" }, { imgUrl: "https://imdb-api.com/images/original/MV5BMTRhNzQ3NGMtZmQ1Mi00ZTViLTk3OTgtOTk0YzE2YTgwMmFjXkEyXkFqcGdeQXVyNzg5MzIyOA@@._V1_Ratio0.7727_AL_.jpg", name: "Anne Hathaway", id: "nm0004266", description: "(Actress, Les Misérables (2012))" }];
var savedMoviesArr = [];
var chosenActor = {};
var chosenMovie = null;
var fullCast = null;
var movieID = null;
var posterUrl = null;
var actorID = null;
var actorImg = null;
var movieSearchPressed = false;
var actorSearchPressed = false;
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

var stringSlice = function (str) {
    if (str.length > 60) {
        var shortenedStr = str.slice(0, 59) + "...";
        return shortenedStr;
    }

    else {
        return str;
    }
};

var okResponseProblemDisplay = function (data) {
    displayModal();
    var errorMessageEl = document.createElement("h3");
    errorMessageEl.classList.add("is-size-2", "has-text-centerd", "my-3");
    errorMessageEl.textContent = data.errorMessage;
    modalContentEl.appendChild(errorMessageEl);
};

var searchProblemDisplay = function () {
    var errorMessageEl = document.createElement("h3");
    errorMessageEl.classList.add("is-size-2", "has-text-centerd", "my-3");
    errorMessageEl.textContent = "There was a problem with your search. Please try again.";
    modalContentEl.appendChild(errorMessageEl);
};

var catchDisplay = function () {
    displayModal();
    var errorMessageEl = document.createElement("h3");
    errorMessageEl.classList.add("is-size-2", "has-text-centerd", "my-3");
    errorMessageEl.textContent = "There was a problem connecting with IMDb";
    modalContentEl.appendChild(errorMessageEl);
};

// Chooses a random actor from the saved array to start the game
var randomStartingActor = function () {
    var possibleStartingActors = savedActorsArr.filter(function (actor) {
        return actor.name != "Kevin Bacon";
    })

    randomArrPosition = Math.floor(Math.random() * possibleStartingActors.length);
    chosenActor = possibleStartingActors[randomArrPosition];
    console.log(chosenActor.name);
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
                        if (data.errorMessage) {
                            console.log(data.errorMessage);
                            okResponseProblemDisplay(data);
                        }

                        else {
                            // Loops through the results from the actor search and assigns the important information to the properties of an object
                            for (i = 0; i < data.results.length; i++) {
                                var actorResultObj = {
                                    imgUrl: data.results[i].image,
                                    name: data.results[i].title,
                                    id: data.results[i].id,
                                    description: data.results[i].description
                                };
                                // Adds the newly created object into the resultsArr array (this is the same array that receives the movie search results, so this function should only be used after we're done with the actor results)
                                resultsArr.push(actorResultObj);
                            };
                            // Cycles to the next API key in the array
                            console.log(resultsArr);
                            displayModal();
                            createResultBtns("actor");
                        }
                        apiKeyCycler();
                    });
            }

            else {
                displayModal();
                searchProblemDisplay();
            }
        })

        .catch(function (error) {
            catchDisplay();
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
    displayChoiceActor();
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
                        if (data.errorMessage) {
                            console.log(data.errorMessage);
                            okResponseProblemDisplay(data);
                        }

                        else {
                            // Loops through the results from the movie search and assigns the important information to the properties of an object
                            for (i = 0; i < data.results.length; i++) {
                                var movieResultObj = {
                                    description: data.results[i].description,
                                    id: data.results[i].id,
                                    imgUrl: data.results[i].image,
                                    name: data.results[i].title
                                };
                                // Adds the newly created object into the resultsArr array (this is the same array that receives the actor search results, so this function should only be used after we're done with the actor results)
                                resultsArr.push(movieResultObj);
                            };
                            // Cycles to the next API key in the array
                            console.log(resultsArr);
                            displayModal();
                            createResultBtns("movie");
                        };
                        apiKeyCycler();
                    });
            }

            else {
                displayModal();
                searchProblemDisplay();
            };
        })

        .catch(function (error) {
            catchDisplay();
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
    displayChoiceMovie();
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
                        if (data.errorMessage == "") {
                            console.log(data.actors);
                            // Sets the returned cast data to the fullCast variable
                            fullCast = data.actors;
                            // Cycles to the next API key in the array
                        }

                        else {
                            okResponseProblemDisplay();
                            resetPoster();
                        }
                        apiKeyCycler();
                    });
            }

            else {
                displayModal();
                searchProblemDisplay();
            };
        })

        .catch(function (error) {
            catchDisplay();
        });
    document.querySelector(".is-loading").classList.remove("is-loading");
};

// Checks if an actor is listed in the full cast
var checkFullCast = function (id) {
    // Runs through the full cast and returns true (ending the function) if the ID is found
    for (i = 0; i < fullCast.length; i++) {
        if (fullCast[i].id == id) {
            return true;
        };
    };

    // If the name wasn't found, the function will return false
    return false;
};

// Runs the checkFullCast function and will run different functions depending on the result
var checkFullCastHandler = function (id) {
    // Checks if checkFullCast returned true
    if (checkFullCast(id)) {
        if (movieSearchPressed == true) {
            correctChoiceHandler("movie");
            movieSearchPressed = false;
        }

        else if (actorSearchPressed == true) {
            correctChoiceHandler("actor");
            actorSearchPressed = false;
        }
    }

    // Runs if checkFullCast returned false
    else {
        if (movieSearchPressed == true) {
            incorrectChoiceHandler("movie");
            movieSearchPressed = false;
        }

        else if (actorSearchPressed == true) {
            incorrectChoiceHandler("actor");
            actorSearchPressed = false;
        }
    };
};

var correctChoiceHandler = function (arg) {
    clearModal();
    var correctEl = document.createElement("h3");
    correctEl.classList.add("is-size-2", "has-text-centerd", "my-3");
    correctEl.textContent = "You got that right!";
    modalContentEl.appendChild(correctEl);
    var userChoiceEl = document.createElement("p");
    userChoiceEl.classList.add("has-text-centerd", "my-3");
    userChoiceEl.textContent = chosenActor.name + " was in \"" + chosenMovie.name + "\"";
    modalContentEl.appendChild(userChoiceEl);
    var continueBtn = document.createElement("button");
    if (arg == "movie" && chosenActor.name !== "Kevin Bacon") {
        continueBtn.classList.add("button", "is-fullwidth", "find-connection");
        continueBtn.textContent = "Find a Connecting Actor";
    }

    else if (arg == "actor" && chosenActor.name !== "Kevin Bacon") {
        continueBtn.classList.add("button", "is-fullwidth", "find-connection");
        continueBtn.textContent = "Find a Connecting Movie";
    }

    else {
        continueBtn.classList.add("button", "is-fullwidth", "victory");
        continueBtn.textContent = "Victory!"
    }
    modalContentEl.appendChild(continueBtn);
};

var incorrectChoiceHandler = function (arg) {
    clearModal();
    var correctEl = document.createElement("h3");
    correctEl.classList.add("is-size-2", "has-text-centerd", "my-3");
    correctEl.textContent = "I'm sorry, no.";
    modalContentEl.appendChild(correctEl);
    var userChoiceEl = document.createElement("p");
    userChoiceEl.classList.add("has-text-centerd", "my-3");
    userChoiceEl.textContent = chosenActor.name + " was not in \"" + chosenMovie.name + "\"";
    modalContentEl.appendChild(userChoiceEl);
    var continueBtn = document.createElement("button");
    continueBtn.classList.add("button", "is-fullwidth", "find-connection");
    if (arg == "movie") {
        continueBtn.textContent = "Find a Connecting Movie";
    }

    else if (arg == "actor") {
        continueBtn.textContent = "Find a Connecting Actor";
    }
    modalContentEl.appendChild(continueBtn);
    resetPoster();
};

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
    if (JSON.parse(localStorage.getItem("Movies"))) {
        savedMoviesArr = JSON.parse(localStorage.getItem("Movies"));
    };
    if (JSON.parse(localStorage.getItem("Actors"))) {
        savedActorsArr = JSON.parse(localStorage.getItem("Actors"));
    }
};

var searchMovieBtnHandler = function () {
    if (movieInputEl.value !== "") {
        var name = movieInputEl.value;
        console.log(name);
        searchMovie(name);
        movieInputEl.value = "";
        searchMovieBtn.classList.add("is-loading");
        movieSearchPressed = true;
    }
};

var displayModal = function () {
    modalEl.classList.add("is-active");
    clearModal();
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
        resultBtnEl.textContent = stringSlice(resultsArr[i].name + " " + resultsArr[i].description);
        resultBtnEl.setAttribute("data-id", resultsArr[i].id);
        resultBtnEl.setAttribute("data-url", resultsArr[i].imgUrl);
        modalContentEl.appendChild(resultBtnEl);
    };
    searchMovieBtn.classList.remove("is-loading");
};

var closeModal = function () {
    clearModal();
    modalEl.classList.remove("is-active");
    movieSearchPressed = false;
    actorSearchPressed = false;
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
        checkFullCastHandler(chosenActor.id);
    }

    if (event.target.classList.contains("button") && event.target.classList.contains("find-connection")) {
        if (event.target.textContent == "Find a Connecting Actor") {
            actorInputEl.focus();
            searchActorBtn.disabled = false;
            searchMovieBtn.disabled = true;
        }

        else if (event.target.textContent == "Find a Connecting Movie") {
            movieInputEl.focus();
            searchActorBtn.disabled = true;
            searchMovieBtn.disabled = false;
            resetDisplay();
        }
        closeModal();
    }

    if (event.target.classList.contains("button") && event.target.classList.contains("victory")) {
        victoryHandler();
    }

    if (event.target.classList.contains("button") && event.target.classList.contains("play-again")) {
        closeModal();
        newGame();
    }

    if (event.target.classList.contains("button") && event.target.classList.contains("actor")) {
        event.target.classList.add("is-loading");
        actorID = event.target.dataset.id;
        actorImg = event.target.dataset.url;
        actorChoice(actorID);
    };
};

var getMovieSynopsis = function () {
    fetch("http://www.omdbapi.com/?apikey=ce77b7fe&i=" + chosenMovie.id + "&plot")
        // Runs an anonymous function on the response
        .then(function (response) {
            // Checks if the response was okay
            if (response.ok) {
                // Converts it to a JSON object
                response.json()
                    // Runs an anonymous function to handle the fetched data
                    .then(function (data) {
                        console.log(data);
                        posterLabelEl.textContent = data.Plot;
                        posterLabelEl.classList.remove("is-invisible");
                    })
            }

            else {
                posterLabelEl.textContent = "Plot details not available";
                posterLabelEl.classList.remove("is-invisible");
            }
        })
        .catch(function (error) {
            posterLabelEl.textContent = "Unable to connect to OMDb";
            posterLabelEl.classList.remove("is-invisible");
        })
}

var displayChoiceMovie = function () {
    posterEl.setAttribute("src", chosenMovie.imgUrl);
    posterEl.setAttribute("alt", chosenMovie.name + " poster");
    getMovieSynopsis();
    clearModal();
    var choiceEl = document.createElement("h3");
    choiceEl.classList.add("is-size-2", "has-text-centerd", "my-3");
    choiceEl.textContent = "You have chosen " + chosenMovie.name + " " + chosenMovie.description;
    modalContentEl.appendChild(choiceEl);
    var continueBtn = document.createElement("button");
    continueBtn.classList.add("button", "is-fullwidth", "check-full-cast", "is-loading");
    continueBtn.textContent = "Check";
    modalContentEl.appendChild(continueBtn);
};

var displayChoiceActor = function () {
    toActorEl.setAttribute("src", chosenActor.imgUrl);
    toActorEl.setAttribute("alt", chosenActor.name + " portrait");
    toActorLabelEl.classList.remove("is-invisible");
    toActorLabelEl.textContent = chosenActor.name;
    clearModal();
    var choiceEl = document.createElement("h3");
    choiceEl.classList.add("is-size-2", "has-text-centerd", "my-3");
    choiceEl.textContent = "You have chosen " + chosenActor.name + " " + chosenActor.description;
    modalContentEl.appendChild(choiceEl);
    var continueBtn = document.createElement("button");
    continueBtn.classList.add("button", "is-fullwidth", "check-full-cast");
    continueBtn.textContent = "Check";
    modalContentEl.appendChild(continueBtn);
};

var searchActorBtnHandler = function () {
    if (actorInputEl.value !== "") {
        var name = actorInputEl.value;
        console.log(name);
        searchActor(name);
        actorInputEl.value = "";
        actorSearchPressed = true;
    }
};



/////////////// CHRIS added this ///////////////
// Display movie and actor search history
var displayMovieSearched = function(savedMoviesArr) {
    var movieHistorydiv = document.getElementById("movieHistory")
    var movieHistoryEl = document.createElement("div")
    var movieHistorylist = document.createElement("ul")

    for (let i=0; i < savedMoviesArr.length; i++) {
        var movieSelected = document.createElement("li")
        console.log(savedMoviesArr[0])
        movieSelected.textContent = savedMoviesArr[i]
    }
    movieHistorylist.appendChild(movieSelected)
    movieHistoryEl.appendChild(movieHistorylist)
    movieHistorydiv.appendChild(movieHistoryEl)

}


var displayActorSearched = function() {
    var ActorHistorydiv = document.getElementById("actorHistory")
    var actorHistoryEl = document.createElement("div")
    var movieHistorylist = document.createElement("ul")

    for (let i=0; i < savedActorsArr.length; i++) {
        var actorSelected = document.createElement("li")
        console.log(savedActorsArr[0])
        actorSelected.textContent = savedActorsArr[i]
    }
}

// after the search movie button click
document.getElementById("searchMovie").addEventListener("click", displayMovieSearched())
//after the search actor button click
document.getElementById("searchActor").addEventListener("click", displayActorSearched())


var resetDisplay = function () {
    fromActorEl.setAttribute("src", chosenActor.imgUrl);
    fromActorEl.setAttribute("alt", chosenActor.name + " portrait");
    fromActorLabelEl.textContent = chosenActor.name;
    toActorLabelEl.textContent = "";
    toActorLabelEl.classList.add("is-invisible");
    toActorEl.setAttribute("src", "");
    toActorEl.setAttribute("alt", "");
};

var resetPoster = function () {
    posterLabelEl.textContent = "";
    posterLabelEl.classList.add("is-invisible");
    posterEl.setAttribute("src", "");
    posterEl.setAttribute("alt", "");
};

var victoryHandler = function () {
    clearModal();
    var youWinEl = document.createElement("h3");
    youWinEl.classList.add("is-size-2", "has-text-centerd", "my-3");
    youWinEl.textContent = "Congratulations!";
    modalContentEl.appendChild(youWinEl);
    var victoryTextEl = document.createElement("p");
    victoryTextEl.classList.add("has-text-centerd", "my-3");
    victoryTextEl.textContent = "You've reached Kevin Bacon";
    modalContentEl.appendChild(victoryTextEl);
    var playAgainBtn = document.createElement("button");
    playAgainBtn.classList.add("button", "is-fullwidth", "play-again")
    playAgainBtn.textContent = "Play Again";
    modalContentEl.appendChild(playAgainBtn);
}

var newGame = function () {
    loadHistory();
    randomStartingActor();
    resetDisplay();
    resetPoster();
}

// END FUNCTION DECLARATIONS



// BEGIN EVENT LISTENERS
searchMovieBtn.addEventListener("click", searchMovieBtnHandler);
searchActorBtn.addEventListener("click", searchActorBtnHandler);
modalCloseBtn.addEventListener("click", closeModal);
modalContentEl.addEventListener("click", modalBtnHandler);
// END EVENT LISTENERS



// BEGIN FUNCTIONS TO RUN ON LOAD
newGame();
console.log(savedActorsArr);
// END FUNCTIONS TO RUN ON LOAD