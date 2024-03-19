var axios = require("axios");
var cheerio = require("cheerio");
//call API list cars
async function getPage(searchText, address, page) {
    let data = [];
    return axios
        .get(
            `https://xetot.com/${address}/mua-ban-oto?q=${searchText}&page=${page}`
        )
        .then((res) => {
            const $ = cheerio.load(res.data);
            let name = $(".item-title");
            let price = $(".meta-seller").find("span");
            let image = $(".archive-thumb").find("img");
            let address = $(".car-info").find(".hight-light-simi-bold");
            let number = $(".call-action").find(".phone-content");
            name.each(function (i, name) {
                data[i] = { name: $(name).text() };
            });
            price.each(function (i, price) {
                data[i] = { ...data[i], price: $(price).text() };
            });
            image.each(function (i, image) {
                data[i] = {
                    ...data[i],
                    image: "https://xetot.com" + $(image).attr("src"),
                };
            });
            address.each(function (i, address) {
                data[i] = {
                    ...data[i],
                    address: $(address).text(),
                };
            });
            number.each(function (i, number) {
                data[i] = {
                    ...data[i],
                    phonenumber: $(number).attr("data-phone"),
                };
            });
            name.each(function (i, url) {
                data[i] = {
                    ...data[i],
                    urlDetail: "https://xetot.com" + $(url).attr("href"),
                };
            });
            name.each(function (i) {
                data[i] = {
                    ...data[i],
                    web: "xetot"
                };
            });
            return data;
        })
        .catch((err) => {
            console.log("getPage ERR xetot ", err);
        });
}
function getTotalPage(searchText, address) {
    return axios
        .get(
            `https://xetot.com/${address}/mua-ban-oto?q=${searchText}`
        )
        .then((res) => {
            let totalPage;
            const $ = cheerio.load(res.data);
            let result = $(".show-case-search").find("p");
            result.each(function (i, result) {
                let arr = $(result).text().split(" ");
                let a = arr[arr.length - 1];
                let b = arr[arr.length - 3];
                if (Number.isInteger(a / b)) {
                    totalPage = a / b;
                } else {
                    totalPage = Math.ceil(a / b);
                }

            });
            return totalPage;
        })
        .catch((error) => {
            console.log("getTotalPage ERR xetot", error);
        });
}
module.exports = { getPage, getTotalPage }