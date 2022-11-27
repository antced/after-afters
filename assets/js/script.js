$(function () {
    // size is how many results
    var size = 24;
    // necessary elements
    var fromDate = document.getElementById("fromDate");
    var toDate = document.getElementById("toDate");
    var searchResults = $("#searchResults");
    var resultContent = $("#resultContent");
    var eventsEl = $("#eventsEl");
    var dateRange = $("#dateRange");
    // ticketmaster parameters for API
    var checkBox = "";
    var music = "&classificationName=music&";
    var sports = "&classificationName=sports&";
    var other = "";
    // event listeners
    var searchBtn = $("#searchBtn");
    var checkBoxes = $(".custom-checkbox");
    // modal stuff
    var modal = $("#modal");
    var modalList = $("#modalList");
    var modalBg = $(".modal-background");
    var modalClose = $(".modal-close");
    // favorites variables
    var eventName;
    var eventDate;
    var dateNameArr = [];
    var saveBtn;
    var favoritesList = $("#favorites-list")
    // var data;
    // array of latitude and longitude for finding nearby places
    var latLonArr = [];
    // delcare 16-18 globally to use them in the favorites list?


    checkBoxes.on("click", function (event) {
        var checkId = $(event.target).attr("id");
        if (checkId === "checkSports") {
            // have something clear search results
            checkBox = sports;
        } else if (checkId === "checkMusic") {
            // have something clear search results
            checkBox = music;
        } else if (checkId === "checkOther") {
            // have something clear search results
            checkBox = other;
        }
    });

    // converts date to readable format
    function dateConvert(x) {
        var step1 = x.split("-");
        var step2 = Date.UTC(step1[0] + 0, step1[1] - 1, step1[2]);
        var step3 = new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: '2-digit' }).format(step2);
        return step3.slice(0, -2) + step1[2];
    }
    // search button event listener
    searchBtn.on("click", function () {
        // keeps search results from overpopulating
        searchResults.empty();
        getAPI();
    });

    // function to call API
    function getAPI() {
        // setting the date at top of search results
        dateRange.text(`${dateConvert(fromDate.value)} - ${dateConvert(toDate.value)}`);
        // ticketmaster API link with custom variables
        var ticketmasterUrl = "https://app.ticketmaster.com/discovery/v2/events.json?" + checkBox + "size=" + size + "&city=[philadelphia]&localStartDateTime=" + fromDate.value + "T00:00:00," + toDate.value + "T23:59:59&apikey=CHo9U7G9NvQH3YdZsAJYBoNV5by3z3Hq";

        fetch(ticketmasterUrl)
            .then(function (response) {

                return response.json();
            })
            .then(function (data) {

                for (let i = 0; i < data._embedded.events.length; i++) {
                    // assign API data
                    var eventName = data._embedded.events[i].name;
                    var venue = data._embedded.events[i]._embedded.venues[0].name;
                    var venueLat = data._embedded.events[i]._embedded.venues[0].location.latitude;
                    var venueLon = data._embedded.events[i]._embedded.venues[0].location.longitude;
                    var venueAddress = data._embedded.events[i]._embedded.venues[0].address.line1;
                    eventDate = dateConvert(data._embedded.events[i].dates.start.localDate);
                    var eventTime = data._embedded.events[i].dates.start.localTime;
                    var ticketUrl = data._embedded.events[i].url;
                    var imageLink = data._embedded.events[i].images[8].url;
                    var item = i;
                    // create elements
                    var imgSectEl = $('<section class="media-left level m-0 is-mobile"></section>');
                    var imgSizeEl = $('<p class="image custom-img"></p>');
                    var posterEl = $(`<img src="${imageLink}" alt="woopsie" onerror="this.src='./assets/images/hand-point-right-solid.svg'">`);
                    var figureEl = $('<figure id="resultContent" class="m-2 px-4 py-3 col-surface2 level customMedia"></figure>');
                    var topSectEl = $('<section class="is-two-thirds has-text-left pl-4">');
                    var anchorEl = $(`<a href="${ticketUrl}" target="_blank"><h3 class="col-on-surface subtitle is-5 custom-textBox">${eventName}</h3></a>`);
                    var venueEl = $(`<h3 class="col-on-surface custom-textBox"><b>${venue}</b></h3>`);
                    var dateEl = $(`<h3 class="col-on-surface is-6">${eventDate}</h3>`);
                    var bottomSectEl = $('<section class="is-one-quarter is-justify-content-right buttons"></section>');
                    var foodBtn = $(`<button class="button custom-btn3 col-on-primary is-small m-1 js-modal-trigger" data-target="modal-js-example" id="foodNearBtn${item}">Food Nearby</button>`);
                    var saveBtn = $(`<button class="button custom-btn4 col-on-primary is-small favorite m-1" id="saveListBtn${item}"><i class="fa-regular fa-bookmark col-on-primary"></i></button>`);
                    // append elements
                    figureEl.append(imgSectEl);
                    imgSectEl.append(imgSizeEl);
                    imgSectEl.append(topSectEl);
                    imgSizeEl.append(posterEl);
                    searchResults.append(figureEl);
                    topSectEl.append(anchorEl);
                    topSectEl.append(venueEl);
                    topSectEl.append(dateEl);
                    figureEl.append(bottomSectEl);
                    bottomSectEl.append(foodBtn);
                    bottomSectEl.append(saveBtn);
                    dateNameArr.push([eventDate, eventName]);
                    latLonArr.push([venueLat, venueLon]);
                    // event listener for save button
                    $(document).on("click", "#saveListBtn" + i, createSaveList);
                    // create saved list function
                    function createSaveList (event) {
                        // limit of favorites list items
                        var limit = 20;
                        // name of button clicked
                        var saveBtnName = $(event.target).attr("id");
                        var saveBtnNumber = saveBtnName.slice(-1);
                        // .slice only works if click is on the BUTTON, if the icon is clicked an error is read
                        // var saveBtnNumber = saveBtnName.slice(-1);
                        // localStorage.setItem(eventDate, eventName);
                        console.log(saveBtnName);
                        console.log(saveBtnNumber);
                        console.log(dateNameArr);
                        // save clicked item in local storage
                        localStorage.setItem(dateNameArr[saveBtnNumber][0], dateNameArr[saveBtnNumber][1]);
                        // create list item to populate favorites list
                        var favoriteEl = $(`<button class="button custom-btn2 is-fullwidth col-on-surface my-2">${dateNameArr[saveBtnNumber]}</button>`)
                        // append item to favorites <ul>
                        favoritesList.append(favoriteEl);
                        // change class of <i> from fa-regular to fa-solid (TODO: get the below 2 lines to work)
                        saveBtn.addClass("fa-solid");
                        saveBtn.removeClass("fa-regular");
                    }
                    // event listener for food nearby button
                    $(document).on("click", "#foodNearBtn" + i, findFood);
                    // food nearby function
                    function findFood(event) {
                        // limit is how many results
                        var limit = 12;
                        // name of the button that was clicked
                        var buttonName = $(event.target).attr("id");
                        var buttonNumber = buttonName.slice(-1);
                        // latitude and longitude of the venue that was clicked
                        var foodLat = latLonArr[buttonNumber][0];
                        var foodLon = latLonArr[buttonNumber][1];
                        // geoapify API url with custom variables
                        var geoapifyUrl = "https://api.geoapify.com/v2/places?categories=catering&conditions=named&filter=circle:" + foodLon + "," + foodLat + ",1000&bias=proximity:" + foodLon + "," + foodLat + "&lang=en&limit=" + limit + "&apiKey=abbaf448e8fd46d789223be439a4096c";

                        fetch(geoapifyUrl)
                            .then(function (response) {
                                return response.json();
                            })
                            .then(function (data) {
                                modalList.empty();
                                for (var i = 0; i < data.features.length; i++) {
                                    console.log("_____this is a spacer______")
                                    // all properties
                                    console.log(data.features[i].properties);
                                    // name
                                    var foodName = data.features[i].properties.name;
                                    console.log("Restaurant Name: " + foodName);
                                    // address
                                    var foodAddress = data.features[i].properties.address_line2.slice(0, -26);
                                    console.log("Restaurant Address: " + foodAddress);
                                    // distance from venue
                                    var distance = data.features[i].properties.distance;
                                    distance = Math.round(distance*3.281)
                                    console.log("Restaurant Distance: " + distance);
                                    // testing modal
                                    var nameEl = (`<div class="foodElement">
                                    <h2 class="foodName">${foodName}</h2>
                                    <p class="foodAddress">${foodAddress}</p>
                                    <p class="foodDistance">${distance} ft</p>
                                    <a href="https://google.gprivate.com/search.php?search?q=${foodName + " " + foodAddress}" target="_blank" class="foodLink">Open in Google</a>
                                    </div>`);
                                    // clear modal before repopulating with new info
                                    modalList.append(nameEl);
                                }
                                // close modal when done
                                modal.addClass("is-active");
                                modalBg.on("click", () => {
                                    modal.removeClass("is-active");
                                })
                                modalClose.on("click", () => {
                                  modal.removeClass("is-active");
                              })
                            });
                    };


                    // // favorites work
                    // var saveBtn = document.querySelector(".favorite")
                    // $(document).on("click", saveBtn, function () {
                    //     localStorage.setItem(eventDate, eventName);
                        // console.log("hit");
                        // console.log(eventDate, eventName);
                    // });

                    // PSEUDO CODE:
                    // when save button is clicked, show name/date is saved to local storage
                    // AND event is added to favorites list
                    // AND bookmark icon class is changed to dark/filled in 

                    // when added to favorites list:
                    // list item is created dynamically
                    // and classes assigned for styling 

                    // when page loads, items saved in local storage populate favorites list 
                };
            });
    };
});

