
var bedSlider = document.getElementById("bedSlider");
var bathSlider = document.getElementById("bathSlider");
var priceSlider = document.getElementById("priceSlider");
var sqftSlider = document.getElementById("sqftSlider");
var yearSlider = document.getElementById("yearSlider");
var moneySqftSlider = document.getElementById("moneySqftSlider");
var hoaSlider = document.getElementById("hoaSlider");


class Param{
    constructor(slider, lowInputId, highInputId) {
        this.slider = slider;
        this.lowInputId = lowInputId;
        this.highInputId = highInputId;
    };
}

const bedParam = new Param(bedSlider, 'bedLowInput', 'bedHighInput');
const bathParam = new Param(bathSlider, 'bathLowInput', 'bathHighInput');
const priceParam = new Param(priceSlider, 'priceLowInput', 'priceHighInput');
const sqftParam = new Param(sqftSlider, 'sqftLowInput', 'sqftHighInput');
const yearParam = new Param(yearSlider, 'yearLowInput', 'yearHighInput');
const moneySqFtParam = new Param(moneySqftSlider, 'moneySqftLowInput', 'moneySqftHighInput');
const hoaParam = new Param(hoaSlider, 'hoaLowInput', 'hoaHighInput');


var firstLoad = true;

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

    // var minVal = [];
    // var maxVal = [];    

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

    // bedInputConnection();
    // bathInputConnection();
    // priceInputConnection();
    // sqftInputConnection();
    // yearInputConnection();
    // moneySqftInputConnection();
    // hoaInputConnection();

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
    
//     createList(`/zoom?\
// high_beds=${filterURLData.bed[1]}\
// &low_beds=${filterURLData.bed[0]}\
// &high_price=${filterURLData.price[1]}\
// &low_price=${filterURLData.price[0]}\
// &high_baths=${filterURLData.bath[1]}\
// &low_baths=${filterURLData.bath[0]}\
// &high_sqft=${filterURLData.sqft[1]}\
// &low_sqft=${filterURLData.sqft[0]}\
// &high_year=${filterURLData.year[1]}\
// &low_year=${filterURLData.year[0]}\
// &high_moneySqft=${filterURLData.moneySqft[1]}\
// &low_moneySqft=${filterURLData.moneySqft[0]}`)};
// &high_hoa=${filterURLData.hoa[1]}\
// &low_hoa=${filterURLData.hoa[0]}\`)};
  // d3.json(`/zoom?high_beds=${numBeds}&low_beds=${numBeds}`, function(error, data) {
  //     console.log("newdata", data);
  // });
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

}

/* Set the width of the side navigation to 0 and the left margin of the page content to 0 */
function closeList() {

  document.getElementById("mini-panel").style.display = "block";
  document.getElementById("result_panel").style.display = "none";

  document.getElementById("map").style.width = "calc(100vw - 80px)";

}

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



}

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
}


// var bedSliderBool = false;
// var bathSliderBool = false;
// var priceSliderBool = false;
// var sqftSliderBool = false;
// var yearSliderBool = false;
// var moneySqftSliderBool = false;
// var hoaSliderBool = false;


// function activateBed() {
//   document.getElementById("activateBedSlider").style.display = "none";
//   document.getElementById("deactivateBedSlider").style.display = "block";
//   bedSlider.removeAttribute("disabled");
//   bedSliderBool = true;
// };

// function deactivateBed() {
//   document.getElementById("activateBedSlider").style.display = "block";
//   document.getElementById("deactivateBedSlider").style.display = "none";
//   bedSlider.setAttribute("disabled", true);
//   bedSliderBool = false;
// };

// function activateBath() {
//   document.getElementById("activateBathSlider").style.display = "none";
//   document.getElementById("deactivateBathSlider").style.display = "block";
//   bathSlider.removeAttribute("disabled");
//   bathSliderBool = true;
// };

// function deactivateBath() {
//   document.getElementById("activateBathSlider").style.display = "block";
//   document.getElementById("deactivateBathSlider").style.display = "none";
//   bathSlider.setAttribute("disabled", true);
//   bathSliderBool = false;
// };

// function activatePrice() {
//   document.getElementById("activatePriceSlider").style.display = "none";
//   document.getElementById("deactivatePriceSlider").style.display = "block";
//   priceSlider.removeAttribute("disabled");
//   priceSliderBool = true;
// };

