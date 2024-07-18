///<reference types="../@types/jquery"/>

const Data ={
  "customers": [
      { "id": 1, "name": "Ahmed Ali" },
      { "id": 2, "name": "Aya Elsayed" },
      { "id": 3, "name": "Mina Adel" },
      { "id": 4, "name": "Sarah Reda" },
      { "id": 5, "name": "Mohamed Sayed" },
      { "id": 6, "name": "Yousef Mohamed" },
      { "id": 7, "name": "Mohamed Essam" },
      { "id": 8, "name": "zeyad Ehab" }
  ],
  "transactions": [
      { "id": 1, "customer_id": 1, "date": "2022-01-01", "amount": 1000 },
      { "id": 2, "customer_id": 1, "date": "2022-01-02", "amount": 2000 },
      { "id": 3, "customer_id": 2, "date": "2022-01-01", "amount": 550 },
      { "id": 4, "customer_id": 3, "date": "2022-01-01", "amount": 500 },
      { "id": 5, "customer_id": 2, "date": "2022-01-02", "amount": 1300 },
      { "id": 6, "customer_id": 4, "date": "2022-01-01", "amount": 750 },
      { "id": 7, "customer_id": 3, "date": "2022-01-02", "amount": 1250 },
      { "id": 8, "customer_id": 5, "date": "2022-01-01", "amount": 2500 },
      { "id": 9, "customer_id": 5, "date": "2022-01-02", "amount": 875 },
      { "id": 10, "customer_id": 7, "date": "2022-01-22", "amount": 2000 },
      { "id": 11, "customer_id": 6, "date": "2022-02-05", "amount": 1500 },
      { "id": 12, "customer_id": 8, "date": "2022-01-07", "amount": 3000 },
      { "id": 13, "customer_id": 8, "date": "2022-01-20", "amount": 222 },
      { "id": 14, "customer_id": 6, "date": "2022-01-30", "amount": 550 },
      { "id": 15, "customer_id": 6, "date": "2022-08-22", "amount": 800 },
      { "id": 16, "customer_id": 7, "date": "2022-01-10", "amount": 1500 },
      { "id": 17, "customer_id": 4, "date": "2022-01-15", "amount": 1000 },
      { "id": 18, "customer_id": 7, "date": "2022-01-26", "amount": 5000 }
  ]
}
localStorage.setItem('Data',JSON.stringify(Data))


let Api = {}

if (localStorage.getItem("Data") !== null) {
  Api = JSON.parse(localStorage.getItem("Data"));
  display();
}

//-------------------------------------- Display Function ---------------------------------------------

function display(customersArr = Api.customers, transactionsArr = Api.transactions) {
  let cartoona = ``;

  for (const customer of customersArr) {
    let matchedId = [];

    for (const transaction of transactionsArr) {
      if (customer.id === transaction.customer_id) matchedId.push(transaction);
    }

    for (let i = 0; i < matchedId.length; i++) {
      if (i == 0) {
        cartoona += `
          <tr class="customer-row" data-customer-id="${customer.id}" data-customer-name="${customer.name}">
            <td class="cusId" rowspan="${matchedId.length}">${customer.id}</td>
            <td class="cusName" rowspan="${matchedId.length}">${customer.name}</td>
            <td class="tranNum">${matchedId[i].id}</td>
            <td class="tranAmount">${matchedId[i].amount}</td>
            <td class="tranDate">${matchedId[i].date}</td>
          </tr>`;
      } else {
        cartoona += `
          <tr class="transaction-row" data-customer-id="${customer.id}">
            <td class="tranNum">${matchedId[i].id}</td>
            <td class="tranAmount">${matchedId[i].amount}</td>
            <td class="tranDate">${matchedId[i].date}</td>
          </tr>`;
      }
    }
  }
  $('.rowData').html(cartoona);

  // Add click event listeners
  addRowClickListeners();
}
display();
// ******************************************************************************************************


//-------------------------------------- function run when i click on id or name of customer ------------------

function addRowClickListeners() {
  const rows = document.querySelectorAll('.customer-row');
  rows.forEach(row => {
    row.addEventListener('click', function() {
      const customerId = this.getAttribute('data-customer-id');
      const customerName = this.getAttribute('data-customer-name');
      if (customerId) {
        showCustomerChart(customerId, customerName);
      }
    }, { passive: true });
  });
}

// ******************************************************************************************************


//-------------------------------------- Search By Name ---------------------------------------------

function searchCustomerName(serchInput) {
  let term = [];
  for (const customer of Api.customers) {
    if (customer.name.toLowerCase().includes(serchInput.toLowerCase())) {
      term.push(customer);
    }
  }
  display(term);
}

// ******************************************************************************************************


//--------------------------------------  Search By Amount ---------------------------------------------

function searchTransactionAmount(amountInput) {
  let term = [];
  for (const transaction of Api.transactions) {
    if (transaction.amount.toString().includes(amountInput.toString())) {
      term.push(transaction);
    }
  }
  display(Api.customers, term);


}
// ******************************************************************************************************


//-------------------------------------- Sort By Name ---------------------------------------------

function sortByName() {
  let sortedCustomers = Api.customers.sort((a, b) => a.name.localeCompare(b.name));
  display(sortedCustomers);
}
// ******************************************************************************************************


//-------------------------------------- Show Customer Chart---------------------------------------------
function showCustomerChart(customerId, customerName) {
  let transactions = Api.transactions.filter(transaction => transaction.customer_id == customerId);
  let dates = transactions.map(transaction => transaction.date);
  let amounts = transactions.map(transaction => transaction.amount);

  let ctx = document.getElementById('myChart').getContext('2d');
  
  // Destroy existing chart instance if it exists
  if (window.myChartInstance) {
    window.myChartInstance.destroy();
  }

  window.myChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: dates,
      datasets: [{
        label: `Transaction Amounts for ${customerName}`,
        data: amounts,
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

// ******************************************************************************************************