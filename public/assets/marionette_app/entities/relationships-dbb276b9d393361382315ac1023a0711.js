(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.Qapp.module("Entities", function(Entities, App, Backbone, Marionette, $, _) {
    Entities.Relationship = (function(_super) {
      __extends(Relationship, _super);

      function Relationship() {
        return Relationship.__super__.constructor.apply(this, arguments);
      }

      return Relationship;

    })(Entities.Model);
    return Entities.Relationships = (function(_super) {
      __extends(Relationships, _super);

      function Relationships() {
        return Relationships.__super__.constructor.apply(this, arguments);
      }

      Relationships.prototype.model = Entities.Relationship;

      Relationships.prototype.url = function() {
        return Routes.relationships_path();
      };

      return Relationships;

    })(Entities.Collection);
  });

}).call(this);
