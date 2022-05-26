const fs = require('fs');
const express = require('express');
const router = express.Router();
const path = require('path');
const { LoadFile, StoreData } = require('../handler/parser');
const JSONReader = require('../handler/reader');

// remove file from local storage
const removeFile = (path) => {
  fs.unlink(path, (err) => {
    if (err) {
      console.error(err);
      throw 'Something went wrong';
    }
  });
};

/** OK
 * @route  GET /api/v1/package?search=<package_name>
 * @desc    find package or all packages
 * @access  public
 */
router.get('/package', async (req, res) => {
  try {
    const package = req.query.search;
    // read the json file
    const data = await JSONReader(
      path.join(__dirname, '..', 'storage', 'data.json')
    );

    if (package) {
      if (data[package]) return res.status(200).json({ pkgs: data[package] });
      else return res.status(500).json({ msg: 'not found package' });
    } else if (!package) {
      // convert to array of objects
      let arrayOfObj = Object.entries(data).map((e) => e[0]);
      arrayOfObj.sort();
      return res.status(200).json({ pkgs: arrayOfObj });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'please upload toml lock file' });
  }
});

/** OK
 * @route  POST /api/v1/upload
 * @desc    file handler
 * @access  public
 */
router.post('/upload', async (req, res) => {
  try {
    if (!req.files) {
      return res.status(404).json({ error: 'File not found' });
    }
    let file = req.files.file;
    let md5 = file.md5;
    // save to local storage
    const savePath = path.join(__dirname, '..', 'storage', file.name);
    file.mv(savePath, async (err) => {
      try {
        if (err) throw 'Cannot save local file';
        // create package dictionary
        const pkgs = await LoadFile(savePath);
        // store to local
        StoreData(pkgs, path.join(__dirname, '..', 'storage', 'data.json'));
        // return status
        return res.status(200).json({ msg: 'OK' });
      } catch (err) {
        console.log(err);
        return res.status(400).json({ error: err });
      }
      // console.log(pkgs);
      // store to local storage
    });
  } catch (err) {
    console.error(err);
    removeFile(savePath);
    return res.status(500).json({ error: err });
  }
});

router.get('/');
module.exports = router;
