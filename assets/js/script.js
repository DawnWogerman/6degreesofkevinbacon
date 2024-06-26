import { defaultActorsArr } from "./defaultActorsArr.js";
var savedActorsArr = [...defaultActorsArr];

// BEGIN QUERY SELECTORS
var movieInputEl = document.querySelector("#movie-search");
var searchMovieBtn = document.querySelector("#searchMovie");
var fromActorEl = document.querySelector("#fromActor");
var fromActorLabelEl = document.querySelector("#fromActorLabel");
var posterEl = document.querySelector("#poster");
var actorInputEl = document.querySelector("#actor-search");
var posterLabelEl = document.querySelector("#posterLabel");
var searchActorBtn = document.querySelector("#searchActor");
var rightSectionEl = document.querySelector(".rightSection");
var toActorEl = document.querySelector("#toActor");
var toActorLabelEl = document.querySelector("#toActorLabel");
var modalEl = document.querySelector(".modal");
var modalContentEl = document.querySelector(".modal-content");
var modalCloseBtn = document.querySelector(".modal-close");
var historyMovieBtn = document.querySelector("#searchMovieHistory");
var historyActorBtn = document.querySelector("#searchActorHistory");
var destinationActorBtn = document.querySelector("#destinationActor");
var kevinBaconEl = document.querySelector("#kevinBacon");
// END QUERY SELECTORS



// BEGIN GLOBAL VARIABLES
var apiKeysArr = ["0a247f3cf097eb7926fb04f3acf17a64", "0a247f3cf097eb7926fb04f3acf17a64", "0a247f3cf097eb7926fb04f3acf17a64"];
var apiKeyTracker = 0;
var apiKey = apiKeysArr[apiKeyTracker];
var currentActorObj = {};
var currentMovieObj = {};
var resultsArr = [];
// Set Kevin Bacon's information to a variable so that a non-classic version of the game can be created where Kevin Bacon is not the destination actor
var kevinBacon = { imgUrl: "https://image.tmdb.org/t/p/w500/rjX2Oz3tCZMfSwOoIAyEhdtXnTE.jpg", name: "Kevin Bacon", id: "4724", description: "(I) (Actor, Footloose (1984))" };
var savedMoviesArr = [];
var savedActorNames = [];
var savedMovieNames = [];
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
    displayModal();
    gameChoice();
    assignSavedActorNames();
    assignSavedMovieNames();
    autocompleteActorSource();
    autocompleteMovieSource();
};

// Chooses a random actor from the saved array to start the game
var randomStartingActor = function () {
    // Creates a new array without Kevin Bacon
    var possibleStartingActors = savedActorsArr.filter(function (actor) {
        if (actor.name !== kevinBacon.name && actor.name != "Kevin Bacon") {
            return actor.name;
        }
    });
    // Randomly chooses an actor from the new array and assigns that actor to chosenActor
    var randomArrPosition = Math.floor(Math.random() * possibleStartingActors.length);
    chosenActor = possibleStartingActors[randomArrPosition];
};

// Chooses a random actor from the saved array to be the end goal actor
var randomEndingActor = function () {
    // Creates a new array without Kevin Bacon or the starting actor
    var possibleEndingActors = savedActorsArr.filter(function (actor) {
        if (actor.name !== chosenActor.name && actor.name != "Kevin Bacon") {
            return actor.name;
        }
    });
    // Randomly chooses an actor from the new array and assigns that actor to kevinBacon
    var randomArrPosition = Math.floor(Math.random() * possibleEndingActors.length);
    kevinBacon = possibleEndingActors[randomArrPosition];
    kevinBaconEl.textContent = kevinBacon.name;
};
// End new game functions



// Begin Utility Functions
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
    // Dynamically creates content for the modal to let the user know there was a problem connecting to TMDb
    var errorMessageEl = document.createElement("h3");
    errorMessageEl.classList.add("is-size-2", "has-text-centered", "my-3");
    errorMessageEl.textContent = "There was a problem connecting with TMDb";
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
    posterEl.classList.add("is-invisible");
};

