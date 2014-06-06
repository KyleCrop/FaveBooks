function Controller() {
    function __alloyId9(e) {
        if (e && e.fromAdapter) return;
        __alloyId9.opts || {};
        var models = __alloyId8.models;
        var len = models.length;
        var rows = [];
        for (var i = 0; len > i; i++) {
            var __alloyId5 = models[i];
            __alloyId5.__transform = {};
            var __alloyId7 = Ti.UI.createTableViewRow({
                title: "undefined" != typeof __alloyId5.__transform["title"] ? __alloyId5.__transform["title"] : __alloyId5.get("title"),
                author: "undefined" != typeof __alloyId5.__transform["author"] ? __alloyId5.__transform["author"] : __alloyId5.get("author")
            });
            rows.push(__alloyId7);
            showBook ? __alloyId7.addEventListener("click", showBook) : __defers["__alloyId7!click!showBook"] = true;
        }
        $.__views.bookTable.setData(rows);
    }
    function showBook(event) {
        var selectedBook = event.source;
        var args = {
            title: selectedBook.title,
            author: selectedBook.author
        };
        var bookview = Alloy.createController("bookdetails", args).getView();
        $.navGroupWin.openWindow(bookview);
    }
    function addBook() {
        var myAddBook = Alloy.createController("addbook", {}).getView();
        $.navGroupWin.openWindow(myAddBook);
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "index";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    var __defers = {};
    Alloy.Collections.instance("books");
    $.__views.__alloyId4 = Ti.UI.createWindow({
        backgroundColor: "white",
        title: "My Books",
        id: "__alloyId4"
    });
    $.__views.bookTable = Ti.UI.createTableView({
        id: "bookTable"
    });
    $.__views.__alloyId4.add($.__views.bookTable);
    var __alloyId8 = Alloy.Collections["books"] || books;
    __alloyId8.on("fetch destroy change add remove reset", __alloyId9);
    var __alloyId12 = [];
    $.__views.add = Ti.UI.createButton({
        id: "add",
        title: "Add book"
    });
    __alloyId12.push($.__views.add);
    addBook ? $.__views.add.addEventListener("click", addBook) : __defers["$.__views.add!click!addBook"] = true;
    $.__views.__alloyId10 = Ti.UI.iOS.createToolbar({
        items: __alloyId12,
        bottom: "0",
        id: "__alloyId10"
    });
    $.__views.__alloyId4.add($.__views.__alloyId10);
    $.__views.navGroupWin = Ti.UI.iOS.createNavigationWindow({
        window: $.__views.__alloyId4,
        id: "navGroupWin"
    });
    $.__views.navGroupWin && $.addTopLevelView($.__views.navGroupWin);
    exports.destroy = function() {
        __alloyId8.off("fetch destroy change add remove reset", __alloyId9);
    };
    _.extend($, $.__views);
    var myBooks = Alloy.Collections.books;
    var book = Alloy.createModel("books", {
        title: "Great Expectations",
        author: "Charles Dickens"
    });
    myBooks.add(book);
    book.save();
    $.navGroupWin.open();
    Ti.include("/specs/enabled.js", "/specs/specs.js");
    __defers["__alloyId7!click!showBook"] && __alloyId7.addEventListener("click", showBook);
    __defers["$.__views.add!click!addBook"] && $.__views.add.addEventListener("click", addBook);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;