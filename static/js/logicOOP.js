var firstLoad = true;


var bedSlider = document.getElementById("bedSlider");
var bathSlider = document.getElementById("bathSlider");
var priceSlider = document.getElementById("priceSlider");
var sqftSlider = document.getElementById("sqftSlider");
var yearSlider = document.getElementById("yearSlider");
var moneySqftSlider = document.getElementById("moneySqftSlider");
var hoaSlider = document.getElementById("hoaSlider");


class Param{
    constructor(name, slider, lowInputId, highInputId, toSingleId, toDoubleId) {
        this.name = name;
        this.slider = slider;
        this.lowInputId = lowInputId;
        this.highInputId = highInputId;
        this.toSingleId = toSingleId;
        this.toDoubleId = toDoubleId;
        document.getElementById(this.toSingleId).addEventListener("click", this.toSingleEvent.bind(this));
        document.getElementById(this.toDoubleId).addEventListener("click", this.toDoubleEvent.bind(this));
    };

    toSingleEvent(){
        console.log(this.toSingleId);
        document.getElementById(this.toSingleId).style.display = "none";
        document.getElementById(this.toDoubleId).style.display = "inline-block";
        console.log(this.slider.noUiSlider);
        this.slider.noUiSlider.destroy();
        createSingleFilter(this.slider, minVal[this.name], minVal[this.name], maxVal[this.name]);
        // this.slider.noUiSlider.on('change', applyFilters());
    };
        
    toDoubleEvent(){
      document.getElementById(this.toSingleId).style.display = "inline-block";
      document.getElementById(this.toDoubleId).style.display = "none";
      this.slider.noUiSlider.destroy();
      createDoubleFilter(this.slider, minVal[this.name], maxVal[this.name], minVal[this.name], maxVal[this.name]);
      this.slider.noUiSlider.on('change', applyFilters());
    };

    
}


const bedParam = new Param("beds", bedSlider, 'bedLowInput', 'bedHighInput', 'bedToSingle', 'bedToDouble');
const bathParam = new Param("baths", bathSlider, 'bathLowInput', 'bathHighInput', 'bathToSingle', 'bathToDouble');
const priceParam = new Param("price", priceSlider, 'priceLowInput', 'priceHighInput', 'priceToSingle', 'priceToDouble');
const sqftParam = new Param("sq_ft", sqftSlider, 'sqftLowInput', 'sqftHighInput',  'sqftToSingle', 'sqftToDouble');
const yearParam = new Param("year_built", yearSlider, 'yearLowInput', 'yearHighInput',  'yearToSingle', 'yearToDouble');
const moneySqFtParam = new Param("money_per_sq_ft", moneySqftSlider, 'moneySqftLowInput', 'moneySqftHighInput',  'moneySqftToSingle', 'moneySqftToDouble');
const hoaParam = new Param("hoa_per_month", hoaSlider, 'hoaLowInput', 'hoaHighInput',  'hoaToSingle', 'hoaToDouble');


var minVal = [];
var maxVal = [];


// Justin 1 of 2 
var propTypeChart = dc.rowChart("#propType");
var zipTypeChart = dc.rowChart("#zipType");
var visCount = dc.dataCount(".dc-data-count");
var visTable = dc.dataTable(".dc-data-count");
 
var chart = dc.scatterPlot("#test");

var myMap = L.map('map');
var mapMarkers = new L.FeatureGroup();

L.tileLayer(
"https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1Ijoibm9vZHVseiIsImEiOiJjamljYXRwcXQwMWQ4M3ducjY1ZWR4Y3VhIn0.i8Cgo--hZxWsAvd0PKOU3A"
).addTo(myMap);
// Justin 1 of 2  END
    

