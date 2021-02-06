let url;
const opt = document.getElementsByClassName("opt");
const paraText = document.getElementById("parameter-text");
const calculate = document.getElementById("calculate");
const payable = document.getElementById("payable");

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
    if (opt[i].textContent === "Car") {
      paraText.textContent = "Engine Capacity";
    } else if (opt[i].textContent === "Passanger") {
      paraText.textContent = "Seating Capacity";
    } else if (opt[i].textContent === "Heavy Goods") {
      paraText.textContent = "tonnage";
    } else {
      paraText.textContent = "";
    }
    console.log(url);
  });
}

getData(url)
  .then((data) => {
    let year = document.getElementById("year"),
      parameter = document.getElementById("parameter"),
      amount = document.getElementById("amount");

    calculate.addEventListener("click", () => {
      // get parameter category
      let category1;
      data.forEach((d) => {
        if (d.cat1_min <= parameter.value && parameter.value <= d.cat1_max) {
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
      // // console.log(totCustom);

      payable.innerHTML = `<div>
                        <span class="p-4 text-light bg-info">
                          MWK ${$.number(totCustom)}
                        </span>
                        </div>`;
    });
  })
  .catch((err) => console.log(err));
