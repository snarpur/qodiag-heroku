(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.Qapp.module("Entities", function(Entities, App, Backbone, Marionette, $, _) {
    return Entities.FormAddressModel = (function(_super) {
      __extends(FormAddressModel, _super);

      function FormAddressModel() {
        return FormAddressModel.__super__.constructor.apply(this, arguments);
      }

      return FormAddressModel;

    })(Entities.Address);
  });

}).call(this);
