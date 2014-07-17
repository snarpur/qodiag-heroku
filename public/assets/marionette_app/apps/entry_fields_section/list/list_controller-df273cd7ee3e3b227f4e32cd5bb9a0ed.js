(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.Qapp.module("EntryFieldsSectionApp.List", function(List, App, Backbone, Marionette, $, _) {
    return List.Controller = (function(_super) {
      __extends(Controller, _super);

      function Controller() {
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.list = function(options) {
        return this.getSectionEntryFields(options);
      };

      Controller.prototype.XgetSectionEntryFields = function(options) {
        var model, region, sectionEntryFields;
        model = options.model, region = options.region;
        return sectionEntryFields = model;
      };

      Controller.prototype.getSectionEntryFields = function(options) {
        var entries, loaderRegion, model, region, view;
        model = options.model, region = options.region, loaderRegion = options.loaderRegion;
        entries = model.getSectionEntryFields();
        view = this.getEntriesView(entries, model);
        this.listenTo(view, "section:entries:updated", (function(_this) {
          return function(options) {
            if (options.field) {
              model.addSelectedField(options);
            }
            return entries.setDisplayOrder();
          };
        })(this));
        this.show(view, {
          region: region,
          loaderRegion: loaderRegion,
          loading: true
        });
        this.listenTo(view, "save:clicked", (function(_this) {
          return function(options) {
            return model.saveEntryFields();
          };
        })(this));
        return this.listenTo(model, "updated", (function(_this) {
          return function() {
            return toastr.success(I18n.t("activerecord.sucess.messages.saved", {
              model: model.get('name')
            }));
          };
        })(this));
      };

      Controller.prototype.getEntriesView = function(entries, section) {
        var entriesView;
        return entriesView = new List.Fields({
          collection: entries,
          model: section
        });
      };

      return Controller;

    })(App.Controllers.Base);
  });

}).call(this);
