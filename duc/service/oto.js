var axios = require("axios");
var cheerio = require("cheerio");
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

function getPage(search, address, page) {
  return axios
    .get(`https://oto.com.vn/mua-ban-xe-${search}-${address}/p${page}`)
    .then((res) => {
      return res.data
    })  
    .catch((error) => {
      console.log("getPage ERR oto.com", error);
    });
}

function fetchDataFormHtmlPageList(listRes){
  let listPromise = [];
  listRes.forEach(function (htmlPage) {
      let newData = [];
      const $ = cheerio.load(htmlPage);
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
  });

  return Promise.all(listPromise);
}
module.exports = { getPage, fetchDataFormHtmlPageList };
