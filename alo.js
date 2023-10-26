var axios = require("axios");
var cheerio = require("cheerio");

//////////////////////////////////////////////////
let data = [];
let searchText = "kia morning";
let address = "Hà Nội";
function getNameOf($, cItem) {
  return $(cItem).find('[itemprop="name"]').text();
}
function getPriceOf($, cItem) {
  return $(cItem).find('[itemprop="price"]').attr("content");
}
function getImageOf($, cItem) {
  return $(cItem).find('[itemprop="image"]').attr("src");
}
function getAddressOf($, cItem) {
  return $(cItem).find(".cb4").text().trim();
}
function getPhoneNumberOf($, cItem) {
  let regex = /(01|03|05|07|08|09)[.\d\s+]{7,15}/g;
  let stringNumber = $(cItem).find(".cb7").text().trim().split(" ").join("");
  let NumberPhone = stringNumber.match(regex);
  return NumberPhone;
}
function getLinkDetailOf($, cItem) {
  return (
    "https://bonbanh.com/" + $(cItem).find('[itemprop="url"]').attr("href")
  );
}

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

//call API list cars
async function getPage(searchText, address, page) {
  return await axios
    .get(
      `https://bonbanh.com/${change_alias(
        address
      )}/oto/${searchText}/page,${page}`
    )
    .then((res) => {
      const $ = cheerio.load(res.data);
      let cars = $(".car-item");

      cars.each(function (i, car) {
        data[i] = {
          name: getNameOf($, car),
          price: getPriceOf($, car),
          image: getImageOf($, car),
          address: getAddressOf($, car),
          phonenumber: getPhoneNumberOf($, car),
          urlDetail: getLinkDetailOf($, car),
        };
      });

      return data;
    })
    .catch((err) => {
      console.log("getPage ERR bonbanh ", err);
    });
}

function getTotalPage(searchText, address) {
  return axios
    .get(`https://bonbanh.com/${change_alias(address)}/oto/${searchText}`)
    .then((res) => {
      const $ = cheerio.load(res.data);
      let text = $(".pagging .cpage").text();
      let regex = /\/\s+\d+/;
      var kq = text.match(regex);
      let number = Number(kq[0].split("/")[1].trim());
      if (number) return number;
    })
    .catch((error) => {
      console.log("getTotalPage ERR bonbanh", error);
    });
}

function fetchData({ searchText, address }) {
  return getTotalPage(searchText, address)
    .then((totalPage) => {
      let arrPromise = [];
      for (let i = 1; i <= totalPage; i++) {
        arrPromise.push(getPage(searchText, address, i));
      }
      return Promise.all(arrPromise);
    })
    .then((data) => {
      data = data.reduce((total, item) => {
        return total.concat(item);
      });
      data = data
        .sort((a, b) => {
          return a.price - b.price;
        })
        .map((item) => {
          let newPrice = Number(item.price).toLocaleString("vi", {
            style: "currency",
            currency: "VND",
          });
          return { ...item, price: newPrice };
        });
      console.log(data);
      return data;
    })
    .catch((err) => {
      console.log("getTotalPage ERR bonbanh", err);
    });
}
const value = {
  searchText: "kia-morning",
  address: "ha-noi",
};
fetchData(value);
