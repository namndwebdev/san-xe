var axios = require("axios");
var cheerio = require("cheerio");
let dataDropdown4banh = [];
let Morecar = [];
let fs = require("fs");
let path = require("path");

function GetDropDown(arrCarbands, $, length) {
  arrCarbands.each(function (i, dropdown) {
    let getCarNames = $(dropdown).find("ul").children("li");
    let arrCarnames = function () {
      let arr = [];
      getCarNames.each(function (i, carname) {
        let stringsearch = $(carname).find("span").attr("url").split("/");
        if (i < getCarNames.length - 1) {
          arr[i] = {
            name: $(carname).find("span").text(),
            stringsearch: stringsearch[1],
          };
        }
      });

      return arr;
    };
    let nameCarBands = $(dropdown).find("a").attr("href").split("/");
    if (i < length - 1 && i > 0) {
      dataDropdown4banh[i] = {
        carband: {
          name: $(dropdown).find("a").text(),
          stringsearch: nameCarBands[1],
        },
        nameoto: arrCarnames(),
      };
    }
  });
  return dataDropdown4banh;
}
function GetMoreCar($, moreCar) {
  return $(moreCar).find(".mtop-item").text();
}
function UrlMoreCar($, moreCar) {
  let urlMoreCar = $(moreCar).find(".mtop-item").attr("href").split("/");
  return urlMoreCar[1];
}
function GetnameCar(carsDrop, $, length) {
  carsDrop.each(function (i, car) {
    let getCarMore = $(car).find("ul").children("li");
    let arrCarnames = function () {
      let arr = [];
      getCarMore.each(function (i, carname) {
        let stringsearch = $(carname).find("a").attr("href").split("/");

        if (i < getCarMore.length - 1) {
          arr[i] = {
            name: $(carname).find("a").text(),
            stringsearch: stringsearch[1],
          };
        }
      });

      return arr;
    };
    if (i < length - 1) {
      Morecar[i] = {
        carband: { name: GetMoreCar($, car), stringsearch: UrlMoreCar($, car) },
        nameoto: arrCarnames(),
      };
    }
  });
}
async function getMore() {
  return await axios
    .get(`https://bonbanh.com/get-more-menu?v=1.2.1`)
    .then((res) => {
      const $ = cheerio.load(res.data);
      let carsDrop = $(".menuparent");
      GetnameCar(carsDrop, $, carsDrop.length);

      return Morecar;
    })
    .catch((err) => {
      console.log("getMore ERR bonbanh ", err);
    });
}
async function getDropDown4() {
  return await axios
    .get(`https://bonbanh.com/oto`)
    .then((res) => {
      const $ = cheerio.load(res.data);
      let carsDrop = $("#primary-nav").children("li");
      GetDropDown(carsDrop, $, carsDrop.length);

      return dataDropdown4banh;
    })
    .catch((err) => {
      console.log("getPage ERR bonbanh ", err);
    });
}
async function getarr() {
  let dropOtoCom = await getDropDown4();
  let dropOtoComMore = await getMore();
  let dropDownComplete = dropOtoCom.concat(dropOtoComMore);
  console.log(dropDownComplete);
  fs.writeFile(
    path.join(__dirname, "dropdown.json"),
    JSON.stringify(dropDownComplete),
    function () {
      console.log("in xong");
    }
  );
}
getarr();
