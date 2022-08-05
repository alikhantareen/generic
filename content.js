/**
 * we will have our main function, who will call every other function when needed.
 * major steps to follow:
 * 1 - let user select the cells
 * 2 - ask the user for the selection
 * 3 - download the excel file
 *
 * sequence wise steps
 * 1 - check if the extension is already running or starting from scratch
 * 2 - if already running, show the popup for user selection
 * 3 - if not, look for the desire table if webpage has multiple tables
 * 4 - let the user select for the cells and pagination button
 * 5 - after selection, show options for downloading file(By date, row, all data)
 * 6 - download the file
 *
 * Approach to follow
 * 1 - our code must be clean
 * 2 - avoid scope errors
 * 3 - make small functions for different tasks
 */

// script code goes below

//class GenericExtraction object
const script_object = new GenericExtraction();

//this code of block will look if the script has been ran before
if (localStorage.getItem("cells_selected")) {
    //if it ran, the selected cells will be displayed
    script_object.userSelection();
}

//this block of code is for listening the message
chrome.runtime.onMessage.addListener(function(request) {
    if (request.type === "runScript") {
        script_object.userSelection();
    }
    if (request.type === "downloadAllData") {
        script_object.allData();
    }
    if (request.type === "clear_reload") {
        localStorage.removeItem("CELL_ONE_KEY");
        localStorage.removeItem("CELL_TWO_KEY");
        localStorage.clear();
        location.reload();
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
    if(request.type === "uploaded") {
        script_object.uploaded();
    }
});