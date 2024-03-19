async function fetchDataWeb(search, address, getTotalPage, getPage) {
  if (typeof getTotalPage == "function") {
    return fetchDataNeedTotalPage(search, address, getTotalPage, getPage);
  } else {
    return fetchDataNotNeedTotalPage(search, address, getPage);
  }
}

async function fetchDataNeedTotalPage(search, address, getTotalPage, getPage) {
  return getTotalPage(search, address)
    .then((totalPage) => {
      let arrPromise = [];
      for (let i = 1; i <= totalPage; i++) {
        arrPromise.push(getPage(search, address, i));
      }
      return Promise.all(arrPromise);
    })
    .then((data) => {
      data = data.reduce((total, item) => {
        return total.concat(item);
      }, []);
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
      return data;
    })
    .catch((err) => {
      console.log("fetchDataWeb ERR", err);
    });
}

async function fetchDataNotNeedTotalPage(search, address, getPage) {
  let arrPromise = []
  for (let i = 1; i < 2; i++) {
    let kq = getPage(search, address, i)
    arrPromise.push(kq)
  }

  let data = await Promise.all(arrPromise)

  return data.reduce((total, item)=>{

    return total.concat(item)
  }, []);
}

// module.exports = {
//   fetchDataWeb,
// };

// async function fetchDataNotNeedTotalPage(search, address, getPage) {
//   let page = 0;
//   let count = 0
//   let data = [];
//   while (true) {
//     page++;
//     count++;
//       let kq = await getPage(search, address, page);
//     //   console.log(kq)
//     if (kq.length) {
//       data = data.concat(kq);
//       console.log(data)
//       console.log("data: " + count)
//     } else {
//       break;
//     }
//     }
//     console.log("done while")
//   return data;
// }
module.exports = {
  fetchDataWeb,
};
