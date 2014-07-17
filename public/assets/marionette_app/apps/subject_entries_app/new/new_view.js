(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.Qapp.module("SubjectEntriesApp.New", function(New, App, Backbone, Marionette, $, _) {
    return New.Entry = (function(_super) {
      __extends(Entry, _super);

      function Entry() {
        return Entry.__super__.constructor.apply(this, arguments);
      }

      Entry.prototype.template = "subject_entries_app/new/_entry";

      Entry.prototype.onShow = function(options) {
        this.bindings = {};
        this.bindings["#entry_field_value_for_" + (this.model.get('entry_field_id'))] = "text_value";
        return this.stickit();
      };

      return Entry;

    })(App.Views.ItemView);
  });

}).call(this);
