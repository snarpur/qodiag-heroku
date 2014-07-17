(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.Qapp.module("SubjectEntriesApp.New", function(New, App, Backbone, Marionette, $, _) {
    return New.Controller = (function(_super) {
      __extends(Controller, _super);

      function Controller() {
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.initialize = function(options) {
        return this.region = options.region, this.entry = options.entry, options;
      };

      Controller.prototype.newEntry = function() {
        var formView;
        formView = this.showForm();
        return this.listenTo(formView, "form:cancel", (function(_this) {
          return function() {
            _this.region.trigger("form:close");
            return _this.region.close();
          };
        })(this));
      };

      Controller.prototype.showForm = function() {
        var editView, formView;
        editView = this.getFormView();
        formView = App.request("form:wrapper", editView, {
          collection: editView.collection
        });
        this.region.show(formView);
        return formView;
      };

      Controller.prototype.createModel = function() {
        var attributes, entry;
        attributes = {
          entry_field_id: this.entry.get('id'),
          entry_set_response_id: this.entry.get('entry_set_response_id'),
          person_id: App.request("get:current:user").get('person_id'),
          text_value: ""
        };
        entry = new App.Entities.EntryValue(attributes);
        this.listenTo(entry, "sync:stop", function(model) {
          this.region.close();
          return this.region.trigger("form:close");
        });
        return entry;
      };

      Controller.prototype.getFormView = function() {
        return new New.Entry({
          model: this.createModel(),
          collection: this.entry.get('caretaker_entry_values')
        });
      };

      return Controller;

    })(App.Controllers.Base);
  });

}).call(this);
