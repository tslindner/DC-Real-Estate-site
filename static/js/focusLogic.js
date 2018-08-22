listing = listing[0];

document.getElementById('address').innerHTML = listing['address'];

document.getElementById('listingInfo').innerHTML = nearestData['restaurant']['results'][0]['name'];

console.log(nearestData);


// nearestCoffee = [{"name": starbucks,
//                     "geometry": },
//                 {"name": jammin java,
//                 "geometry": }
//             {}
//         ]

// d3.json(nearestCoffee blah)

// d3.json(nearestBars)