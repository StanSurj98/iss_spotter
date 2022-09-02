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


module.exports = { fetchMyIP, fetchCoordsByIP };