function createList (jsonUrl) {   

  d3.json(`${jsonUrl}`, function(error, response) {

    if (error) return console.warn(error);

    console.log(response);

    if (firstLoad == true) {

        minVal.push(response[0]);
        maxVal.push(response[1]);

        minVal = minVal[0];
        maxVal = maxVal[0];

        initFilters(bedSlider, minVal.beds, maxVal.beds, minVal.beds, maxVal.beds);    
        initFilters(bathSlider, minVal.baths, maxVal.baths, minVal.baths, maxVal.baths);
        initFilters(priceSlider, minVal.price, maxVal.price, minVal.price, maxVal.price);
        initFilters(sqftSlider, minVal.sq_ft, maxVal.sq_ft, minVal.sq_ft, maxVal.sq_ft);
        initFilters(yearSlider, minVal.year_built, maxVal.year_built, minVal.year_built, maxVal.year_built);
        initFilters(moneySqftSlider, minVal.money_per_sq_ft, maxVal.money_per_sq_ft, minVal.money_per_sq_ft, maxVal.money_per_sq_ft);
        initFilters(hoaSlider, minVal.hoa_per_month, maxVal.hoa_per_month, minVal.hoa_per_month, maxVal.hoa_per_month);
    };

    firstLoad = false;

    inputConnection(bedParam);
    inputConnection(bathParam);
    inputConnection(priceParam);
    inputConnection(sqftParam);
    inputConnection(yearParam);
    inputConnection(moneySqFtParam);
    inputConnection(hoaParam);

    response = response.slice(2);

    d3.select(".list-group").selectAll("li").remove()

  // Creates scrolling list NOW WITH BUTTONS!
      var scrollListRow = d3.select(".list-group").selectAll("li")
                            .data(response, function(d) { return d["id"];})
                            .enter()
                            .append("li")
                            .classed("list-group-item row", true);

      scrollListRow.append("label")
                      .classed("col-md-1 scroll-list scroll-list-left", true)
                      .attr('for',function(d){ return "a"; })
                      .append("input")
                      .attr("unchecked", true)
                      .attr("type", "checkbox")
                      .attr("id", "c")
                      .on("click", function(d) {  return console.log(d["address"]); });

      scrollListRow.append("span")
                    .html(function(d) {
                      return `
                      <a class="col-md-3 scroll-list" href="/search?id=${d["id"]}"> ${d["address"]} </a>
                      <a class="col-md-2 scroll-list" href="/search?id=${d["id"]}"> ${d["location"]} </a> 
                      <a class="col-md-2 scroll-list" href="/search?id=${d["id"]}"> $${d["price"]} </a>
                      <a class="col-md-1 scroll-list" href="/search?id=${d["id"]}"> ${d["beds"]} </a>
                      <a class="col-md-1 scroll-list" href="/search?id=${d["id"]}"> ${d["baths"]} </a>
                      <a class="col-md-2 scroll-list" href="/search?id=${d["id"]}"> ${d["sq_ft"]} Sq. Ft. </a>`
                    });

      /// JUSTIN 2 of 2 
      var ndx = crossfilter(response);
      var all = ndx.groupAll();

      var propTypeDim = ndx.dimension(function (d){
          return d["property_type"];
      });
      var zipTypeDim = ndx.dimension(function (d){
          return d["zip_"];
      });
      var idTypeDim = ndx.dimension(function (d){
          return d["id"];
      });
      // scatter
      var scatterDim = ndx.dimension(function (d){
          return [d["sq_ft"],d["price"]]
      });
      var allDim = ndx.dimension(function(d) {return d;});

      
      var propTypeGroup = propTypeDim.group();
      var zipTypeGroup = zipTypeDim.group();
      var idTypeGroup = idTypeDim.group();
      // scatter
      var scatterGroup = scatterDim.group();



      propTypeChart
          .width(500)
          .height(250)
          .dimension(propTypeDim)
          .group(propTypeGroup)
          .elasticX(true);
          

      zipTypeChart
          .width(500)
          .height(250)
          .dimension(zipTypeDim)
          .group(zipTypeGroup)
          .elasticX(true)
          .data(function (group){
              return group.top(10)
          });

      chart
          .width(550)
          .height(275)
          .dimension(scatterDim)
          .group(scatterGroup)
          .symbolSize(9)
          // .elasticX(true)
          .yAxisPadding(500)
          .xAxisPadding(100)
          .yAxisLabel(["Price"])
          .xAxisLabel("Square Feet")
          .margins({top: 10, right: 20, bottom: 50, left: 80})
          // .renderlet(function (chart) {
          //     chart.selectAll("g.x text")
          //       .attr('dx', '-30')
          //       .attr('transform', "rotate(-90)");
          // })
          // .xAxis([0, 1000, 2000, 3000, 4000, 5000])
          .x(d3.scale.linear().domain([25, 6508]))
          .yAxis().ticks(10).tickFormat(function (v) {
      return "$" + v;});
          // .y(d3.scale.linear().domain([0, 100]));

      visCount
          .dimension(ndx)
          .group(all);
      
      visTable   
          .dimension(idTypeDim)
          .group(function(d) {
              return d["id"];
          })
          .columns([
              {
                  label: "PROPERTY TYPE",
                  format: function (d){ return d["id"]}
              },
              {
                  label: "PROPERTY TYPE",
                  format: function (d){ return d["property_type"]}
              },
              {
                  label: "ADDRESS",
                  format: function (d){ return d["address"]}
              },
              {
                  label: "CITY",
                  format: function (d){ return d["city"]}
              },
              {
                  label: "STATE",
                  format: function (d){ return d["state"]}
              },
              {
                  label: "ZIP",
                  format: function (d){ return d["zip_"]}
              },
              {
                  label: "PRICE",
                  format: function (d){ return d["price"]}
              },
              {
                  label: "BEDS",
                  format: function (d){ return d["beds"]}
              },
              {
                  label: "BATHS",
                  format: function (d){ return d["baths"]}
              },
              {
                  label: "LOCATION",
                  format: function (d){ return d["location"]}
              },
              {
                  label: "SQUARE FEET",
                  format: function (d){ return d["sq_ft"]}
              },
              {
                  label: "URL",
                  format: function (d){ return d["url"]}
              }
              ])
              .on('renderlet', function (table) { // update map with locations to match filtered data
                table.select('tr.dc-table-group').remove();
                mapMarkers.clearLayers();
                _.each(allDim.top(Infinity), function (d) {
                    var addy = d.address;
                    var marker = L.marker([d.lat, d.lon]);
                    marker.bindPopup("<u/>" +
                    "<li>" + "Sales Price: " + "$" + d.price +  "</li>" +
                    "<li>" + "Sq Feet: " + d.sq_ft +  "</li>" +
                    "<li>" + "Address: " + addy + ", " + d.city + " " + d.state + "  " + "</li>" +
                    "<li>" + "Neighborhood: " + d.location +  "</li>" +
                    "<li>" + "Property Type: " + d.property_type +  "</li>" +
                    "<li>" + "Days on Market: " + d.days_on_market +  "</li>" +
                    "<li>" + "Year Built: " + d.year_built +  "</li>" +
                    "<li>" + "<a href=" + d.url + ">Visit Redfin Listing for more information!" + "</a>" + "</li>" 
                  );
                    mapMarkers.addLayer(marker);
                });
                myMap.addLayer(mapMarkers);
                myMap.fitBounds(mapMarkers.getBounds());
            });
          // Justin 2 of 2 END
              

      dc.renderAll();

  });

};