// function deactivatePrice() {
//   document.getElementById("activatePriceSlider").style.display = "block";
//   document.getElementById("deactivatePriceSlider").style.display = "none";
//   priceSlider.setAttribute("disabled", true);
//   priceSliderBool = false;
// };

// function activateSqft() {
//   document.getElementById("activateSqftSlider").style.display = "none";
//   document.getElementById("deactivateSqftSlider").style.display = "block";
//   sqftSlider.removeAttribute("disabled");
//   sqftSliderBool = true;
// };

// function deactivateSqft() {
//   document.getElementById("activateSqftSlider").style.display = "block";
//   document.getElementById("deactivateSqftSlider").style.display = "none";
//   sqftSlider.setAttribute("disabled", true);
//   sqftSliderBool = false;
// };

// function activateYear() {
//   document.getElementById("activateYearSlider").style.display = "none";
//   document.getElementById("deactivateYearSlider").style.display = "block";
//   yearSlider.removeAttribute("disabled");
//   yearSliderBool = true;
// };

// function deactivateYear() {
//   document.getElementById("activateYearSlider").style.display = "block";
//   document.getElementById("deactivateYearSlider").style.display = "none";
//   yearSlider.setAttribute("disabled", true);
//   yearSliderBool = false;
// };

// function activateMoneySqft() {
//   document.getElementById("activateMoneySqftSlider").style.display = "none";
//   document.getElementById("deactivateMoneySqftSlider").style.display = "block";
//   moneySqftSlider.removeAttribute("disabled");
//   moneySqftSliderBool = true;
// };

// function deactivateMoneySqft() {
//   document.getElementById("activateMoneySqftSlider").style.display = "block";
//   document.getElementById("deactivateMoneySqftSlider").style.display = "none";
//   moneySqftSlider.setAttribute("disabled", true);
//   moneySqftBool = false;
// };

// function activateHoa() {
//   document.getElementById("activateHoaSlider").style.display = "none";
//   document.getElementById("deactivateHoaSlider").style.display = "block";
//   hoaSlider.removeAttribute("disabled");
//   hoaSliderbool = true;
// };

// function deactivateHoa() {
//   document.getElementById("activateHoaSlider").style.display = "block";
//   document.getElementById("deactivateHoaSlider").style.display = "none";
//   hoaSlider.setAttribute("disabled", true);
//   hoaSliderBool = false;
// };


// var bedSlider = document.getElementById("bedSlider");
// var bathSlider = document.getElementById("bathSlider");
// var priceSlider = document.getElementById("priceSlider");
// var sqftSlider = document.getElementById("sqftSlider");
// var yearSlider = document.getElementById("yearSlider");
// var moneySqftSlider = document.getElementById("moneySqftSlider");
// var hoaSlider = document.getElementById("hoaSlider");


// initFilters(bedSlider,0, 10, -99999999999999999, 99999999999999999)
// initFilters(bathSlider, 0, 10, -99999999999999999, 99999999999999999)
// initFilters(priceSlider, 0, 10000000, -99999999999999999, 99999999999999999)
// initFilters(sqftSlider, 0, 3000, -99999999999999999, 99999999999999999)
// initFilters(yearSlider, 1900, 2018, -99999999999999999, 99999999999999999)
// initFilters(moneySqftSlider, 0, 1000, -99999999999999999, 99999999999999999)
// initFilters(hoaSlider, 0, 1000, -99999999999999999, 99999999999999999)

// initFilters(bedSlider,0, 10, 0, 10)
// initFilters(bathSlider, 0, 10, 0, 10)
// initFilters(priceSlider, 0, 10000000, 0, 10000000)
// initFilters(sqftSlider, 0, 3000, 0, 3000)
// initFilters(yearSlider, 1900, 2018, 1900, 2018)
// initFilters(moneySqftSlider, 0, 1000, 0, 1000)
// initFilters(hoaSlider, 0, 1000, 0, 1000)

