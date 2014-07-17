(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  App.Models.Person = (function(_super) {
    __extends(Person, _super);

    function Person() {
      this.separateAddressCallbacks = __bind(this.separateAddressCallbacks, this);
      this.commonAddressCallbacks = __bind(this.commonAddressCallbacks, this);
      this.getCprFields = __bind(this.getCprFields, this);
      this.setAddres = __bind(this.setAddres, this);
      return Person.__super__.constructor.apply(this, arguments);
    }

    Person.prototype.defaults = {
      "object_class": "person",
      "i18n": "person"
    };

    Person.prototype.urlRoot = "/people";

    Person.prototype.paramRoot = 'person';

    Person.prototype.blacklist = ["family"];

    Person.prototype.initialize = function() {
      var spouseRelationship;
      Person.__super__.initialize.apply(this, arguments);
      spouseRelationship = this.get("spouse_relationships");
      if (spouseRelationship) {
        spouseRelationship.on("statusUpdate", this.setAddres);
      }
      this.on('change:family', (function(_this) {
        return function(model, attribute) {
          return App.Event.trigger('person:cpr:populate_from_select', attribute);
        };
      })(this));
      this.on('change:full_cpr', this.getCprFields);
      this.on('change:form', (function(_this) {
        return function() {
          var family, options;
          family = _this.get('family');
          if (family) {
            options = _.map(family, (function(v) {
              return {
                val: _.keys(v)[0],
                label: _.values(v)[0]
              };
            }), _this);
            _this.get('form').fields.family.editor.setOptions(options);
          }
          if (_.has(_this.attributes, 'full_cpr')) {
            return App.Event.on('person:cpr:populate_from_select', function(attribute) {
              return _this.set('full_cpr', attribute, {
                formUpdate: true
              });
            });
          }
        };
      })(this));
      return this;
    };

    Person.prototype.setAddres = function(model) {
      var address, spouse_id;
      address = this.get("address");
      if (model.changed.status == null) {
        if (model.get("status") === true) {
          address.set("submitDisabled", model.get("status"));
        }
        return;
      }
      if (model.get('status') === true) {
        spouse_id = _.difference(_.filter(model.attributes, function(v, k) {
          return k.search(/person|relation/) !== -1;
        }), [this.get('id')]);
        address.set("person_id", spouse_id, {
          silent: true
        });
        return address.fetch(this.commonAddressCallbacks());
      } else {
        if (this.get('id')) {
          address.set("person_id", this.get('id'));
          return address.fetch(this.separateAddressCallbacks());
        } else {
          address.clearFormAttributes();
          return address.enableFields();
        }
      }
    };

    Person.prototype.getCprFields = function(person) {
      var address, cpr, entry, thisModel;
      thisModel = this;
      address = thisModel.get("address");
      cpr = person.get('full_cpr');
      if (cpr.length === 10) {
        entry = new App.Models.NationalRegisterEntry({
          cpr: cpr
        });
        return entry.fetch({
          success: function(model, response) {
            thisModel.set(response, {
              formUpdate: true
            });
            if (_.isFunction(address.set)) {
              return address.set(response, {
                formUpdate: true
              });
            }
          },
          error: function(model, xhr, options) {
            throw I18n.t("marionette.errors.error_in_function", {
              "function": "Person:getCprFields"
            });
          }
        });
      }
    };

    Person.prototype.commonAddressCallbacks = function() {
      var callbacks, thisModel;
      thisModel = this;
      return callbacks = {
        formUpdate: true,
        success: function(model, response) {
          model.disableFields();
          return thisModel.set('address_id', model.get('id'));
        },
        error: function(model, xhr, options) {
          throw I18n.t("marionette.errors.error_in_function", {
            "function": "Person:commonAddressCallbacks"
          });
        }
      };
    };

    Person.prototype.separateAddressCallbacks = function() {
      var callbacks, thisModel;
      thisModel = this;
      return callbacks = {
        success: function(model, response) {
          if (model.previous("id") === model.get("id")) {
            model.clearFormAttributes();
          }
          thisModel.set('address_id', model.get('id'));
          return model.enableFields();
        },
        error: function(model, xhr, options) {
          throw I18n.t("marionette.errors.error_in_function", {
            "function": "Person:separateAddressCallbacks"
          });
        }
      };
    };

    return Person;

  })(App.Models.Base);

  App.Collections.Person = (function(_super) {
    __extends(Person, _super);

    function Person() {
      return Person.__super__.constructor.apply(this, arguments);
    }

    Person.prototype.model = App.Models.Person;

    Person.prototype.paramRoot = "people";

    return Person;

  })(App.Collections.Base);

  App.Models.Aliases.Relations = App.Models.Person;

  App.Models.Aliases.InverseRelations = App.Models.Person;

  App.Models.Aliases.Relation = App.Models.Person;

  App.Models.Aliases.InverseRelation = App.Models.Person;

}).call(this);
