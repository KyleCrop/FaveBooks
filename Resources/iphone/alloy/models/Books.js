exports.definition = {
    config: {
        columns: {
            title: "text",
            author: "text"
        },
        adapter: {
            type: "sql",
            collection_name: "books"
        }
    },
    extendModel: function(Model) {
        _.extend(Model.prototype, {});
        return Model;
    },
    extendCollection: function(Collection) {
        _.extend(Collection.prototype, {});
        return Collection;
    }
};

var Alloy = require("alloy"), _ = require("alloy/underscore")._, model, collection;

model = Alloy.M("books", exports.definition, []);

collection = Alloy.C("books", exports.definition, model);

exports.Model = model;

exports.Collection = collection;