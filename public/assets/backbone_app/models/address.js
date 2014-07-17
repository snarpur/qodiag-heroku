(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  App.Models.Address = (function(_super) {
    __extends(Address, _super);

    function Address() {
      this.initialize = __bind(this.initialize, this);
      return Address.__super__.constructor.apply(this, arguments);
    }

    Address.prototype.urlRoot = "/address";

    Address.prototype.paramRoot = "address";

    Address.prototype.initialize = function() {
      Address.__super__.initialize.apply(this, arguments);
      this.once("change:form", function() {
        if (this.get("submitDisabled") === true) {
          return this.disableFields();
        }
      });
      return this.url = function() {
        if (this.get('person_id')) {
          return "/people/" + (this.get('person_id')) + this.urlRoot;
        } else {
          return "" + this.urlRoot;
        }
      };
    };

    return Address;

  })(App.Models.Base);

}).call(this);
