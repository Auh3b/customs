let url;
const opt = document.getElementsByClassName("opt");
const calculate = document.getElementById("calculate");
const payable = document.getElementById("payable");

let year = document.getElementById("year"),
  parameter = document.getElementById("parameter"),
  amount = document.getElementById("amount");

async function getData(data) {
  const response = await fetch(data);
  const responseData = response.json();
  return responseData;
}

function getVehicle(d) {
  return d == "Car" ? "cars.json" : d == "Passanger" ? "pass.json" : "hgv.json";
}

for (let i = 0; i < opt.length; i++) {
  opt[i].addEventListener("click", () => {
    url = getVehicle(opt[i].textContent);
    let optLabel;

    if (opt[i].textContent === "Car") {
      parameter.setAttribute("placeholder", "Enter Engine Capacity");
    } else if (opt[i].textContent === "Passanger") {
      parameter.setAttribute("placeholder", "Enter Seating Capacity");
    } else if (opt[i].textContent === "Heavy Goods") {
      parameter.setAttribute("placeholder", "Enter tonnage");
    } else {
      parameter.setAttribute("placeholder", "");
    }

    getData(url)
      .then((data) => {
        calculate.addEventListener("click", () => {
          // get parameter category
          let category1;
          data.forEach((d) => {
            if (
              d.cat1_min <= parameter.value &&
              parameter.value <= d.cat1_max
            ) {
              category1 = d.cat1;
            }
          });

          // get age category

          let category2;
          let baseDate = new Date();
          let today = baseDate.getFullYear();
          let age = today - parseInt(year.value);

          data.forEach((d) => {
            if ((d.cat2_min <= age) & (d.cat2_max >= age)) {
              category2 = d.cat2;
            }
          });

          // get array

          let calArr = data.filter(
            (d) => (d.cat1 == category1) & (d.cat2 == category2)
          );

          // calculate total custom

          let totCustom;
          let total =
            amount.value * calArr[0].import_duty +
            amount.value * calArr[0].import_excise +
            amount.value * calArr[0].import_vat;

          totCustom = total;

          payable.innerHTML = `
                          <span class="display-4">
                            MWK ${$.number(totCustom)}
                          </span>`;
          clearFields();
        });
      })
      .catch((err) => console.log(err));
  });
}

function clearFields() {
  year.value = "";
  parameter.value = "";
  amount.value = "";
}