// initFilters(bedSlider,minVal.beds, maxVal.beds, minVal.beds, maxVal.beds)
// initFilters(bathSlider, minVal.baths, maxVal.baths, minVal.baths, maxVal.baths)
// initFilters(priceSlider, minVal.price, maxVal.price, minVal.price, maxVal.price)
// initFilters(sqftSlider, minVal.sq_ft, maxVal.sq_ft, minVal.sq_ft, maxVal.sq_ft)
// initFilters(yearSlider, minVal.year, maxVal.year, minVal.year, maxVal.year)
// initFilters(moneySqftSlider, minVal.money_per_sq_ft, maxVal.money_per_sq_ft, minVal.money_per_sq_ft, maxVal.money_per_sq_ft)
// initFilters(hoaSlider, minVal.hoa_per_month, maxVal.hoa_per_month, minVal.hoa_per_month, maxVal.hoa_per_month)

// deactivateBed()
// deactivateBath()
// deactivatePrice()
// deactivateSqft()
// deactivateYear()
// deactivateMoneySqft()
// deactivateHoa()


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
//   bedInputConnection()
//   bathInputConnection()
//   priceInputConnection()
//   sqftInputConnection()
//   yearInputConnection()
//   moneySqftInputConnection()
//   hoaInputConnection()

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
//   bedInputConnection()
//   bathInputConnection()
//   priceInputConnection()
//   sqftInputConnection()
//   yearInputConnection()
//   moneySqftInputConnection()
//   hoaInputConnection()

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



bedToSingleEvent = function(){
  document.getElementById("bedToSingle").style.display = "none";
  document.getElementById("bedToDouble").style.display = "inline-block";
  bedSlider.noUiSlider.destroy();
  createSingleFilter(bedSlider, minVal.beds, minVal.beds, maxVal.beds);
}

bedToDoubleEvent = function(){
  document.getElementById("bedToSingle").style.display = "inline-block";
  document.getElementById("bedToDouble").style.display = "none";
  bedSlider.noUiSlider.destroy();
  createDoubleFilter(bedSlider, minVal.beds, maxVal.beds, minVal.beds, maxVal.beds);
}

bathToSingleEvent = function(){
  document.getElementById("bathToSingle").style.display = "none";
  document.getElementById("bathToDouble").style.display = "inline-block";
  bathSlider.noUiSlider.destroy();
  createSingleFilter(bathSlider, minVal.baths, minVal.baths, maxVal.baths);
}

bathToDoubleEvent = function(){
  document.getElementById("bathToSingle").style.display = "inline-block";
  document.getElementById("bathToDouble").style.display = "none";
  bathSlider.noUiSlider.destroy();
  createDoubleFilter(bathSlider, minVal.baths, maxVal.baths, minVal.baths, maxVal.baths);
}

priceToSingleEvent = function(){
  document.getElementById("priceToSingle").style.display = "none";
  document.getElementById("priceToDouble").style.display = "inline-block";
  priceSlider.noUiSlider.destroy();
  createSingleFilter(priceSlider, minVal.price, minVal.price, maxVal.price);
}

priceToDoubleEvent = function(){
  document.getElementById("priceToSingle").style.display = "inline-block";
  document.getElementById("priceToDouble").style.display = "none";
  priceSlider.noUiSlider.destroy();
  createDoubleFilter(priceSlider, minVal.price, maxVal.price, minVal.price, maxVal.price);
}

sqftToSingleEvent = function(){
  document.getElementById("sqftToSingle").style.display = "none";
  document.getElementById("sqftToDouble").style.display = "inline-block";
  sqftSlider.noUiSlider.destroy();
  createSingleFilter(sqftSlider, minVal.sq_ft, minVal.sq_ft, maxVal.sq_ft);
}

sqftToDoubleEvent = function(){
  document.getElementById("sqftToSingle").style.display = "inline-block";
  document.getElementById("sqftToDouble").style.display = "none";
  sqftSlider.noUiSlider.destroy();
  createDoubleFilter(sqftSlider, minVal.sq_ft, maxVal.sq_ft, minVal.sq_ft, maxVal.sq_ft);
}

yearToSingleEvent = function(){
  document.getElementById("yearToSingle").style.display = "none";
  document.getElementById("yearToDouble").style.display = "inline-block";
  yearSlider.noUiSlider.destroy();
  createSingleFilter(yearSlider, minVal.year_built, minVal.year_built, maxVal.year_built);
}

