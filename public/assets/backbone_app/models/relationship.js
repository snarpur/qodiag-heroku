(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  App.Models.Relationship = (function(_super) {
    __extends(Relationship, _super);

    function Relationship() {
      this.setSelectFieldTitle = __bind(this.setSelectFieldTitle, this);
      return Relationship.__super__.constructor.apply(this, arguments);
    }

    Relationship.prototype.initialize = function() {
      Relationship.__super__.initialize.apply(this, arguments);
      return this.on("change:form", function(model, form) {
        return model.trigger("change:status", model);
      });
    };

    Relationship.prototype.setSelectFieldTitle = function() {
      var select, selectWithTitle;
      select = _.filter(this.schema, (function(v, k) {
        var _ref;
        return (v != null ? (_ref = v.type) != null ? _ref.search(/Select|Checkbox|Radio/) : void 0 : void 0) > -1;
      }));
      return selectWithTitle = _.map(select, (function(i) {
        return i.title = this.get('name');
      }), this);
    };

    Relationship.prototype.fieldTitle = function(field) {
      Relationship.__super__.fieldTitle.apply(this, arguments);
      return this.i18nTitle("" + (this.get('object_class')) + ".is_" + (this.get('name')));
    };

    return Relationship;

  })(App.Models.Base);

  App.Collections.Relationships = (function(_super) {
    __extends(Relationships, _super);

    function Relationships() {
      this.toJSON = __bind(this.toJSON, this);
      this.renewModel = __bind(this.renewModel, this);
      this.setRelationship = __bind(this.setRelationship, this);
      return Relationships.__super__.constructor.apply(this, arguments);
    }

    Relationships.prototype.model = App.Models.Relationship;

    Relationships.prototype.url = '/relationships';

    Relationships.prototype.initialize = function(models, options) {
      Relationships.__super__.initialize.apply(this, arguments);
      this.on("change:status", this.setRelationship);
      return this.on("remove", this.renewModel);
    };

    Relationships.prototype.setRelationship = function(model) {
      this.trigger('statusUpdate', model);
      if (model.changed.status != null) {
        if (model.get('status') === false && !model.isNew()) {
          return App.Event.trigger("addToDestructionQueue", model);
        } else if (model.get('status') === true) {
          return App.Event.trigger("removeFromDestructionQueue", model);
        }
      }
    };

    Relationships.prototype.renewModel = function(model) {
      var attrs, modelAttrs;
      attrs = _.without(model.getSchemaFields(), 'id');
      attrs.push("form", "schema");
      modelAttrs = _.pick(model.attributes, attrs);
      return this.add(modelAttrs);
    };

    Relationships.prototype.toJSON = function() {
      return _.chain(this.models).map((function(i) {
        if (i.get('status') !== false) {
          return i.toJSON();
        }
      }), this).compact().value();
    };

    return Relationships;

  })(App.Collections.Base);

  App.Models.Relationships = App.Models.Relationship;

  App.Models.Aliases.InverseRelationships = App.Models.Relationship;

  App.Collections.Aliases.InverseRelationships = App.Collections.Relationships;

}).call(this);
