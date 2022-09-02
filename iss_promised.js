// This version of request RETURNS A PROMISE response, so it's an object
const request = require('request-promise-native');
/*
 * Requests user's ip address from https://www.ipify.org/
 * Input: None
 * Returns: Promise of request for ip data, returned as JSON string
 */
const fetchMyIP = () => {
  return request("https://api.ipify.org/?format=json"); // returns JSON string
};

/* 
 * Makes a request to ipwho.is using the provided IP address to get its geographical information (latitude/longitude)
 * Input: JSON string containing the IP address
 * Returns: Promise of request for lat/lon
 */
const fetchCoordsByIP = (ipObj) => {
  const ip = JSON.parse(ipObj).ip;
  return request(`http://ipwho.is/${ip}`);// take the value of "ip": 1.1.1.1 
};

const fetchISSFlyOverTimes = (coords) => {
  const {latitude, longitude} = JSON.parse(coords);
  const url = `https://iss-pass.herokuapp.com/json/?lat=${latitude}&lon=${longitude}`;
  return request(url);
};



const nextISStimesForMyLocation = () => {
  return fetchMyIP()
    .then(fetchCoordsByIP)
    .then(fetchISSFlyOverTimes)
    .then((passTimes) => {
      const { response } = JSON.parse(passTimes); // returns an array of objects
      // we only want to format the response object
      return response; // getting here is success, return the response
    });
};

// helper func to format the data
const formatPassTime = (response) => {
  // Now to format response:
  // it's an array of objects, so we have to loop thru and log each
  // console.log(response);
  for (const x of response) {
    const dateTime = new Date(0);
    dateTime.setUTCSeconds(x.risetime);
    console.log(`Next pass at ${dateTime} for ${x.duration} seconds!`);
  }
};


  
module.exports = {
  nextISStimesForMyLocation, 
  formatPassTime,
};