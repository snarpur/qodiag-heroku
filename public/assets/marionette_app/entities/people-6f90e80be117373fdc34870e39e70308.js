(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.Qapp.module("Entities", function(Entities, App, Backbone, Marionette, $, _) {
    var API;
    Entities.Person = (function(_super) {
      __extends(Person, _super);

      function Person() {
        return Person.__super__.constructor.apply(this, arguments);
      }

      Person.prototype.urlRoot = Routes.people_path();

      Person.prototype.paramRoot = 'person';

      Person.prototype.relations = [
        {
          type: Backbone.One,
          key: 'address',
          relatedModel: function() {
            return App.Entities.Address;
          }
        }, {
          type: Backbone.One,
          key: 'user',
          relatedModel: function() {
            return App.Entities.User;
          }
        }, {
          type: Backbone.Many,
          key: 'inverse_relationships',
          relatedModel: function() {
            return App.Entities.Relationship;
          }
        }
      ];

      Person.prototype.nestedAttributeList = ['relationships'];

      Person.prototype.defaults = {
        "image_url_tiny": "/assets/avatars/tiny/male.png",
        "image_url_thumb": "/assets/avatars/thumb/male.png",
        "image_url_small": "/assets/avatars/small/male.png",
        "image_url_medium": "/assets/avatars/medium/male.png",
        "image_url_large": "/assets/avatars/large/male.png"
      };

      Person.prototype.validation = {
        firstname: {
          required: true,
          msg: function() {
            return I18n.t("activerecord.errors.messages.blank");
          }
        },
        lastname: {
          required: true,
          msg: function() {
            return I18n.t("activerecord.errors.messages.blank");
          }
        },
        full_cpr: {
          required: true,
          msg: function() {
            return I18n.t("activerecord.errors.messages.blank");
          }
        },
        sex: {
          required: true,
          msg: function() {
            return I18n.t("activerecord.errors.messages.blank");
          }
        }
      };

      Person.prototype.initialize = function() {
        this.blacklist = _.keys(this.defaults);
        this.on("change:respondents", this.setRespondents);
        return Person.__super__.initialize.apply(this, arguments);
      };

      Person.prototype.setRespondents = function(model, value, options) {
        if (!(value instanceof Backbone.Collection)) {
          return this.set('respondents', new Entities.People(value), {
            silent: true
          });
        }
      };

      Person.prototype.getParents = function() {
        var parents;
        parents = new Entities.People([]);
        parents.url = "" + (Routes.inverse_relation_path(this.id)) + "?relationship_name=parents";
        parents.fetch();
        return parents;
      };

      return Person;

    })(Entities.Model);
    Entities.People = (function(_super) {
      __extends(People, _super);

      function People() {
        return People.__super__.constructor.apply(this, arguments);
      }

      People.prototype.model = Entities.Person;

      People.prototype.url = function() {
        return Routes.people_path();
      };

      return People;

    })(Entities.Collection);
    API = {
      getPerson: function(id) {
        var person;
        person = new Entities.Person({
          id: id
        });
        person.fetch();
        return person;
      }
    };
    return App.reqres.setHandler("get:person:entity", function(id) {
      return API.getPerson(id);
    });
  });

}).call(this);
