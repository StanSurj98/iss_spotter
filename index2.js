const { nextISStimesForMyLocation, formatPassTime } = require('./iss_promised');


nextISStimesForMyLocation()
  .then((response) => {
    formatPassTime(response);
  })
  .catch(error => console.log(`Something went wrong... ${error}`)); // if error, pass the error, null the results param