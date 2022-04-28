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
// Starting array of actors. This array will be built up any time the user uses a new actor not already represented in the array
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
// Begin functions for starting a new game
// Sets up a new game
var newGame = function () {
    // Loads the saved actors and movies arrays
    loadHistory();
    // Chooses a new starting actor
    randomStartingActor();
    // Removes any actor imgages
    resetDisplay();
    // Removes any poster image
    resetPoster();
    // Puts the movieInputEl into focus
    movieInputEl.focus();
    // Enables the searchActorBtn
    searchActorBtn.disabled = true;
    // Disables the searchMovieBtn
    searchMovieBtn.disabled = false;
}

// Chooses a random actor from the saved array to start the game
var randomStartingActor = function () {
    // Creates a new array without Kevin Bacon
    var possibleStartingActors = savedActorsArr.filter(function (actor) {
        return actor.name != "Kevin Bacon";
    });
    // Randomly chooses an actor from the new array and assigns that actor to chosenActor
    randomArrPosition = Math.floor(Math.random() * possibleStartingActors.length);
    chosenActor = possibleStartingActors[randomArrPosition];
};
// End new game functions



// Begin Utility Functions
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

// Function for shortening long strings (for when the title and or description is excessively long)
var stringSlice = function (str) {
    // Checks the string length
    if (str.length > 60) {
        // Slices off the end of the string beyond the 60th space in the string
        var shortenedStr = str.slice(0, 59) + "...";
        // Returns the newly shortened string
        return shortenedStr;
    }

    // If the string is already short enough, it is returned unchanged
    else {
        return str;
    }
};

// Function for when fetch responses come back ok, but have error messages
var okResponseProblemDisplay = function (data) {
    // Displays the modal with its content emptied
    displayModal();
    // Dynamically creates content for the modal to let the user know there was an error with the returned data from a fetch
    var errorMessageEl = document.createElement("h3");
    errorMessageEl.classList.add("is-size-2", "has-text-centered", "my-3");
    errorMessageEl.textContent = data.errorMessage;
    modalContentEl.appendChild(errorMessageEl);
};

var searchProblemDisplay = function () {
    // Displays the modal with its content emptied
    displayModal();
    // Dynamically creates content for the modal to let the user know there was a problem with their search
    var errorMessageEl = document.createElement("h3");
    errorMessageEl.classList.add("is-size-2", "has-text-centered", "my-3");
    errorMessageEl.textContent = "There was a problem with your search. Please try again.";
    modalContentEl.appendChild(errorMessageEl);
};

var catchDisplay = function () {
    // Displays the modal with its content emptied
    displayModal();
    // Dynamically creates content for the modal to let the user know there was a problem connecting to IMDb
    var errorMessageEl = document.createElement("h3");
    errorMessageEl.classList.add("is-size-2", "has-text-centered", "my-3");
    errorMessageEl.textContent = "There was a problem connecting with IMDb";
    modalContentEl.appendChild(errorMessageEl);
};

// Resets the display by changing the image in the left column to the current chosenActor and removing the image in the right column
var resetDisplay = function () {
    // Changes the displayed image in the left column
    fromActorEl.setAttribute("src", chosenActor.imgUrl);
    fromActorEl.setAttribute("alt", chosenActor.name + " portrait");
    fromActorLabelEl.textContent = chosenActor.name;
    // Removes the image in the right column
    toActorLabelEl.textContent = "";
    toActorLabelEl.classList.add("is-invisible");
    toActorEl.setAttribute("src", "");
    toActorEl.setAttribute("alt", "");

};

// Removes the poster image and label from the middle column
var resetPoster = function () {
    posterLabelEl.textContent = "";
    posterLabelEl.classList.add("is-invisible");
    posterEl.setAttribute("src", "");
    posterEl.setAttribute("alt", "");
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
    // if statements check whether anything is already saved to local storage
    if (JSON.parse(localStorage.getItem("Movies")) !== null) {
        savedMoviesArr = JSON.parse(localStorage.getItem("Movies"));
    };
    if (JSON.parse(localStorage.getItem("Actors")) !== null) {
        savedActorsArr = JSON.parse(localStorage.getItem("Actors"));
    }
};
// End Utility Functions



