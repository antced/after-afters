$(function () {
    // size is how many results
    var size = 20;
    var fromDate = document.getElementById("fromDate");
    var toDate = document.getElementById("toDate");
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
            checkBox = sports;
        } else if (checkId === "checkMusic") {
            checkBox = music;
        } else if (checkId === "checkOther") {
            checkBox = other;
        }
    })

    searchBtn.on("click", function () {
        console.log(fromDate.value);
        console.log(toDate.value);
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
                    // var eventName = data[i].name
                    // console.log(eventName);
                    var venue = data._embedded.events[i]._embedded.venues[0].name;
                    var venueLat = data._embedded.events[i]._embedded.venues[0].location.latitude;
                    var venueLon = data._embedded.events[i]._embedded.venues[0].location.longitude;
                    var venueAddress = data._embedded.events[i]._embedded.venues[0].address.line1;
                    var eventTime = data._embedded.events[i].dates.start.localTime;
                    var ticketUrl = data._embedded.events[i].url;
                    var imageLink = data._embedded.events[i].images[0].url;
                    findFood(venue, venueAddress, venueLat, venueLon, eventTime, ticketUrl, imageLink, ticketUrl);

                }
                console.log(data._embedded.events);
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
                    console.log(data.features[0].properties);
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