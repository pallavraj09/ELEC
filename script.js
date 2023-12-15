// Fetch and display data when the page loads
document.addEventListener("DOMContentLoaded", function () {
  displayDataFromLocalStorage();
});

// Variable to keep track of Main Meter Units Used
let mainMeterUnitsUsed = parseFloat(localStorage.getItem("mainMeterUnitsUsed")) || 0;

function calculate() {
  // Get selected user, year, month, and electricity units
  const selectedUser = document.getElementById("users").value;
  const selectedYear = document.getElementById("years").value;
  const selectedMonth = document.getElementById("months").value;
  const previousMonthReading = parseFloat(document.getElementById("previousMonthReading").value);
  const currentMonthReading = parseFloat(document.getElementById("currentMonthReading").value);

  // Check if readings are valid numbers
  if (isNaN(previousMonthReading) || isNaN(currentMonthReading) || currentMonthReading < previousMonthReading) {
    alert("Please enter valid meter readings.");
    return;
  }

  // Calculate electricity units and price
  const electricityUnits = currentMonthReading - previousMonthReading;
  const price = electricityUnits * 8;

  // Display electricity units and price in the table
  const newRow = document.createElement("tr");
  newRow.innerHTML = `
    <td>${selectedYear}</td>
    <td>${selectedMonth}</td>
    <td>${selectedUser}</td>
    <td>${previousMonthReading}</td>
    <td>${currentMonthReading}</td>
    <td>${electricityUnits}</td>
    <td>${price}</td>
    <td><button onclick="removeRow(this)">Remove</button></td>
  `;
  document.getElementById("tableBody").appendChild(newRow);

  // Update Unit used by users
  const unitUsedByUsers = parseFloat(document.getElementById("unitUsedByUsers").innerText) + electricityUnits;
  document.getElementById("unitUsedByUsers").innerText = unitUsedByUsers;

  // Update Main Meter Units Used outside the table
  mainMeterUnitsUsed += electricityUnits;
  document.getElementById("mainMeterUnitsUsed").innerText = mainMeterUnitsUsed;

  // Save the data to localStorage
  saveDataToLocalStorage(selectedYear, selectedMonth, selectedUser, previousMonthReading, currentMonthReading, electricityUnits, price);

  // Calculate and display the difference
  calculateDifference();
}

function calculateDifference() {
  // Get the Main Meter Units Used and Unit Used by Users
  const mainMeterUnitsUsed = parseFloat(document.getElementById("mainMeterUnitsUsed").innerText);
  const unitUsedByUsers = parseFloat(document.getElementById("unitUsedByUsers").innerText);

  // Calculate the difference
  const difference = mainMeterUnitsUsed - unitUsedByUsers;

  // Display the difference in the difference table
  const diffRow = document.createElement("tr");
  diffRow.innerHTML = `
    <td>${selectedYear}</td>
    <td>${selectedMonth}</td>
    <td>${mainMeterUnitsUsed}</td>
    <td>${unitUsedByUsers}</td>
    <td>${difference}</td>
  `;
  document.getElementById("differenceTableBody").appendChild(diffRow);

  // Reset Unit used by users and Main Meter Units Used to zero
  document.getElementById("unitUsedByUsers").innerText = 0;
  document.getElementById("mainMeterUnitsUsed").innerText = 0;
}

function removeRow(button) {
  // Get the row to be removed
  const row = button.parentNode.parentNode;

  // Remove the row from the table
  row.parentNode.removeChild(row);

  // Update localStorage after removing the row
  updateLocalStorage();
}

function saveDataToLocalStorage(year, month, user, prevReading, currReading, units, price) {
  // Retrieve existing data from localStorage
  const existingData = JSON.parse(localStorage.getItem("electricityData")) || [];

  // Add the new data to the array
  existingData.push({ year, month, user, prevReading, currReading, units, price });

  // Save the updated data back to localStorage
  localStorage.setItem("electricityData", JSON.stringify(existingData));
}

function updateLocalStorage() {
  // Get all rows from the table
  const tableRows = document.getElementById("tableBody").getElementsByTagName("tr");

  // Create an array to store the data
  const data = [];

  // Iterate through each row and extract data
  for (const row of tableRows) {
    const cells = row.getElementsByTagName("td");
    const year = cells[0].innerText;
    const month = cells[1].innerText;
    const user = cells[2].innerText;
    const prevReading = parseFloat(cells[3].innerText);
    const currReading = parseFloat(cells[4].innerText);
    const units = parseFloat(cells[5].innerText);
    const price = parseFloat(cells[6].innerText);

    data.push({ year, month, user, prevReading, currReading, units, price });
  }

  // Save the updated data back to localStorage
  localStorage.setItem("electricityData", JSON.stringify(data));
}

