/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */
const request = require('request');

// Remember! callback(err, ip);
const fetchMyIP = (callback) => {
  // use request to fetch IP address from JSON API
  request("https://api.ipify.org/?format=json", (error, response, body) => {
    // if an error present, invoke CB with error as first param
    if (error) return callback(error, null);

    // if non-200 status, assume server error
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }

    // if we get here - all is good => deserialize the body
    const ip = JSON.parse(body).ip;
    callback(null, ip);
  });
};

// Reminder            cb(err, data)
const fetchCoordsByIP = (ip, cb) => {
  request(`http://ipwho.is/${ip}`, (error, response, body) => {
    if (error) return cb(error, null);

    const parsedBody = JSON.parse(body); // first we parse JSON string to object
    // Then we DESTRUCTURE the properties we want
    const { latitude, longitude, success, message } = parsedBody;

    // error handling for if response 200 but ip doesn't exist
    //                                        cb(1st param-> err     ,     2nd param -> data)
    if (!success) return cb(`success: ${success}, message: ${message}`, null);

    // otherwise, if successful and we got here
    cb(null, {latitude, longitude}); // pass those back as our 2nd param to the callback
  });
};

// request for the simulation API
const fetchISSFlyOverTimes = (coords, cb) => {
  const url = `https://iss-pass.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`;
  request(url, (error, status, body) => {
    // our 2 guard clauses
    if (error) return cb(error, null);
    if (status.statusCode !== 200) return cb(`status: ${status && status.statusCode}`, null);

    // if all well, parse the body to object
    const parsedBody = JSON.parse(body);
    // destructure the response object
    const { response } = parsedBody;
    // pass back the response object to the callback in index.js
    cb(null, response);
  });
};

// FINALLY, lets chain all these callback APIs together...
/**
 * Orchestrates multiple API requests in order to determine the next 5 upcoming ISS fly overs for the user's current location.
 * Input:
 *   - A callback with an error or results. 
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly-over times as an array (null if error):
 *     [ { risetime: <number>, duration: <number> }, ... ]
 */ 
const nextISStimesForMyLocation = (cb) => {
  // first we pass in our fetchMyIP() func
  fetchMyIP((error, ip) => {
    // 1. always check for errors, since we know our cb takes errors first arg
    if (error) return cb(error, null);

    // 2. if we get an ip, lets pass back into it, our fetch coords take (ip, cb(err, coords))
    fetchCoordsByIP(ip, (error, coords) => {
      // 3. check again for errors... if we get one, pass to main cb in index.js, null data
      if (error) return cb(error, null);

      // 4. if we get coords, pass it into 3rd func, fetchFlytimes...(coords, cb(err, data))
      fetchISSFlyOverTimes(coords, (error, data) => {
        if (error) return cb(error, null);

        // 5. FINALLY => if no errors, nullify it and pass the data to the main callback
        cb(null, data);
      });
    });
  });
};

module.exports = { nextISStimesForMyLocation };