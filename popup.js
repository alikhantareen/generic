//Conditions on which different screens will be displayed
if (
  localStorage.getItem("user") &&
  localStorage.getItem("startClicked") &&
  localStorage.getItem("proceed")
) {
  try {
    console.log("logging from the if statement");
    chrome.storage.sync.get(["scrappedRows"], function (result) {
      let table = tableMaker(result.scrappedRows);
      container.appendChild(table);
      localStorage.setItem("rowdisplay", true);
      rowScreenDisplay();
    });
  } catch (error) {
    alert(error);
  }
} else if (
  localStorage.getItem("user") &&
  localStorage.getItem("startClicked")
) {
  showOptionsScreen();
} else if (localStorage.getItem("user")) {
  introScreen();
} else if (localStorage.getItem("startClicked")) {
  showOptionsScreen();
} else {
  loginScreen();
}

//constants to be used
const startbtn = document.getElementById("startButton");
const allDatabtn = document.getElementById("allData");
const clearLsbtn = document.getElementById("clrlocal");
const show_rows_screen = document.getElementById("rowsData");
const proceedBtn = document.getElementById("rowsScreenbutton");
const show_date_screen = document.getElementById("dateData");
const download_date_data = document.getElementById("dateDataDownload");
const logInScreen = document.getElementsByClassName("formContainer");
const container = document.getElementById("rowContainer");
const down = document.getElementById("down");
const up = document.getElementById("upload");
const back = document.getElementById("backbtn");
const totalRows = document.getElementById("totalRows");
const errorInput = document.getElementById('errorInput');

//hiding the buttons
allDatabtn.style.display = "none";
show_date_screen.style.display = "none";

//below are the listeners on different elements
back.addEventListener("click", () => {
  container.removeChild(container.childNodes[container.childNodes.length - 1]);
  localStorage.removeItem("proceed");
  showOptionsScreen();
});

clearLsbtn.addEventListener("click", () => {
  messagePassing("clear_reload");
  localStorage.removeItem("startClicked");
  localStorage.removeItem("dateSelected");
  localStorage.removeItem("rowdisplay");
  introScreen();
});

startbtn.addEventListener("click", () => {
  localStorage.setItem("startClicked", true);
  messagePassing("runScript");
});

show_rows_screen.addEventListener("click", () => {
  showRowsScreen();
});

show_date_screen.addEventListener("click", () => {
  const value = JSON.parse(localStorage.getItem("dateSelected"));
  if (value) {
    showDateScreen();
  } else {
    alert("Select the date cell and enter the date in the popup");
    messagePassing("date_select");
    localStorage.setItem("dateSelected", true);
  }
});

proceedBtn.addEventListener("click", () => {
  let rows = document.getElementById("rowsNumber").value;
  if (rows === " " || rows < 0 || rows === "") {
    errorInput.innerText = "Invalid input!";
  } else {
    localStorage.setItem("proceed", true);
    messagePassing("rows_data", rows);
    chrome.storage.sync.get(["scrappedRows"], function (result) {
      let table = tableMaker(result.scrappedRows);
      container.appendChild(table);
      totalRows.innerText = `Total rows : ${table.rows.length}`;
      localStorage.setItem("rowdisplay", true);
      rowScreenDisplay();
    });
  }
});

download_date_data.addEventListener("click", () => {
  let date = document.getElementById("datepick").value;
  messagePassing("date_data", date);
});

allDatabtn.addEventListener("click", () => {
  messagePassing("downloadAllData");
});

document.querySelector("#loginform").addEventListener("submit", function (e) {
  // Prevent the form from submitting
  e.preventDefault();
  // login() will be called when the form is submitted
  document.getElementById("submit").style.background = "#2c963f";
  document.getElementById("submit").innerText = "Logging you in...";
  login();
});

document.getElementById("logoutbutton").addEventListener("click", () => {
  messagePassing("clear_reload");
  localStorage.removeItem("startClicked");
  localStorage.removeItem("dateSelected");
  localStorage.removeItem("user");
  error();
  loginScreen();
});

document
  .getElementById("showPasswordFunction")
  .addEventListener("click", () => {
    var x = document.getElementById("password");
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
  });

down.addEventListener("click", () => {
  try {
    let table = document.getElementById("generic_data_extraction");
    let rows = getRowsTable(table);
    let newTable = tableMaker(rows);
    document.getElementById("down").style.background = "#2c963f";
    document.getElementById("down").innerText = "Downloading...";
    html_table_to_excel(newTable, "xlsx");
  } catch (error) {
    alert(error);
  }
});

up.addEventListener("click", () => {
  try {
    let table = document.getElementById("generic_data_extraction");
    let rows = getRowsTable(table);
    document.getElementById("upload").style.background = "#2c963f";
    document.getElementById("upload").innerText = "Uploading...";
    postData(rows);
  } catch (error) {
    alert(error);
  }
});