yearToDoubleEvent = function(){
  document.getElementById("yearToSingle").style.display = "inline-block";
  document.getElementById("yearToDouble").style.display = "none";
  yearSlider.noUiSlider.destroy();
  createDoubleFilter(yearSlider, minVal.year_built, maxVal.year_built, minVal.year_built, maxVal.year_built);
}

moneySqftToSingleEvent = function(){
  document.getElementById("moneySqftToSingle").style.display = "none";
  document.getElementById("moneySqftToDouble").style.display = "inline-block";
  moneySqftSlider.noUiSlider.destroy();
  createSingleFilter(moneySqftSlider, minVal.money_per_sq_ft, minVal.money_per_sq_ft, maxVal.money_per_sq_ft);
}

moneySqftToDoubleEvent = function(){
  document.getElementById("moneySqftToSingle").style.display = "inline-block";
  document.getElementById("moneySqftToDouble").style.display = "none";
  moneySqftSlider.noUiSlider.destroy();
  createDoubleFilter(moneySqftSlider, minVal.money_per_sq_ft, maxVal.money_per_sq_ft, minVal.money_per_sq_ft, maxVal.money_per_sq_ft);
}

hoaToSingleEvent = function(){
  document.getElementById("hoaToSingle").style.display = "none";
  document.getElementById("hoaToDouble").style.display = "inline-block";
  hoaSlider.noUiSlider.destroy();
  createSingleFilter(hoaSlider, minVal.hoa_per_month, minVal.hoa_per_month, maxVal.hoa_per_month);
}

hoaToDoubleEvent = function(){
  document.getElementById("hoaToSingle").style.display = "inline-block";
  document.getElementById("hoaToDouble").style.display = "none";
  hoaSlider.noUiSlider.destroy();
  createDoubleFilter(hoaSlider, minVal.hoa_per_month, maxVal.hoa_per_month, minVal.hoa_per_month, maxVal.hoa_per_month);
}



// bedInputConnection();
// bathInputConnection();
// priceInputConnection();
// sqftInputConnection();
// yearInputConnection();
// moneySqftInputConnection();
// hoaInputConnection();









// Need 
// Param.lowInput
// Param.highInput
// Param.slider

// class Param{
//     constructor(param, slider) {
//         this.param = param;
//         this.slider = slider;
//     };

//     get lowInput() {
//         let tempParam = this.param;
//         return minVal.tempParam;
//     };

//     get highInput() {
//         let tempParam = this.param;
//         return maxVal.tempParam;
//     }
// }

// const bedParam = new Param(beds, bedSlider);
// const bathParam = new Param(baths, bathSlider);
// const priceParam = new Param(price, priceSlider);
// const sqftParam = new Param(price, sqftSlider);
// const yearParam = new Param(year_built, yearSlider);
// const moneySqFtParam = new Param(money_per_sq_ft, moneySqftSlider);
// const hoaParam = new Param(hoa_per_month, hoaSlider);




