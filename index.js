const { fetchMyIP, fetchCoordsByIP } = require('./iss');

// fetchMyIP((err, ip) => {
//   if (err) {
//     console.log(`It didn't work! ${err}`);
//     return;
//   }
//   console.log(`It worked! IP: ${ip}`);
// });

fetchCoordsByIP("ip goes here", (err, coords) => {
  if (err) return console.log(`It didn't work... ${err}`);
  console.log(coords);
});