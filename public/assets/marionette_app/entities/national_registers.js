(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.Qapp.module("Entities", function(Entities, App, Backbone, Marionette, $, _) {
    var API;
    Entities.NationalRegister = (function(_super) {
      __extends(NationalRegister, _super);

      function NationalRegister() {
        return NationalRegister.__super__.constructor.apply(this, arguments);
      }

      NationalRegister.prototype.urlRoot = function() {
        return Routes.lookup_path(this.get("kennitala"));
      };

      NationalRegister.prototype.isEmpty = function() {
        if (_.size(this.attributes) === 1) {
          return true;
        } else {
          return false;
        }
      };

      return NationalRegister;

    })(Entities.Model);
    Entities.NationalRegisters = (function(_super) {
      __extends(NationalRegisters, _super);

      function NationalRegisters() {
        return NationalRegisters.__super__.constructor.apply(this, arguments);
      }

      NationalRegisters.prototype.model = Entities.NationalRegister;

      NationalRegisters.prototype.isEmpty = function() {
        if (this.length === 0) {
          return true;
        } else {
          return false;
        }
      };

      return NationalRegisters;

    })(Entities.Collection);
    API = {
      getNationalRegisterInformation: function(full_cpr) {
        var nr;
        nr = new Entities.NationalRegister({
          kennitala: full_cpr
        });
        nr.fetch();
        return nr;
      },
      getNationalRegisterFamily: function(full_cpr) {
        var nr;
        nr = new Entities.NationalRegisters;
        nr.url = Routes.family_path(full_cpr);
        nr.fetch();
        return nr;
      }
    };
    App.reqres.setHandler("get:national_register:data", function(full_cpr) {
      return API.getNationalRegisterInformation(full_cpr);
    });
    return App.reqres.setHandler("get:national_register:family", function(full_cpr) {
      return API.getNationalRegisterFamily(full_cpr);
    });
  });

}).call(this);
