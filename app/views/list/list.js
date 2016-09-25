var swipeDelete = require("../../shared/utils/ios-swipe-delete");
var dialogsModule = require("ui/dialogs");
var Observable = require("data/observable").Observable;
var WorkListViewModel = require("../../shared/view-models/work-list-view-model");
var ObservableArray = require("data/observable-array").ObservableArray;
var viewModule = require("ui/core/view");
var page;
var LocalNotifications = require("nativescript-local-notifications");


var workList = new WorkListViewModel([]);
var pageData = new Observable({
    workList: workList,
    work: ""
});


exports.loaded = function(args) {
    page = args.object;
    if (page.ios) {
      var listView = viewModule.getViewById(page, "workList");
      swipeDelete.enable(listView, function(index) {
        workList.delete(index);
      });
    }
    var listView = page.getViewById("workList");
    page.bindingContext = pageData;

    workList.empty();
    pageData.set("isLoading", true);
    workList.load().then(function() {
        pageData.set("isLoading", false);
        listView.animate({
            opacity: 1,
            duration: 1000
        });
    });
};

exports.add = function() {
    // Check for empty submissions
    if (pageData.get("work").trim() === "") {
        dialogsModule.alert({
            message: "Enter a work item",
            okButtonText: "OK"
        });
        return;
    }

    // Dismiss the keyboard
    page.getViewById("work").dismissSoftInput();
    workList.add(pageData.get("work"))
        .catch(function() {
            dialogsModule.alert({
                message: "An error occurred while adding an item to your list.",
                okButtonText: "OK"
            });
        });

    // Empty the input field
    pageData.set("work", "");
};

exports.delete = function(args) {
    var item = args.view.bindingContext;
    var index = workList.indexOf(item);
    workList.delete(index);
};
