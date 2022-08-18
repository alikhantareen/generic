// script code goes below

//class GenericExtraction object
const script_object = new GenericExtraction();

//this code of block will look if the script has been ran before
if (localStorage.getItem("cells_selected")) {
  //if it ran, the selected cells will be displayed
  script_object.userSelection();
}

//this block of code is for listening the message
chrome.runtime.onMessage.addListener(function (request) {
  if (request.type === "runScript") {
    script_object.userSelection();
  }
  if (request.type === "downloadAllData") {
    script_object.allData();
  }
  if (request.type === "clear_reload") {
    chrome.storage.local.remove(["startSet"], function () {
      var error = chrome.runtime.lastError;
      if (error) {
        console.error(error);
      }
      localStorage.removeItem("CELL_ONE_KEY");
      localStorage.removeItem("CELL_TWO_KEY");
      localStorage.clear();
      location.reload();
    });
  }
  if (request.type === "rows_data") {
    script_object.obj.rows_num = request.data;
    script_object.fetchRowsData(script_object.obj.rows_num);
  }
  if (request.type === "date_data") {
    script_object.obj.user_date = request.data;
    script_object.dateDataDownloader(script_object.obj.user_date);
  }
  if (request.type === "date_select") {
    script_object.dateIndexReturn();
  }
  if (request.type === "uploaded") {
    script_object.uploaded();
  }
});