// Begin Modal Functions
// Displays the modal with any potential content removed
var displayModal = function () {
    modalEl.classList.add("is-active");
    clearModal();
};

// Removes any content from the modal if present
var clearModal = function () {
    var child = modalContentEl.lastElementChild;
    while (child) {
        child.remove();
        child = modalContentEl.lastElementChild;
    };
};

// Function for closing the modal
var closeModal = function () {
    // Removes the loading indicator from either of the search buttons if present
    searchActorBtn.classList.remove("is-loading");
    searchMovieBtn.classList.remove("is-loading");
    // Removes anything from the modal content 
    clearModal();
    // Removes the is-active class to hide the modal
    modalEl.classList.remove("is-active");
    // Resets the movieSearchPressed and actorSearchPressed variables
    movieSearchPressed = false;
    actorSearchPressed = false;
};

// Displays the results from either the actor or movie searches that the IMDb API returns
var createResultBtns = function (specialClass) {
    // Loops through the results creating buttons for each
    for (i = 0; i < resultsArr.length; i++) {
        var resultBtnEl = document.createElement("button");
        resultBtnEl.classList.add("button", "is-fullwidth", "m-1", specialClass);
        resultBtnEl.textContent = stringSlice(resultsArr[i].name + " " + resultsArr[i].description);
        // Saves important information as data attributes in each button
        resultBtnEl.setAttribute("data-id", resultsArr[i].id);
        resultBtnEl.setAttribute("data-url", resultsArr[i].imgUrl);
        modalContentEl.appendChild(resultBtnEl);
    };
};
// End Modal Functions



// Begin user input functions
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
                        // Checks for an errorMessage and displays if there is one
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
                            console.log(resultsArr);
                            // Displays the modal with its content emptied
                            displayModal();
                            // Displays the actors that returned from the search as button choices
                            createResultBtns("actor");
                        }
                        // Cycles to the next API key in the array
                        apiKeyCycler();
                    });
            }

            // Displays the problems with the fetch if it returned, but wasn't okay
            else {
                searchProblemDisplay();
            }
        })

        // Catches any fetch errors
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
    // Sets up the actor's portrait in the HTML and displays the user's choice within the modal
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
                        // Checks if there was an error message in the data
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
                            // Displays the modal with its content emptied
                            displayModal();
                            createResultBtns("movie");
                        };
                        apiKeyCycler();
                    });
            }

            // Displays the problems with the fetch if it returned, but wasn't okay
            else {
                searchProblemDisplay();
            };
        })

        // Catches any fetch errors
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
    // Displays the movie poster and presents the user's choice with options to proceed or go back
    displayChoiceMovie();
};

// Displays a movie's poster and give's the user the opportunity to proceed witht the selected movie or go back and choose again
var displayChoiceMovie = function () {
    posterEl.setAttribute("src", chosenMovie.imgUrl);
    posterEl.setAttribute("alt", chosenMovie.name + " poster");
    // Gets and displays the movie's synopsis in the poster label
    getMovieSynopsis();
    clearModal();
    // Dynamically creates HTML elements to display to the user their movie choice
    var choiceEl = document.createElement("h3");
    choiceEl.classList.add("is-size-2", "has-text-centered", "my-3");
    choiceEl.textContent = "You have chosen " + chosenMovie.name + " " + chosenMovie.description;
    modalContentEl.appendChild(choiceEl);
    // This will be a button to check that the current chosenActor was in the movie chosen by the user
    var checkBtn = document.createElement("button");
    checkBtn.classList.add("button", "is-fullwidth", "check-full-cast", "is-loading");
    checkBtn.id = "check";
    checkBtn.textContent = "Check";
    modalContentEl.appendChild(checkBtn);
    // This button will allow the user to return to the search results to choose a different option
    var goBackBtn = document.createElement("button");
    goBackBtn.classList.add("button", "is-fullwidth", "go-back");
    goBackBtn.textContent = "Go Back";
    modalContentEl.appendChild(goBackBtn);
};

