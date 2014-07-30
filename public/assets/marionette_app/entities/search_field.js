(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.Qapp.module("Entities", function(Entities, App, Backbone, Marionette, $, _) {
    var API;
    Entities.Search = (function(_super) {
      __extends(Search, _super);

      function Search() {
        return Search.__super__.constructor.apply(this, arguments);
      }

      Search.prototype.schema = {
        search: {
          type: 'Text'
        }
      };

      return Search;

    })(Entities.Model);
    API = {
      getSearchField: function(search) {
        var field;
        return field = new Entities.Search({
          search: search
        });
      }
    };
    return App.reqres.setHandler("get:search:field", function(options) {
      return API.getSearchField(options);
    });
  });

}).call(this);