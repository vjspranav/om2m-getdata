var express = require("express");
var router = express.Router();
var axios = require("axios");
var config = require("../config/keys");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

// /<AE>/<container>/
router.get("/data/:AE/:container", async function (req, res, next) {
  try {
    let AE = req.params.AE;
    let container = req.params.container;
    let descriptor = "";
    let data = "";

    let res_desc = await axios.get(
      `${config.URL}/~/in-cse/in-name/${AE}/${container}/Descriptor/la`,
      {
        headers: {
          "X-M2M-Origin": `${config.username}:${config.password}`,
          Accept: "application/json",
          AccessControlAllowOrigin: "*",
        },
      }
    );

    let final = res_desc.data["m2m:cin"]["con"];
    descriptor = final
      .split("Data String Parameters")[1]
      .split("val=")[1]
      .split("]")[0]
      .split("[")[1]
      .split(",");

    // Now do axios call to get data
    let res_data = await axios.get(
      `${config.URL}/~/in-cse/in-name/${AE}/${container}/Data/la`,
      {
        headers: {
          "X-M2M-Origin": `${config.username}:${config.password}`,
          Accept: "application/json",
          AccessControlAllowOrigin: "*",
        },
      }
    );

    final = res_data.data["m2m:cin"]["con"];
    // there are nan values in data, so replace them with 0. final is the array of data in string format
    data = JSON.parse(final.replace(/nan/g, '"nan"'));

    // descriptor is array of keys and data is array of values, make a final object
    // let data_desc = {};
    // for (let i = 0; i < descriptor.length; i++) {
    //   data_desc[descriptor[i]] = data[i];
    // }
    // same as above
    let data_desc = Object.fromEntries(
      descriptor.map((key, i) => [
        key.replaceAll("'", "").replace(/\s/g, ""),
        data[i],
      ])
    );

    return res.status(200).json(data_desc);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err });
  }
});

module.exports = router;
