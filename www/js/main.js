"use strict";
var map; 
var Pos ;
var markers = [];
var currentMarkers = [];
var currentMarker;
var Destination;
var infoWindow;
var directionsService;
var directionsDisplay;
var watch_id;
var destinationType;
var photoimagedata;
var imageList = [];
var request; 
var service;

//https://cordova.apache.org/docs/en/3.0.0/cordova/geolocation/geolocation.watchPosition.html
// This link inspired this code 
//{
//watchPosition checks if the users location has changed
function watchPosition(){
	   watch_id = navigator.geolocation.watchPosition(
     //If Successful it gets the position
	function(position){
		//Update the Position by storing it in Pos
		//inc = inc + 0.01;
		
		//Pos = {lat:(position.coords.latitude + inc),
		Pos = {lat:position.coords.latitude,
		  lng: position.coords.longitude
		};
		console.log(Pos)
		//Update the current marker on the map
		currentMarker.setMap(null);
		currentMarker = new google.maps.Marker({
             position: Pos,
			 map: map
			});
	},
	// Error occurs then log error
	function(error){
		console.log(error);
	}, 
	// Settings for watching the change in position
	{ frequency: 15000, enableHighAccuracy: true });
}
//}
// Called then the Map Page is created
$(document).on('pagecreate', '#MapPage', function () {
	console.log("pagecreate Map Page");
	// Get the popup element
	var popup = document.getElementById('popup');

	// Get the <span> element that closes the modal
	var span = document.getElementsByClassName("close")[0];

	// When the user clicks on <span> (x), close the modal
	span.onclick = function() {
		console.log("close");
	   popup.style.display = "none";
	}
	// When the user clicks anywhere outside of the modal, close it
	window.onclick = function(event) {
		if (event.target == popup) {
			popup.style.display = "none";
		}
	}
	//Check if the device has a internet connection to load the map
	if(window.navigator.onLine){
	//Initialize the Map
	initMap()
	}else{
		//If not connected to the internet then display popup
		popup.style.display = "block";
		$(".popup-header").empty();
		$(".popup-body").empty();
	
		var popupHeaderTxt = "<span class='close2'>&times;</span> <h2 id='modelHead'>No Internet Connection</h2>"
		$(".popup-header").html(popupHeaderTxt);
		var popupBodyText = "<p>Please have a internet connection to  use the map. </p>"
		 $(".popup-body").html(popupBodyText);
		 // Get the <span> element that closes the modal
		var span = document.getElementsByClassName("close2")[0];

		// When the user clicks on <span> (x), close the modal
		span.onclick = function() {
	    popup.style.display = "none";
	}
	}
	//scroll hint down arrow is clicked and moves the user to the bottom of the page 
	$('.arrowDown').on('click',function (event) {
		//Animate to the bottom of the page
		$('html, body').animate({scrollTop: $("#bottom").offset().top
		}, 1000);
		//Show the up arrow scroll hint
		$('.arrowUp').show();
		//Hide the down arrow scroll hint
		$('.arrowDown').hide();
		return true;
	});
	//scroll hint up arrow is clicked and moves the user to the bottom of the page 
	$('.arrowUp').on('click',function (event) {
		//Animate to the top of the page
		$('html, body').animate({scrollTop: $("#top").offset().top
		}, 1000);
		//Hide the up arrow scroll hint
		$('.arrowUp').hide();
		//Show the down arrow scroll hint
		$('.arrowDown').show();
		return true;
	});
	//Get the results of the nearby cafes when the cafe button is clicked
	$('#cafeButton').on('click',function (event) {
		//Animate to the top of the page
		$('html, body').animate({scrollTop: $("#top").offset().top
		}, 1000);
		//Hide the up arrow scroll hint
		$('.arrowUp').hide();
		//Show the down arrow scroll hint
		$('.arrowDown').show();
		// Display a popup
		popup.style.display = "block";
		//Clear the text of the popup
		$("#popupHead").empty();
		$(".popup-body").empty();
		//Check if the device is connected to the internet
		if(window.navigator.onLine){
			// Change the navigation bar to show the place Results Page in the navigation page
			$(".navbar").hide();
			$(".navbar2").show();
			//Change the header and body text of the popup
			var popupHeaderTxt = "<p>Searching ...</p>"
			$("#popupHead").html(popupHeaderTxt);
			var popupBodyText = "<p>Displaying nearby cafes.Click on the markers to get directions and the name and vicinity of the nearby place</p>"
			$(".popup-body").html(popupBodyText);
			//Get the value of the button which contains the type of place
			var type = $(this).val();
			//Update map position to user position
			map.setCenter(Pos);
			//Update map zoom
			map.setZoom(10);
			//Removes any markers on the map
			clearResults(markers);
			//Removes directions and the display of the route to a nearby place 
			directionsDisplay.setDirections({routes: []});
			//Creates a request to search for cafes
			request = {location:Pos, radius: 10000, type:type};
			//console.log(request);
			//create a new service
			service = new google.maps.places.PlacesService(map);
			//Call a nearby Search to get the nearby cafes
			service.nearbySearch(request,callback);
		}else{
			
			//Change the header and body text of the popup if there is not internet connection and display it
			var popupHeaderTxt = "<p>No Internet Connection</p>"
			$("#popupHead").html(popupHeaderTxt);
			var popupBodyText = "<p>Please have a internet connection to search for nearby Cafes.</p>"
			$(".popup-body").html(popupBodyText);
		}
	});
	//Get the results of the nearby hotels when the hotel button is clicked
	$('#hotelButton').on('click',function (event) {
		//Animate to the top of the page
		$('html, body').animate({scrollTop: $("#top").offset().top
		}, 1000);
		//Hide the up arrow scroll hint
		$('.arrowUp').hide();
		//Show the down arrow scroll hint
		$('.arrowDown').show();
		// Display a popup
		popup.style.display = "block";
		//Clear the text of the popup
		$("#popupHead").empty();
		$(".popup-body").empty();
		//Check if the device is connected to the internet
		if(window.navigator.onLine){
			// Change the navigation bar to show the place Results Page in the navigation page
			$(".navbar").hide();
			$(".navbar2").show();
			//Change the header and body text of the popup
			var popupHeaderTxt= "<p>Searching ...</p>"
			$("#popupHead").html(popupHeaderTxt);
			var popupBodyText = "<p>Displaying nearby hotels.Click on the markers to get directions and the name and vicinity of the nearby place</p>"
			 $(".popup-body").html(popupBodyText);
			//Get the value of the button which contains the type of place
			var type = $(this).val();
			//Update map position to user position
			map.setCenter(Pos);
			//Update map zoom
			map.setZoom(10);
			//Removes any markers on the map
			clearResults(markers);
			//Removes directions and the display of the route to a nearby place 
			directionsDisplay.setDirections({routes: []});
			//Creates a request to search for cafes
			request = {location:Pos, radius: 10000, type:type};
			//create a new service
			service = new google.maps.places.PlacesService(map);
			//Call a nearby Search to get the nearby cafes
			service.nearbySearch(request,callback);
		}else{
			
			//Change the header and body text of the popup if there is not internet connection and display it	
			var popupHeaderTxt = "<p>No Internet Connection</p>"
			$("#popupHead").html(popupHeaderTxt);
			var popupBodyText = "<p>Please have a internet connection to search for nearby hotels.</p>"
			$(".popup-body").html(popupBodyText);
		}
	});
	//Get the results of the nearby restaurants when the restaurant button is clicked
	$('#restaurantButton').on('click',function (event) {
		//Animate to the top of the page
		$('html, body').animate({scrollTop: $("#top").offset().top
		}, 1000);
		//Hide the up arrow scroll hint
		$('.arrowUp').hide();
		//Show the down arrow scroll hint
		$('.arrowDown').show();
		// Display a popup
		popup.style.display = "block";
		//Clear the text of the popup
		$("#popupHead").empty();
		$(".popup-body").empty();
		//Check if the device is connected to the internet
		if(window.navigator.onLine){
			// Change the navigation bar to show the place Results Page in the navigation page
			$(".navbar").hide();
			$(".navbar2").show();
			//Change the header and body text of the popup
			var popupHeaderTxt= "<p>Searching ...</p>"
			$("#popupHead").html(popupHeaderTxt);
			var popupBodyText = "<p>Displaying nearby restaurants.Click on the markers to get directions and the name and vicinity of the nearby place</p>"
			 $(".popup-body").html(popupBodyText);
			//Get the value of the button which contains the type of place
			var type = $(this).val();
			//console.log(type);
			//Update map position to user position
			map.setCenter(Pos);
			//Update map zoom
			map.setZoom(10);
			//Removes any markers on the map
			clearResults(markers);
			//Removes directions and the display of the route to a nearby place 
			directionsDisplay.setDirections({routes: []});
			//Creates a request to search for cafes
			request = {location:Pos, radius: 10000, type:type};
			//console.log(request);
			//create a new service
			service = new google.maps.places.PlacesService(map);
			//Call a nearby Search to get the nearby cafes
			service.nearbySearch(request,callback);
		}else{
			//Change the header and body text of the popup if there is not internet connection and display it
			var popupHeaderTxt = "<p>No Internet Connection</p>"
			$("#popupHead").html(popupHeaderTxt);
			var popupBodyText = "<p>Please have a internet connection to search for nearby Restaurants.</p>"
			$(".popup-body").html(popupBodyText);
		}
	});
	//Get the results of the nearby banks when the bank button is clicked
	$('#bankButton').on('click',function (event) {
		//Animate to the top of the page
		$('html, body').animate({scrollTop: $("#top").offset().top
		}, 1000);
		//Hide the up arrow scroll hint
		$('.arrowUp').hide();
		//Show the down arrow scroll hint
		$('.arrowDown').show();
		// Display a popup
		popup.style.display = "block";
		//Clear the text of the popup
		$("#popupHead").empty();
		$(".popup-body").empty();
		//Check if the device is connected to the internet
		if(window.navigator.onLine){
			// Change the navigation bar to show the place Results Page in the navigation page
			$(".navbar").hide();
			$(".navbar2").show();
			//Change the header and body text of the popup
			var popupHeaderTxt = "<p>Searching ...</p>"
			$("#popupHead").html(popupHeaderTxt);
			var popupBodyText = "<p>Displaying nearby banks.Click on the markers to get directions and the name and vicinity of the nearby place</p>"
			 $(".popup-body").html(popupBodyText);
			//Get the value of the button which contains the type of place
			var type = $(this).val();
			//console.log(type);
			//Update map position to user position
			map.setCenter(Pos);
			//Update map zoom
			map.setZoom(10);
			//Removes any markers on the map
			clearResults(markers);
			//Removes directions and the display of the route to a nearby place 
			directionsDisplay.setDirections({routes: []});
			//Creates a request to search for cafes
			request = {location:Pos, radius: 10000, type:type};
			//console.log(request);
			//create a new service
			service = new google.maps.places.PlacesService(map);
			//Call a nearby Search to get the nearby cafes
			service.nearbySearch(request,callback);
		}else{
			//Change the header and body text of the popup if there is not internet connection and display it
			var popupHeaderTxt = "<p>No Internet Connection</p>"
			$("#popupHead").html(popupHeaderTxt);
			var popupBodyText = "<p>Please have a internet connection to search for nearby Banks.</p>"
			$(".popup-body").html(popupBodyText);
		}
	});
	//Get the results of the nearby health care when the health care button is clicked
	$('#healthButton').on('click',function (event) {
		//Animate to the top of the page
		$('html, body').animate({scrollTop: $("#top").offset().top
		}, 1000);
		//Hide the up arrow scroll hint
		$('.arrowUp').hide();
		//Show the down arrow scroll hint
		$('.arrowDown').show();
		// Display a popup
		popup.style.display = "block";
		//Clear the text of the popup
		$("#popupHead").empty();
		$(".popup-body").empty();
		//Check if the device is connected to the internet
		if(window.navigator.onLine){
			// Change the navigation bar to show the place Results Page in the navigation page
			$(".navbar").hide();
			$(".navbar2").show();
			//Change the header and body text of the popup
			var popupHeaderTxt= "<p>Searching ...</p>"
			$("#popupHead").html(popupHeaderTxt);
			var popupBodyText = "<p>Displaying nearby health centres.Click on the markers to get directions and the name and vicinity of the nearby place</p>"
			 $(".popup-body").html(popupBodyText);
			//Get the value of the button which contains the type of place
			var type = $(this).val();
			//console.log(type);
			//Update map position to user position
			map.setCenter(Pos);
			//Update map zoom
			map.setZoom(10);
			//Removes any markers on the map
			clearResults(markers);
			//Removes directions and the display of the route to a nearby place 
			directionsDisplay.setDirections({routes: []});
			//Creates a request to search for cafes
			request = {location:Pos, radius: 10000, type:type};
			//console.log(request);
			//create a new service
			service = new google.maps.places.PlacesService(map);
			//Call a nearby Search to get the nearby cafes
			service.nearbySearch(request,callback);
		}else{
			//Change the header and body text of the popup if there is not internet connection and display it
			var popupHeaderTxt = "<p>No Internet Connection</p>"
			$("#popupHead").html(popupHeaderTxt);
			var popupBodyText = "<p>Please have a internet connection to search for nearby Health centres.</p>"
			$(".popup-body").html(popupBodyText);
		}
	});
	//Get the results of the nearby train stations when the train station button is clicked
	$('#trainStationButton').on('click',function (event) {
		//Animate to the top of the page
		$('html, body').animate({scrollTop: $("#top").offset().top
		}, 1000);
		//Hide the up arrow scroll hint
		$('.arrowUp').hide();
		//Show the down arrow scroll hint
		$('.arrowDown').show();
		// Display a popup
		popup.style.display = "block";
		//Clear the text of the popup
		$("#popupHead").empty();
		$(".popup-body").empty();
		//Check if the device is connected to the internet
		if(window.navigator.onLine){
			// Change the navigation bar to show the place Results Page in the navigation page
			$(".navbar").hide();
			$(".navbar2").show();
			//Change the header and body text of the popup
			var popupHeaderTxt= "<p>Searching ...</p>"
			$("#popupHead").html(popupHeaderTxt);
			var popupBodyText = "<p>Displaying nearby Train Stations.Click on the markers to get directions and the name and vicinity of the nearby place</p>"
			$(".popup-body").html(popupBodyText);
			//Get the value of the button which contains the type of place
			var type = $(this).val();
			//console.log(type);
			//Update map position to user position
			map.setCenter(Pos);
			//Update map zoom
			map.setZoom(10);
			//Removes any markers on the map
			clearResults(markers);
			//Removes directions and the display of the route to a nearby place 
			directionsDisplay.setDirections({routes: []});
			//Creates a request to search for cafes
			request = {location:Pos, radius: 10000, type:type};
			//console.log(request);
			//create a new service
			service = new google.maps.places.PlacesService(map);
			//Call a nearby Search to get the nearby cafes
			service.nearbySearch(request,callback);
		}else{
			//Change the header and body text of the popup if there is not internet connection and display it
			var  popupHeaderTxt= "<p>No Internet Connection</p>"
			$("#popupHead").html(popupHeaderTxt);
			var popupBodyText = "<p>Please have a internet connection to search for nearby Train Stations.</p>"
			$(".popup-body").html(popupBodyText);
		}
	});
});
//initiates the creation of the google map on the app
function initMap() {
	//Creates an new directions service ,display and info window 
	directionsService = new google.maps.DirectionsService;
	directionsDisplay = new google.maps.DirectionsRenderer({suppressMarkers: true});
	infoWindow = new google.maps.InfoWindow();
	// Create the search box and link it to the inputfield element.
	  var input = document.getElementById('searchInput');
	  var searchBox = new google.maps.places.SearchBox(input);
	// Try HTML5 geolocation.
	if (navigator.geolocation) {
		//Get the current position of the user
		navigator.geolocation.getCurrentPosition(function(position) {
			 Pos = {lat: position.coords.latitude,
			  lng: position.coords.longitude
			};
			//Create the map so it is  center on the users position
			//Disable the default UI  but have the fullscreenControl , zoom Control and make it so the map 
			//can be handled with gestures eg one finger to move
			map = new google.maps.Map(document.getElementById('map'), {
			  center: Pos,
			  zoom: 13,
			  disableDefaultUI: true,
			  fullscreenControl: true,
			  zoomControl: true,
			  gestureHandling: 'greedy'
			  
			});
			//https://developers.google.com/maps/documentation/javascript/examples/places-searchbox
			//{
			// Bias the searchBox results towards current map's viewport.
			map.addListener('bounds_changed', function() {
				searchBox.setBounds(map.getBounds());
				});
			// Check for the event of when the user selects a suggestion and retrieve
			// more details for that place.
			searchBox.addListener('places_changed', function() {
				var places = searchBox.getPlaces();
				//User entered the name of a place that was not suggested
				if (places.length == 0) {
				  return;
				}
				// Clear out any markers on the map.
				clearResults(markers)
			 
				// For each place, name and location.
				var bounds = new google.maps.LatLngBounds();
				places.forEach(function(place) {
					if (!place.geometry) {
						console.log("Returned place contains no geometry");
						return;
					}
					var marker = new google.maps.Marker({
						map: map,
						title: place.name,
						position: place.geometry.location,
						icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
					});
					// Create a marker for each place.
					markers.push(marker);
					// If the marker is clicked on then display the route to the searched result
					google.maps.event.addListener(marker,'click' ,function(){
						infoWindow.setContent(place.name);
						Destination = place.geometry.location;
						calculateAndDisplayRoute(directionsService, directionsDisplay,Destination)
						infoWindow.open(map,this);
					})
					// If a places has a lat and lng then they have viewport
					if (place.geometry.viewport) {		
						bounds.union(place.geometry.viewport);
					} else {
						bounds.extend(place.geometry.location);
					}
				});
				map.fitBounds(bounds);
			});
			//}
				//direction Display for the map has been set 
				directionsDisplay.setMap(map);
				//Display the current marker on the map
				 currentMarker = new google.maps.Marker({
				 position: Pos,
				 map: map
				});
				// Call the watchPosition function to check if the users location has changed
				watchPosition();
				map.setCenter(Pos);
			}, function() {
				handleLocationError(true, infoWindow, map.getCenter());
			});
		} else {
		  // Browser doesn't support Geolocation
		  handleLocationError(false, infoWindow, map.getCenter());
		}
}
//callback function is called to display the results of the nearby search
function callback(results,status){ 
	// create a listview in html
	var result ="<ul data-role='listview' id = 'placesList' data-filter= 'true' data-theme='b' >";
	//Loop through each of the results
	for(var i=0; i< results.length;i++){
		//Get the placeId from the results
		var placeId = results[i].place_id;
		//Pass each result into the create marker function and then push it to the markers list
		markers.push(createMarkers(results[i]));
		//Store the place id in the data value for each of the places in a list
		result+= "<li id='placeInList' data-value='"+placeId+"'><a href='#MapPage'>";
		//Display info that relates to each place
		result+= "<h3>"+ results[i].name + "</h3>";
		//Create variable to store if that place is open , its price level and rating
		var openNow;
		var priceLevel;
		var Rating;
		// Check if the results have a price_level and it is not null
		if (results[i].price_level != null){
			priceLevel = results[i].price_level;
		}else {
			priceLevel = "Unavailable";
		}
		// Check if the results have a rating and it is not null
		if (results[i].rating != null){
			Rating = results[i].rating;
		}else {
			Rating = "Unavailable";
		}
		// Check if the results have open_now and it is not null
		console.log(results[i])
		//console.log(results[i].opening_hours.open_now)
		if (results[i].opening_hours != null){
			//If it is true then display the place as open else then it is displayed as closed
			if(results[i].opening_hours.open_now ==true){
				openNow = " Currently Open";
			}else {
				openNow = "Currently Closed";
			}
		
		}
		else{
			//If null then it is not available to display
			openNow = "Check if Open or Closed Unavailable";
		}
		// Add the place information variables so they can be displayed for place in the list
		result+= "<p>"+openNow+"</p>";
		result+= "<p> Rating:"+ Rating+ "</p>"
		result+= "<p>Price Level:"+priceLevel+ "</p>"
		result+= "</a></li>";
	}
	result+="</ul>";
	//Add the results to the place results page using the searchResults Id
	$('#searchResults').html(result);
	//Refresh the listview
	$('#placesList').listview().listview('refresh');
}
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
	infoWindow.setPosition(Pos);
	infoWindow.setContent(browserHasGeolocation ?
						  'Error: The Geolocation service failed.' :
						  'Error: Your browser doesn\'t support geolocation.');
	infoWindow.open(map);
}
// If the users click on place in the placeList 
$(document).on('click','#placesList li' ,function(){
	//Clear  the markers from the map
	clearResults(markers);
	//Removes directions and the display of the route to a nearby place 
	directionsDisplay.setDirections({routes: []});
	// Get Place id  from the value of this element
	var id = $(this).data("value");
	//Create a new PlacesService 
	service = new google.maps.places.PlacesService(map);
	//Call the getDetails function to get the places details that has that id
	service.getDetails({placeId: id}, getDetailsCallback);
	//Update map zoom
	map.setZoom(10);
});
//Callback function called when getDetails function is called
function getDetailsCallback(place, status) {
	//Check if the status is ok 
	if (status == google.maps.places.PlacesServiceStatus.OK) {
		//Create a marker by passing it to the createMarker function and then add it into the marker list
		markers.push(createMarkers(place));
		//Get the Destination location in the form of Lat and Lng 
		Destination = place.geometry.location;
		// Calculate and Display the route from the users location and the place that was selected from the places list
		calculateAndDisplayRoute(directionsService, directionsDisplay,Destination)
		
	}
	
}	 
//createMarkers Function
function createMarkers(place) {
	//Store the place's location
    var placeLoc =place.geometry.location;
	//Create a new marker
    var marker = new google.maps.Marker({
		map: map,
		title: place.name,
		position: place.geometry.location,
		icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
	});
	// If the marker is clicked on then display the route to this place and display the place name and vicinity
	google.maps.event.addListener(marker,'click' ,function(){
		infoWindow.setContent(place.name+":"+"<br>"+place.vicinity);
		Destination = place.geometry.location;
		calculateAndDisplayRoute(directionsService, directionsDisplay,Destination)
		infoWindow.open(map,this);
	})
	return marker;
}
//https://developers.google.com/maps/documentation/javascript/directions
// This link inspired this code 
//{
// calculateAndDisplayRoute Function
function calculateAndDisplayRoute(directionsService, directionsDisplay,Destination) {
	// Calls the route function  using the current users Position , destination and travelMode
	directionsService.route({
	  origin: Pos,
	  destination: Destination,
	  travelMode: 'WALKING'
	}, function(response, status) {
	  if (status === 'OK') {
		 //Displays the route if the status is ok
		directionsDisplay.setDirections(response);
	  } else {
		window.alert('Directions request failed due to ' + status);
	  }
    });
}
//}
//Called when you need to remove markers from the map
function clearResults(markers){
  for(var m in markers){
	  markers[m].setMap(null)
  }
  markers = []
}
// On Click event when the user press the display photos button calls the displayPhoto function
$(document).on('click', '#displayPhoto',displayPhoto);
function displayPhoto (){
	//Animate the scrolling to the top of the page to see the map
	$('html, body').animate({
	scrollTop: $("#top").offset().top
	}, 1000);
	// Retrieve stored images from local storage
	var storedImageList = JSON.parse(localStorage.getItem("Images"));
	//Removes any markers from the map
	clearResults(markers);
	//Removes directions and the display of the route to a nearby place 
	directionsDisplay.setDirections({routes: []});
	// Loops through the list and creates a customMarker for each image
	$.each(storedImageList, function(i,item){
		var customMarker = new CustomMarker(
		new google.maps.LatLng(item.ImageLat,item.ImageLng),
		map,
		item.ImageURL
		)
		//Store each of the customMarkers 
		markers.push(customMarker);
	});
}
//On Click event when the user press the camera button and calls the openCamera Function
$(document).on('click', '#takePhoto', openCamera);
function openCamera() {
   //https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-camera/
   //This link inspired this code 
   //{
   navigator.camera.getPicture(onSuccess, onFail, {  
      quality: 50, 
	  allowEdit: true,
      destinationType: Camera.DestinationType.FILE_URL,
	  //saveToPhotoAlbum:true
   });  
   //onSuccess 
   function onSuccess(imageData) { 
		//Store the users current position in lat and lng and then store the imageData as it is a URL
		var imageInfo = {ImageLat: Pos.lat,ImageLng:Pos.lng,ImageURL :imageData};
		//Add the imageInfo to a imageList
		imageList.push(imageInfo);
		//Use localStorage to then store the list of images 
		localStorage.setItem("Images", JSON.stringify(imageList));
   }  
   //onFail then display a camera error that contains a error message
   function onFail(message) { 
		// Display a popup
		popup.style.display = "block";
		//Clear the text of the popup
		$("#popupHead").empty();
		$(".popup-body").empty();
		//Change the header and body text of the popup
		var popupHeaderTxt = "<p>Camera Error</p>"
		$("#popupHead").html(popupHeaderTxt);
		var popupBodyText = "<p>Failed because:"+message+"</p>"
		 $(".popup-body").html(popupBodyText);
    } 
   //}
}
//https://stackoverflow.com/questions/23965161/js-maps-v3-custom-marker-with-user-profile-picture
//This custom marker was inspired by 
//{
//Stores the image information and creates the custom marker 
function CustomMarker(latlng, map, imageURL) { 
    this.LatLng = latlng;
    this.imageURL = imageURL; //added imageSrc
    this.setMap(map);
}
CustomMarker.prototype = new google.maps.OverlayView();
CustomMarker.prototype.draw = function () {
    // Check if the customMarker has been created.
    var customMarkerDiv = this.div_;
    if (!customMarkerDiv) {
        // Create a overlay HTML Div
        customMarkerDiv = this.div_ = document.createElement('div');
        // This div would be the CustomMarker
        customMarkerDiv.className = "customMarker" //Add className to style the marker
		//Create a image element to with the passed image URL
        var img = document.createElement("img");
        img.src = this.imageURL;
        customMarkerDiv.appendChild(img);
        // Then add the overlay to the DOM
        var panes = this.getPanes();
        panes.overlayImage.appendChild(customMarkerDiv);
    }

    // Position the custom marker on the map
    var point = this.getProjection().fromLatLngToDivPixel(this.LatLng);
    if (point) {
        customMarkerDiv.style.left = point.x + 'px';
        customMarkerDiv.style.top = point.y + 'px';
    }
};
CustomMarker.prototype.remove = function () {
    // Check if the overlay was on the map and needs to be removed.
    if (this.div_) {
        this.div_.parentNode.removeChild(this.div_);
        this.div_ = null;
    }
};

CustomMarker.prototype.getPosition = function () {
    return this.LatLng;
};
//}

	