function getData(filterURLData) {
  console.log(filterURLData);
  if (filterURLData === "reset") {
    clearFilters();
  }
  else {

    var filterURL = "/search?";
  
      filterURL = filterURL + `high_beds=${filterURLData.bed[1]}&low_beds=${filterURLData.bed[0]}`

      filterURL = filterURL + `&high_baths=${filterURLData.bath[1]}&low_baths=${filterURLData.bath[0]}`

      filterURL = filterURL + `&high_price=${filterURLData.price[1]}&low_price=${filterURLData.price[0]}`

      filterURL = filterURL + `&high_sqft=${filterURLData.sqft[1]}&low_sqft=${filterURLData.sqft[0]}`

      filterURL = filterURL + `&high_year=${filterURLData.year[1]}&low_year=${filterURLData.year[0]}`
  
      filterURL = filterURL + `&high_moneySqft=${filterURLData.moneySqft[1]}&low_moneySqft=${filterURLData.moneySqft[0]}`

      filterURL = filterURL + `&high_hoa=${filterURLData.hoa[1]}&low_hoa=${filterURLData.hoa[0]}\ `

    console.log(filterURL)

    createList(filterURL);
  };
};

function clearFilters() {
  createList("/resource")
}


document.body.onload = function() {
  getData("reset");
};


function openList() {

  document.getElementById("mini-panel").style.display = "none";
  document.getElementById("result_panel").style.display = "block";

  document.getElementById("map").style.width = "calc(100% - 498px)";
};

/* Set the width of the side navigation to 0 and the left margin of the page content to 0 */
function closeList() {

  document.getElementById("mini-panel").style.display = "block";
  document.getElementById("result_panel").style.display = "none";

  document.getElementById("map").style.width = "calc(100vw - 80px)";
};

