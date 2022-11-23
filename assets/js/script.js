$(function () {
    // size is how many results
    var size = 20;
    // necessary elements
    var fromDate = document.getElementById("fromDate");
    var toDate = document.getElementById("toDate");
    var searchResults = $("#searchResults")
    // ticketmaster parameters for API
    var checkBox = ""
    var music = "&classificationName=music&"
    var sports = "&classificationName=sports&"
    var other = ""
    // event listeners
    var searchBtn = $("#searchBtn");
    var checkBoxes = $(".custom-checkbox");

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
    })

    searchBtn.on("click", function () {
        getAPI();
    });

    function getAPI() {
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
                    var eventDate = data._embedded.events[i].dates.start.localDate;
                    var eventDateB = eventDate.split('-');
                    eventDate = eventDateB[1] + "-" + eventDateB[2] + "-" + eventDateB[0];
                    var eventTime = data._embedded.events[i].dates.start.localTime;
                    var ticketUrl = data._embedded.events[i].url;
                    var imageLink = data._embedded.events[i].images[0].url;
                    // create elements
                    var poster = $()
                    var figureEl = $('<figure class="m-2 px-4 py-3 col-surface2 level"></figure>');
                    var topSectEl = $('<section class="is-two-thirds has-text-left">');
                    var anchorEl = $(`<a href="# LINK To SHOW? #"><h3 class="col-on-surface subtitle mb-2">${eventName}</h3></a>`);
                    var venueEl = $(`<h3 class="col-on-surface">${venue}</h3>`);
                    var dateEl = $(`<h3 class="col-on-surface">${eventDate}</h3>`);
                    var bottomSectEl = $('<section class="is-one-third is-justify-content-right buttons"></section>');
                    var foodBtn = $('<button class="button custom-btn3 col-on-primary is-small"><b>Food Nearby</b></button>');
                    var saveBtn = $('<button class="button custom-btn4 col-on-primary is-small"><i class="fa-regular fa-bookmark col-on-primary"></i></button>');
                    // append elements
                    searchResults.append(figureEl);
                    figureEl.append(topSectEl);
                    topSectEl.append(anchorEl);
                    topSectEl.append(venueEl);
                    topSectEl.append(dateEl); //maybe could just be month and day
                    figureEl.append(bottomSectEl);
                    bottomSectEl.append(foodBtn);
                    bottomSectEl.append(saveBtn);
                    findFood(venue, venueAddress, venueLat, venueLon, eventTime, ticketUrl, imageLink, ticketUrl);

                }
            });

        function findFood(venue, venueAddress, venueLat, venueLon, eventTime, ticketUrl, imageLink, ticketUrl) {
            // limit is how many results
            var limit = 20;
            var geoapifyUrl = "https://api.geoapify.com/v2/places?categories=catering&bias=proximity:" + venueLon + "," + venueLat + "&limit=" + limit + "&apiKey=abbaf448e8fd46d789223be439a4096c";

            fetch(geoapifyUrl)
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    // all properties
                    // console.log(data.features[0].properties);
                    // name
                    var foodName = data.features[0].properties.name;
                    console.log("Restaurant Name: " + foodName);
                    // address
                    var foodAddress = data.features[0].properties.address_line2;
                    console.log("Restaurant Address: " + foodAddress);
                });
        }
    }

});