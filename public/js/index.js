//hIJTUbDjDsYAHwRbJen81_1KEs Honolulu place id

var map;
var service; //places search service
var geocoder;
var departing = [ //holds info of the departing city
    {city: ""},
    {marker: ""}
  ];
var flightArray = [];
var flightDest = [ //temp hardcoded destinations, change to 
//include multiple object, indexed and each containing city, 
//latlng, marker, info content
    {lat: 37.772, lng: -122.214}, //this content should be made after the search with the intended structure
    {lat: 21.291, lng: -157.821},
    {lat: -18.142, lng: 178.431},
    {lat: -27.467, lng: 153.027},
    {lat: -40.762021, lng: -62.578080},
    {lat: 39.626641, lng: 2.877364},
    {lat: 59.614856, lng: 6.217208},
    {lat: 39.355332, lng: 125.748454},
    {lat: 63.775087, lng: -18.392168}
  ];

var citySearch = [
  {city: 'Barcelona, Spain'},
  {city: 'Pyongyang'},
  {city: 'Paris'},
  {city: 'New York'},
  {city: 'Salt Lake City'},
  {city: 'Coopenhagen'},
  {city: 'Liverpool'},
  {city: 'Brisbane'}
];

var cityResult = [];

var boundsOverView;
var centerOverView;
var boundsZoom;
var centerZoom;
var cityState = false;

var autocomplete;
var places; //
var infoWindow; //google's window, not working currently
var infowindow; //currently works



//events that happen apart from the map  
window.onload = function() { //displays the first pop up on the page loading
  console.log("is this working?");
  $('#myModal2').show();
};

hideModal = function(type) { //toggles the pop ups
  console.log("button click");
  if (type == 1) {
    $('#myModal').hide();
    $('#myModal2').show();
  } else if (type == 2) {
    setVar();
    console.log(isFormComplete());
    //if (isFormComplete()) {
      $('#myModal2').hide();
      $('#searchBox').show();
      //$('#resultsbar').show();
      //}
  }
}

//setting the inputs from the forms, currently needs work on 
//getting input to check correctly
var minBudget;
var maxBudget;

var dateDep;
var yearDep;
var monthDep;
var dayDep;

var dateRet;
var yearRet;
var monthRet;
var dayRet;

subVar = function() {
  if (isFormComplete()) { //need to fix so that it gets the whole value and it currently breaks after having broken once, it will not rewrite the values into the var
    console.log(isFormComplete());
    minBudget = document.getElementById('lowEndUI').value;
    maxBudget = document.getElementById('highEndUI').value;
    dateDep = document.getElementById('departUI').value;
    dateRet = document.getElementById('returnUI').value;
    $('#submitButton').css('background-color','#AAAAAA');
  } else {
    $('#submitButton').css('background-color','#AAAAAA');
  }
}

setVar = function() { //not using jquery due to issues with getting the input
  minBudget = document.getElementById('lowEnd').value;
  maxBudget = document.getElementById('highEnd').value;
  dateDep = document.getElementById('depart').value;
  dateRet = document.getElementById('return').value;
  setDates();

  document.getElementById('lowEndUI').value = minBudget;
  document.getElementById('highEndUI').value = maxBudget;
  document.getElementById('departUI').value = dateDep;
  document.getElementById('returnUI').value = dateRet;
}

isFormComplete = function() {
  if (minBudget!="" || maxBudget!="" || dateDep!="" || dateRet!="") {
    if (minBudget<=maxBudget){
      console.log(minBudget);
      console.log(maxBudget);
      if (yearDep<=yearRet){
        //console.log("year is good");
        if (monthDep<=monthRet) {
          //console.log("month is good");
          if (dayDep<=dayRet) {
            //console.log("input looks good");
            return true;
          }
        }
      }
    }
  }
  console.log("input looks bad");
  return false;
}

setDates = function() {
  for (var i=0; i<dateDep.length; i++) {
    if (i<4) {
      yearDep = new String();
      yearRet = new String();
      yearDep += yearDep.toString(dateDep.charAt(i));
      yearRet += yearRet.toString(dateRet.charAt(i));
      console.log(yearDep);
    } else if (i>4 && i<7) {
      monthDep = new String();
      monthRet = new String();
      monthDep += monthDep.toString(dateDep.charAt(i));
      monthRet += monthRet.toString(dateRet.charAt(i));
    } else if (i>7) {
      dayDep = new String();
      dayRet = new String();
      dayDep += dayDep.toString(dateDep.charAt(i));
      dayRet += dayRet.toString(dateRet.charAt(i));
    }
  }
}

var toggle = 1;
toggleForm = function() {
  if (toggle == 1) {
    //move form up to the top, off the page
    toggle = 2;
  } else {
    //move form down, so it is visible
    toggle = 1;
  }
}



