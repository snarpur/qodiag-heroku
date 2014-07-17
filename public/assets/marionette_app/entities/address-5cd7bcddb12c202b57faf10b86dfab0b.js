(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.Qapp.module("Entities", function(Entities, App, Backbone, Marionette, $, _) {
    Entities.Address = (function(_super) {
      __extends(Address, _super);

      function Address() {
        return Address.__super__.constructor.apply(this, arguments);
      }

      return Address;

    })(Entities.Model);
    return Entities.Addresses = (function(_super) {
      __extends(Addresses, _super);

      function Addresses() {
        return Addresses.__super__.constructor.apply(this, arguments);
      }

      Addresses.prototype.model = Entities.Address;

      return Addresses;

    })(Entities.Collection);
  });

}).call(this);