/* Set the width of the side navigation to 250px and the left margin of the page content to 250px */
function openNav() {
  closeGraphNav()
  document.getElementById("mySidenav").style.height = "40vh";
  document.getElementById("main").style.marginTop = "40vh";
  var navElement = document.getElementsByClassName("list-group");
  navElement[0].style.height = "49vh";

  document.getElementById("mini-panel").style.height = "60vh";

  var navElement2 = document.getElementsByClassName("mini-panel-btn");
  navElement2[0].style.height = "15vh";
  navElement2[1].style.height = "15vh";
  navElement2[2].style.height = "15vh";
  navElement2[3].style.height = "15vh";
  navElement2[4].style.height = "15vh";
  navElement2[5].style.height = "15vh";

  document.getElementById("showFiltersButton").style.display = "none";
  document.getElementById("hideFiltersButton").style.display = "inline-block";
  document.getElementById("showFiltersButton2").style.display = "none";
  document.getElementById("hideFiltersButton2").style.display = "inline-block";
};


/* Set the width of the side navigation to 0 and the left margin of the page content to 0 */
function closeNav() {
  document.getElementById("mySidenav").style.height = "0";
  document.getElementById("main").style.marginTop = "0";
  var navElement = document.getElementsByClassName("list-group");
  navElement[0].style.height = "89vh";

  document.getElementById("mini-panel").style.height = "100vh";

  var navElement2 = document.getElementsByClassName("mini-panel-btn");
  navElement2[0].style.height = "25vh";
  navElement2[1].style.height = "25vh";
  navElement2[2].style.height = "25vh";
  navElement2[3].style.height = "25vh";
  navElement2[4].style.height = "25vh";
  navElement2[5].style.height = "25vh";

  document.getElementById("showFiltersButton").style.display = "inline-block";
  document.getElementById("hideFiltersButton").style.display = "none";
  document.getElementById("showFiltersButton2").style.display = "inline-block";
  document.getElementById("hideFiltersButton2").style.display = "none";


}

/* Set the width of the side navigation to 250px and the left margin of the page content to 250px */
function openGraphNav() {
  closeNav()
  document.getElementById("graphNav").style.height = "40vh";
  document.getElementById("main").style.marginTop = "40vh";

  var navElement = document.getElementsByClassName("list-group");
  navElement[0].style.height = "49vh";

  document.getElementById("mini-panel").style.height = "60vh";

  var navElement2 = document.getElementsByClassName("mini-panel-btn");
  navElement2[0].style.height = "15vh";
  navElement2[1].style.height = "15vh";
  navElement2[2].style.height = "15vh";
  navElement2[3].style.height = "15vh";
  navElement2[4].style.height = "15vh";
  navElement2[5].style.height = "15vh";

  document.getElementById("showGraphsButton").style.display = "none";
  document.getElementById("hideGraphsButton").style.display = "inline-block";
  document.getElementById("showGraphsButton2").style.display = "none";
  document.getElementById("hideGraphsButton2").style.display = "inline-block";
}

/* Set the width of the side navigation to 0 and the left margin of the page content to 0 */
function closeGraphNav() {
  document.getElementById("graphNav").style.height = "0";
  document.getElementById("main").style.marginTop = "0";
  var navElement = document.getElementsByClassName("list-group");
  navElement[0].style.height = "89vh";

  document.getElementById("mini-panel").style.height = "100vh";

  var navElement2 = document.getElementsByClassName("mini-panel-btn");
  navElement2[0].style.height = "25vh";
  navElement2[1].style.height = "25vh";
  navElement2[2].style.height = "25vh";
  navElement2[3].style.height = "25vh";
  navElement2[4].style.height = "25vh";
  navElement2[5].style.height = "25vh";

  document.getElementById("showGraphsButton").style.display = "inline-block";
  document.getElementById("hideGraphsButton").style.display = "none";
  document.getElementById("showGraphsButton2").style.display = "inline-block";
  document.getElementById("hideGraphsButton2").style.display = "none";
};


function initFilters(fieldSlider, low, high, min, max) {
  noUiSlider.create(fieldSlider, {
    animate: true,
    animationDuration: 300,
    start: [low, high],
    step: 1,
    connect: true,
    // tooltips: [ wNumb({ decimals: 0 }), wNumb({ decimals: 0 }) ],
    range: {
      'min': min,
      'max': max
    }
});
};


function createDoubleFilter(fieldSlider, low, high, min, max) {
  noUiSlider.create(fieldSlider, {
    animate: true,
    animationDuration: 300,
    start: [low, high],
    step: 1,
    connect: true,
    // tooltips: [ wNumb({ decimals: 0 }), wNumb({ decimals: 0 }) ],
    range: {
      'min': min,
      'max': max
    }
  });

  inputConnection(bedParam);
  inputConnection(bathParam);
  inputConnection(priceParam);
  inputConnection(sqftParam);
  inputConnection(yearParam);
  inputConnection(moneySqFtParam);
  inputConnection(hoaParam);
};