function initMap() { //the search function for getting an airport
  map = new google.maps.Map(document.getElementById('map'), {
    //center: {lat: 32.729, lng: -117.195},
    center: {lat: 40.72, lng: -95.11},
    zoom: 4,
    mapTypeId: 'terrain',
    streetViewControl: false,
    mapTypeControl: false, //changing from sat to terrain
    //zoomControl: false, //icons to zoom in or out
    scrollwheel: false, //zooming in/out with mousewheel
    panControl: false 
  });

  // geolocation
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      map.setZoom(9);
      map.setCenter(pos);
    }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
    });
    findAirports(map.getCenter());
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter()); 
    //google wants to display an infowindow when locating doesnt work
    //do nothing then, need user input for a city
  }

  //in case we want to do something beyond 'nothing' when locating doesnt work
  function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    // tempPos = new google.maps.LatLng(pos);
    // infoWindow.setPosition(tempPos);
    // infoWindow.setContent(browserHasGeolocation ?
    //                       'Error: The Geolocation service failed.' :
    //                       'Error: Your browser doesn\'t support geolocation.');
    // infoWindow.open(map);
  }

  function findAirports(pos) { 
    //want to make the map return airports near the current location to pick from
    //var searchReturns = new google.maps.
    //do a searchNearBy(using the city chosen)
    // then display airports so user can select
    // set the clicked airport as the departing airport
  }

  // Create the autocomplete object and associate it with the UI input control.
  autocomplete = new google.maps.places.Autocomplete(
      /** @type {!HTMLInputElement} */ (
          document.getElementById('autocomplete')), {
        types: ['(cities)'],
      });
  console.log(autocomplete);
  places = new google.maps.places.PlacesService(map);

  autocomplete.addListener('place_changed', onPlaceChanged);

  if (cityState) {
    console.log("i wanna click");
    departing.marker.addListener('click', function(){
      codeAddress();
    });
  }

  geocoder = new google.maps.Geocoder();

  // search for the cities of destinations and place markers
  // for (var j = 0; j < citySearch.length; j++) {
  //   console.log(citySearch[j].city);

  //   var input = document.getElementById('dest-input');
  //   citySearch[j] = new google.maps.places.Autocomplete(
  //     /** @type {!HTMLInputElement} */ (
  //         input), {
  //       types: ['(cities)'],
  //     });

  //   citySearch[j].addListener('place_changed', function (){
  //     console.log(citySearch[j]);
  //     console.log(citySearch[j].getPlace());
  //   });
  //   var t = document.createTextNode(citySearch[j].city);
  //   input.appendChild(t);
  //   console.log(citySearch[j].getPlace());

  //   // var input = document.getElementById('dest-input');
  //   // var t = document.createTextNode(citySearch[j].city);
  //   // input.appendChild(t);
  //   // console.log(input);
  //   // citySearch[j] = new google.maps.places.Autocomplete(input);

  //   console.log(citySearch[j]);
  //   place = citySearch[j].getPlace();
  //   console.log(place);
  //   // do another search in order to add the latlng for the element
  //   request = {
  //     location: place.geometry.location,
  //     types: ['cities']
  //   };
  //   service.nearbySearch(request, function(results, status) {
  //     if (status == google.maps.places.PlacesServiceStatus.OK) {
  //       for (var i = 0; i < results.length; i++) {
  //         var place = results[i];
  //         // If the request succeeds, draw the place location on
  //         // the map as a marker, and register an event to handle a
  //         // click on the marker.
  //         var marker = new google.maps.Marker({
  //           map: map,
  //           position: place.geometry.location
  //         });
  //       }
  //     }
  //   });
  // }

  service = new google.maps.places.PlacesService(map);

} //initMap ends here

// When the user selects a city, get the place details for the city and
// zoom the map in on the city.
function onPlaceChanged() {
  var place = autocomplete.getPlace();
  if (place.geometry) {
    map.panTo(place.geometry.location);
    map.setZoom(9);
    search();
  } else {
    document.getElementById('autocomplete').placeholder = 'Enter a city';
  }
}

// Search for airports in the selected city, within the viewport of the map.
function search() {
  var search = { //conforms the search
    bounds: map.getBounds(),
    types: ['cities']
  };

  places.nearbySearch(search, function(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      clearMarkers();
      var result = results[0]; //grabs the city element of the search
      // Create a marker for each city found, and
      // Use marker animation to drop the icons incrementally on the map.
      departing.marker = new google.maps.Marker({ //places a marker
        position: result.geometry.location,
        animation: google.maps.Animation.DROP,
      });
      departing.marker.setMap(map);
      departing.marker.placeResult = result;
      departing.marker.addListener('click', function(){
        codeAddress();
        console.log("click the marker");
      });
    }
  });
}

