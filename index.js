const { nextISStimesForMyLocation } = require('./iss');

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

nextISStimesForMyLocation((error, response) => {
  if (error) return console.log(`Oh no! Something went wrong... ${error}`);

  // Success! Print the response!
  formatPassTime(response);
});

module.exports = {
  formatPassTime,
};