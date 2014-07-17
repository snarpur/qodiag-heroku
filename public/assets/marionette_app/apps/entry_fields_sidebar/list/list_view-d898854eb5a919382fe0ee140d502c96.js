(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.Qapp.module("EntryFieldsSidebarApp.List", function(List, App, Backbone, Marionette, $, _) {
    List.Layout = (function(_super) {
      __extends(Layout, _super);

      function Layout() {
        return Layout.__super__.constructor.apply(this, arguments);
      }

      Layout.prototype.template = "entry_fields_sidebar/list/templates/list_layout";

      Layout.prototype.regions = {
        searchRegion: "#entry-fields-search-region",
        listRegion: "#entry-fields-list-region",
        formRegion: "#entry-fields-form-region"
      };

      return Layout;

    })(App.Views.Layout);
    List.EntryField = (function(_super) {
      __extends(EntryField, _super);

      function EntryField() {
        return EntryField.__super__.constructor.apply(this, arguments);
      }

      EntryField.prototype.template = "entry_fields_sidebar/list/templates/_entry_field";

      EntryField.prototype.tagName = "li";

      EntryField.prototype.className = "list-group-item";

      EntryField.prototype.triggers = {
        'mouseenter': 'connect:to:sortable'
      };

      EntryField.prototype.onConnectToSortable = function() {
        var droppableEl, options, _this;
        droppableEl = this.model.collection.droppableElement;
        _this = this;
        options = {
          revert: 'invalid',
          revertDuration: 100,
          helper: 'clone',
          opacity: .4,
          addClasses: false,
          connectToSortable: droppableEl,
          start: function(e, ui) {
            return droppableEl.trigger("item:selected", _this.model);
          },
          stop: function(e, ui) {
            return _this.trigger("drag:stopped");
          }
        };
        return this.$el.draggable(options);
      };

      return EntryField;

    })(App.Views.ItemView);
    List.Search = (function(_super) {
      __extends(Search, _super);

      function Search() {
        return Search.__super__.constructor.apply(this, arguments);
      }

      Search.prototype.template = "entry_fields_sidebar/list/templates/_search";

      Search.prototype.tagName = 'form';

      Search.prototype.events = {
        "keyup input": "setSearch"
      };

      Search.prototype.setSearch = function(event) {
        return this.model.set("search", $(event.target).val());
      };

      return Search;

    })(App.Views.ItemView);
    return List.EntryFields = (function(_super) {
      __extends(EntryFields, _super);

      function EntryFields() {
        return EntryFields.__super__.constructor.apply(this, arguments);
      }

      EntryFields.prototype.itemView = List.EntryField;

      EntryFields.prototype.tagName = "ul";

      EntryFields.prototype.className = "list-group questions";

      return EntryFields;

    })(App.Views.CollectionView);
  });

}).call(this);
