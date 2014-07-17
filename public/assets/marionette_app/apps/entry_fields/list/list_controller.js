(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.Qapp.module("EntryFieldsApp.List", function(List, App, Backbone, Marionette, $, _) {
    return List.Controller = (function(_super) {
      __extends(Controller, _super);

      function Controller() {
        this.getLayout = __bind(this.getLayout, this);
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.list = function(options) {
        this.executeSettingsNavigation();
        App.contentRegion.show(this.getLayout());
        this.executeSettingsNavigation();
        return this.showEntryFields();
      };

      Controller.prototype.showEntryFields = function(options) {
        var fields;
        if (options == null) {
          options = {};
        }
        fields = App.request("entry:fields:entities");
        return App.execute("when:fetched", fields, (function(_this) {
          return function() {
            var searchCollection;
            searchCollection = fields.createSearchCollection();
            return _this.showEntryFieldsView(searchCollection, fields);
          };
        })(this));
      };

      Controller.prototype.getEntryFieldsView = function(collection) {
        return new List.EntryFields({
          collection: collection
        });
      };

      Controller.prototype.executeSettingsNavigation = function() {
        return App.execute("show:settings:navigation", {
          iconClass: "fa fa-question",
          i18n: "terms.question"
        });
      };

      Controller.prototype.showEntryFieldsView = function(collection, fields) {
        var view;
        view = this.getEntryFieldsView(collection);
        this.listenTo(collection, "updated", (function(_this) {
          return function(model, collection) {
            return toastr.success(I18n.t("entry_set.messages.question_edited"), model.get('title'));
          };
        })(this));
        this.listenTo(view, "create:field:clicked", (function(_this) {
          return function(view) {
            return App.execute("create:entry:field", {
              collection: view.collection
            });
          };
        })(this));
        this.listenTo(view, "childview:edit:clicked", (function(_this) {
          return function(view) {
            return App.execute("edit:entry:field", {
              model: view.model
            });
          };
        })(this));
        this.listenTo(view, "childview:destroy:clicked", (function(_this) {
          return function(view) {
            return bootbox.confirm(I18n.t("entry_set.messages.confirm_delte_question"), function(result) {
              if (result) {
                return view.model.destroy();
              }
            });
          };
        })(this));
        return this.show(view, {
          region: this.getLayout().listRegion,
          loading: true
        });
      };

      Controller.prototype.getLayout = function() {
        return this.layout != null ? this.layout : this.layout = new List.Layout;
      };

      return Controller;

    })(App.Controllers.Base);
  });

}).call(this);