var getMovieSynopsis = function () {
    fetch("http://www.omdbapi.com/?apikey=ce77b7fe&i=" + chosenMovie.id + "&plot")
        // Runs an anonymous function on the response
        .then(function (response) {
            // Checks if the response was okay
            if (response.ok) {
                // Converts it to a JSON object
                response.json()
                    // Runs an anonymous function to handle the fetched data, displaying it on the poster label
                    .then(function (data) {
                        console.log(data);
                        posterLabelEl.textContent = data.Plot;
                        posterLabelEl.classList.remove("is-invisible");
                    })
            }

            // Displays if the response did not come back ok
            else {
                posterLabelEl.textContent = "Plot details not available";
                posterLabelEl.classList.remove("is-invisible");
            }
        })

        // Catches any fetch errors
        .catch(function (error) {
            posterLabelEl.textContent = "Unable to connect to OMDb";
            posterLabelEl.classList.remove("is-invisible");
        })
}

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
                            // Removes the loading indicator from the "check" button once the full cast has been retrieved
                            document.getElementById("check").classList.remove("is-loading");
                            // Removes the loading indicator from the searchMovieBtn after the fetch is complete
                            searchMovieBtn.classList.remove("is-loading");
                        }
                        
                        // Displays any problems for fetches that returend ok
                        else {
                            okResponseProblemDisplay();
                            resetPoster();
                        }
                        // Cycles to the next API key in the array
                        apiKeyCycler();
                    });
            }

            // Displays the problems with the fetch if it returned, but wasn't okay
            else {
                searchProblemDisplay();
            };
        })

        // Catches any fetch errors
        .catch(function (error) {
            catchDisplay();
        });
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
        // If a movie was most recently searched
        if (movieSearchPressed == true) {
            // Displays to the user that their connection was valid
            correctChoiceHandler("movie");
            // Resets the movieSearchPressed variable
            movieSearchPressed = false;
        }

        // If an actor was most recently searched
        else if (actorSearchPressed == true) {
            // Displays to the user that their connection was valid
            correctChoiceHandler("actor");
            // Resets the actorSearchPressed variable
            actorSearchPressed = false;
        }
    }

    // Runs if checkFullCast returned false
    else {
        // If a movie was most recently searched
        if (movieSearchPressed == true) {
            // Displays to the user that their connection was not valid
            incorrectChoiceHandler("movie");
            // Resets the movieSearchPressed variable
            movieSearchPressed = false;
        }

        // If an actor was most recently searched
        else if (actorSearchPressed == true) {
            // Displays to the user that their connection was not valid
            incorrectChoiceHandler("actor");
            // Resets the actorSearchPressed variable
            actorSearchPressed = false;
        }
    };
};

// Displays an actor's portrait and name and give's the user the opportunity to proceed witht the selected actor or go back and choose again
var displayChoiceActor = function () {
    toActorEl.setAttribute("src", chosenActor.imgUrl);
    toActorEl.setAttribute("alt", chosenActor.name + " portrait");
    toActorLabelEl.classList.remove("is-invisible");
    toActorLabelEl.textContent = chosenActor.name;
    clearModal();
    // Dynamically creates HTML elements to display to the user their actor choice
    var choiceEl = document.createElement("h3");
    choiceEl.classList.add("is-size-2", "has-text-centered", "my-3");
    choiceEl.textContent = "You have chosen " + chosenActor.name + " " + chosenActor.description;
    modalContentEl.appendChild(choiceEl);
    // This will be a button to check that the current chosenActor was in the movie chosen by the user
    var checkBtn = document.createElement("button");
    checkBtn.classList.add("button", "is-fullwidth", "check-full-cast");
    checkBtn.id = "check";
    checkBtn.textContent = "Check";
    modalContentEl.appendChild(checkBtn);
    // This button will allow the user to return to the search results to choose a different option
    var goBackBtn = document.createElement("button");
    goBackBtn.classList.add("button", "is-fullwidth", "go-back");
    goBackBtn.textContent = "Go Back";
    modalContentEl.appendChild(goBackBtn);
};
// End user input functions



