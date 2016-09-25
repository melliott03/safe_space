var dialogsModule = require("ui/dialogs");
var UserViewModel = require("../../shared/view-models/user-view-model");
var LocalNotifications = require("nativescript-local-notifications");
var fetchModule = require("fetch");
var user = new UserViewModel();
var http = require("http");

//start nativescript-dialog stuff
// var platform = require("platform");
// var application = require("application");
// var dialog = require("nativescript-dialog");
//end nativescript-dialog stuff

// var Promise = require('bluebird');
// const StringFormat = require("nativescript-stringformat");
// var StringBuilder = require("nativescript-stringformat");
// import {StringBuilder} from "nativescript-stringformat";

var frameModule = require("ui/frame");
var viewModule = require("ui/core/view");
var email;

var user = new UserViewModel({ //just delete these four lines and login will work with any user
    email: "user@gmail.com",
    password: "123"
});
var config = require("../../shared/config");

var opts = {};
var url = config.apiUrl;
var nativescript_socketio_1 = require('nativescript-socketio');
var socketIO;
socketIO = new nativescript_socketio_1.SocketIO(url,opts);

socketIO.on('connect', function (data) {
  console.log("Socket Connected: ", data);
  // user.postSocketID(data);
  // frameModule.topmost().navigate({ moduleName: 'main-page', context: { username: pageData.get("username"), socket: socketIO.instance } })
});
socketIO.on('connectedSocketID', function (data) {
  console.log("connectedSocketID: ", data);
  user.postSocketID(data);
  // frameModule.topmost().navigate({ moduleName: 'main-page', context: { username: pageData.get("username"), socket: socketIO.instance } })
});
socketIO.on('socketToYou', function (workitem) {
            console.log("in socketToYou, socketToYou msg, BEFORE::", workitem);
            console.log("in socketToYou, socketToYou msg, BEFORE::"+ workitem);
            postWorkID(workitem);
});
exports.loaded = function(args) {
    var page = args.object;
    page.bindingContext = user;
};
exports.signIn = function() {
    user.login()
        .catch(function(error) {
            console.log(error);
            dialogsModule.alert({
                message: "Unfortunately we could not find your account.",
                okButtonText: "OK"
            });
            return Promise.reject();
        })
        .then(function() {
            frameModule.topmost().navigate("views/list/list");
            requestLocalNotificationsPermission();
            socketIO.connect();
        });
};

function requestLocalNotificationsPermission(response) {
    LocalNotifications.requestPermission().then((granted) => {
        if(granted) {
          console.log('notifications granted::');
          LocalNotifications.schedule([{
              id: '12',
              title: 'this.title',
              body: 'this.body',
              ticker: 'this.ticker',
              at: new Date(new Date().getTime() + (10 * 1000))
          }]).then(() => {
            alert("Notification scheduled");
              console.log("Notification scheduled");
          }, (error) => {
              console.log("ERROR", error);
          });
          alert('notifications granted::');
            // workList.schedule();
        }else if(!granted) {
            console.log('notifications NOT granted::');
            alert('notifications NOT granted::');

        }else {
            console.log('notifications neither granted notgranted::');
            alert('notifications neither granted notgranted::');

        }
    });
}

function handleSocketErrors(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    console.log('response:::::', JSON.stringify(response));
    return response;
}
function handleErrors(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    console.log('response:::::', JSON.stringify(response));
    return response;
}
function postWorkID(workitem){
  console.log("in postWorkID,  workitem, BEFORE fetchModule.fetch post::" +workitem);
  return fetchModule.fetch(config.apiUrl + "work/mobileWork", {
    method: "POST",
    body: JSON.stringify({
      msg: ''+workitem
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
    console.log('data::', data);
    console.log('data.id::', data.id);
    // viewModel.push({ name: work, id: data._id });
    console.log('data in return from get addedwork by id::', JSON.stringify(data));
    var addedWork = data.work;
    // var timer = function(){return 23;};
    //SCHEDULE A POPUP NOTIFICATION
    LocalNotifications.schedule([{
        id: addedWork._id,
        title: '',
        body: 'TYPE: '
          +addedWork.type +' ADDRESS: '+ addedWork.address +' START: '+addedWork.datetime +' END: '+addedWork.endTime,
        ticker: 'this.ticker',
        at: new Date(new Date().getTime() + (10 * 1000))
    }]).then((value) => {
      alert("Notification scheduled");
        console.log("Notification scheduled " + value);
    }, (error) => {
        console.log("ERROR", error);
    });
    //SCHEDULE A SECOND POPUP NOTIFICATION
  });
};


// exports.buttonTap = function(args){
//       var nativeView;
//       if(platform.device.os === platform.platformNames.ios){
//         console.log('inside platform.device.os === platform.platformNames.ios');
//           nativeView = UIActivityIndicatorView.alloc().initWithActivityIndicatorStyle(UIActivityIndicatorViewStyle.UIActivityIndicatorViewStyleGray);
//           console.log('nativeView::', nativeView);
//         nativeView.startAnimating();
//         console.log('nativeView::', nativeView.startAnimating());
//
//       } else if(platform.device.os === platform.platformNames.android){
//           nativeView = new android.widget.ProgressBar(application.android.currentContext);
//         nativeView.setIndeterminate(true);
//       }
//       dialog.show({
//         title: "Loading...",
//         message: "Please wait!",
//         cancelButtonText: "Cancel",
//         nativeView: nativeView
//       })
//       .then(function(r){
//         console.log("Result: " + r);
//       },
//       function(e){
//         console.log("Error: " + e)
//     });
// };

exports.register = function() {
  var topmost = frameModule.topmost();
  topmost.navigate("views/register/register");
};
