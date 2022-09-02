const { nextISStimesForMyLocation } = require('./iss');

// helper func to format the data
const formatPassTime = (passTimes) => {
  // Now to format passTimes:
  // it's an array of objects, so we have to loop thru and log each
  // console.log(passTimes);
  for (const x of passTimes) {
    const dateTime = new Date(0);
    dateTime.setUTCSeconds(x.risetime);
    console.log(`Next pass at ${dateTime} for ${x.duration} seconds!`);
  }
};

nextISStimesForMyLocation((error, passTimes) => {
  if (error) return console.log(`Oh no! Something went wrong... ${error}`);

  // Success! Print the passTimes!
  formatPassTime(passTimes);
});