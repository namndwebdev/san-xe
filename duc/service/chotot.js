var axios = require("axios");
var cheerio = require("cheerio");
function change_alias(alias) {
  var str = alias;
  str = str.toLowerCase();
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/đ/g, "d");
  str = str.replace(
    /!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,
    " "
  );
  str = str.replace(/ + /g, " ");
  str = str.trim().split(" ").join("-");

  return str;
}

function getNameOf($, cItem) {
  return $(cItem).find("[class*='commonStyle_adTitle']").text();
}
function getPriceOf($, cItem) {
  return $(cItem).find("[class*='AdBody_adPriceNormal']").text();
}
function getImageOf($, cItem) {
  return $(cItem).find("[class*='AdThumbnail_thumbnailDefault']").attr("src");
}
function getAddressOf($, cItem) {
  let splitaddress = $(cItem).attr("href").split("/");
  let address = splitaddress[1];
  return address;
}
function getUrlDetailOf($, cItem) {
  return "https://xe.chotot.com/" + $(cItem).attr("href");
}

async function getPage(search, address, page) {
  change_alias("Hải Phòng");
  return axios
    .get(
      `https://xe.chotot.com/mua-ban-oto-${change_alias(
        address
      )}?sp=1&q=${search}&page=${page}`
    )
    .then((res) => {
      let newData = [];
      const $ = cheerio.load(res.data);
      let cars = $("[class*='AdItem_adItem']");
      cars.each(function (i, car) {
        if (getNameOf($, car)) {
          newData[i] = {
            name: getNameOf($, car),
            price: getPriceOf($, car),
            image: getImageOf($, car),
            address: getAddressOf($, car),
            phonenumber: "",
            urlDetail: getUrlDetailOf($, car),
            web: "chotot",
          };
        } else {
          return false;
        }
      });

      return cars.length ? newData : [];
    })
    .catch((error) => {
      console.log("getPage ERR chotot.js", error);
    });
}

module.exports = { getPage };
