(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.Qapp.module("Entities", function(Entities, App, Backbone, Marionette, $, _) {
    return Entities.FormEntrySetModel = (function(_super) {
      __extends(FormEntrySetModel, _super);

      function FormEntrySetModel() {
        return FormEntrySetModel.__super__.constructor.apply(this, arguments);
      }

      return FormEntrySetModel;

    })(Entities.EntrySet);
  });

}).call(this);
