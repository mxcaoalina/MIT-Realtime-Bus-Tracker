// Initialize and add the map
let map;

var markers = [];

async function init() {
  // The location of boston
  const position = { lat: 42.353350,lng:-71.091525 };
  // Request needed libraries.
  //@ts-ignore
   const { Map } = await google.maps.importLibrary("maps");
 //  const { addMarker } = await google.maps.importLibrary("marker");

  // The map, centered at boston
  map = new Map(document.getElementById("map"), {
    zoom: 12,
    center: position,
    mapId: "8e0a97af9386fef",
  });


  
  addMarkers();
}




  // Add bus markers to map
async function addMarkers(){
	// get bus data
	var locations = await getBusLocations();

	// loop through data, add bus markers
	locations.forEach(function(bus){
		var marker = getMarker(bus.id);		
		if (marker){
			moveMarker(marker,bus);
		}
		else{
			addMarker(bus);			
		}
	});

	// timer
	console.log(new Date());
	setTimeout(addMarkers,15000);
}


// Request bus data from MBTA
async function getBusLocations(){
	var url = 'https://api-v3.mbta.com/vehicles?filter[route]=1&include=trip';	
	var response = await fetch(url);
	var json     = await response.json();
	return json.data;
}

function addMarker(bus){
    var icon = google.maps.importLibrary("marker");
	var marker = new google.maps.Marker({
	    position: {
	    	lat: bus.attributes.latitude, 
	    	lng: bus.attributes.longitude
	    },
	    map: map,
	    icon: icon,
	    id: bus.id
	});
	markers.push(marker);
}


function moveMarker(marker,bus) {
	// change icon if bus has changed direction
	var icon = google.maps.importLibrary("marker");

	// move icon to new lat/lon
    marker.setPosition( {
    	lat: bus.attributes.latitude, 
    	lng: bus.attributes.longitude
	});
}

function getMarker(id){
	var marker = markers.find(function(item){
		return item.id === id;
	});
	return marker;
}

window.onload = init;
