$(function () {
    // size is how many results
    var size = 20;
    // start date must be in YYYY-MM-DD format
    var startDate = "2022-11-22"; // TODO make this a dynamic variable chosen by user
    // ticketmaster API is limited to Philadelphia
    var ticketmasterUrl = "https://app.ticketmaster.com/discovery/v2/events.json?size=" + size + "&city=[philadelphia]&localStartDateTime=" + startDate + "T00:00:00," + startDate + "T23:59:59&apikey=CHo9U7G9NvQH3YdZsAJYBoNV5by3z3Hq";

    document.getElementById('fromDate').addEventListener('change', function() {
        var fromDate = this.value
        console.log(fromDate);
    });
    document.getElementById('toDate').addEventListener('change', function() {
        var toDate = this.value
        console.log(toDate);
    });

    $.ajax({
        url: ticketmasterUrl,
        method: 'GET'
    }).then(function (data) {
        // all event data in array
        console.log(data._embedded.events);
        // venue name for display
        var venue = data._embedded.events[0]._embedded.venues[0].name;
        console.log("Venue Name: " + venue);
        // venue address
        var venueAddress = data._embedded.events[0]._embedded.venues[0].address.line1;
        console.log("Vanue Address: " + venueAddress);
        // venue latitude and longitude to find food nearby
        var venueLat = data._embedded.events[0]._embedded.venues[0].location.latitude;
        var venueLon = data._embedded.events[0]._embedded.venues[0].location.longitude;
        console.log("Venue Latitude: " + venueLat);
        console.log("Venue Longitude: " + venueLon);
        // start time of event, to send to food api to check if open
        var eventTime = data._embedded.events[0].dates.start.localTime;
        console.log("Event Time (24 hours): " + eventTime);
        // url for linking to buy tickets
        var ticketUrl = data._embedded.events[0].url;
        console.log("Ticketing Url: " + ticketUrl);
        // image
        var imageLink = data._embedded.events[0].images[0].url;
        console.log("Image Link: " + imageLink);
        findFood(venue, venueAddress, venueLat, venueLon, eventTime, ticketUrl, imageLink, ticketUrl);
    });

    function findFood(venue, venueAddress, venueLat, venueLon, eventTime, ticketUrl, imageLink, ticketUrl) {
        // limit is how many results
        var limit = 20;
        var geoapifyUrl = "https://api.geoapify.com/v2/places?categories=catering&bias=proximity:" + venueLon + "," + venueLat + "&limit=" + limit + "&apiKey=abbaf448e8fd46d789223be439a4096c";
        
        $.ajax({
            url: geoapifyUrl,
            method: 'GET'
        }).then(function (data) {
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

});