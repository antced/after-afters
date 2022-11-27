$(function () {
  // size is how many results
  var size = 24;
  // necessary elements
  var fromDate = document.getElementById("fromDate");
  var toDate = document.getElementById("toDate");
  var searchResults = $("#searchResults");
  var resultContent = $("#resultContent");
  var eventsEl = $("#eventsEl");
  var dateRangeSudoEl = $("#dateRangeEl");
  var rangeCont = $("rangeSec");
  // ticketmaster parameters for API
  var checkBox = "";
  var music = "&classificationName=music&";
  var sports = "&classificationName=sports&";
  var other = "";
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
  });
  function dateConvert(x) {
    var step1 = x.split("-");console.log();
    var step2 = Date.UTC(step1[0]+0, step1[1] - 1, step1[2]);
    var step3 = new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: '2-digit' }).format(step2);
    return step3.slice(0, -2) + step1[2];
  }
  searchBtn.on("click", function () {
    rangeCont.empty();
    searchResults.empty();
    getAPI();
  });

  function getAPI() {
    var ticketmasterUrl =
      "https://app.ticketmaster.com/discovery/v2/events.json?" + checkBox + "size=" + size + "&city=[philadelphia]&localStartDateTime=" +
      fromDate.value + "T00:00:00," + toDate.value + "T23:59:59&apikey=CHo9U7G9NvQH3YdZsAJYBoNV5by3z3Hq";
    fetch(ticketmasterUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {

        var dateRangeEl = $(`<h3 id="dateRange" class="col-on-surface title is-6">${dateConvert(fromDate.value)} - ${dateConvert(toDate.value)}</h3>`);
        eventsEl.append(dateRangeEl);
        for (let i = 0; i < data._embedded.events.length; i++) {
          // assign API data
          var eventName = data._embedded.events[i].name;
          var venue = data._embedded.events[i]._embedded.venues[0].name;
          var venueLat = data._embedded.events[i]._embedded.venues[0].location.latitude;
          var venueLon = data._embedded.events[i]._embedded.venues[0].location.longitude;
          var venueAddress = data._embedded.events[i]._embedded.venues[0].address.line1;
          var eventDate = dateConvert(data._embedded.events[i].dates.start.localDate);
          var eventTime = data._embedded.events[i].dates.start.localTime;
          var ticketUrl = data._embedded.events[i].url;
          var imageLink = data._embedded.events[i].images[8].url;
          var item = i;
          // var minPrice = data._embedded.events[i].priceRanges[0].min
          // console.log(minPrice);
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
          var foodBtn = $(`<button class="button custom-btn3 col-on-primary is-small m-1" id="foodNearBtn${item}" >Food Nearby</button>`);
          var saveBtn = $('<button class="button custom-btn4 col-on-primary is-small favorite m-1"><i class="fa-regular fa-bookmark col-on-primary"></i></button>');
          
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
          //  findFood(venue, venueAddress, venueLat, venueLon, eventTime, ticketUrl, imageLink, ticketUrl);
        $(document).on("click", "#foodNearBtn" + i, findFood);
        function findFood() {
            // limit is how many results
            var limit = 20;
            var geoapifyUrl =
              "https://api.geoapify.com/v2/places?categories=catering&bias=proximity:" + venueLon + "," + venueLat + "&limit=" + limit + "&apiKey=abbaf448e8fd46d789223be439a4096c";
              
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
                // distance from venue
                var distance = data.features[0].properties.distance;
                console.log(distance);
              });
          }
        }
        // reset form elements
        fromDate.value = "";
        toDate.value = "";
        checkOther.checked = false;
        checkMusic.checked = false;
        checkSports.checked = false;
      });
      
  

};
})