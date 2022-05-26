const fs = require('fs');

// read the json file and return as an object
const JSONReader = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.open(filePath, 'r', (err, fin) => {
      if (err) reject(err);
      else {
        // read file uploaded
        fs.readFile(filePath, (err, data) => {
          const toJSON = JSON.parse(data);
          resolve(toJSON);
        });
      }
    });
  });
};

module.exports = JSONReader;