function createSingleFilter(fieldSlider, start, min, max) {
  noUiSlider.create(fieldSlider, {
    animate: true,
    animationDuration: 300,
    start: [ start ],
    step: 1,
    connect: [ true, false],
    // tooltips: [ wNumb({ decimals: 0 }) ],
    range: {
      'min': min,
      'max': max
    }
  });

  inputConnection(bedParam);
  inputConnection(bathParam);
  inputConnection(priceParam);
  inputConnection(sqftParam);
  inputConnection(yearParam);
  inputConnection(moneySqFtParam);
  inputConnection(hoaParam);

};

document.getElementById("resetButton").addEventListener('click', function(){
  bedSlider.noUiSlider.set([minVal.beds, maxVal.beds]);
  bathSlider.noUiSlider.set([minVal.baths, maxVal.baths]);
  priceSlider.noUiSlider.set([minVal.price, maxVal.price]);
  sqftSlider.noUiSlider.set([minVal.sq_ft, maxVal.sq_ft]);
  yearSlider.noUiSlider.set([minVal.year_built, maxVal.year_built]);
  moneySqftSlider.noUiSlider.set([minVal.money_per_sq_ft, maxVal.money_per_sq_ft]);
  hoaSlider.noUiSlider.set([minVal.hoa_per_month, maxVal.hoa_per_month]);
  
});

function fillLists(maybeList) {
  if (maybeList.constructor === Array) {
    return maybeList
  } else {
    let a = [maybeList, maybeList];
    return a;
  };
};

function applyFilters() {

  let bedFilterList = bedParam.slider.noUiSlider.get();
  let bathFilterList = bathParam.slider.noUiSlider.get();
  let priceFilterList = priceParam.slider.noUiSlider.get();
  let sqftFilterList = sqftParam.slider.noUiSlider.get();
  let yearFilterList = yearParam.slider.noUiSlider.get();
  let moneySqftFilterList = moneySqFtParam.slider.noUiSlider.get();
  let hoaFilterList = hoaParam.slider.noUiSlider.get();

  let bedFilterList2 = fillLists(bedFilterList)
  let bathFilterList2 = fillLists(bathFilterList)
  let priceFilterList2 = fillLists(priceFilterList)
  let sqftFilterList2 = fillLists(sqftFilterList)
  let yearFilterList2 = fillLists(yearFilterList)
  let moneySqftFilterList2 = fillLists(moneySqftFilterList)
  let hoaFilterList2 = fillLists(hoaFilterList)

  var filterList = {
    bed: bedFilterList2,
    bath: bathFilterList2,
    price: priceFilterList2,
    sqft: sqftFilterList2,
    year: yearFilterList2,
    moneySqft: moneySqftFilterList2,
    hoa: hoaFilterList2

  };

  console.log(filterList)

  getData(filterList);
};


function inputConnection(Param) {
    var highInput = document.getElementById(Param.highInputId);
    var lowInput = document.getElementById(Param.lowInputId);
    
    Param.slider.noUiSlider.on('update', function( values, handle ) {
  
      var value = values[handle];
  
      if ( handle ) {
        highInput.value = Math.round(value);
      } else {
        lowInput.value = Math.round(value);
      }
    });
  
    lowInput.addEventListener('change', function(){
      Param.slider.noUiSlider.set([this.value, null]);
    });
  
    highInput.addEventListener('change', function(){
      Param.slider.noUiSlider.set([null, Math.round(this.value)]);
    });
  };


// bedSlider.noUiSlider.on('change', applyFilters());
// bathSlider.noUiSlider.on('change', applyFilters());
// priceSlider.noUiSlider.on('change', applyFilters());
// sqftSlider.noUiSlider.on('change', applyFilters());
// yearSlider.noUiSlider.on('change', applyFilters());
// moneySqftSlider.noUiSlider.on('change', applyFilters());
// hoaSlider.noUiSlider.on('change', applyFilters());


function initMap() {
  // The location of Uluru
  var uluru = {lat: -25.344, lng: 131.036};
  // The map, centered at Uluru
  var map = new google.maps.Map(
      document.getElementById('map'), {zoom: 4, center: uluru});
  // The marker, positioned at Uluru
  var marker = new google.maps.Marker({position: uluru, map: map});
}