function codeAddress() {
  for (var i = 0; i < citySearch.length; i++) {
    var address = citySearch[i].city;
    geocoder.geocode( { 'address': address}, function(results, status) {
      if (status == 'OK') {
        //map.setCenter(results[0].geometry.location);
        // var marker = new google.maps.Marker({
        //     map: map,
        //     position: results[0].geometry.location
        // });
        cityResult.push(results);
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    });
  }
  drawMap(cityResult);
  console.log(cityResult);
}


function clearDeparting() {
  //need to clear existing departing input to replace it
  //removes the marker from the map
}

function clearMarkers() {
  //removes markers of the results, needs to remove the polylines too
  //for (var i = 0; i < airports.length; i++) {
    //if (airports[i]) {
      //departing.marker.setMap(null);
    //} once i figure out how to remove them...
  //}
}

function drawMap(destinations) { //function to call line drawing after user input is taken
  console.log('check if not null');
if (destinations != null) { //make sure there is a departing point
  console.log('k its not null');
  for (var i=0; i<destinations.length; i++) {
    //if (destinations[i].length == 1) {
      console.log('here we go');
      // var flightPlanCoordinates = [ //set departing and destination coords
      //   {lat: departing.marker.position.lat.call(), lng: departing.marker.position.lng.call()},
      //   {lat: destinations.geometry.location.lat, lng: destinations.geometry.location.lng} ];
      
      // var flightPath = new google.maps.Polyline({ //make the polylines
      //   path: flightPlanCoordinates,
      //   geodesic: true, //line or curves!!
      //   strokeColor: '#283018',
      //   strokeOpacity: 0.9,
      //   strokeWeight: 2
      // });
      // flightPath.setMap(map); //set flights to the map
      // flightArray.push(flightPath); //add flights to the array
      
      boundsOverView = map.getBounds();
      boundsOverView.extend(destinations[i].geometry.location);
      map.fitBounds(boundsOverView); //need to fix bounds to not zoom so much
      map.setZoom(2);
      centerOverView = map.getCenter();
    //}
  }
    
  // for (k in flightArray) { //changes opacity on all lines but the hovered one
  //   flightArray[k].addListener('mouseover', function(){ //function for the lines dimming when one is hovered
  //     for (var j=0; j<flightArray.length; j++) {
  //       flightArray[j].setOptions({strokeOpacity:0.2});
  //       this.setOptions({strokeOpacity:1.0});
  //     }
  //   });

  //   flightArray[k].addListener('mouseout', function(){ //reset line opacity after mouse leaves
  //     for (var i=0; i<flightArray.length; i++) {
  //       flightArray[i].setOptions({strokeOpacity:1.0});
  //       this.setOptions({strokeOpacity:1.0});
  //     }
  //   });
  // }

  var markerArray = []; //object of all the markers
  
  console.log('is it getting this far');
  console.log(destinations.length);
  for (var i=0; i<destinations.length; i++) { //loops through all destination
    var marker = new google.maps.Marker({ //creates a marker at each destination
      position: destinations[i].geometry.location,
      map: map,
      animation: google.maps.Animation.DROP
    });
    markerArray.push(marker); //add the marker to the array
    marker.setMap(map); //applies the marker to the map
  }

  for (i in markerArray) { //makes the map zoom on the clicked marker
    bounds = map.getBounds();
    center = map.getCenter();
    
    if (map.getZoom() != 8) { //checks that the map is zoomed out
      var marker = markerArray[i]; //gets the clicked marker
      google.maps.event.addListener(marker,'click',function(){
        map.setZoom(6); //zooms in the map
        tempCoord = new google.maps.LatLng({lat: this.getPosition().lat.call()+0.6, lng: this.getPosition().lng.call()+0.5}); //builds a new center for the map
        map.setCenter(tempCoord); //sets the center of the map
        infowindow.open(map, this); //open the pop up on the marker
      });
    }

    placeDetailsByPlaceId(service, map, infowindow);

  // infowindow content set here
  var contentString = '<div id="infoContent">' +
  '<h3 id="placeName"><b>{{Place Name}}</b></h3>' +
  '<h6 id="flightDetails>{{Flight Info}}</h6>' +
  '<p id="placeDetails>{{placeDetails}}</p>' +
  '<div id="placeImages></div>' +
  '</div>';
  infowindow = new google.maps.InfoWindow({
    content: contentString
  });
    
   google.maps.event.addListener(infowindow, 'closeclick', function(){ //if the pop up is closed
    map.fitBounds(boundsOverView); //resets the bounds of the map
    map.setCenter(centerOverView);
    map.setZoom(2);
   });

  }
}

function placeDetailsByPlaceId(service, map, infowindow) {
  // Create and send the request to obtain details for a specific place,
  // using its Place ID.
  var request = {
    placeId: 'hIJTUbDjDsYAHwRbJen81_1KEs' //document.getElementById('place-id').value
  };

  service.getDetails(request, function (place, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      // If the request succeeds, draw the place location on the map
      // as a marker, and register an event to handle a click on the marker.
      var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location
      });

      google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent('<div><strong>' + place.name + '</strong><br>' +
          'Place ID: ' + place.place_id + '<br>' +
          place.formatted_address + '</div>');
        infowindow.open(map, this);
      });

      //map.panTo(place.geometry.location);
    }
  });
}

// For each place, get the icon, name and location.
//var bounds = new google.maps.LatLngBounds();

// Get the place details for a hotel. Show the information in an info window,
// anchored on the marker for the hotel that the user selected.
function showInfoWindow() {
  var marker = this;
  places.getDetails({placeId: marker.placeResult.place_id},
      function(place, status) {
        if (status !== google.maps.places.PlacesServiceStatus.OK) {
          return;
        }
        infoWindow.open(map, marker);
        buildIWContent(place);
      });
} 

} //end of script area
  