// Begin Handler Functions
// Function for when valid connections are made
var correctChoiceHandler = function (arg) {
    clearModal();
    // Dynamically creates HTML elements to display to the user that their connection was valid
    var correctEl = document.createElement("h3");
    correctEl.classList.add("is-size-2", "has-text-centered", "my-3");
    correctEl.textContent = "You got that right!";
    modalContentEl.appendChild(correctEl);
    var userChoiceEl = document.createElement("p");
    userChoiceEl.classList.add("has-text-centered", "my-3");
    userChoiceEl.textContent = chosenActor.name + " was in \"" + chosenMovie.name + "\"";
    modalContentEl.appendChild(userChoiceEl);
    // Creates a button to continue the game 
    var continueBtn = document.createElement("button");
    continueBtn.classList.add("button", "is-fullwidth");

    // If "movie" was passed into the function, the added button will direct the user to the actor search 
    if (arg == "movie" && chosenActor.name !== "Kevin Bacon") {
        continueBtn.classList.add("find-connection");
        continueBtn.textContent = "Find a Connecting Actor";
    }

    // If "actor" was passed into the function, the added button will direct the user to the mvoie search
    else if (arg == "actor" && chosenActor.name !== "Kevin Bacon") {
        continueBtn.classList.add("find-connection");
        continueBtn.textContent = "Find a Connecting Movie";
    }

    // If Kevin Bacon was chosen, the user wins and the added button will handle the victory
    else {
        continueBtn.classList.add("victory");
        continueBtn.textContent = "Victory!"
    }
    modalContentEl.appendChild(continueBtn);
};

// Function for when invalid connections are made
var incorrectChoiceHandler = function (arg) {
    clearModal();
    // Dynamically creates HTML elements to display to the user that their connection was not valid
    var correctEl = document.createElement("h3");
    correctEl.classList.add("is-size-2", "has-text-centered", "my-3");
    correctEl.textContent = "I'm sorry, no.";
    modalContentEl.appendChild(correctEl);
    var userChoiceEl = document.createElement("p");
    userChoiceEl.classList.add("has-text-centered", "my-3");
    userChoiceEl.textContent = chosenActor.name + " was not in \"" + chosenMovie.name + "\"";
    modalContentEl.appendChild(userChoiceEl);
    // Creates a button to continue the game 
    var continueBtn = document.createElement("button");
    continueBtn.classList.add("button", "is-fullwidth", "find-connection");
    // If "movie" was passed into the function, the added button will direct the user back to the movie search to try again
    if (arg == "movie") {
        continueBtn.textContent = "Find a Connecting Movie";
    }

    // If "actor" was passed into the function, the added button will direct the user back to the actor search to try again
    else if (arg == "actor") {
        continueBtn.textContent = "Find a Connecting Actor";
    }
    modalContentEl.appendChild(continueBtn);
};

// Function for when a movie is searched
var searchMovieBtnHandler = function () {
    // Checks that input has actually been received
    if (movieInputEl.value !== "") {
        // Stores the input in a local variable
        var name = movieInputEl.value;
        // Runs the searchMovie function based on the user's input
        searchMovie(name);
        // Resets the input field
        movieInputEl.value = "";
        // Adds the loading indicator to the search button. It will be removed after the fetch is complete
        searchMovieBtn.classList.add("is-loading");
        // Sets movieSearchPressed to true for proper functionality when the modal is displayed
        movieSearchPressed = true;

        displayMovieSearched();
    }
};

