import $ from "jquery";

function render(products) {
  $("tr")
    .not($("tr#title"))
    .remove();
  $("td").remove();
  for (let i = 0; i < products.length; i++) {
    let idBtn = i + 1;
    const newRowStr = `
      <tr id="${products[i].id}">
        <td>${products[i].name}</td>
        <td>${products[i].price.toLocaleString()}</td>
        <td>${products[i].final_price.toLocaleString()}</td>
        <td>${products[i].promotion_percent.toLocaleString()} %</td>
        <td><button id="${idBtn}" class="detailBtn" data-id=${
      products[i].id
    }>Chi tiết</button></td>
      </tr>
    `;

    $("table#sampleTable").append(newRowStr);

    $(`#${idBtn}`).click(function(e) {
      const selectedProductId = $(this).attr("data-id");

      $.ajax({
        url: `https://mapi.sendo.vn/mob/product/${selectedProductId}/detail/`,
        method: "GET"
      })
        .done(function(result) {
          printDetailProduct(result);
        })
        .catch(function(error) {
          console.log(error);
        });
    });
  }
}

function filterBigSaleProduct(products, number) {
  return products.filter(elm => elm.promotion_percent >= number);
}

const sortProduct = function(isLowToHigh, property, sortList) {
  let resultList = sortList;

  if (isLowToHigh) {
    resultList.sort((a, b) => a[property] - b[property]);
  } else {
    if (property === "name") {
      resultList.sort();
      resultList.reverse();
    } else {
      resultList.sort((a, b) => b[property] - a[property]);
    }
  }

  return resultList;
};

let products;

const getProduct = function() {
  $.ajax({
    url:
      " https://mapi.sendo.vn/mob/product/cat/phu-kien-cong-nghe/phu-kien-may-tinh-laptop/usb/?p=1",
    method: "GET"
  })
    .done(function(result) {
      products = result.data;
      render(products);
    })
    .catch(function(error) {
      console.log(error);
    });
};

getProduct();

$("#lowToHigh").click(function() {
  const sortedList = sortProduct(true, "price", [...products]);
  render(sortedList);
});

$("#highToLow").click(function() {
  let sortedList = sortProduct(false, "price", [...products]);
  render(sortedList);
});

$("#aToZ").click(function() {
  let sortedList = sortProduct(false, "name", [...products]);
  render(sortedList);
});

$("#zToA").click(function() {
  let sortedList = sortProduct(true, "name", [...products]);
  render(sortedList);
});

$("#filterBigSale").click(function() {
  let sortedList = filterBigSaleProduct([...products], 10);
  render(sortedList);
});

/**
 * HOMEWORK
 */
function isDefined(inputVal) {
  return inputVal !== null && inputVal !== undefined;
}

$("#searchBtn").click(function(e) {
  e.preventDefault();
  const inputProductName = $("#searchProductName").val();
  const inputPageNum = $("#searchPage").val();

  if (!isDefined(inputProductName) || inputProductName === "") {
    return;
  }

  if (!isDefined(inputPageNum) || inputPageNum <= 0) {
    return;
  }

  $.ajax({
    url: `https://mapi.sendo.vn/mob/product/search?p=${inputPageNum}&q=${inputProductName}`,
    method: "GET"
  })
    .done(function(result) {
      if (!isDefined(result) || result.data.length === 0) {
        $("#notFound").show();
      } else {
        $("#notFound").hide();
      }

      products = result.data;
      render(products);
    })
    .catch(function(error) {
      console.log(error);
    });
});

function printDetailProduct(data) {
  console.log(`Details of ${data.name}:`);
  console.log(data);
}
