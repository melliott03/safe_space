var config = require("../../shared/config");
var fetchModule = require("fetch");
var Observable = require("data/observable").Observable;


function User(info) {
    info = info || {};

    // You can add properties to observables on creation
    var viewModel = new Observable({
        email: info.email || "",
        password: info.password || ""
    });

    viewModel.login = function() {
        return fetchModule.fetch(config.apiUrl + "api/authenticate", {//get auth token
            method: "POST",
            body: JSON.stringify({
                email: viewModel.get("email"),
                username: viewModel.get("email"),
                password: viewModel.get("password"),
                grant_type: "password"
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(handleErrors)
        .then(function(response) {
            // console.log('response.json():::::', JSON.stringify(response));
            return response.json();
        })
        .then(function(data) {
            // console.log('data.Result.access_token::::: '+ data.Result.access_token);
            config.token = data.token;
            // console.log('data:::::: ', JSON.stringify(data));
            // console.log('data:::::: ', config.token);
        });
    };

    viewModel.register = function() {
        return fetchModule.fetch(config.apiUrl + "register", { //config.apiUrl + "Users",
            method: "POST",
            body: JSON.stringify({
                username: viewModel.get("email"),
                email: viewModel.get("email"),
                password: viewModel.get("password")
            }),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(handleErrors);
    };

    viewModel.postSocketID = function(socketID) {
      console.log('inside postSocketID, socketID::', socketID);
      // console.log('inside postSocketID, socketID.socketid::', socketID.socketid);

      // var socketInfo = {socketid: socketID};
        return fetchModule.fetch(config.apiUrl + "updateUserSocketIdmobile", {//get auth token
            method: "POST",
            body: JSON.stringify({
                socketidit: ''+socketID
            }),
            headers: {
              "Authorization": "" + config.token,
              "Content-Type": "application/json"
            }
        })
        .then(handleErrors)
        .then(function(response) {
            // console.log('response.json():::::', JSON.stringify(response));
            return response.json();
        })
        .then(function(data) {
            console.log('return data in postSocketID::::: '+ data);
            // config.token = data.token;
            // console.log('data:::::: ', JSON.stringify(data));
            // console.log('data:::::: ', config.token);
        });
    };

    viewModel.postWorkID = function(workID) {
      console.log('inside postWorkID, workID::', workID);
      // console.log('inside postWorkID, workID.socketid::', workID.socketid);

      // var socketInfo = {socketid: workID};
        return fetchModule.fetch(config.apiUrl + "work/mobileWork", {//get auth token
            method: "POST",
            body: JSON.stringify({
                workID: ''+workID
            }),
            headers: {
              "Authorization": "" + config.token,
              "Content-Type": "application/json"
            }
        })
        .then(handleErrors)
        .then(function(response) {
            // console.log('response.json():::::', JSON.stringify(response));
            return response.json();
        })
        .then(function(data) {
            console.log('return data in postWorkID::::: ', data);
            // config.token = data.token;
            // console.log('data:::::: ', JSON.stringify(data));
            // console.log('data:::::: ', config.token);
        });
    };



    return viewModel;
}

function handleErrors(response) {
    if (!response.ok) {
        console.log(JSON.stringify(response));
        throw Error(response.statusText);
    }
    return response;
}

module.exports = User;
