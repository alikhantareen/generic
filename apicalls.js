//this function is used for logging the user in.
function login() {
  let userData = {
    username: document.getElementById("username").value,
    password: document.getElementById("password").value,
    type: "main",
  };

  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VybmFtZSI6Imdvb2dsZXRlc3QiLCJFbWFpbCI6Im9hdXRodGVzdDEyMUBnbWFpbC5jb20iLCJHcm91cElkIjoiIiwiVXNlcklkIjoiMjczNiIsIklzQWRtaW4iOiJGYWxzZSIsIm5iZiI6MTY1Nzc5MTcwNSwiZXhwIjoxNjU4Mzk2NTA1LCJpYXQiOjE2NTc3OTE3MDV9.xkZYv7g3JKWM7r7Zmf09AuBzhTNXOgbnG2ZcWHw1tr4";

  fetch("https://spotncenter.net/api/User/Authenticate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      if (!data.email) {
        document.getElementById("error").style.display = "block";
        document.getElementById("error").innerText = data.message;
        error();
      } else {
        //chrome.storage
        localStorage.setItem("user", data.email);
        // localStorage.setItem("token", data.token);
        // localStorage.setItem("user_id", data.id);
        chrome.storage.sync.set({ token: data.token }, function () {
          console.log("Token is set to " + data.token);
        });
        chrome.storage.sync.set({ user_id: data.id }, function () {
          console.log("user_id is set to " + data.id);
        });
        introScreen();
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

//this api will use for uploading and authenticating the user
function postData(rowsToUpload) {
  let arrayOfObjects = arr2obj(rowsToUpload);
  let token = "";
  let obj = {};
  chrome.storage.sync.get(["token"], function (result) {
    token = result.token;
  });
  chrome.storage.sync.get(["user_id"], function (result) {
    obj = {
      createdDate: new Date().getTime(),
      FileId: 0,
      user_id: result.user_id,
    };
    fetch("https://spotncenter.net/api/Files", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(obj),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.results.user_id) {
          let obj = {
            status: "new",
            fileId: data.results.fileId,
            list: arrayOfObjects,
          };
          fetch("https://spotncenter.net/api/Csv", {
            method: "POST",
            headers: {
              "Content-type": "application/json",
              Authorization: "Bearer " + token,
            },
            body: JSON.stringify(obj),
          })
            .then((res) => res.json())
            .then((data) => {
              if (!data) {
                alert("Please wait...");
              } else {
                messagePassing("uploaded")
              }
            })
            .catch((err) => {
              console.warn(err);
            });
        } else {
          console.warn("no response");
        }
      })
      .catch((err) => {
        console.warn(err);
      });
  });
}

//this function will be used to make objects from the array
function arr2obj(arr) {
  let arrofobj = [];
  arr.forEach((v) => {
    // Create an empty object
    let obj = {};
    // Extract the key and the value
    let itemID = v[0];
    let link = v[1];

    // Add the key and value to
    // the object
    obj["item_id"] = itemID;
    obj["marketplace"] = null;
    obj["supplier_link"] = link;
    obj["supplier_item_name"] = null;
    obj["link_fetched_name"] = null;
    obj["link_fetched_description"] = null;
    obj["link_fetched_price"] = null;
    //push the object into the array
    arrofobj.push(obj);
  });
  // Return the array of object
  return arrofobj;
}