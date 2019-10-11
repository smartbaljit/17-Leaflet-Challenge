// Function to determine marker size based on earthquake magnitude
function markerSize(responseFeature) {
  return Math.sqrt(Math.abs(responseFeature.properties.mag)) * 5;
}


// Function to determine marker color based on earthquake magnitude
var colors = ["#7FFF00", "#dfedbe", "#eede9f", "#FF8C00", "	#FA8072", "#FF0000"]
function fillColor(responseFeature) {
  var mag = responseFeature.properties.mag;
  if (mag <= 1) {
    return colors[0]
  }
  else if (mag <= 2) {
    return colors[1]
  }
  else if (mag <= 3) {
    return colors[2]
  }
  else if (mag <= 4) {
    return colors[3]
  }
  else if (mag <= 5) {
    return colors[4]
  }
  else {
    return colors[5]
  }
}

var attribution = "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>";
   
  var satelliteMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: attribution,
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
  });
  
  var lightMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: attribution,
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
  });
  
  var outdoorsMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: attribution,
    maxZoom: 18,
    id: "mapbox.outdoors",
    accessToken: API_KEY
  });
  
  // Create a baseMaps object
  var baseMaps = {
    "Satellite": satelliteMap,
    "Grayscale": lightMap,
    "Outdoors": outdoorsMap
  };


//First data set url
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
   

//second data set url
var platesPath = "PB2002_boundaries.json";


// Creating map object
var myMap = L.map("map", {
   center: [40.7, -73.95],
   zoom: 2
});


// Adding tile layer to the map
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  }).addTo(myMap);
  

// Grab the data with d3
d3.json(queryUrl, function(response) {
    console.log(response);
    createFeatures(response.features) 
    });
    function createFeatures(data) {
      console.log(data);
      // Create a new marker cluster group
      var markers = L.markerClusterGroup();
    
      // Loop through data
      for (var i = 0; i < data.length; i++) {
        console.log( data[i].geometry)
        // Set the data location property to a variable
        var features = data;
       // console.log(features)
        var lat =data[i].geometry.coordinates[0];
        var lng = data[i].geometry.coordinates[1];
        // Check for feature property
        if (features) {
    
          // Add a new marker to the cluster group and bind a pop-up
          markers.addLayer(L.circleMarker([lng, lat], {
             color: "white",
             fillColor: fillColor(data[i]),//"#f03",
             fillOpacity: 0.8,
             radius: markerSize(data[i])
          })
           // .bindPopup(data[i].properties.place));
            .bindPopup(`<strong>Place:</strong> ${data[i].properties.place}<br><strong>Magnitude:</strong> ${data[i].properties.mag}`));
        }
    
      }
    
  
    // Add our marker cluster layer to the map
    myMap.addLayer(markers);
    
    // Add the layer control to the map
    L.control.layers(baseMaps, satelliteMap, {
      collapsed: false
    }).addTo(map);
    
    // Create a legend to display information about our map
    var info = L.control({
      position: "bottomright"
    });

    // When the layer control is added, insert a div with the class of "legend"
    info.onAdd = function() {
      var div = L.DomUtil.create("div", "legend");
      return div;
    };
    // Add the info legend to the map
    info.addTo(map);

    
  }
