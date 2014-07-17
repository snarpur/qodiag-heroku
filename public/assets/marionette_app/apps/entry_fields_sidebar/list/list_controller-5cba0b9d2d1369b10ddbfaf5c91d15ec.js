(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.Qapp.module("EntryFieldsSidebarApp.List", function(List, App, Backbone, Marionette, $, _) {
    return List.Controller = (function(_super) {
      __extends(Controller, _super);

      function Controller() {
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.list = function(options) {
        var section;
        this.region = options.region, section = options.section;
        this.region.show(this.getLayout());
        return this.showEntryFields(options);
      };

      Controller.prototype.showEntryFields = function(options) {
        var droppableCollection, droppableElement, fields;
        droppableCollection = options.droppableCollection, droppableElement = options.droppableElement;
        fields = App.request("entry:fields:entities");
        this.listenTo(droppableCollection, "change:current:dropzone", (function(_this) {
          return function(droppable) {
            return fields.droppableElement = droppable;
          };
        })(this));
        return App.execute("when:fetched", fields, (function(_this) {
          return function() {
            var searchCollection;
            searchCollection = fields.createSearchCollection(_.result(droppableCollection, 'entryFieldIds'));
            fields.droppableElement = droppableElement;
            _this.listenTo(droppableCollection, "remove:fields", function(options) {
              return searchCollection.add(options.model.get('entry_field'));
            });
            _this.showEntryFieldsView({
              collection: searchCollection,
              droppableCollection: droppableCollection
            });
            return _this.showSearchField(fields);
          };
        })(this));
      };

      Controller.prototype.getEntryFieldsView = function(options) {
        return new List.EntryFields({
          collection: options.collection
        });
      };

      Controller.prototype.showEntryFieldsView = function(options) {
        var collection, droppableCollection, view;
        droppableCollection = options.droppableCollection, collection = options.collection;
        view = this.getEntryFieldsView(options);
        this.listenTo(view, "childview:drag:stopped", (function(_this) {
          return function(options) {
            if (droppableCollection.hasFieldWithId(options.model.id)) {
              return collection.remove(options.model);
            }
          };
        })(this));
        return this.layout.listRegion.show(view);
      };

      Controller.prototype.showSearchField = function(collection) {
        return this.layout.searchRegion.show(this.getSearchFieldView(collection));
      };

      Controller.prototype.getSearchFieldView = function(collection) {
        var search;
        search = new Backbone.Model({
          search: ""
        });
        search.on("change:search", function() {
          return collection.trigger("search:update", this.get("search"));
        });
        return new List.Search({
          model: search
        });
      };

      Controller.prototype.getLayout = function() {
        return this.layout != null ? this.layout : this.layout = new List.Layout;
      };

      return Controller;

    })(App.Controllers.Base);
  });

}).call(this);
