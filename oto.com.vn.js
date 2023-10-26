var axios = require("axios");
var cheerio = require("cheerio");
let search = "hyundai creta";
let address = "ha-noi";
let page = 0;
const MAX_PAGE = 15;
function getNameOf($, cItem) {
  return $(cItem).find(".info-left").find("a").attr("title");
}
function getPriceOf($, cItem) {
  return $(cItem).find(".info-right").find("p").text().trim();
}
function getImageOf($, cItem) {
  return $(cItem).find(".photo").find(".lozad").attr("data-src");
}

function getUrlDetailOf($, cItem) {
  return "https://oto.com.vn/" + $(cItem).find(".photo").find("a").attr("href");
}
function getNumberOf(data) {
  try {
    const HTMLdetails = cheerio.load(data);
    let Number = HTMLdetails(".call3").text().replaceAll("\n", " ").trim();
    return Number;
  } catch (error) {
    console.log("getNumberOf ERR oto.com", error);
  }
}
function getAddressOf($, cItem) {
  let address = $(cItem).find(".info-left").find("a").attr("href").split("/");

  return address[1];
}

function getpage(search, address, page) {
  return axios
    .get(`https://oto.com.vn/mua-ban-xe-${search}-${address}/p${page}`)
    .then((res) => {
      let newData = [];
      let listPromise = [];
      const $ = cheerio.load(res.data);
      let cars = $(".item-car");
      cars.each(function (i, car) {
        let p = axios(getUrlDetailOf($, car)).then((res) => {
          return (newData[i] = {
            name: getNameOf($, car),
            price: getPriceOf($, car),
            image: getImageOf($, car),
            address: getAddressOf($, car),
            phonenumber: getNumberOf(res.data),
            urlDetail: getUrlDetailOf($, car),
          });
        });
        listPromise.push(p);
      });
      return Promise.all(listPromise);
    })
    .catch((error) => {
      console.log("getPage ERR oto.com", error);
    });
}

async function fetchData({ search, address }) {
  let data = [];
  while (true) {
    page++;
    let kq = await getpage(search, address, page);
    if (page <= MAX_PAGE) {
      if (kq) {
        data = data.concat(kq);
      }
    } else {
      break;
    }
  }

  return data;
}

module.exports = { fetchData };
