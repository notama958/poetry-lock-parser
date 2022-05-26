const fs = require('fs');
const path = require('path');

const storeData = (jsonObj, filePath) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(jsonObj));
  } catch (err) {
    console.error(err);
    throw err;
  }
};
const loadData = (filePath) => {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const parseOne = (package) => {
  // declare delimters
  const ret = RegExp(/\n/g);
  const delimiter = ' = ';
  // split line by line
  const lines = package.split(ret);
  const obj = {};
  // check type: package, dependency, extra
  const type = lines[0].replace(ret, '').split(delimiter)[0];

  if (type === '[[package]]') obj.type = 'package';
  else if (type === '[package.dependencies]') {
    obj.type = 'dependency';
    obj.dependency = []; // compulsory dependency
    obj.extra = []; // optional dependecy
  } else if (type === '[package.extras]') {
    obj.type = 'extra'; // optional dependency
    obj.extra = new Set();
  }
  // parse line by line
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].replace(ret, ''); // remove \n from line
    const indexDelimiter = line.indexOf(delimiter); // delimiter index
    const firstHalf = line.slice(0, indexDelimiter); // get left part
    const secondHalf = line.slice(indexDelimiter + delimiter.length); // get right part
    let trimmedLine = [firstHalf, secondHalf];

    // create package object
    if (obj.type === 'package') {
      if (trimmedLine[0] === 'description' || trimmedLine[0] === 'name')
        obj[trimmedLine[0]] = trimmedLine[1].replace(/\"/g, '');
    }
    // create dependecy object
    else if (obj.type === 'dependency') {
      if (trimmedLine[1].includes('optional = true')) {
        obj.extra.push(trimmedLine[0]);
      } else {
        obj.dependency.push(trimmedLine[0]);
      }
    }
    // create extra object
    else if (obj.type === 'extra') {
      let arr = JSON.parse(trimmedLine[1]);
      arr.forEach((element, id) => {
        // remove version number
        let removedVersion = element.replace(
          /\s\(([><=!]+?([0-9a-zA-z][\.,]?)+?)+?\)/g,
          ''
        );
        obj.extra.add(removedVersion);
      });
    }
  }
  return obj;
};

const loadFile = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.open(filePath, 'r', (err, fin) => {
      if (err) reject(err);
      else {
        // read file uploaded
        fs.readFile(filePath, (err, data) => {
          if (err) reject(err);

          const rawString = data.toString();
          // meta version should be 1.1
          let meta_ver = rawString.includes('lock-version = "1.1"');
          if (!meta_ver) reject('invalid version');

          // split the file data by an empty line
          const packages = rawString.split(/\n\s*\n/);

          let pkgs = new Object(); // final parsed dictionary
          let poetryObject = null; // current parsed package

          let map_pack = new Map(); // Map of installed/not installed packages eg. <package_name> => true/false
          let map_re_dep = new Map(); // Map of reversed dependencies eg. <package_name> => [a,b,n,c]

          // loop over each package to parse
          packages.forEach((package, id) => {
            const packObject = parseOne(package);

            // package, dependency, extra
            if (packObject.type === 'package') {
              map_pack.set(packObject.name, true); // add/update object_map with state true (installed)
              poetryObject = packObject; // save current package
              pkgs[packObject.name] = packObject; // create object in dictionary
            } else if (packObject.type === 'dependency') {
              // add field dependencies for package
              pkgs[poetryObject.name]['dependencies'] = packObject.dependency;
              // update the map_re_dep
              packObject.dependency.forEach((e) => {
                if (!map_re_dep.get(e)) {
                  // create new
                  map_re_dep.set(e, [poetryObject.name]);
                } else {
                  // update
                  map_re_dep.set(e, [...map_re_dep.get(e), poetryObject.name]);
                }
              });
            } else if (
              (packObject.type === 'dependency' &&
                packObject.extra.length > 0) |
              (packObject.type === 'extra') // optional dependecies
            ) {
              packObject.extra.forEach((p, id) => {
                if (!map_pack.has(p)) {
                  map_pack.set(p, false); // add packages to map_pack with init state false ( not installed )
                }
              });

              // dependecies with optional = true
              if (pkgs[poetryObject.name]['exts']) {
                packObject.extra.forEach((p, id) => {
                  pkgs[poetryObject.name]['exts'].add(p);
                });
              } else {
                // create field exts for package
                pkgs[poetryObject.name]['exts'] = packObject.extra;
              }
            }
          });
          // final retouch
          // update optional package installation status
          for (let key in pkgs) {
            // update the new reversed dependencies list
            pkgs[key].re_dep = map_re_dep.get(key);
            if (pkgs[key].exts) {
              let newObj = [];
              // update new optional dependecies
              pkgs[key].exts.forEach((p) => {
                const obj = new Object();
                obj[p] = map_pack.get(p);
                newObj.push(obj);
              });
              pkgs[key].exts = newObj;
            }
          }
          if (Object.keys(pkgs).length === 0) reject('Format invalid');
          resolve(pkgs);
        });
      }
    });
  });
};

module.exports = {
  ParseOne: parseOne,
  StoreData: storeData,
  LoadFile: loadFile,
};