// Function for handling all of the possible modal buttons
var modalBtnHandler = function (event) {
    if (event.target.classList.contains("button") && event.target.classList.contains("movie")) {
        // Retrieves the id and url information that was stored into the button HTML
        movieID = event.target.dataset.id;
        posterUrl = event.target.dataset.url;
        // Runs the movieChoice function to display the poster and short plot synopsis
        movieChoice(movieID);
        // Fetches the full cast information
        getFullCast(movieID);
    };

    // Checks if the chosen actor was in the chosen movie
    if (event.target.classList.contains("button") && event.target.classList.contains("check-full-cast")) {
        checkFullCastHandler(chosenActor.id);
    }

    if (event.target.classList.contains("button") && event.target.classList.contains("find-connection")) {
        // Logic for handling the procedure of the game if a correct movie match was given, or an incorrect actor
        if (event.target.textContent == "Find a Connecting Actor") {
            // Puts the actorInputEl into focus
            actorInputEl.focus();
            // Disables the searchActorBtn
            searchActorBtn.disabled = false;
            // Enables the searchMovieBtn
            searchMovieBtn.disabled = true;
        }

        // Logic for handling the procedure of the game if a correct actor match was given, or an incorrect movie
        else if (event.target.textContent == "Find a Connecting Movie") {
            // Puts the movieInputEl into focus
            movieInputEl.focus();
            // Enables the searchActorBtn
            searchActorBtn.disabled = true;
            // Disables the searchMovieBtn
            searchMovieBtn.disabled = false;
            // Removes the movie poster and sets the fromActor image to the chosenActor's
            resetDisplay();
        }
        // Closes the modal again when the function is done
        closeModal();
    }

    // Button for choosing an actor
    if (event.target.classList.contains("button") && event.target.classList.contains("actor")) {
        // Retrieves the id and url information that was stored into the button HTML
        actorID = event.target.dataset.id;
        actorImg = event.target.dataset.url;
        // Runs the actorChoice function to set the chosenActor variable and display the actor's name and portrait
        actorChoice(actorID);
    };

    // Button for going back and choosing a movie or actor again from the returned search results
    if (event.target.classList.contains("button") && event.target.classList.contains("go-back")) {
        // Actor results will display again if the actorSearchBtn was most recently pressed
        if (actorSearchPressed == true) {
            clearModal();
            createResultBtns("actor");
        };

        // Movie results will display again if the movieSearchBtn was most recently pressed
        if (movieSearchPressed == true) {
            clearModal();
            createResultBtns("movie");
        };
    };

    // Button for when the game is won
    if (event.target.classList.contains("button") && event.target.classList.contains("victory")) {
        victoryHandler();
    }

    // Button for a play again option
    if (event.target.classList.contains("button") && event.target.classList.contains("play-again")) {
        // Closes the modal
        closeModal();
        // Resets the game with a new starting actor, and puts the movie search into focus
        newGame();
    }
};

// Function for when an actor is searched
var searchActorBtnHandler = function () {
    // Checks that input has actually been received
    if (actorInputEl.value !== "") {
        // Stores the input in a local variable
        var name = actorInputEl.value;
        // Runs the searchActor function based on the user's input
        searchActor(name);
        // Resets the input field
        actorInputEl.value = "";
        // Adds a loading indicator while the fetches are performed
        searchActorBtn.classList.add("is-loading");
        // Sets actorSearchPressed to true for proper functionality when the modal is displayed
        actorSearchPressed = true;

        displayActorSearched();
    }
};

// Function for connecting to Kevin Bacon
var victoryHandler = function () {
    // Clears the modal of content, then creates and adds new content
    clearModal();
    var youWinEl = document.createElement("h3");
    youWinEl.classList.add("is-size-2", "has-text-centered", "my-3");
    youWinEl.textContent = "Congratulations!";
    modalContentEl.appendChild(youWinEl);
    var victoryTextEl = document.createElement("p");
    victoryTextEl.classList.add("has-text-centered", "my-3");
    victoryTextEl.textContent = "You've reached Kevin Bacon";
    modalContentEl.appendChild(victoryTextEl);
    // Creates a button that will allow the user to play again starting at a new actor
    var playAgainBtn = document.createElement("button");
    playAgainBtn.classList.add("button", "is-fullwidth", "play-again")
    playAgainBtn.textContent = "Play Again";
    modalContentEl.appendChild(playAgainBtn);
}
// End Handler Functions



/////////////// CHRIS added this ///////////////
// Display movie and actor search history
var displayMovieSearched = function() {
    var movieHistorydiv = document.getElementById("movieHistory")
    var movieHistoryEl = document.createElement("div")
    var movieHistorylist = document.createElement("ul")

    for (let i=0; i < savedMoviesArr.length; i++) {
        var movieSelected = document.createElement("li")
        console.log(savedMoviesArr[0])
        movieSelected.textContent = savedMoviesArr[i]
        movieHistorylist.appendChild(movieSelected)
    }
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
