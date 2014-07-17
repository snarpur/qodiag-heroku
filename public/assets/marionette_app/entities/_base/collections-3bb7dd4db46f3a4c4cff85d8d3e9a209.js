(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (function(Backbone) {
    return _.extend(Backbone.Collection.prototype, Qapp.CollectionMixins.NestedValidation);
  })(Backbone);

  this.Qapp.module("Entities", function(Entities, App, Backbone, Marionette, $, _) {
    return Entities.Collection = (function(_super) {
      __extends(Collection, _super);

      function Collection() {
        this.toJSON = __bind(this.toJSON, this);
        return Collection.__super__.constructor.apply(this, arguments);
      }

      Collection.prototype.toJSON = function(options) {
        if ((options != null ? options.acceptsNested : void 0) === false) {
          Collection.__super__.toJSON.apply(this, arguments);
        } else {

        }
        return _.chain(this.models).map((function(i) {
          return i.toJSON(options);
        }), this).compact().value();
      };

      return Collection;

    })(Backbone.Collection);
  });

}).call(this);
