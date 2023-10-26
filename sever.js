const express = require("express");
const app = express();
const port = 3100;
const { fetchData: ChoTot } = require("./chotot.js");
const { fetchData: OtoCom } = require("./oto.com.vn.js");
const { fetchData: BonBanh } = require("./bonbanh.js");
const { formatUnderline, formatChoTot } = require("./validate.js");
app.get("/:search/:address", (req, res) => {
  let objSearch = {
    address: req.params.address, //chuan
  };

  try {
    objSearch.bonbanh = req.params.search;
    console.log(req.params.search, req.params.address);
    objSearch.oto = formatUnderline(req.params.search);
    objSearch.chotot = formatChoTot(req.params.search);

    objSearch.search = objSearch.chotot;
    var p1 = ChoTot(objSearch);
    objSearch.search = objSearch.oto;
    var p2 = OtoCom(objSearch);
    objSearch.search = objSearch.bonbanh;
    var p3 = BonBanh(objSearch);

    Promise.allSettled([p1, p2, p3]).then((results) => {
      let data = results.reduce((total, item) => {
        if (item.status === "fulfilled") {
          return total.concat(item.value);
        } else {
          console.log(item.reason);
          return total;
        }
      }, []);
      res.json(data);
    });
  } catch (error) {
    res.send(error);
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
