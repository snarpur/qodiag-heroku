(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  App.Models.Base = (function(_super) {
    __extends(Base, _super);

    function Base() {
      this.removeBlacklistedFields = __bind(this.removeBlacklistedFields, this);
      this.removeNonSchemaFields = __bind(this.removeNonSchemaFields, this);
      this.jsonWithNestedSuffix = __bind(this.jsonWithNestedSuffix, this);
      this.setFormErrors = __bind(this.setFormErrors, this);
      this.bindToForm = __bind(this.bindToForm, this);
      this.getNestedFields = __bind(this.getNestedFields, this);
      this.getNestedModelNames = __bind(this.getNestedModelNames, this);
      this.getNonSchemaFields = __bind(this.getNonSchemaFields, this);
      this.getSchemaFields = __bind(this.getSchemaFields, this);
      this.getModelFromString = __bind(this.getModelFromString, this);
      this.initializeNestedModels = __bind(this.initializeNestedModels, this);
      this.getSchema = __bind(this.getSchema, this);
      this.setSchema = __bind(this.setSchema, this);
      return Base.__super__.constructor.apply(this, arguments);
    }

    Base.prototype.initialize = function() {
      this.on("change:formErrors", this.setFormErrors);
      this.on("change:form", this.bindToForm);
      this.schema = this.setSchema();
      this.initializeNestedModels();
      if (this.get("urlRoot") != null) {
        this.urlRoot = this.get("urlRoot");
      }
      if (this.get('paramRoot')) {
        this.paramRoot = this.get("paramRoot");
      }
      return this;
    };

    Base.prototype.setSchema = function() {
      var _ref;
      if (this.schema != null) {
        return this.schema;
      } else if (this.get('schema') != null) {
        return this.get('schema');
      } else if ((this.get('schema') == null) && ((typeof this !== "undefined" && this !== null ? (_ref = this.collection) != null ? _ref.schema : void 0 : void 0) != null)) {
        return function() {
          var schemaFromCollection;
          schemaFromCollection = this.collection.schemaForModel(this);
          if (_.isArray(this.get("schema")) && (schemaFromCollection != null)) {
            this.set("schema", schemaFromCollection);
          }
          return this.get("schema");
        };
      }
    };

    Base.prototype.getSchema = function() {
      if (_.isFunction(this.schema)) {
        return this.schema();
      } else {
        return this.schema;
      }
    };

    Base.prototype.fieldTemplate = function(schemaType) {
      var str;
      str = "" + (schemaType[0].toLowerCase()) + (schemaType.substr(1));
      if (App.Templates.Forms[str] != null) {
        return str;
      } else {
        return false;
      }
    };

    Base.prototype.fieldTitle = function(field) {
      var root, _ref;
      if (((_ref = this.getSchema()[field]) != null ? _ref.type : void 0) === "Hidden" || this.getSchema()[field] === "Hidden") {
        return "";
      }
      root = this.paramRoot || this.get("object_class");
      if (_.isObject(this.get(field))) {
        return this.nestedFieldTitle(field);
      } else {
        return this.i18nTitle("" + root + "." + field);
      }
    };

    Base.prototype.nestedFieldTitle = function(field) {
      var title;
      title = this.getSchema()[field].title;
      if (title == null) {
        return "";
      }
      return _.capitalize(this.i18nTitle("forms." + title));
    };

    Base.prototype.i18nTitle = function(str) {
      return I18n.t(str, {
        defaultValue: str
      });
    };

    Base.prototype.initializeNestedModels = function() {
      var model;
      model = this;
      return _.each(this.getNestedFields(), function(nestedModel) {
        return model.set(nestedModel, model.getOrCreateNestedModel(nestedModel), {
          silent: true
        });
      });
    };

    Base.prototype.getModelFromString = function(item) {
      return _.reduce(_.rest(item.split(".")), (function(mem, val) {
        return mem[val];
      }), App);
    };

    Base.prototype.getOrCreateNestedModel = function(modelName) {
      var modelStr, nestedAttributes, nestedModel, nestedSchema, schemaModel, type;
      nestedModel = this.get(modelName);
      if (!this.isModelOrCollection(nestedModel)) {
        type = this.getSchema()[modelName].type.match(/Collection|Model/)[0].toLowerCase();
        modelStr = _.isString(this.getSchema()[modelName][type]) ? this.getSchema()[modelName][type] : this.getSchema()[modelName].modelStr;
        this.getSchema()[modelName].modelStr = modelStr;
        schemaModel = this.getModelFromString(modelStr);
        this.getSchema()[modelName].model = schemaModel;
        nestedSchema = this.getSchema()[modelName].schema;
        nestedAttributes = _.extend(this.get(modelName), {
          schema: nestedSchema
        });
        if (_.isArray(nestedAttributes)) {
          nestedModel = new schemaModel(nestedAttributes, {
            schema: nestedSchema
          });
        } else {
          nestedModel = new schemaModel(_.extend(nestedAttributes, {
            schema: nestedSchema
          }));
        }
      }
      return nestedModel;
    };

    Base.prototype.isModelOrCollection = function(obj) {
      return obj instanceof Backbone.Model || obj instanceof Backbone.Collection;
    };

    Base.prototype.getSchemaFields = function() {
      return _.keys(this.getSchema());
    };

    Base.prototype.getNonSchemaFields = function() {
      return _.difference(_.keys(this.attributes), this.getSchemaFields());
    };

    Base.prototype.getNestedModelNames = function() {
      var base;
      base = this;
      return _.chain(this.getSchema()).map(function(v, k) {
        var associationType, modelStr;
        if ((v != null ? v.type : void 0) === "NestedModel" || (v != null ? v.type : void 0) === "NestedCollection") {
          associationType = (v != null ? v.type : void 0) === "NestedCollection" ? 'collection' : 'model';
          modelStr = _.has(v, 'modelStr') ? v.modelStr : v[associationType];
          return {
            name: k,
            modelStr: modelStr
          };
        }
      }).compact().flatten().value();
    };

    Base.prototype.getNestedFields = function() {
      return _.chain(this.getSchema()).map((function(v, k) {
        if ((v != null ? v.type : void 0) === "NestedModel" || (v != null ? v.type : void 0) === "NestedCollection") {
          return k;
        }
      }), this).compact().flatten().value();
    };

    Base.prototype.bindToForm = function() {
      return _.each(this.get('form').fields, (function(v, k) {
        var _ref, _ref1;
        if ((_ref = v.schema) != null ? (_ref1 = _ref.type) != null ? _ref1.match(/Nested(Model|Collection)/) : void 0 : void 0) {
          if (_.isArray(v.editor.form)) {
            return _.each(v.editor.form, function(i) {
              return i.model.set("form", i);
            });
          } else {
            return v.editor.form.model.set("form", v.editor.form);
          }
        } else {
          this.on("change:" + k, function(model, value, options) {
            if ((options != null ? options.formUpdate : void 0) === true) {
              return this.get('form').setValue(k, value);
            }
          });
          return v.editor.on("change", function(form, editor) {
            return v.editor.model.set(v.editor.key, v.editor.getValue());
          });
        }
      }), this);
    };

    Base.prototype.clearFormAttributes = function() {
      var clearAttrs;
      clearAttrs = _.map(this.get("form").fields, function(v, k) {
        return [k, null];
      });
      return this.set(_.object(clearAttrs), {
        formUpdate: true
      });
    };

    Base.prototype.disableFields = function() {
      this.get("form").$("input").attr("disabled", "disabled");
      return this.set("submitDisabled", true);
    };

    Base.prototype.enableFields = function() {
      this.get("form").$("input").removeAttr("disabled");
      return this.unset("submitDisabled");
    };

    Base.prototype.setFormErrors = function(model, errors) {
      return _.each(errors, (function(v, k) {
        var options, type;
        options = {};
        if (k.search(/\./) === -1) {
          if (!_.isObject(this.get(k))) {
            if (_.has(this.get('form').fields, k)) {
              return this.get('form').fields[k].setError(v);
            } else {
              throw 'field not found #{k}';
            }
          }
        } else {
          type = k.split('.')[0];
          options[k.split(".").slice(1).join('.')] = v;
          return this.get(type).set('formErrors', options);
        }
      }), this);
    };

    Base.prototype.jsonWithNestedSuffix = function(json) {
      var nestedFields;
      nestedFields = this.getNestedFields();
      _.each(nestedFields, (function(i) {
        var nestedJson, nestedModel;
        nestedModel = this.getOrCreateNestedModel(i);
        if (!nestedModel.get("submitDisabled")) {
          nestedJson = nestedModel.toJSON();
          if (!_.isEmpty(nestedJson)) {
            json["" + i + "_attributes"] = nestedJson;
            return delete json["" + i];
          }
        } else {
          return delete json["" + i];
        }
      }), this);
      return json;
    };

    Base.prototype.removeNonSchemaFields = function(json) {
      _.each(this.getNonSchemaFields(), (function(i) {
        return delete json["" + i];
      }), this);
      return json;
    };

    Base.prototype.removeBlacklistedFields = function(json) {
      if (_.size(this.blacklist) < 1) {
        json;
      }
      _.each(this.getSchemaFields(), (function(i) {
        if (_.contains(this.blacklist, i)) {
          return delete json["" + i];
        }
      }), this);
      return json;
    };

    Base.prototype.toJSON = function() {
      var json;
      json = $.extend(true, {}, this.attributes);
      json = this.removeNonSchemaFields(json);
      json = this.removeBlacklistedFields(json);
      return this.jsonWithNestedSuffix(json);
    };

    return Base;

  })(Backbone.Model);

  App.Collections.Base = (function(_super) {
    __extends(Base, _super);

    function Base() {
      this.setModelSchema = __bind(this.setModelSchema, this);
      this.schemaForModel = __bind(this.schemaForModel, this);
      return Base.__super__.constructor.apply(this, arguments);
    }

    Base.prototype.model = App.Models.Base;

    Base.prototype.initialize = function(models, options) {
      if ((options != null ? options.schema : void 0) != null) {
        this.schema = options.schema;
      }
      this.setModelSchema(models);
      return this;
    };

    Base.prototype.schemaForModel = function(model) {
      return this.schema[_.pluck(this.models, 'cid').indexOf(model.cid)];
    };

    Base.prototype.setModelSchema = function(models) {
      if (this.schema) {
        if (_.isArray(this.schema)) {
          return _.each(this.schema, (function(item, index) {
            return models[index].schema = this.schema[index];
          }), this);
        } else {
          return _.each(models, (function(item, index) {
            return item.schema = this.schema;
          }), this);
        }
      }
    };

    Base.prototype.toJSON = function() {
      return _.chain(this.models).map((function(i) {
        return i.toJSON();
      }), this).compact().value();
    };

    return Base;

  })(Backbone.Collection);

}).call(this);