function inputConnection(Param) {
    var highInput = document.getElementById(Param.highInputId);
    var lowInput = document.getElementById(Param.lowInputId);
    
    Param.slider.noUiSlider.on('update', function( values, handle ) {
  
      var value = values[handle];
  
      if ( handle ) {
        highInput.value = value;
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














// function bedInputConnection() {
//   var bedLowInput = document.getElementById("bedLowInput");
//   var bedHighInput = document.getElementById("bedHighInput");

//   bedSlider.noUiSlider.on('update', function( values, handle ) {

//     var value = values[handle];

//     if ( handle ) {
//       bedHighInput.value = value;
//     } else {
//       bedLowInput.value = Math.round(value);
//     }
//   });

//   bedLowInput.addEventListener('change', function(){
//     bedSlider.noUiSlider.set([this.value, null]);
//   });

//   bedHighInput.addEventListener('change', function(){
//     bedSlider.noUiSlider.set([null, Math.round(this.value)]);
//   });
// };

// function bathInputConnection() {
//   var bathLowInput = document.getElementById("bathLowInput");
//   var bathHighInput = document.getElementById("bathHighInput");

//   bathSlider.noUiSlider.on('update', function( values, handle ) {

//     var value = values[handle];

//     if ( handle ) {
//       bathHighInput.value = value;
//     } else {
//       bathLowInput.value = Math.round(value);
//     }
//   });

//   bathLowInput.addEventListener('change', function(){
//     bathSlider.noUiSlider.set([this.value, null]);
//   });

//   bathHighInput.addEventListener('change', function(){
//     bathSlider.noUiSlider.set([null, Math.round(this.value)]);
//   });
// };

// function priceInputConnection() {
//   var priceLowInput = document.getElementById("priceLowInput");
//   var priceHighInput = document.getElementById("priceHighInput");

//   priceSlider.noUiSlider.on('update', function( values, handle ) {

//     var value = values[handle];

//     if ( handle ) {
//       priceHighInput.value = value;
//     } else {
//       priceLowInput.value = Math.round(value);
//     }
//   });

//   priceLowInput.addEventListener('change', function(){
//     priceSlider.noUiSlider.set([this.value, null]);
//   });

//   priceHighInput.addEventListener('change', function(){
//     priceSlider.noUiSlider.set([null, Math.round(this.value)]);
//   });
// };

// function sqftInputConnection() {
//   var sqftLowInput = document.getElementById("sqftLowInput");
//   var sqftHighInput = document.getElementById("sqftHighInput");

//   sqftSlider.noUiSlider.on('update', function( values, handle ) {

//     var value = values[handle];

//     if ( handle ) {
//       sqftHighInput.value = value;
//     } else {
//       sqftLowInput.value = Math.round(value);
//     }
//   });

//   sqftLowInput.addEventListener('change', function(){
//     sqftSlider.noUiSlider.set([this.value, null]);
//   });

//   sqftHighInput.addEventListener('change', function(){
//     sqftSlider.noUiSlider.set([null, Math.round(this.value)]);
//   });
// };

// function yearInputConnection() {
//   var yearLowInput = document.getElementById("yearLowInput");
//   var yearHighInput = document.getElementById("yearHighInput");

//   yearSlider.noUiSlider.on('update', function( values, handle ) {

//     var value = values[handle];

//     if ( handle ) {
//       yearHighInput.value = value;
//     } else {
//       yearLowInput.value = Math.round(value);
//     }
//   });

//   yearLowInput.addEventListener('change', function(){
//     yearSlider.noUiSlider.set([this.value, null]);
//   });

//   yearHighInput.addEventListener('change', function(){
//     yearSlider.noUiSlider.set([null, Math.round(this.value)]);
//   });
// };

// function moneySqftInputConnection() {
//   var moneySqftLowInput = document.getElementById("moneySqftLowInput");
//   var moneySqftHighInput = document.getElementById("moneySqftHighInput");

//   moneySqftSlider.noUiSlider.on('update', function( values, handle ) {

//     var value = values[handle];

//     if ( handle ) {
//       moneySqftHighInput.value = value;
//     } else {
//       moneySqftLowInput.value = Math.round(value);
//     }
//   });

//   moneySqftLowInput.addEventListener('change', function(){
//     moneySqftSlider.noUiSlider.set([this.value, null]);
//   });

//   moneySqftHighInput.addEventListener('change', function(){
//     moneySqftSlider.noUiSlider.set([null, Math.round(this.value)]);
//   });
// };

// function hoaInputConnection() {
//   var hoaLowInput = document.getElementById("hoaLowInput");
//   var hoaHighInput = document.getElementById("hoaHighInput");

//   hoaSlider.noUiSlider.on('update', function( values, handle ) {

//     var value = values[handle];

//     if ( handle ) {
//       hoaHighInput.value = value;
//     } else {
//       hoaLowInput.value = Math.round(value);
//     }
//   });

//   hoaLowInput.addEventListener('change', function(){
//     hoaSlider.noUiSlider.set([this.value, null]);
//   });

//   hoaHighInput.addEventListener('change', function(){
//     hoaSlider.noUiSlider.set([null, Math.round(this.value)]);
//   });
// };

function initMap() {
  // The location of Uluru
  var uluru = {lat: -25.344, lng: 131.036};
  // The map, centered at Uluru
  var map = new google.maps.Map(
      document.getElementById('map'), {zoom: 4, center: uluru});
  // The marker, positioned at Uluru
  var marker = new google.maps.Marker({position: uluru, map: map});
}





