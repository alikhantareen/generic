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