// Checks if an object (the chosenActor object) is already saved in savedActorsArr
var checkSavedActorsArr = function (obj) {
    // Checks that savedActorsArr actually has anything in it
    if (savedActorsArr !== null) {
        // Loops through each object in the savedActorsArr array
        for (let i = 0; i < savedActorsArr.length; i++) {
            // Checks if the ID's match
            if (savedActorsArr[i].id == obj.id) {
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
        for (let i = 0; i < savedMoviesArr.length; i++) {
            // Checks if the ID's match
            if (savedMoviesArr[i].id == obj.id) {
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
    // Reassigns the arrays of saved actor and movie names to update them any time new info is saved
    assignSavedActorNames();
    assignSavedMovieNames();
};

// Creates an array that is just the names of the actors in the savedActorsArr array
var assignSavedActorNames = function () {
    // Resets savedActorNames so that duplicates don't appear in the array every time the function is called
    savedActorNames = [];
    for (let i = 0; i < savedActorsArr.length; i++) {
        savedActorNames.push(savedActorsArr[i].name);
    };
};

// Creates an array that is just the names of the movies in the savedMoviesArr array
var assignSavedMovieNames = function () {
    // Resets savedMovieNames so that duplicates don't appear in the array every time the function is called
    savedMovieNames = [];
    for (let i = 0; i < savedMoviesArr.length; i++) {
        savedMovieNames.push(savedMoviesArr[i].name);
    };
};

// Adds autocomplete to the movie search input based on the saved movie names
var autocompleteMovieSource = function () {
    $("#movie-search").autocomplete({
        source: savedMovieNames
    });
};

// Adds autocomplete to the actor search input based on the saved actor names
var autocompleteActorSource = function () {
    $("#actor-search").autocomplete({
        source: savedActorNames
    });
};

// Function for loading movie and actor search results
var loadHistory = function () {
    // if statements check whether anything is already saved to local storage
    if (JSON.parse(localStorage.getItem("Movies")) !== null) {
        savedMoviesArr = JSON.parse(localStorage.getItem("Movies")).filter(element => element);
    };
    if (JSON.parse(localStorage.getItem("Actors")) !== null && JSON.parse(localStorage.getItem("Actors")).length > 0) {
        savedActorsArr = JSON.parse(localStorage.getItem("Actors")).filter(element => element);
    };
};

// Function for converting array of objects representing movies an actor is known for to text
var knownForToText = function (arr) {
    return arr.reduce((a, c) => {
        return a + c.title + ", ";
    }, '').replace(/, $/, '');
}
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

// Displays the results from either the actor or movie searches that the TMDb API returns
var createResultBtns = function (specialClass) {
    // Loops through the results creating buttons for each
    for (let i = 0; i < resultsArr.length; i++) {
        var resultBtnEl = document.createElement("button");
        resultBtnEl.classList.add("button", "is-fullwidth", "is-dark", "my-1", specialClass);
        resultBtnEl.textContent = stringSlice(resultsArr[i].name + " " + resultsArr[i].description);
        // Saves important information as data attributes in each button
        resultBtnEl.setAttribute("data-id", resultsArr[i].id);
        resultBtnEl.setAttribute("data-url", resultsArr[i].imgUrl);
        modalContentEl.appendChild(resultBtnEl);
    };
};

// Presents the user with gameplay options
var gameChoice = function () {
    var promptEl = document.createElement("h3");
    promptEl.classList.add("is-size-2", "has-text-centered", "my-3");
    promptEl.textContent = "Which version would you like to play?";
    modalContentEl.appendChild(promptEl);
    // A button for connecting to Kevin Bacon
    var classicEl = document.createElement("button");
    classicEl.classList.add("button", "is-fullwidth", "is-dark", "my-1", "classic");
    classicEl.textContent = "Classic - Connect to Kevin Bacon";
    modalContentEl.appendChild(classicEl);
    // A button for connecting to a random actor
    var randomEl = document.createElement("button");
    randomEl.classList.add("button", "is-fullwidth", "is-dark", "my-1", "random");
    randomEl.textContent = "Random - Connect to a Random Actor";
    modalContentEl.appendChild(randomEl);
};

// Shows the actor the user should try to connect to
var displayDestination = function () {
    displayModal();
    var destinationEl = document.createElement("h3");
    destinationEl.classList.add("is-size-2", "has-text-centered", "my-3");
    destinationEl.textContent = "Your Destination Actor is " + kevinBacon.name;
    modalContentEl.appendChild(destinationEl);
    // A portrait of the destination actor is displayed
    var figureEl = document.createElement("figure");
    figureEl.classList.add("image");
    var imageEl = document.createElement("img");
    imageEl.classList.add("mx-auto");
    imageEl.style.maxHeight = "500px";
    imageEl.style.width = "auto";
    imageEl.setAttribute("src", kevinBacon.imgUrl);
    imageEl.setAttribute("alt", kevinBacon.name + " portrait");
    figureEl.appendChild(imageEl);
    modalContentEl.appendChild(figureEl);
    // A button for exiting the modal
    var gotItEl = document.createElement("button");
    gotItEl.classList.add("button", "is-fullwidth", "is-dark", "my-1", "got-it")
    gotItEl.textContent = "Got it!";
    modalContentEl.appendChild(gotItEl);
};
// End Modal Functions



// Begin user input functions
// Searches for an actor using the TMDb API. Only use this after we're done with the searchmovie() and movieChoice() functions
var searchActor = function (name) {
    // Creates the url by inserting one of the API keys and the name that was passed into the function
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwYTI0N2YzY2YwOTdlYjc5MjZmYjA0ZjNhY2YxN2E2NCIsInN1YiI6IjY2MWRkNmM2ZWNhZWY1MDE3Y2Y4OTkxNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Nz5rGKTtQfwMBC2bfSEzNlJQeC6U_I3wFtagD75ilvE'
        }
    };

    fetch(`https://api.themoviedb.org/3/search/person?query=${name.replace(" ", "%20")}&include_adult=false&language=en-US&page=1`, options)
        // Runs an anonymous function on the response
        .then(function (response) {
            // Checks if the response was okay
            if (response.ok) {
                // Converts it to a JSON object
                response.json()
                    // Runs an anonymous function to handle the fetched data
                    .then(function (data) {
                        // Checks for an errorMessage and displays if there is one
                        if (data.errorMessage) {
                            okResponseProblemDisplay(data);
                        }

                        else {
                            // Loops through the results from the actor search and assigns the important information to the properties of an object
                            for (let i = 0; i < data.results.length; i++) {
                                console.log(knownForToText(data.results[i].known_for))
                                var actorResultObj = {
                                    imgUrl: `https://image.tmdb.org/t/p/original${data.results[i].profile_path}`,
                                    name: data.results[i].name,
                                    id: data.results[i].id,
                                    // data.results[i].known_for => array of movies => arr[i].title
                                    description: `Known for: ${knownForToText(data.results[i].known_for)}`
                                };
                                // Adds the newly created object into the resultsArr array (this is the same array that receives the movie search results, so this function should only be used after we're done with the actor results)
                                resultsArr.push(actorResultObj);

                            };
                            // Displays the modal with its content emptied
                            displayModal();
                            // Displays the actors that returned from the search as button choices
                            createResultBtns("actor");
                        }
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
    for (let i = 0; i < resultsArr.length; i++) {
        if (resultsArr[i].id == id) {
            // Saves the object with the actor's information
            chosenActor = resultsArr[i];
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

// Searches for a movie using the TMDb API. Only use this after we're done with the searchActor() and actorChoice() functions
var searchMovie = function (movie) {
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwYTI0N2YzY2YwOTdlYjc5MjZmYjA0ZjNhY2YxN2E2NCIsInN1YiI6IjY2MWRkNmM2ZWNhZWY1MDE3Y2Y4OTkxNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Nz5rGKTtQfwMBC2bfSEzNlJQeC6U_I3wFtagD75ilvE'
        }
    };

    fetch(`https://api.themoviedb.org/3/search/movie?query=${movie.replace(" ", "%20")}&include_adult=false&language=en-US&page=1`, options)
        // Runs an anonymous function on the response
        .then(function (response) {
            // Checks if the response was okay
            if (response.ok) {
                // Converts it to a JSON object
                response.json()
                    // Runs an anonymous function to handle the fetched data
                    .then(function (data) {
                        // Checks if there was an error message in the data
                        if (data.errorMessage) {
                            okResponseProblemDisplay(data);
                        }

                        else {
                            // Loops through the results from the movie search and assigns the important information to the properties of an object
                            for (let i = 0; i < data.results.length; i++) {
                                var movieResultObj = {
                                    overview: data.results[i].overview,
                                    description: data.results[i].release_date.slice(0, 4),
                                    id: data.results[i].id,
                                    imgUrl: `https://image.tmdb.org/t/p/original/${data.results[i].poster_path}`,
                                    name: data.results[i].title,
                                };
                                // Adds the newly created object into the resultsArr array (this is the same array that receives the actor search results, so this function should only be used after we're done with the actor results)
                                resultsArr.push(movieResultObj);

                            };
                            // Displays the modal with its content emptied
                            displayModal();
                            // Shows the results of the search with buttons for any options
                            createResultBtns("movie");
                        };
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
    for (let i = 0; i < resultsArr.length; i++) {
        if (resultsArr[i].id == id) {
            // Saves the object with the movie's information
            chosenMovie = resultsArr[i];
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
    posterEl.classList.remove("is-invisible");
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
    checkBtn.classList.add("button", "is-fullwidth", "is-dark", "my-1", "check-full-cast", "is-loading");
    checkBtn.id = "check";
    checkBtn.textContent = "Check";
    modalContentEl.appendChild(checkBtn);
    // This button will allow the user to return to the search results to choose a different option
    var goBackBtn = document.createElement("button");
    goBackBtn.classList.add("button", "is-fullwidth", "is-dark", "my-1", "go-back");
    goBackBtn.textContent = "Go Back";
    modalContentEl.appendChild(goBackBtn);
};

var getMovieSynopsis = function () {
    fetch("https://www.omdbapi.com/?apikey=ce77b7fe&i=" + chosenMovie.id + "&plot")
        // Runs an anonymous function on the response
        .then(function (response) {
            // Checks if the response was okay
            if (response.ok) {
                // Converts it to a JSON object
                response.json()
                    // Runs an anonymous function to handle the fetched data, displaying it on the poster label
                    .then(function (data) {
                        console.log(data)
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
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwYTI0N2YzY2YwOTdlYjc5MjZmYjA0ZjNhY2YxN2E2NCIsInN1YiI6IjY2MWRkNmM2ZWNhZWY1MDE3Y2Y4OTkxNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Nz5rGKTtQfwMBC2bfSEzNlJQeC6U_I3wFtagD75ilvE'
        }
    };

    fetch(`https://api.themoviedb.org/3/movie/${movieID}/credits?language=en-US`, options)
        // Runs an anonymous function on the response
        .then(function (response) {
            // Checks if the response was okay
            if (response.ok) {
                // Converts it to a JSON object
                response.json()
                    // Runs an anonymous function to handle the fetched data
                    .then(function (data) {
                        console.log(data);
                        if (!data.errorMessage) {
                            // Sets the returned cast data to the fullCast variable
                            console.log(data);
                            fullCast = data.cast;
                            if (document.getElementById("check")) {
                                // Removes the loading indicator from the "check" button once the full cast has been retrieved
                                document.getElementById("check").classList.remove("is-loading");
                            }
                            // Removes the loading indicator from the searchMovieBtn after the fetch is complete
                            searchMovieBtn.classList.remove("is-loading");
                        }

                        // Displays any problems for fetches that returend ok
                        else {
                            okResponseProblemDisplay();
                            resetPoster();
                        }
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
    for (let i = 0; i < fullCast.length; i++) {
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
    checkBtn.classList.add("button", "is-fullwidth", "is-dark", "my-1", "check-full-cast");
    checkBtn.id = "check";
    checkBtn.textContent = "Check";
    modalContentEl.appendChild(checkBtn);
    // This button will allow the user to return to the search results to choose a different option
    var goBackBtn = document.createElement("button");
    goBackBtn.classList.add("button", "is-fullwidth", "is-dark", "my-1", "go-back");
    goBackBtn.textContent = "Go Back";
    modalContentEl.appendChild(goBackBtn);
};

// Function for reusing saved information to decrease API fetches
var reuseSavedDataActor = function (name) {
    // Checks all of the saved actors' information to see if it has been saved
    for (let i = 0; i < savedActorsArr.length; i++) {
        // Returns it as a result in the resultsArr if it has
        if (savedActorsArr[i].name == name) {
            resultsArr.push(savedActorsArr[i]);
        };
    };
};

// Function for reusing saved information to decrease API fetches
var reuseSavedDataMovie = function (name) {
    // Checks all of the saved actors' information to see if it has been saved
    for (let i = 0; i < savedMoviesArr.length; i++) {
        // Returns it as a result in the resultsArr if it has
        if (savedMoviesArr[i].name == name) {
            resultsArr.push(savedMoviesArr[i]);
        };
    };
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
    continueBtn.classList.add("button", "is-fullwidth", "is-dark", "my-1");

    // If "movie" was passed into the function, the added button will direct the user to the actor search 
    if (arg == "movie" && chosenActor.name !== kevinBacon.name) {
        continueBtn.classList.add("find-connection");
        continueBtn.textContent = "Find a Connecting Actor";
    }

    // If "actor" was passed into the function, the added button will direct the user to the mvoie search
    else if (arg == "actor" && chosenActor.name !== kevinBacon.name) {
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
    continueBtn.classList.add("button", "is-fullwidth", "is-dark", "my-1", "find-connection");
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
    // Resets resultsArr
    resultsArr = [];
    // Checks that input has actually been received
    if (movieInputEl.value !== "") {
        // Stores the input in a local variable
        var name = movieInputEl.value;
        // Checks if the movie is saved in the savedMoviesArr and uses it as a result for the search if it has
        reuseSavedDataMovie(name);
        if (resultsArr.length == 0) {
            // Runs the searchMovie function based on the user's input
            searchMovie(name);
        }
        else {
            // Displays the modal with its content emptied
            displayModal();
            // Shows the results of the search with buttons for any options
            createResultBtns("movie");
        }
        // Resets the input field
        movieInputEl.value = "";
        // Adds the loading indicator to the search button. It will be removed after the fetch is complete
        searchMovieBtn.classList.add("is-loading");
        // Sets movieSearchPressed to true for proper functionality when the modal is displayed
        movieSearchPressed = true;
    }
};

// Function for when an actor is searched
var searchActorBtnHandler = function () {
    // Resets resultsArr
    resultsArr = [];
    // Checks that input has actually been received
    if (actorInputEl.value !== "") {
        // Stores the input in a local variable
        var name = actorInputEl.value;
        // Checks if the actor is saved in the savedActorsArr and uses it as a result for the search if it has
        reuseSavedDataActor(name);
        if (resultsArr.length == 0) {
            // Runs the searchActor function based on the user's input
            searchActor(name);
        }
        else {
            // Displays the modal with its content emptied
            displayModal();
            // Shows the results of the search with buttons for any options
            createResultBtns("actor");
        }
        // Resets the input field
        actorInputEl.value = "";
        // Adds a loading indicator while the fetches are performed
        searchActorBtn.classList.add("is-loading");
        // Sets actorSearchPressed to true for proper functionality when the modal is displayed
        actorSearchPressed = true;
    }
};

// Function for handling all of the possible modal buttons
var modalBtnHandler = function (event) {
    // Movie Results Buttons
    if (event.target.classList.contains("button") && event.target.classList.contains("movie")) {
        // Retrieves the id and url information that was stored into the button HTML
        movieID = parseInt(event.target.dataset.id);
        posterUrl = event.target.dataset.url;
        // Runs the movieChoice function to display the poster and short plot synopsis
        movieChoice(movieID);
        // Fetches the full cast information
        getFullCast(movieID);
    };

    // Check Button
    if (event.target.classList.contains("button") && event.target.classList.contains("check-full-cast")) {
        checkFullCastHandler(chosenActor.id);
    }

    // Find a Connecting * Buttons
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
            resetPoster();
            rightSectionEl.classList.add("is-invisible");
        }
        // Closes the modal again when the function is done
        closeModal();
    }

    // Actor Results Buttons
    if (event.target.classList.contains("button") && event.target.classList.contains("actor")) {
        // Retrieves the id and url information that was stored into the button HTML
        actorID = event.target.dataset.id;
        actorImg = event.target.dataset.url;
        // Runs the actorChoice function to set the chosenActor variable and display the actor's name and portrait
        actorChoice(actorID);
        rightSectionEl.classList.remove("is-invisible");
    };

    // Go Back Button
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

    // Victory Button
    if (event.target.classList.contains("button") && event.target.classList.contains("victory")) {
        victoryHandler();
    }

    // Play Again Button
    if (event.target.classList.contains("button") && event.target.classList.contains("play-again")) {
        // Closes the modal
        closeModal();
        // Resets the game with a new starting actor, and puts the movie search into focus
        newGame();
        rightSectionEl.classList.add("is-invisible");
    }

    // Remove Button
    if (event.target.classList.contains("button") && event.target.classList.contains("is-danger")) {
        // Loops through the array of saved actors
        for (let i = 0; i < savedActorsArr.length; i++) {
            // If the ID matches the ID saved in the HTML dataset...
            if (savedActorsArr[i].id == event.target.dataset.id) {
                // ...That saved object will be removed
                savedActorsArr.splice(i, 1);
            };
        };
        // The altered savedActorsArr is saved
        saveHistory();
        // The modal content is adjusted to display without the removed entry
        displayActorSearchModal();
    }

    // Classic version button
    if (event.target.classList.contains("button") && event.target.classList.contains("classic")) {
        // Sets the destination actor in the kevinBacon variable (as the man himself in this case)
        kevinBacon = { imgUrl: "https://image.tmdb.org/t/p/w500/rjX2Oz3tCZMfSwOoIAyEhdtXnTE.jpg", name: "Kevin Bacon", id: "4724", description: "(I) (Actor, Footloose (1984))" };
        kevinBaconEl.textContent = kevinBacon.name;
        clearModal();
        // The destination actor is displayed
        displayDestination();
    };

    // Random version button
    if (event.target.classList.contains("button") && event.target.classList.contains("random")) {
        clearModal();
        // Sets the destination actor in the kevinBacon variable to a random actor
        randomEndingActor();
        // The destination actor is displayed
        displayDestination();
    };

    if (event.target.classList.contains("button") && event.target.classList.contains("got-it")) {
        closeModal();
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
    victoryTextEl.textContent = "You've reached " + kevinBacon.name;
    modalContentEl.appendChild(victoryTextEl);
    // Creates a button that will allow the user to play again starting at a new actor
    var playAgainBtn = document.createElement("button");
    playAgainBtn.classList.add("button", "is-fullwidth", "is-dark", "my-1", "play-again")
    playAgainBtn.textContent = "Play Again";
    modalContentEl.appendChild(playAgainBtn);
};
// End Handler Functions



/////////////// CHRIS added this ///////////////
// Display movie and actor search history
var displayMovieSearched = function () {
    var movieHistoryEl = document.createElement("div")
    var movieHistorylist = document.createElement("ul")

    for (let i = 0; i < savedMoviesArr.length; i++) {
        var movieSelected = document.createElement("li")
        movieSelected.textContent = savedMoviesArr[i].name + " " + savedMoviesArr[i].description
        movieHistorylist.appendChild(movieSelected)
    }
    movieHistoryEl.appendChild(movieHistorylist)
    modalContentEl.appendChild(movieHistoryEl)

}
var displayMovieSearchModal = function () {
    displayModal()
    displayMovieSearched();
}

var displayActorSearched = function () {
    var actorHistoryEl = document.createElement("div")
    var actorHistorylist = document.createElement("ul")

    for (let i = 0; i < savedActorsArr.length; i++) {
        var actorSelected = document.createElement("li")
        actorSelected.setAttribute("class", "m-1 is-fullwidth is-flex is-justify-content-space-between")
        actorSelected.textContent = savedActorsArr[i].name + " " + savedActorsArr[i].description
        var removeActor = document.createElement("button")
        removeActor.textContent = "Remove"
        removeActor.setAttribute("class", "button is-danger")
        removeActor.setAttribute("data-id", savedActorsArr[i].id)
        actorSelected.appendChild(removeActor)
        actorHistorylist.appendChild(actorSelected)
    }

    actorHistoryEl.appendChild(actorHistorylist)
    modalContentEl.appendChild(actorHistoryEl)
}

var displayActorSearchModal = function () {
    displayModal()
    displayActorSearched()
}
// END FUNCTION DECLARATIONS



// BEGIN EVENT LISTENERS
searchMovieBtn.addEventListener("click", searchMovieBtnHandler);
searchActorBtn.addEventListener("click", searchActorBtnHandler);
modalCloseBtn.addEventListener("click", closeModal);
modalContentEl.addEventListener("click", modalBtnHandler);
historyMovieBtn.addEventListener("click", displayMovieSearchModal);
historyActorBtn.addEventListener("click", displayActorSearchModal);
destinationActorBtn.addEventListener("click", displayDestination);
// END EVENT LISTENERS



// BEGIN FUNCTIONS TO RUN ON LOAD
newGame();
// END FUNCTIONS TO RUN ON LOAD
