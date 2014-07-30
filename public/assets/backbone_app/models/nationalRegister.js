(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  App.Models.NationalRegisterEntry = (function(_super) {
    __extends(NationalRegisterEntry, _super);

    function NationalRegisterEntry() {
      return NationalRegisterEntry.__super__.constructor.apply(this, arguments);
    }

    NationalRegisterEntry.prototype.urlRoot = "/national_registers";

    NationalRegisterEntry.prototype.initialize = function() {
      return this.url = function() {
        return "" + this.urlRoot + "/" + (this.get('cpr'));
      };
    };

    return NationalRegisterEntry;

  })(App.Models.Base);

  App.Collections.NationalRegister = (function(_super) {
    __extends(NationalRegister, _super);

    function NationalRegister() {
      return NationalRegister.__super__.constructor.apply(this, arguments);
    }

    NationalRegister.prototype.model = App.Models.NationalRegisterEntry;

    NationalRegister.prototype.url = "/national_registers";

    return NationalRegister;

  })(App.Collections.Base);

}).call(this);