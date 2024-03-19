const { formatChoTot } = require("./Helper/validate");
let search = "kia";
let address = "ha-noi";
// search = formatChoTot(search);
var { fetchDataWeb } = require("./Helper/fetchData"); // lấy bên fetchData
var { getTotalPage:xetotTotal, getPage:xetotGetPage } = require("./service/xetot"); // lấy bên trang web.js, mỗi trang web.js sẽ có 2 phương thức riêng
var { getTotalPage:bonBanhTotal, getPage:bonBanhGetPage } = require("./service/bonBanh"); // lấy bên trang web.js, mỗi trang web.js sẽ có 2 phương thức riêng
var { getTotalPage:chototTotal, getPage:chototGetPage } = require("./service/chotot"); // lấy bên trang web.js, mỗi trang web.js sẽ có 2 phương thức riêng
var { getTotalPage:otoTotal, getPage:otoGetPage, fetchDataFormHtmlPageList:otoHandleData } = require("./service/oto"); // lấy bên trang web.js, mỗi trang web.js sẽ có 2 phương thức riêng
(async function () {
  try {
    let dataXeTot =  fetchDataWeb(search, address, xetotTotal, xetotGetPage);
    let dataBonBanh =  fetchDataWeb(search, address, bonBanhTotal, bonBanhGetPage);
    let dataChotot =  fetchDataWeb(search, address, chototTotal, chototGetPage);
    let dataOto =  fetchDataWeb(search, address, otoTotal, otoGetPage).then(res=>{
      return otoHandleData(res)
    });

    Promise.all([ dataBonBanh]).then(listData=>{
      let allData = listData.reduce((total, item)=>{
        return total.concat(item)
      },[])
      console.log(allData)
    }).catch(err=>{
      console.log(err)
    })

   
  } catch (error) {
    console.log(error);
  }
})();
