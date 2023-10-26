let dropDownCarsBand = $("#cars-bands");
let dropDownCarsName = $("#cars");
console.log(dropDownCarsName);
let DataJson = fetch("./dropdown.json")
  .then((response) => response.json())
  .then((json) => json);
async function fetchData() {
  let data = await DataJson;

  console.log(data);
  var valueSelectCarBand = data[0].carband.name;
  data.forEach((element, index) => {
    dropDownCarsBand.append(
      `<option value="${element.carband.name}">${element.carband.name}</option>`
    );
    dropDownCarsBand.on("change", function () {
      valueSelectCarBand = $(this).val();
      if (valueSelectCarBand === element.carband.name) {
        dropDownCarsName.empty();
        let namecar = element.nameoto[0].name;
        let url = element.nameoto[0].stringsearch;
        element.nameoto.forEach(function (item, index1) {
          dropDownCarsName.append(
            `<option value="${item.name}">${item.name}</option>`
          );
          console.log(url);
          dropDownCarsName.on("change", function () {
            namecar = $(this).val();
            if (namecar === item.name) {
              url = item.stringsearch;
              console.log(url);
            }
          });
        });
      }
    });
  });
}
fetchData();
