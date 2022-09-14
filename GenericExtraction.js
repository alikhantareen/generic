class GenericExtraction {
  constructor() {
    this.CELL_ONE_KEY = "cell_one_index";
    this.CELL_TWO_KEY = "cell_two_index";
    this.obj = {
      paginationButtons: "",
      paginationButtonsLength: [],
      user_selections: [],
      tableHeadingsInnerTextArray: [],
      autoDsNextButton: "",
      flag: false,
      rows_num: 0,
      user_date: 0,
      alert: true,
      dateIndex: "",
      dynamicRows: [],
    };
  }

  //these are the methods that have been added and changed accordingly.
  alertUser() {
    if (this.obj.alert) {
      alert(
        "Selection process has been done. Please choose the options from the popup OR clear selections to start from scratch"
      );
      this.obj.alert = false;
    } else {
    }
  }

  uploaded() {
    alert("Data has been uploaded.");
  }

  disablingClick() {
    let arr = [];
    let links = document.links;
    document.querySelectorAll("*").forEach((node) => {
      if (
        node.tagName === "TR" ||
        node.className === "ant-pagination" ||
        node.className === "pagination"
      ) {
        arr.push(node);
      } else {
        node.style.pointerEvents = "none";
      }
    });

    for (let i = 0; i < links.length; i++) {
      links[i].style.pointerEvents = "none";
    }

    arr.forEach((elem) => {
      if (
        elem.className === "pagination" ||
        elem.className === "ant-pagination" ||
        elem.className === "dataTables_paginate"
      ) {
        elem.querySelectorAll("*").forEach((el) => {
          el.querySelectorAll("*").forEach((e) => {
            if (e.innerText === "1") {
              e.style.pointerEvents = "auto";
            } else {
            }
          });
        });
      }
    });

    arr.forEach((n) => {
      n.querySelectorAll("*").forEach((e) => {
        e.style.pointerEvents = "auto";
      });
    });

    if (window.location.href === "https://platform.autods.com/orders") {
      let c = document.getElementsByClassName("ellipsis");
      let icn = document.getElementsByClassName("site-icn");

      for (let i = 0; i < c.length; i++) {
        c[i].style.pointerEvents = "none";
      }
      for (let i = 0; i < icn.length; i++) {
        icn[i].style.pointerEvents = "none";
      }
    }
  }

  enablingClicks() {
    document.querySelectorAll("*").forEach((node) => {
      node.style.pointerEvents = "auto";
    });
  }

  async userSelection() {
    try {
      this.disablingClick();
      const exist = await this.waitForElm("table");
      let vars = this.table_manipulate("table");
      let table = vars.table;
      let classNameToCapture = "";
      let tableHeadings = document.querySelectorAll("table thead tr th");
      let tableCellsInnerText = [];
      let running_alert = true;
      let windowClickedElems = [];
      let winClickLastElem = "";

      // this loop is extracting the innerText from the table headings
      for (let i = 0; i < tableHeadings.length; i++) {
        this.obj.tableHeadingsInnerTextArray.push(tableHeadings[i].innerText);
      }

      //this block of code is for extracting the cells inner text
      for (let i = 0; i < vars.tableCellsLength.length; i++) {
        tableCellsInnerText.push(vars.tableCellsLength[i].innerText);
      }

      if (!localStorage.getItem("cellsInnerText")) {
        localStorage.setItem(
          "cellsInnerText",
          JSON.stringify(tableCellsInnerText)
        );
      } else {
      }
      if (document.querySelector("table")) {
        if (localStorage.getItem("cells_selected")) {
          running_alert = false;
          alert(
            "Selection process has been done. Please choose the options from the popup OR clear selections to start from scratch"
          );
          this.obj.paginationButtons = document.querdySelectorAll(
            localStorage.getItem("nextButtonClassName")
          );
          table.rows[1].style.backgroundColor = "white";
          table.rows[1].cells[
            localStorage.getItem(this.CELL_ONE_KEY)
          ].style.backgroundColor = "green";
          table.rows[1].cells[
            localStorage.getItem(this.CELL_TWO_KEY)
          ].style.backgroundColor = "green";
          table.rows[1].cells[
            localStorage.getItem(this.CELL_ONE_KEY)
          ].style.color = "white";
          table.rows[1].cells[
            localStorage.getItem(this.CELL_TWO_KEY)
          ].style.color = "white";
        }
        if (running_alert) {
          alert(
            "The extension is running now, select any two cells from the highlighted table & click on the first button of pagination"
          );
        }
        table.rows[1].addEventListener("click", (e) => {
          if (localStorage.getItem("cells_selected")) {
          } else {
            if (this.obj.user_selections.length < 3) {
              e.target.style.backgroundColor = "green";
              e.target.style.color = "white";
            }
            this.obj.user_selections.push(e.target);
          }
          if (this.obj.user_selections.length === 2) {
            table.rows[1].style.backgroundColor = "white";
            this.enablingClicks();
            alert(
              "Please select the pagination buttons element from the page!"
            );
            window.addEventListener("click", this.respond(), true);
          }
        });
      } else {
        alert("Table not found");
      }
    } catch (error) {
      alert(
        "OOPS! Unexpected error. Refresh the page and continue again. " + error
      );
    }
  }

  respond() {
    return (elem) => {
      if (!localStorage.getItem("capturedBtn")) {
        elem.stopPropagation();
        elem.stopImmediatePropagation();
        elem.preventDefault();
      }

      let btnClass = unique(elem.target);
      if (localStorage.getItem("nextButtonClassName")) {
        this.obj.paginationButtons = document.querySelectorAll(
          localStorage.getItem("nextButtonClassName")
        );
      } else {
        localStorage.setItem("nextButtonClassName", btnClass);
        this.obj.paginationButtons = document.querySelectorAll(
          localStorage.getItem("nextButtonClassName")
        );
      }
      chrome.storage.local.set({ startSet: true }, function () {
        console.log("");
      });
      localStorage.setItem("capturedBtn", true);
      this.alertUser();
      window.removeEventListener("click", this.respond, true);
    };
  }

  waitForElm(selector) {
    return new Promise((resolve) => {
      if (document.querySelector(selector)) {
        return resolve(true);
      }

      const observer = new MutationObserver((mutations) => {
        if (document.querySelector(selector)) {
          resolve(true);
          observer.disconnect();
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
    });
  }

  tableIndexReturn(tables) {
    for (let i = 0; i < tables.length; i++) {
      if (tables[i].rows[3]) {
        return i;
      } else {
        continue;
      }
    }
  }

  table_manipulate(selector) {
    let tableCellsLength = [];
    let table = "";
    let tableIndex = "";
    if (document.querySelectorAll(selector).length > 1) {
      tableIndex = this.tableIndexReturn(document.querySelectorAll(selector));
      table = document.querySelectorAll(selector)[tableIndex];
      table.rows[1].style.background = "gray";
      table.style.color = "black";
      tableCellsLength = table.rows[1].cells;
    } else {
      table = document.querySelector(selector);
      table.rows[1].style.background = "gray";
      table.style.color = "black";
      tableCellsLength = table.rows[1].cells;
    }
    return {
      table: table,
      tableCellsLength: tableCellsLength,
    };
  }

  makingOfTable(rowsData) {
    let returned_indexes = [];
    let cellInnerText = "";
    if (this.obj.user_selections.length === 0) {
      returned_indexes[0] = localStorage.getItem(this.CELL_ONE_KEY);
      returned_indexes[1] = localStorage.getItem(this.CELL_TWO_KEY);
    } else {
      cellInnerText = JSON.parse(localStorage.getItem("cellsInnerText"));
      returned_indexes = this.matchedIndexes(
        cellInnerText,
        this.obj.user_selections
      );
      if (window.location.href === "https://platform.autods.com/orders") {
        returned_indexes[0] += parseInt(18);
        returned_indexes[1] += parseInt(18);
      }
    }
    let table = document.createElement("table");
    table.setAttribute("id", "generic_data_extraction");
    let thead = document.createElement("thead");
    let tbody = document.createElement("tbody");
    let theadrow = document.createElement("tr");
    let theadrowData_1 = document.createElement("td");
    theadrowData_1.innerHTML =
      this.obj.tableHeadingsInnerTextArray[returned_indexes[0]];
    let theadrowData_2 = document.createElement("td");
    theadrowData_2.innerHTML =
      this.obj.tableHeadingsInnerTextArray[returned_indexes[1]];
    theadrow.appendChild(theadrowData_1);
    theadrow.appendChild(theadrowData_2);
    thead.appendChild(theadrow);

    // table.appendChild(thead);
    table.appendChild(thead);
    table.appendChild(tbody);

    for (let i = 0; i < rowsData.length; i++) {
      if (
        rowsData[i][0] ===
          this.obj.tableHeadingsInnerTextArray[returned_indexes[0]] ||
        rowsData[i][1] ===
          this.obj.tableHeadingsInnerTextArray[returned_indexes[1]]
      ) {
        continue;
      } else {
        let row = document.createElement("tr");
        let rowData_1 = document.createElement("td");
        rowData_1.innerHTML = rowsData[i][0];
        let rowData_2 = document.createElement("td");
        rowData_2.innerHTML = rowsData[i][1];
        row.appendChild(rowData_1);
        row.appendChild(rowData_2);
        tbody.appendChild(row);
      }
    }
    return table;
  }

  matchedIndexes(arr1, arr2) {
    let ar2 = [];
    ar2.push(arr2[0].innerText);
    ar2.push(arr2[1].innerText);
    let indexesReturned = [];
    for (let i = 0; i < ar2.length; i++) {
      for (let j = 0; j < arr1.length; j++) {
        if (ar2[i].replace("\n", "") === arr1[j].replace("\n", "")) {
          indexesReturned.push(j);
        }
      }
    }
    return indexesReturned;
  }

  async allData() {
    let len = this.getting_buttons_length(this.obj.paginationButtons);
    let NextButton = "";
    let dynamicRows = [];
    for (let i = 0; i < len.length; i++) {
      const ex = await this.waitForElm("table");
      let table_manipulate_obj = this.table_manipulate("table");
      let table = table_manipulate_obj.table;
      if (this.obj.flag) {
        NextButton = this.obj.autoDsNextButton;
      } else {
        this.obj.paginationButtons = document.querySelectorAll(
          localStorage.getItem("nextButtonClassName")
        );
        if (this.NextButtonCapture(this.obj.paginationButtons)) {
          NextButton = this.NextButtonCapture(this.obj.paginationButtons);
        } else {
          NextButton =
            this.obj.paginationButtons[this.obj.paginationButtons.length - 1];
        }
      }
      dynamicRows = [...dynamicRows, ...this.rowsReturn(table)];
      if (
        NextButton.classList[NextButton.classList.length - 1] === "disabled"
      ) {
        break;
      } else {
        NextButton.click();
      }
    }
    this.promptOption(dynamicRows, this.obj.user_selections);
  }

  promptOption(incomingRows, select) {
    let choice = prompt(
      "Press 1 to download, 2 to upload the data and 3 to download and upload."
    );
    if (choice === "1") {
      let globalTable = this.makingOfTable(incomingRows, select);
      this.html_table_to_excel(globalTable, "xlsx");
    } else if (choice === "2") {
      this.postData(incomingRows);
    } else if (choice === "3") {
      this.obj.dataChecker = false;
      this.postData(incomingRows);
      let globalTable = this.makingOfTable(incomingRows, select);
      this.html_table_to_excel(globalTable, "xlsx");
      alert("Data has been downloaded and uploaded!");
    } else if (choice === null || choice === "") {
      console.log("Terminated");
    } else {
      this.promptOption();
    }
  }

  getting_buttons_length(btn) {
    for (let i = 0; i < btn.length; i++) {
      if (
        btn[i].innerText === "First" ||
        btn[i].innerText === "Previous" ||
        btn[i].innerText === "Next" ||
        btn[i].innerText === "Last" ||
        btn[i].innerText === "<" ||
        btn[i].innerText === ">" ||
        btn[i].innerText === "..." ||
        btn[i].innerText === "←" ||
        btn[i].innerText === "→"
      ) {
        continue;
      } else {
        this.obj.paginationButtonsLength.push(btn[i]);
      }
    }
    return this.obj.paginationButtonsLength;
  }

  rowsReturn(table) {
    let returned_index = "";
    let cellInnerText = "";
    if (!localStorage.getItem(this.CELL_ONE_KEY)) {
      this.setting_indexes(returned_index, cellInnerText);
    }

    /* Declaring array variable */
    let rows = [];

    //iterate through rows of table
    for (let i = 0; i < table.rows.length; i++) {
      let column1 = "";
      let column2 = "";
      column1 =
        table.rows[i].cells[localStorage.getItem(this.CELL_ONE_KEY)].innerText;
      if (i === 0) {
        column2 =
          table.rows[i].cells[localStorage.getItem(this.CELL_TWO_KEY)]
            .innerText;
      } else {
        if (
          table.rows[i].cells[localStorage.getItem(this.CELL_TWO_KEY)]
            .querySelector("a")
            .getAttribute("href")
        ) {
          column2 = table.rows[i].cells[localStorage.getItem(this.CELL_TWO_KEY)]
            .querySelector("a")
            .getAttribute("href");
        } else {
          column2 = "No link found";
        }
      }

      /* add a new records in the array */
      rows.push([
        column1.split("\n\n").join(""),
        column2.split("\n\n").join(""),
      ]);
    }
    return rows;
  }
  async fetchRowsData(number_of_rows) {
    try {
      // let len = this.getting_buttons_length(this.obj.paginationButtons);
      let rows = [];
      let NextButton =
        this.obj.paginationButtons[this.obj.paginationButtons.length - 1];
      while (true) {
        if (NextButton.tagName === "A" || NextButton.tagName === "BUTTON") {
          break;
        } else {
          NextButton = NextButton.parentNode;
        }
      }
      debugger;
      while (true) {
        const ex = await this.waitForElm("table");
        if (ex) {
          let table_manipulate_obj = this.table_manipulate("table");
          let table = table_manipulate_obj.table;
          let x = this.getSpecificRowsTable(
            table,
            number_of_rows - rows.length
          );
          rows = [...rows, ...x];
          if (rows.length === parseInt(number_of_rows)) {
            break;
          }
          if (
            NextButton.classList[NextButton.classList.length - 1] === "disabled"
          ) {
            break;
          } else {
            NextButton.click();
          }
        } else {
          console.log("Something");
        }
      }
      chrome.runtime.sendMessage({ type: "rows", data: rows });
    } catch (error) {
      alert(
        "OOPS! Unexpected error. Refresh the page and continue again. " + error
      );
    }
  }

  getSpecificRowsTable(table, u) {
    /* Declaring array variable */
    let rows = [];
    let userRows = u;
    let returned_indexes = "";
    let cellInnerText = "";

    if (!localStorage.getItem(this.CELL_ONE_KEY)) {
      this.setting_indexes(returned_indexes, cellInnerText);
    }

    //iterate through rows of table
    for (let i = 1; i < table.rows.length; i++) {
      let column1 = "";
      let column2 = "";
      if (i === 0) {
      } else {
        column1 =
          table.rows[i].cells[localStorage.getItem(this.CELL_ONE_KEY)]
            .innerText;
        if (
          table.rows[i].cells[
            localStorage.getItem(this.CELL_TWO_KEY)
          ].querySelector("a") === undefined ||
          table.rows[i].cells[
            localStorage.getItem(this.CELL_TWO_KEY)
          ].querySelector("a") === null
        ) {
          column2 = "No link found";
        } else {
          column2 = table.rows[i].cells[localStorage.getItem(this.CELL_TWO_KEY)]
            .querySelector("a")
            .getAttribute("href");
        }
      }

      /* add a new records in the array */
      if (
        table.rows[i].cells[localStorage.getItem(this.CELL_ONE_KEY)]
          .innerText ===
          this.obj.tableHeadingsInnerTextArray[
            localStorage.getItem(this.CELL_ONE_KEY)
          ] ||
        table.rows[i].cells[localStorage.getItem(this.CELL_TWO_KEY)]
          .innerText ===
          this.obj.tableHeadingsInnerTextArray[
            localStorage.getItem(this.CELL_TWO_KEY)
          ]
      ) {
        continue;
      } else {
        rows.push([
          column1.split("\n\n").join(""),
          column2.split("\n\n").join(""),
        ]);
      }

      if (rows.length === parseInt(userRows)) {
        return rows;
      } else {
        continue;
      }
    }
    return rows;
  }

  setting_indexes(indexes_variable, innerTextArray) {
    innerTextArray = JSON.parse(localStorage.getItem("cellsInnerText"));
    indexes_variable = this.matchedIndexes(
      innerTextArray,
      this.obj.user_selections
    );
    localStorage.setItem(this.CELL_ONE_KEY, indexes_variable[0]);
    localStorage.setItem(this.CELL_TWO_KEY, indexes_variable[1]);
  }

  async dateDataDownloader(date) {
    let userDate = date;
    let returned_indexes = [];
    let len = this.getting_buttons_length(this.obj.paginationButtons);
    let NextButton = "";
    let datesArray = [];
    let dateRow = [];
    let cellInnerText = "";
    if (this.obj.user_selections.length === 0) {
      returned_indexes[0] = localStorage.getItem(this.CELL_ONE_KEY);
      returned_indexes[1] = localStorage.getItem(this.CELL_TWO_KEY);
    } else {
      cellInnerText = JSON.parse(localStorage.getItem("cellsInnerText"));
      returned_indexes = this.matchedIndexes(
        cellInnerText,
        this.obj.user_selections
      );
    }
    for (let i = 0; i < len.length; i++) {
      const ex = await this.waitForElm("table");
      let table_manipulate_obj = this.table_manipulate("table");
      let table = table_manipulate_obj.table;
      this.obj.paginationButtons = document.querySelectorAll(
        localStorage.getItem("nextButtonClassName")
      );
      if (this.obj.flag) {
        NextButton = this.obj.autoDsNextButton;
      } else {
        this.obj.paginationButtons = document.querySelectorAll(
          localStorage.getItem("nextButtonClassName")
        );
        if (this.NextButtonCapture(this.obj.paginationButtons)) {
          NextButton = this.NextButtonCapture(this.obj.paginationButtons);
        } else {
          NextButton =
            this.obj.paginationButtons[this.obj.paginationButtons.length - 1];
        }
      }
      if (userDate) {
        datesArray = this.dateRowsReturn(table);
        datesArray.forEach((e, i) => {
          userDate = new Date(userDate);
          e = new Date(e);
          if (e.getTime() >= userDate.getTime()) {
            let column1 = "";
            let column2 = "";
            column1 =
              table.rows[i].cells[localStorage.getItem(this.CELL_ONE_KEY)]
                .innerText;
            if (i === 0) {
              table.rows[i].cells[localStorage.getItem(this.CELL_TWO_KEY)]
                .innerText;
            } else {
              column2 = table.rows[i].cells[
                localStorage.getItem(this.CELL_TWO_KEY)
              ]
                .querySelector("a")
                .getAttribute("href");
            }

            /* add a new records in the array */
            dateRow.push([
              column1.split("\n\n").join(""),
              column2.split("\n\n").join(""),
            ]);
          } else {
          }
        });
      }
      if (
        NextButton.classList[NextButton.classList.length - 1] === "disabled"
      ) {
        break;
      } else {
        NextButton.click();
      }
    }
    this.promptOption(dateRow, this.obj.user_selections);
  }

  dateRowsReturn(table) {
    let tableCellsInnerText = JSON.parse(
      localStorage.getItem("cellsInnerText")
    );
    let dateIndex = this.obj.dateIndex;
    tableCellsInnerText.forEach((e, i) => {
      if (e === dateIndex) {
        dateIndex = i;
      } else {
      }
    });
    /* Declaring array variable */
    let rows = [];

    //iterate through rows of table
    for (let i = 0; i < table.rows.length; i++) {
      let column1 = table.rows[i].cells[dateIndex].innerText;

      /* add a new records in the array */
      if (column1 === this.obj.tableHeadingsInnerTextArray[dateIndex]) {
        continue;
      } else {
        rows.push(
          column1.split("\n\n").join("").replace("\n", "").slice(0, 10)
        );
      }
    }
    return rows;
  }

  dateIndexReturn() {
    let table_manipulate_obj = this.table_manipulate("table");
    let table = table_manipulate_obj.table;
    table.rows[1].addEventListener("click", (e) => {
      this.obj.dateIndex = e.target.innerText;
      e.target.style.backgroundColor = "green";
      e.target.style.color = "white";
      table.style.background = "white";
    });
  }
}
