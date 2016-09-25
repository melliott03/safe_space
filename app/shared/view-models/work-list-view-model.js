var config = require("../../shared/config");
var fetchModule = require("fetch");
var ObservableArray = require("data/observable-array").ObservableArray;
var LocalNotifications = require("nativescript-local-notifications");
var dialogs = require("ui/dialogs");


function doAddOnMessageReceivedCallback() {
    LocalNotifications.addOnMessageReceivedCallback(
        function(notificationData) {
            dialogs.confirm({
                title: "Notification received",
                message: "ID: " + notificationData.id +
                "\nTitle: " + notificationData.title +
                "\nBody: " + notificationData.body,
                okButtonText: "Accept!",
                cancelButtonText: "Decline",
                neutralButtonText: "Hold 2-mins"
            }).then(function (result) {
              // result argument is boolean
              console.log("Dialog result: " + result);
              alert(result);
            });
        }
    );
}

// original alert
// function doAddOnMessageReceivedCallback() {
//     LocalNotifications.addOnMessageReceivedCallback(
//         function(notificationData) {
//             dialogs.alert({
//                 title: "Notification received",
//                 message: "ID: " + notificationData.id +
//                 "\nTitle: " + notificationData.title +
//                 "\nBody: " + notificationData.body,
//                 okButtonText: "Excellent!"
//             });
//         }
//     );
// }

function WorkListViewModel(items) {
    var viewModel = new ObservableArray(items);

    //LocalNotifications Stuff
    viewModel.id = 0;
    viewModel.title = "Test Title";
    viewModel.body = "Test Body";
    viewModel.ticker = "Test Ticker";

    doAddOnMessageReceivedCallback();

    viewModel.schedule = function() {
        LocalNotifications.schedule([{
            id: '12',
            title: 'this.title',
            body: 'this.body',
            ticker: 'this.ticker',
            at: new Date(new Date().getTime() + (10 * 1000))
        }]).then(() => {
            console.log("Notification scheduled");
        }, (error) => {
            console.log("ERROR", error);
        });
    };
    //End LocalNotifications stuff

    viewModel.load = function() {
      console.log('config.token:::::::::::', config.token );
      return fetch(config.apiUrl + "dashboard", {
        headers: {
          "Authorization": "" + config.token,
          "hello": "hello"
        }
      })
      .then(handleErrors)
      .then(function(response) {
        // console.log('back from getting work items response.json():::::', JSON.stringify(response));
        return response.json();
      }).then(function(data) {
        console.log('data inside load() get work:::::: ', JSON.stringify(data));
        data.forEach(function(work) {
          viewModel.push({
            id: work._id,
            status: work.status,
            details: work.details,
            datetime: work.datetime,
            endTime: work.endTime,
            type: work.type,
            weather: work.weather[0].daily.data[0].summary
          });
        });
      });
    };

    viewModel.empty = function() {
      while (viewModel.length) {
        viewModel.pop();
      }
    };

    viewModel.add = function(work) {
      console.log('config.token:::::::::::', config.token );
      return fetch(config.apiUrl + "work", {
        method: "POST",
        body: JSON.stringify({
          address: work
        }),
        headers: {
          "Authorization": "" + config.token,
          "Content-Type": "application/json"
        }
      })
      .then(handleErrors)
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        viewModel.push({ name: work, id: data._id });
      });
    };

    viewModel.delete = function(index) {
      return fetch(config.apiUrl + "work/" + viewModel.getItem(index).id, {
        method: "PUT", //"DELETE" would actually delete from the database "PUT" is setting it's status to canceled
        headers: {
          "Authorization": "" + config.token,
          "Content-Type": "application/json"
        }
      })
      .then(handleErrors)
      .then(function() {
        viewModel.splice(index, 1);
      });
    };


    return viewModel;
}

function handleErrors(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    console.log('response:::::', JSON.stringify(response));
    return response;
}

module.exports = WorkListViewModel;