function displayDataFromLocalStorage() {
  // Retrieve data from localStorage
  const storedData = JSON.parse(localStorage.getItem("electricityData")) || [];

  // Get the table body
  const tableBody = document.getElementById("tableBody");

  // Clear existing rows
  tableBody.innerHTML = "";

  // Add rows for each stored entry
  storedData.forEach(entry => {
    const newRow = document.createElement("tr");
    newRow.innerHTML = `
      <td>${entry.year}</td>
      <td>${entry.month}</td>
      <td>${entry.user}</td>
      <td>${entry.prevReading}</td>
      <td>${entry.currReading}</td>
      <td>${entry.units}</td>
      <td>${entry.price}</td>
      <td><button onclick="removeRow(this)">Remove</button></td>
    `;
    tableBody.appendChild(newRow);
  });

  // Update Unit used by users
  const unitUsedByUsers = storedData.reduce((total, entry) => total + entry.units, 0);
  document.getElementById("unitUsedByUsers").innerText = unitUsedByUsers;

  // Update Main Meter Units Used outside the table
  document.getElementById("mainMeterUnitsUsed").innerText = mainMeterUnitsUsed;
}

function sortTable() {
  // Get the table body
  const tableBody = document.getElementById("tableBody");

  // Get all rows in the table body
  const rows = Array.from(tableBody.getElementsByTagName("tr"));

  // Sort the rows based on the year and then the month
  const sortedRows = rows.sort((a, b) => {
    const yearA = a.getElementsByTagName("td")[0].innerText;
    const monthA = a.getElementsByTagName("td")[1].innerText;
    const yearB = b.getElementsByTagName("td")[0].innerText;
    const monthB = b.getElementsByTagName("td")[1].innerText;

    if (yearA !== yearB) {
      return yearA - yearB;
    }

    return monthA.localeCompare(monthB);
  });

  // Remove all rows from the table body
  rows.forEach(row => tableBody.removeChild(row));

  // Append the sorted rows to the table body
  sortedRows.forEach(row => tableBody.appendChild(row));

  // Update localStorage after sorting the table
  updateLocalStorage();
}

function updateMainMeterUnitsUsed() {
  // Ask for previous and current month's main meter readings through a popup
  const previousMonthReading = prompt("Enter Previous Month Main Meter Units Used:");
  const currentMonthReading = prompt("Enter Current Month Main Meter Units Used:");

  // Validate the input
  if (
    previousMonthReading === null ||
    currentMonthReading === null ||
    isNaN(parseFloat(previousMonthReading)) ||
    isNaN(parseFloat(currentMonthReading))
  ) {
    alert("Please enter valid numbers for main meter units used.");
    return;
  }

  // Calculate the main meter units used
  const mainMeterUnitsUsed = parseFloat(currentMonthReading) - parseFloat(previousMonthReading);

  // Display the main meter units used outside the table
  document.getElementById("mainMeterUnitsUsed").innerText = mainMeterUnitsUsed;

  // Save the previous month's main meter units used to localStorage
  localStorage.setItem("previousMonthUnitsUsed", previousMonthReading);
}

function saveData() {
  // Save the current Main Meter Units Used and Unit Used by Users to another table
  const selectedYear = document.getElementById("years").value;
  const selectedMonth = document.getElementById("months").value;
  const mainMeterUnitsUsed = parseFloat(document.getElementById("mainMeterUnitsUsed").innerText);
  const unitUsedByUsers = parseFloat(document.getElementById("unitUsedByUsers").innerText);

  // Display the data in the difference table
  const diffRow = document.createElement("tr");
  diffRow.innerHTML = `
    <td>${selectedYear}</td>
    <td>${selectedMonth}</td>
    <td>${mainMeterUnitsUsed}</td>
    <td>${unitUsedByUsers}</td>
    <td>${mainMeterUnitsUsed - unitUsedByUsers}</td>
  `;
  document.getElementById("differenceTableBody").appendChild(diffRow);

  // Reset Unit used by users and Main Meter Units Used to zero
  document.getElementById("unitUsedByUsers").innerText = 0;
  document.getElementById("mainMeterUnitsUsed").innerText = 0;
}
