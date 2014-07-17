(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.Qapp.module("Entities", function(Entities, App, Backbone, Marionette, $, _) {
    return Entities.FormUserModel = (function(_super) {
      __extends(FormUserModel, _super);

      function FormUserModel() {
        return FormUserModel.__super__.constructor.apply(this, arguments);
      }

      FormUserModel.prototype.initialize = function() {
        this.validation = {};
        return FormUserModel.__super__.initialize.apply(this, arguments);
      };

      return FormUserModel;

    })(Entities.User);
  });

}).call(this);
