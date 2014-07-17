(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (function(Backbone) {
    _.extend(Backbone.Model.prototype, Backbone.Validation.mixin);
    return _.extend(Backbone.Model.prototype, Qapp.ModelMixins.NestedValidation);
  })(Backbone);

  this.Qapp.module("Entities", function(Entities, App, Backbone, Marionette, $, _) {
    return Entities.Model = (function(_super) {
      __extends(Model, _super);

      function Model() {
        this.toJSON = __bind(this.toJSON, this);
        this.saveError = __bind(this.saveError, this);
        this.saveSuccess = __bind(this.saveSuccess, this);
        return Model.__super__.constructor.apply(this, arguments);
      }

      Model.prototype.attributeList = [];

      Model.prototype.nestedAttributeList = [];

      Model.prototype.blacklist = ["_errors", "_nestedErrors"];

      Model.prototype.nestedErrors = {};

      Model.prototype.validation = {};

      Model.prototype.initialize = function() {
        this.url = function() {
          var base, _ref;
          base = (_ref = _.result(this, 'urlRoot')) != null ? _ref : this.collection.url();
          if (this.id) {
            return "" + base + "/" + this.id;
          } else {
            return base;
          }
        };
        this.validateOnChange();
        this.on("validated:invalid", this.onInvalid);
        this.on("validated:valid", this.onValid);
        return Model.__super__.initialize.apply(this, arguments);
      };

      Model.prototype.validateOnChange = function() {
        var eventStr;
        eventStr = _.map(_.keys(this.validation), function(i) {
          return "change:" + i;
        }).join(" ");
        return this.on(eventStr, (function(_this) {
          return function() {
            if (_this.get('_errors') != null) {
              return _this.validate();
            }
          };
        })(this));
      };

      Model.prototype.destroy = function(options) {
        if (options == null) {
          options = {};
        }
        _.defaults(options, {
          wait: true
        });
        this.set({
          _destroy: true
        });
        return Model.__super__.destroy.call(this, options);
      };

      Model.prototype.isDestroyed = function() {
        return this.get("_destroy");
      };

      Model.prototype.save = function(data, options) {
        var isNew;
        if (options == null) {
          options = {};
        }
        isNew = this.isNew();
        _.defaults(options, {
          wait: true,
          success: _.bind(this.saveSuccess, this, isNew, options.collection),
          error: _.bind(this.saveError, this)
        });
        this.unset("_errors");
        return Model.__super__.save.call(this, data, options);
      };

      Model.prototype.saveSuccess = function(isNew, collection) {
        if (isNew) {
          if (collection) {
            collection.add(this);
          }
          if (collection) {
            collection.trigger("model:created", this);
          }
          return this.trigger("created", this);
        } else {
          if (collection == null) {
            collection = this.collection;
          }
          if (collection) {
            collection.trigger("model:updated", this);
          }
          return this.trigger("updated", this);
        }
      };

      Model.prototype.saveError = function(model, xhr, options) {
        var _ref;
        if (!(xhr.status === 500 || xhr.status === 404)) {
          model.off("created updated");
          return this.setNestedServerErrors((_ref = $.parseJSON(xhr.responseText)) != null ? _ref.errors : void 0);
        }
      };

      Model.prototype._getEntityClass = function(name) {
        return Entities[_(name).chain().capitalize().camelize().value()];
      };

      Model.prototype._createNestedEntity = function(key, value) {
        var entity;
        if (!(this._isBackbone(this.get('key')) && (value != null))) {
          entity = new (this._getEntityClass(key))(value);
          this.set(key, entity, {
            silent: true
          });
          return this.listenTo(entity, "change", (function(_this) {
            return function() {
              return _this.trigger("change:" + key, key, entity);
            };
          })(this));
        }
      };

      Model.prototype._isBackbone = function(attribute) {
        return attribute instanceof Backbone.Model || attribute instanceof Backbone.Collection;
      };

      Model.prototype._isBackboneAssociation = function(key) {
        return _.contains(_.pluck(this.relations, 'key'), key);
      };

      Model.prototype._isHelper = function(key, value) {
        return (_.isObject(value) && !this._inNestedAttributeList(key) && !_.endsWith(key, "_attributes")) || _.isFunction(value);
      };

      Model.prototype._inNestedAttributeList = function(key) {
        return _.contains(this.nestedAttributeList, key);
      };

      Model.prototype._inAttributeList = function(key) {
        return _.contains(this.attributeList, key);
      };

      Model.prototype._inBlacklist = function(key) {
        return _.contains(this.blacklist, key);
      };

      Model.prototype.onValid = function(model, errors) {
        return model.set("_errors", null);
      };

      Model.prototype.onInvalid = function(model, errors) {
        return model.set("_errors", errors);
      };

      Model.prototype.toJSON = function(options) {
        var json;
        if ((options != null ? options.acceptsNested : void 0) === false) {
          return Model.__super__.toJSON.apply(this, arguments);
        } else {
          json = $.extend(true, {}, this.attributes);
          _.each(json, (function(v, k) {
            if ((this._inNestedAttributeList(k) || this._isBackboneAssociation(k)) && !(_.isNull(v) || (v != null ? v.length : void 0) === 0)) {
              if (this._isBackbone(v) && (json["" + k + "_attributes"] = v.toJSON())) {

              } else {
                json["" + k + "_attributes"] = v;
              }
              return delete json[k];
            } else if (this._isHelper(k, v) || this._inBlacklist(k)) {
              return delete json[k];
            }
          }), this);
          return json;
        }
      };

      return Model;

    })(Backbone.AssociatedModel);
  });

}).call(this);
