document.getElementById('address').innerHTML = listing['address'];

document.getElementById('location').innerHTML = `${listing['city']}  ${listing['zip_']}`;
// document.getElementById('listingInfo').innerHTML = listing['zip_'];
document.getElementById('price').innerHTML = `$ ${listing['price']}`;
document.getElementById('propertyType').innerHTML = listing['property_type'];
document.getElementById('beds').innerHTML = `Beds: ${listing['beds']}`;
document.getElementById('baths').innerHTML = `Baths: ${listing['baths']}`;
document.getElementById('sqFt').innerHTML = `Square Feet: ${listing['sq_ft']}`;
document.getElementById('moneySqFt').innerHTML = `$/sqft: ${listing['money_per_sq_ft']}`;
document.getElementById('yearBuilt').innerHTML = `Year Built: ${listing['year_built']}`;
document.getElementById('lotSize').innerHTML = `Lot Size: ${listing['lot_size']}`;



var myMap = L.map("map", {
    center: [45.52, -122.67],
    zoom: 13
  });
var mapMarkers = new L.FeatureGroup();
// var centerMarker = new L.FeatureGroup();

// var mapMarkers = L.markerClusterGroup();
// var mapMarkers = L.layerGroup().addTo(map);

L.tileLayer(
"https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1Ijoibm9vZHVseiIsImEiOiJjamljYXRwcXQwMWQ4M3ducjY1ZWR4Y3VhIn0.i8Cgo--hZxWsAvd0PKOU3A"
).addTo(myMap);

// var cafeIcon = L.AwesomeMarkers.icon({
//     prefix: 'fa', //font awesome rather than bootstrap
//     markerColor: 'red', // see colors above
//     icon: 'coffee' //http://fortawesome.github.io/Font-Awesome/icons/
// });

var myIcon = L.icon({
    iconUrl: redIcon,
    iconSize: [35, 40],
    iconAnchor: [22, 94],
    popupAnchor: [-3, -76],
    // shadowUrl: 'my-icon-shadow.png',
    shadowSize: [68, 95],
    shadowAnchor: [22, 94]
});



function populateMap (jsonObj) {

    mapMarkers.clearLayers();

    centerMarker = L.marker([listing.lat, listing.lng],{
                    title:`${listing.address}`,
                    icon: myIcon});
    centerMarker.bindPopup("<u/>" +
    "<li>" + "Sales Price: " + "$" + listing.price +  "</li>" +
    "<li>" + "Sq Feet: " + listing.sq_ft +  "</li>" +
    "<li>" + "Address: " + listing.address + ", " + listing.city + " " + listing.state + "  " + "</li>" +
    "<li>" + "Neighborhood: " + listing.location +  "</li>" +
    "<li>" + "Property Type: " + listing.property_type +  "</li>" +
    "<li>" + "Days on Market: " + listing.days_on_market +  "</li>" +
    "<li>" + "Year Built: " + listing.year_built +  "</li>" +
    "<li>" + "<a href=" + listing.url + ">Visit Redfin Listing for more information!" + "</a>" + "</li>" 
    ).addTo(myMap);

    console.log(jsonObj);

    jsonObj.forEach(function(d){
        let lat = d.geometry.location.lat;
        let lng = d.geometry.location.lng;
        let marker = L.marker([lat, lng]);
        marker.bindPopup("<u/>" +
        "<li>" + "Name: " + d.name +  "</li>" +
        "<li>" + "Address: " + d.vicinity +  "</li>" +
        "<li>" + "type: " + d.types[0] + "</li>"
        );

        mapMarkers.addLayer(marker);
        myMap.addLayer(mapMarkers);
        myMap.fitBounds(mapMarkers.getBounds());
    });

};

populateMap(nearestRestaurant);
document.getElementById('restaurantButton').style.backgroundColor = 'darkgrey';

document.getElementById('restaurantButton').addEventListener('click', function(){
    document.getElementById('restaurantButton').style.backgroundColor = 'darkgrey';
    document.getElementById('groceriesButton').style.backgroundColor = '';
    document.getElementById('coffeeButton').style.backgroundColor = '';
    document.getElementById('entertainmentButton').style.backgroundColor = '';
    document.getElementById('barButton').style.backgroundColor = '';

    populateMap(nearestRestaurant)
});
document.getElementById('groceriesButton').addEventListener('click', function(){
    document.getElementById('restaurantButton').style.backgroundColor = '';
    document.getElementById('groceriesButton').style.backgroundColor = 'darkgrey';
    document.getElementById('coffeeButton').style.backgroundColor = '';
    document.getElementById('entertainmentButton').style.backgroundColor = '';
    document.getElementById('barButton').style.backgroundColor = '';

    populateMap(nearestGroceries)
});
document.getElementById('coffeeButton').addEventListener('click', function(){
    document.getElementById('restaurantButton').style.backgroundColor = '';
    document.getElementById('groceriesButton').style.backgroundColor = '';
    document.getElementById('coffeeButton').style.backgroundColor = 'darkgrey';
    document.getElementById('entertainmentButton').style.backgroundColor = '';
    document.getElementById('barButton').style.backgroundColor = '';

    populateMap(nearestCoffee)
});
document.getElementById('entertainmentButton').addEventListener('click', function(){
    document.getElementById('restaurantButton').style.backgroundColor = '';
    document.getElementById('groceriesButton').style.backgroundColor = '';
    document.getElementById('coffeeButton').style.backgroundColor = '';
    document.getElementById('entertainmentButton').style.backgroundColor = 'darkgrey';
    document.getElementById('barButton').style.backgroundColor = '';

    populateMap(nearestEntertainment)
});
document.getElementById('barButton').addEventListener('click', function(){
    document.getElementById('restaurantButton').style.backgroundColor = '';
    document.getElementById('groceriesButton').style.backgroundColor = '';
    document.getElementById('coffeeButton').style.backgroundColor = '';
    document.getElementById('entertainmentButton').style.backgroundColor = '';
    document.getElementById('barButton').style.backgroundColor = 'darkgrey';

    populateMap(nearestBar)
});