//this function will be used to display table
function tableMaker(rowsData) {
  let table = document.createElement("table");
  table.setAttribute("id", "generic_data_extraction");
  let thead = document.createElement("thead");
  let tbody = document.createElement("tbody");
  let theadrow = document.createElement("tr");
  let theadrowData_1 = document.createElement("td");
  let theadrowData_2 = document.createElement("td");
  theadrowData_1.innerHTML = "Item_Id";
  theadrowData_2.innerHTML = "Supplier Link";
  theadrow.appendChild(theadrowData_1);
  theadrow.appendChild(theadrowData_2);
  thead.appendChild(theadrow);

  // table.appendChild(thead);
  table.appendChild(thead);
  table.appendChild(tbody);

  for (let i = 0; i < rowsData.length; i++) {
    let row = document.createElement("tr");
    let rowData_1 = document.createElement("td");
    rowData_1.innerHTML = rowsData[i][0];
    let rowData_2 = document.createElement("td");
    rowData_2.innerHTML = rowsData[i][1];
    let btn = document.createElement("button");
    btn.setAttribute("class", "deleteRowbtn");
    btn.innerText = "remove row";
    //this listener will be used to remove the row from the html table
    btn.addEventListener("click", (e) => {
      let tr = e.target.parentNode;
      tr.parentNode.removeChild(tr);
    });
    row.appendChild(rowData_1);
    row.appendChild(rowData_2);
    row.appendChild(btn);
    tbody.appendChild(row);
  }
  return table;
}

//this function will be used to download xlsx file
function html_table_to_excel(table, type = "xlsx") {
  var data = table;

  var file = XLSX.utils.table_to_book(data, { sheet: "sheet1" });

  XLSX.write(file, { bookType: type, bookSST: true, type: "base64" });

  XLSX.writeFile(file, "orders_excel." + type);
}

function getRowsTable(table) {
  /* Declaring array variable */
  let rows = [];

  //iterate through rows of table
  for (let i = 1; i < table.rows.length; i++) {
    let column1 = "";
    let column2 = "";
    column1 = table.rows[i].cells[0].innerText;
    column2 = table.rows[i].cells[1].innerText;
    /* add a new records in the array */
    rows.push([column1.split("\n\n").join(""), column2.split("\n\n").join("")]);
  }
  return rows;
}

//error display function
function error() {
  document.getElementById("submit").style.background = "#1b5c27";
  document.getElementById("submit").innerText = "Log in";
}

//this function is used to pass the message from html script to content script
function messagePassing(msg, data = 0) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { type: msg, data: data });
  });
}

//below are the functions used to display the screens on different conditions
function loginScreen() {
  document.getElementById("formContainer").style.display = "flex";
  document.getElementById("mainScreen").style.display = "none";
  document.getElementById("optionsScreen").style.display = "none";
  document.getElementById("rowsScreen").style.display = "none";
  document.getElementById("dateScreen").style.display = "none";
  document.getElementById("displayrow").style.display = "none";
}

function introScreen() {
  document.getElementById("formContainer").style.display = "none";
  document.getElementById("mainScreen").style.display = "flex";
  document.getElementById("optionsScreen").style.display = "none";
  document.getElementById("rowsScreen").style.display = "none";
  document.getElementById("dateScreen").style.display = "none";
  document.getElementById("displayrow").style.display = "none";
}

function showOptionsScreen() {
  document.getElementById("formContainer").style.display = "none";
  document.getElementById("mainScreen").style.display = "none";
  document.getElementById("optionsScreen").style.display = "flex";
  document.getElementById("rowsScreen").style.display = "none";
  document.getElementById("dateScreen").style.display = "none";
  document.getElementById("displayrow").style.display = "none";
}

function showRowsScreen() {
  document.getElementById("formContainer").style.display = "none";
  document.getElementById("mainScreen").style.display = "none";
  document.getElementById("optionsScreen").style.display = "none";
  document.getElementById("rowsScreen").style.display = "flex";
  document.getElementById("dateScreen").style.display = "none";
  document.getElementById("displayrow").style.display = "none";
}

function showDateScreen() {
  document.getElementById("formContainer").style.display = "none";
  document.getElementById("mainScreen").style.display = "none";
  document.getElementById("optionsScreen").style.display = "none";
  document.getElementById("rowsScreen").style.display = "none";
  document.getElementById("dateScreen").style.display = "flex";
  document.getElementById("displayrow").style.display = "none";
}

function rowScreenDisplay() {
  document.getElementById("formContainer").style.display = "none";
  document.getElementById("mainScreen").style.display = "none";
  document.getElementById("optionsScreen").style.display = "none";
  document.getElementById("rowsScreen").style.display = "none";
  document.getElementById("dateScreen").style.display = "none";
  document.getElementById("displayrow").style.display = "flex";
}
