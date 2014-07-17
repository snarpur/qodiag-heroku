(function() {
  $(document).ready(function() {
    Backbone.Form.validators.errMessages.required = I18n.t("activerecord.errors.messages.empty");
    Backbone.Form.validators.errMessages.email = I18n.t("activerecord.errors.messages.invalid");
    Backbone.Form.validators.errMessages.match = I18n.t("activerecord.errors.messages.not_equal", {
      field: "{{field}}"
    });
    return Backbone.Form.editors.Date.monthNames = I18n.translations.is.date.month_names.slice(1);
  });

}).call(this);
(function() {
  Backbone.Form.Field.prototype.renderingContext = function(schema, editor) {
    var model, nestedTitle, opt, title;
    model = editor.model;
    title = model.fieldTitle(this.key);
    nestedTitle = {
      nestedTitle: model.nestedFieldTitle(this.key)
    };
    if (schema.type === "Radio") {
      _.each(schema.options, function(item, index, list) {
        if (!item.label.match(/[A-Z]/)) {
          return item.label = model.fieldTitle(item.label);
        }
      });
    }
    opt = {
      key: this.key,
      id: editor.id,
      type: schema.type,
      title: title,
      typeClass: "type-" + (schema.type.toLowerCase()),
      editor: '<b class="bbf-tmp-editor"></b>',
      help: '<b class="bbf-tmp-help"></b>',
      error: '<b class="bbf-tmp-error"></b>'
    };
    if ((editor != null ? editor.hasNestedForm : void 0) != null) {
      opt.nestedTitle = Handlebars.compile(App.Templates.FormPartials.nestedTitle)(nestedTitle);
      opt.nestedClass = _.isEmpty(opt.nestedTitle) ? "" : 'nested-fields';
    }
    return opt;
  };

}).call(this);
(function() {
  App.Templates || (App.Templates = {});

  App.Templates.Forms = {
    form: "<form class=\"form-base\"> {{fieldsets}} </form>",
    fieldset: "<fieldset> <legend>{{legend}}</legend> {{fields}} </fieldset>",
    field: "<div class=\"control-group field-{{key}} {{typeClass}}\"> <label class=\"control-label\" for=\"{{id}}\">{{title}}</label> <div class=\"controls\"> <div> {{editor}} <span class=\"help-inline\"> {{error}} </span> </div> <div class=\"help-block\">{{help}}</div> </div> </div>",
    nestedField: "<div class=\"field-{{key}} {{nestedClass}}\"> {{nestedTitle}} <div title=\"{{title}}\">{{editor}}</div> <div class=\"help-block\">{{help}}</div> </div>",
    checkbox: "<div class=\"control-group field-{{key}} type-checkbox\"> <div class=\"controls\"> <label class=\"checkbox\" for=\"{{id}}\">{{editor}}{{title}}</label> <div class=\"help-block\">{{help}}</div> </div> </div>",
    radio: "<div class=\"control-group field-{{key}} type-radio\"> <div class=\"controls\">{{title}} {{editor}} <div class=\"help-block\">{{help}}</div> </div> </div>",
    list: "<div class=\"bbf-list\"> <ul class=\"unstyled clearfix\">{{items}}</ul> <button type=\"button\" class=\"btn bbf-add\" data-action=\"add\">Add</div> </div>",
    listItem: "<li class=\"clearfix\"> <div class=\"pull-left\">{{editor}}</div> <button type=\"button\" class=\"btn bbf-del\" data-action=\"remove\">&times;</button> </li>",
    date: "<div class=\"bbf-date\"> <select data-type=\"date\" class=\"bbf-date\">{{dates}}</select> <select data-type=\"month\" class=\"bbf-month\">{{months}}</select> <select data-type=\"year\" class=\"bbf-year\">{{years}}</select> </div>",
    dateTime: "<div class=\"bbf-datetime\"> <p>{{date}}</p> <p> <select data-type=\"hour\" style=\"width: 4em\">{{hours}}</select>: <select data-type=\"min\" style=\"width: 4em\">{{mins}}</select> </p> </div>",
    "list.Modal": "<div class=\"bbf-list-modal\">  {{summary}}</div>"
  };

  App.Templates.FormPartials = {
    nestedTitle: "{{#if nestedTitle}}<h2>{{nestedTitle}}</h2>{{/if}}"
  };

  (function() {
    var Form, classNames;
    Form = Backbone.Form;
    classNames = {
      error: "error"
    };
    return Form.setTemplates(App.Templates.Forms, classNames);
  })();

}).call(this);
(function() {
  App.FormEditors || (App.FormEditors = {});

  App.FormEditors.HasManySelect = Backbone.Form.editors.Base.extend({
    tagName: "div",
    extensionType: "HasManySelect",
    events: {
      change: function() {
        return this.trigger("change", this);
      },
      focus: function() {
        return this.trigger("focus", this);
      },
      blur: function() {
        return this.trigger("blur", this);
      }
    },
    initialize: function(options) {
      var _ref;
      Backbone.Form.editors.Base.prototype.initialize.call(this, options);
      if (((_ref = this.schema) != null ? _ref.schema : void 0) != null) {
        return _.each(this.schema.schema, (function(v, k) {
          var field, fieldEl;
          field = this.form.fields[k] = this.form.createField(k, v);
          fieldEl = field.render().el;
          return this.$el.append(fieldEl);
        }), this);
      }
    },
    render: function() {
      this.setValue(this.value);
      return this;
    },
    getValue: function() {
      return this.$el.val();
    },
    setValue: function(value) {
      return this.$el.val(value);
    },
    focus: function() {
      if (this.hasFocus) {
        return;
      }
      return this.$el.focus();
    },
    blur: function() {
      if (!this.hasFocus) {
        return;
      }
      return this.$el.blur();
    }
  });

  App.FormEditors.NestedCollection = Backbone.Form.editors.NestedModel.extend({
    tagName: "div",
    extensionType: "NestedCollection",
    events: {
      change: function() {
        return this.trigger("change", this);
      },
      focus: function() {
        return this.trigger("focus", this);
      },
      blur: function() {
        return this.trigger("blur", this);
      }
    },
    initialize: function(options) {
      Backbone.Form.editors.NestedModel.prototype.initialize.call(this, options);
      this.schema.title = "";
      if (!options.schema.model) {
        throw I18n.t("marionette.errors.schema_nested_model_not_found");
      }
    },
    render: function() {
      var data, key, modelInstance, nestedModel;
      data = this.value || {};
      key = this.key;
      nestedModel = this.schema.model;
      modelInstance = (data.constructor === nestedModel ? data : new (this._findNestedModel(nestedModel))(data));
      this._renderModelOrCollection(modelInstance);
      if (this.hasFocus) {
        this.trigger("blur", this);
      }
      return this;
    },
    validate: function() {
      var errors;
      if (_.isArray(this.form)) {
        errors = _.compact(_.map(this.form, function(i) {
          return i.validate();
        }));
        return errors = _.isEmpty(errors) ? null : errors;
      }
    },
    _renderModelOrCollection: function(modelInstance) {
      form;
      var form;
      if (modelInstance instanceof Backbone.Collection) {
        form = [];
        _.each(modelInstance.models, (function(i) {
          i.set("schema", modelInstance.schema);
          return form.push(this._renderNestedForm(i));
        }), this);
      } else {
        form = this._renderNestedForm(modelInstance);
      }
      this.form = form;
      form = (_.isArray(form) ? form : [form]);
      this._observeFormEvents();
      return _.each(form, (function(i) {
        return this.$el.append(i.render().el);
      }), this);
    },
    _renderNestedForm: function(modelInstance) {
      var form;
      form = new Backbone.Form({
        model: modelInstance,
        idPrefix: this.id + "_" + modelInstance.cid + "_",
        fieldTemplate: "nestedField"
      });
      return form;
    },
    _findNestedModel: function(value) {
      if (_.isString(value)) {
        return this._stringToFunction(value);
      } else {
        return value;
      }
    },
    _stringToFunction: function(str) {
      var arr, fn, i, len;
      arr = str.split(".");
      fn = window || this;
      i = 0;
      len = arr.length;
      while (i < len) {
        fn = fn[arr[i]];
        i++;
      }
      if (typeof fn !== "function") {
        throw I18n.t("marionette.errors.schema_model_not_found");
      }
      return fn;
    },
    _observeFormEvents: function() {
      if (_.isArray(this.form)) {
        return _.each(this.form, (function(i) {
          return i.on("all", (function() {
            var args;
            args = _.toArray(arguments);
            args[1] = this;
            return this.trigger.apply(this, args);
          }), this);
        }), this);
      } else {
        return this.form.on("all", (function() {
          var args;
          args = _.toArray(arguments);
          args[1] = this;
          return this.trigger.apply(this, args);
        }), this);
      }
    },
    getValue: function() {
      if (this.value instanceof Backbone.Collection) {
        return this.value;
      } else if (this.form != null) {
        return this.form.getValue();
      } else {
        return this.value;
      }
    },
    focus: function() {
      if (this.hasFocus) {
        return;
      }
      return this.$el.focus();
    },
    blur: function() {
      if (!this.hasFocus) {
        return;
      }
      return this.$el.blur();
    }
  });

}).call(this);
(function() {
  App.FormEditors || (App.FormEditors = {});

  App.FormEditors.NestedCollection = Backbone.Form.editors.NestedModel.extend({
    tagName: "div",
    extensionType: "NestedCollection",
    events: {
      change: function() {
        return this.trigger("change", this);
      },
      focus: function() {
        return this.trigger("focus", this);
      },
      blur: function() {
        return this.trigger("blur", this);
      }
    },
    initialize: function(options) {
      Backbone.Form.editors.NestedModel.prototype.initialize.call(this, options);
      this.schema.title = "";
      if (!options.schema.model) {
        throw I18n.t("marionette.errors.schema_nested_model_not_found");
      }
    },
    render: function() {
      var data, key, modelInstance, nestedModel;
      data = this.value || {};
      key = this.key;
      nestedModel = this.schema.model;
      modelInstance = (data.constructor === nestedModel ? data : new (this._findNestedModel(nestedModel))(data));
      this._renderModelOrCollection(modelInstance);
      if (this.hasFocus) {
        this.trigger("blur", this);
      }
      return this;
    },
    validate: function() {
      var errors;
      if (_.isArray(this.form)) {
        errors = _.compact(_.map(this.form, function(i) {
          return i.validate();
        }));
        return errors = _.isEmpty(errors) ? null : errors;
      }
    },
    _renderModelOrCollection: function(modelInstance) {
      form;
      var form;
      if (modelInstance instanceof Backbone.Collection) {
        form = [];
        _.each(modelInstance.models, (function(i) {
          i.set("schema", modelInstance.schema);
          return form.push(this._renderNestedForm(i));
        }), this);
      } else {
        form = this._renderNestedForm(modelInstance);
      }
      this.form = form;
      form = (_.isArray(form) ? form : [form]);
      this._observeFormEvents();
      return _.each(form, (function(i) {
        return this.$el.append(i.render().el);
      }), this);
    },
    _renderNestedForm: function(modelInstance) {
      var form;
      form = new Backbone.Form({
        model: modelInstance,
        idPrefix: this.id + "_" + modelInstance.cid + "_",
        fieldTemplate: "nestedField"
      });
      return form;
    },
    _findNestedModel: function(value) {
      if (_.isString(value)) {
        return this._stringToFunction(value);
      } else {
        return value;
      }
    },
    _stringToFunction: function(str) {
      var arr, fn, i, len;
      arr = str.split(".");
      fn = window || this;
      i = 0;
      len = arr.length;
      while (i < len) {
        fn = fn[arr[i]];
        i++;
      }
      if (typeof fn !== "function") {
        throw I18n.t("marionette.errors.schema_model_not_found");
      }
      return fn;
    },
    _observeFormEvents: function() {
      if (_.isArray(this.form)) {
        return _.each(this.form, (function(i) {
          return i.on("all", (function() {
            var args;
            args = _.toArray(arguments);
            args[1] = this;
            return this.trigger.apply(this, args);
          }), this);
        }), this);
      } else {
        return this.form.on("all", (function() {
          var args;
          args = _.toArray(arguments);
          args[1] = this;
          return this.trigger.apply(this, args);
        }), this);
      }
    },
    getValue: function() {
      if (this.value instanceof Backbone.Collection) {
        return this.value;
      } else if (this.form != null) {
        return this.form.getValue();
      } else {
        return this.value;
      }
    },
    focus: function() {
      if (this.hasFocus) {
        return;
      }
      return this.$el.focus();
    },
    blur: function() {
      if (!this.hasFocus) {
        return;
      }
      return this.$el.blur();
    }
  });

  Backbone.Form.editors['NestedCollection'] = App.FormEditors.NestedCollection;

}).call(this);
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
(function() {
  var _base,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (_base = App.Lib).ChartEvents || (_base.ChartEvents = {});

  App.Lib.ChartEvents.Drilldown = (function(_super) {
    __extends(Drilldown, _super);

    function Drilldown() {
      this.addChartToHistory = __bind(this.addChartToHistory, this);
      this.addQuestionListToHistory = __bind(this.addQuestionListToHistory, this);
      this.mergeParamsFromRoot = __bind(this.mergeParamsFromRoot, this);
      this.getQuestionList = __bind(this.getQuestionList, this);
      this.drilldown = __bind(this.drilldown, this);
      this.drillup = __bind(this.drillup, this);
      return Drilldown.__super__.constructor.apply(this, arguments);
    }

    Drilldown.prototype.initialize = function() {
      this.chart = this.get('chart');
      this.set("paramsHistory", [this.chart.attributes]);
      this.chart.get('plotOptions').column.cursor = 'pointer';
      return this.chart.get('plotOptions').column.point.events.click = this.drilldown;
    };

    Drilldown.prototype.drillup = function() {
      var paramsHistory;
      paramsHistory = _.initial(this.get('paramsHistory'));
      return this.set("paramsHistory", paramsHistory);
    };

    Drilldown.prototype.getCurrentChartParams = function() {
      return _.last(this.get("paramsHistory"));
    };

    Drilldown.prototype.drilldown = function(event) {
      var drilldown, target;
      target = event.currentTarget;
      if (target.drilldown) {
        this.set({
          previousChart: target.series.chart
        });
        drilldown = $.extend(true, {}, target.drilldown);
        return this.addChartToHistory(drilldown);
      } else if (this.isQuestionList(target.category)) {
        return this.getQuestionList(target.category);
      }
    };

    Drilldown.prototype.getQuestionList = function(questionGroupName) {
      var callbacks, drilldown, questionList;
      questionList = new App.Collections.QuestionResponse(questionGroupName, this.chart);
      drilldown = this;
      callbacks = {
        success: function(model, response) {
          return drilldown.addQuestionListToHistory(questionList);
        },
        error: function(model, response) {
          throw I18n.t("surveys.messages.question_list_failed", {
            name: questionGroupName
          });
        }
      };
      return questionList.fetch(callbacks);
    };

    Drilldown.prototype.mergeParamsFromRoot = function(params) {
      var inherited;
      inherited = ["chart", "credits", "legend", "subtitle", "title", "tooltip", "yAxis", "xAxis", "plotOptions"];
      _.each(inherited, (function(i) {
        var target;
        target = params[i];
        if (target == null) {
          target = {};
        }
        return params[i] = $.extend({}, this.chart.get(i), target);
      }), this);
      params.chart.width = App.Timeline.Dimensions.history_view_width;
      return params;
    };

    Drilldown.prototype.isQuestionList = function(category) {
      return _.contains(this.chart.get('questionListDrilldown'), category);
    };

    Drilldown.prototype.addQuestionListToHistory = function(questionResponse) {
      var paramsHistory;
      paramsHistory = this.get("paramsHistory");
      paramsHistory.push(questionResponse);
      this.set('paramsHistory', paramsHistory);
      return this.trigger('change:paramsHistory');
    };

    Drilldown.prototype.addChartToHistory = function(params) {
      var paramsHistory;
      params = this.mergeParamsFromRoot(params);
      paramsHistory = this.get("paramsHistory");
      paramsHistory.push(params);
      this.set('paramsHistory', paramsHistory);
      return this.trigger('change:paramsHistory');
    };

    return Drilldown;

  })(Backbone.Model);

}).call(this);
(function() {
  var _base,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  (_base = App.Lib).ChartFormatters || (_base.ChartFormatters = {});

  App.Lib.ChartFormatters.Chart = (function() {
    Chart.prototype.formatters = function() {
      return ["plotOptions.column.dataLabels.formatter", "plotOptions.scatter.dataLabels.formatter", "xAxis.labels.formatter", "yAxis.labels.formatter", "legend.labelFormatter", "tooltip.formatter", "subtitle.text", "title.text"];
    };

    function Chart(chart_config) {
      this.titleText = __bind(this.titleText, this);
      this.subtitleText = __bind(this.subtitleText, this);
      this.legendLabelFormatter = __bind(this.legendLabelFormatter, this);
      this.plotOptionsScatterDataLabelsFormatter = __bind(this.plotOptionsScatterDataLabelsFormatter, this);
      this.getFormatterFunction = __bind(this.getFormatterFunction, this);
      this.setFormatters = __bind(this.setFormatters, this);
      this.findKeyAndValue = __bind(this.findKeyAndValue, this);
      this.chart = chart_config;
    }

    Chart.prototype.findValue = function(obj, path) {
      var nestedValue, pathArray;
      pathArray = path.split(".");
      nestedValue = _.reduce(pathArray, (function(m, i) {
        if ((m != null ? m[i] : void 0) != null) {
          return m[i];
        }
      }), obj);
      return nestedValue;
    };

    Chart.prototype.findKey = function(obj, path) {
      var nestedKey, pathArray;
      pathArray = path.split(".");
      nestedKey = _.reduce(_.initial(pathArray), (function(m, i) {
        if ((m != null ? m[i] : void 0) != null) {
          return m[i];
        }
      }), obj);
      return nestedKey;
    };

    Chart.prototype.findKeyAndValue = function(obj, path) {
      var nestedKey, nestedValue, pathArray;
      pathArray = path.split(".");
      nestedValue = _.last(pathArray);
      nestedKey = _.reduce(_.initial(pathArray), (function(m, i) {
        if ((m != null ? m[i] : void 0) != null) {
          return m[i];
        }
      }), obj);
      if (nestedKey != null) {
        return {
          key: nestedKey,
          value: nestedValue
        };
      }
    };

    Chart.prototype.setFormatters = function() {
      _.each(this.formatters(), (function(f) {
        var target, value, _ref;
        target = this.findKeyAndValue(this.chart, f);
        if ((target != null ? (_ref = target.key) != null ? _ref[target.value] : void 0 : void 0) != null) {
          value = target.key[target.value];
          return target.key[target.value] = this.getFormatterFunction(f, value);
        }
      }), this);
      return this.chart;
    };

    Chart.prototype.getFormatterFunction = function(str, options) {
      var functionString;
      functionString = _.camelize(str.replace(/\./g, "-"));
      if (options === true) {
        options = {
          name: 'default'
        };
      }
      return this[functionString].call(this, options);
    };

    Chart.prototype.plotOptionsColumnDataLabelsFormatter = function() {
      return function() {
        if ((this.point.config.name != null) && this.point.config.name.data_label) {
          return this.point.config.name.data_label;
        } else {
          return this.y;
        }
      };
    };

    Chart.prototype.plotOptionsScatterDataLabelsFormatter = function() {
      var accessCode;
      accessCode = this.chart.accessCode;
      return function() {
        var nameI18n;
        nameI18n = _.capitalize(I18n.t("surveys." + accessCode + ".terms." + this.series.name.name));
        return "" + this.series.name.value + " " + nameI18n;
      };
    };

    Chart.prototype.legendLabelFormatter = function() {
      var accessCode;
      accessCode = this.chart.accessCode;
      return function() {
        var str;
        str = I18n.t("surveys." + accessCode + ".terms." + this.name);
        if (_.includes(str, 'missing')) {
          str = this.name;
        }
        return _.capitalize(str);
      };
    };

    Chart.prototype.subtitleText = function() {
      return I18n.l("date.formats.long", this.chart.subtitle.text);
    };

    Chart.prototype.titleText = function() {
      var title;
      title = _.chain(this.chart.title.text).map((function(i) {
        return this["title" + (_(i[0]).capitalize())].call(this, i[1]);
      }), this).flatten().value();
      return title.join(" ");
    };

    Chart.prototype.titleSurvey = function(name) {
      return _(I18n.t("surveys." + name + ".name")).capitalize();
    };

    Chart.prototype.titleSex = function(sex) {
      return I18n.t("surveys.terms." + sex);
    };

    Chart.prototype.titleAge = function(age) {
      var str;
      str = "" + age + " ";
      return str.concat(I18n.t("surveys.terms.age"));
    };

    Chart.prototype.titleRespondent = function(respondent) {
      return I18n.t("surveys.terms.norm_reference." + respondent);
    };

    return Chart;

  })();

}).call(this);
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  App.Lib.ChartFormatters.Column = (function(_super) {
    __extends(Column, _super);

    function Column() {
      this.tooltipFormatter = __bind(this.tooltipFormatter, this);
      this.xAxisLabelsFormatter = __bind(this.xAxisLabelsFormatter, this);
      this.plotOptionsColumnDataLabelsFormatter = __bind(this.plotOptionsColumnDataLabelsFormatter, this);
      return Column.__super__.constructor.apply(this, arguments);
    }

    Column.prototype.plotOptionsColumnDataLabelsFormatter = function() {
      return function() {
        if ((this.point.config.name != null) && this.point.config.name.data_label) {
          return this.point.config.name.data_label;
        } else {
          return this.y;
        }
      };
    };

    Column.prototype.xAxisLabelsFormatter = function() {
      var accessCode, standardDeviation;
      accessCode = this.chart.accessCode;
      standardDeviation = this.chart.chart.type === 'areaspline';
      return function() {
        var str;
        if (standardDeviation) {
          return this.value;
        } else if (_.isNaN(parseInt(this.value))) {
          str = I18n.t("surveys." + accessCode + ".terms." + this.value);
        } else {
          str = I18n.t("surveys." + accessCode + ".terms.terms")[parseInt(this.value) - 1];
        }
        if (_.includes(str, 'missing')) {
          str = this.value;
        }
        str.replace(/\s/, "\n");
        return _.capitalize(str);
      };
    };

    Column.prototype.tooltipFormatter = function(options) {
      var formatters;
      formatters = {
        countHighScores: function() {
          var labelText, totalHighScores;
          labelText = "";
          if (typeof this.points === "object") {
            totalHighScores = _.countBy(_.toArray(_.pluck(this.points[0].point.values, 'weight')), function(num) {
              return _.contains(options.argument, num);
            })["true"];
            if (totalHighScores > 0) {
              labelText += '<strong>' + options.argument.join(I18n.t("terms.y")) + ': </strong>';
              labelText += totalHighScores + '/' + this.points[0].point.values.length;
            }
          }
          return labelText;
        },
        "default": function() {
          return "";
        }
      };
      return formatters[options.name];
    };

    return Column;

  })(App.Lib.ChartFormatters.Chart);

}).call(this);
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  App.Lib.ChartFormatters.Line = (function(_super) {
    __extends(Line, _super);

    function Line() {
      this.xAxisLabelsFormatter = __bind(this.xAxisLabelsFormatter, this);
      return Line.__super__.constructor.apply(this, arguments);
    }

    Line.prototype.formatters = function() {
      return ["plotOptions.column.dataLabels.formatter", "xAxis.labels.formatter", "legend.labelFormatter"];
    };

    Line.prototype.xAxisLabelsFormatter = function() {
      return function() {
        return I18n.l("date.formats.default", new Date(this.value));
      };
    };

    return Line;

  })(App.Lib.ChartFormatters.Chart);

}).call(this);
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  App.Lib.ChartFormatters.QuestionList = (function(_super) {
    __extends(QuestionList, _super);

    function QuestionList() {
      this.legendLabelFormatter = __bind(this.legendLabelFormatter, this);
      this.yAxisLabelsFormatter = __bind(this.yAxisLabelsFormatter, this);
      this.xAxisLabelsFormatter = __bind(this.xAxisLabelsFormatter, this);
      return QuestionList.__super__.constructor.apply(this, arguments);
    }

    QuestionList.prototype.xAxisLabelsFormatter = function() {
      var accessCode;
      accessCode = this.chart.accessCode;
      return function() {
        var css, height, str;
        if (_.isNaN(parseInt(this.value))) {
          str = I18n.t("surveys." + accessCode + ".terms." + this.value);
        } else {
          str = I18n.t("surveys." + accessCode + ".questions")[parseInt(this.value) - 1];
        }
        if (_.includes(str, 'missing')) {
          str = this.value;
        }
        str.replace(/\s/, "\n");
        height = this.chart.plotBox.height / this.axis.categories.length;
        css = "'height:" + height + "px; line-height:" + height + "px;'";
        return "<span style=" + css + ">" + (_.capitalize(str)) + "</span>";
      };
    };

    QuestionList.prototype.yAxisLabelsFormatter = function() {
      var accessCode;
      accessCode = this.chart.accessCode;
      return function() {
        var css, str, width;
        str = I18n.t("surveys." + accessCode + ".answers")[parseInt(this.value)];
        width = this.chart.plotBox.width / this.axis.max;
        css = "'widt:" + width + "px; margin-left:" + width + "px;'";
        return "<span style=" + css + ">" + (_.capitalize(str)) + "</span>";
      };
    };

    QuestionList.prototype.legendLabelFormatter = function() {
      var accessCode;
      accessCode = this.chart.accessCode;
      return function() {
        var str;
        str = I18n.t("surveys." + accessCode + ".terms." + this.name);
        if (_.includes(str, 'missing')) {
          str = this.name;
        }
        return _.capitalize(str);
      };
    };

    return QuestionList;

  })(App.Lib.ChartFormatters.Column);

}).call(this);
(function() {
  $.fn.extend({
    setCssState: function(state, prefix) {
      var cssString, hasState, isStateStr, newState, regexp, setState, settings, updatedCssStr;
      settings = {
        state: '',
        regexp: /^state\-[a-z\-]*/g,
        prefix: 'state-'
      };
      if ((prefix != null) && _.isString(prefix)) {
        regexp = "\^" + (_.trim(prefix, "-")) + "\\-[a-z\-]*";
        settings.regexp = new RegExp(regexp, "g");
        settings.prefix = "" + prefix + "-";
      }
      settings.state = state;
      setState = (function(_this) {
        return function() {
          return _this.attr('class', updatedCssStr());
        };
      })(this);
      updatedCssStr = (function(_this) {
        return function() {
          css;
          var css;
          if (hasState()) {
            css = cssString().replace(hasState(), newState());
          } else {
            css = "" + (cssString()) + " " + (newState());
          }
          return _.trim(css);
        };
      })(this);
      cssString = (function(_this) {
        return function() {
          var _ref;
          return (_ref = _this.attr('class')) != null ? _ref : "";
        };
      })(this);
      isStateStr = (function(_this) {
        return function(str) {
          return str.match(settings.regexp);
        };
      })(this);
      hasState = (function(_this) {
        return function() {
          return _.find(cssString().split(" "), function(str) {
            return _.isArray(str.match(settings.regexp));
          });
        };
      })(this);
      newState = (function(_this) {
        return function() {
          if (_.isBlank(settings.state)) {
            return "";
          } else {
            return "" + settings.prefix + settings.state;
          }
        };
      })(this);
      return this.each(function() {
        return setState(settings);
      });
    },
    cssState: function(prefix) {
      var css, regexp, settings;
      settings = {
        state: '',
        regexp: /^state\-[a-z\-]*/g,
        prefix: 'state-'
      };
      if ((prefix != null) && _.isString(prefix)) {
        regexp = "\^" + (_.trim(prefix, "-")) + "\\-[a-z\-]*";
        settings.regexp = new RegExp(regexp, "g");
        settings.prefix = "" + prefix + "-";
      }
      css = this.attr('class').match(settings.regexp);
      if (css !== null) {
        return css[0].split("-")[1];
      }
    }
  });

}).call(this);
(function() {
  App.FormEditors || (App.FormEditors = {});

  App.FormEditors.HasManySelect = Backbone.Form.editors.Base.extend({
    tagName: "div",
    extensionType: "HasManySelect",
    events: {
      change: function() {
        return this.trigger("change", this);
      },
      focus: function() {
        return this.trigger("focus", this);
      },
      blur: function() {
        return this.trigger("blur", this);
      }
    },
    initialize: function(options) {
      var _ref;
      Backbone.Form.editors.Base.prototype.initialize.call(this, options);
      if (((_ref = this.schema) != null ? _ref.schema : void 0) != null) {
        return _.each(this.schema.schema, (function(v, k) {
          var field, fieldEl;
          field = this.form.fields[k] = this.form.createField(k, v);
          fieldEl = field.render().el;
          return this.$el.append(fieldEl);
        }), this);
      }
    },
    render: function() {
      this.setValue(this.value);
      return this;
    },
    getValue: function() {
      return this.$el.val();
    },
    setValue: function(value) {
      return this.$el.val(value);
    },
    focus: function() {
      if (this.hasFocus) {
        return;
      }
      return this.$el.focus();
    },
    blur: function() {
      if (!this.hasFocus) {
        return;
      }
      return this.$el.blur();
    }
  });

}).call(this);
(function() {
  $.fn.extend({
    helpOverlay: function() {
      var setUp, settings;
      settings = {
        trigger: 'a',
        overlay: "#help-overlay"
      };
      setUp = (function(_this) {
        return function() {
          return $(_this, settings.trigger).bind("click", function(e) {
            e.preventDefault();
            return $(settings.overlay).toggleClass("visible");
          });
        };
      })(this);
      return this.each(function() {
        return setUp(settings);
      });
    }
  });

}).call(this);
/**
 * Gray theme for Highcharts JS
 * @author Torstein Hønsi
 */


Highcharts.theme = {
colors: ['#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4'],
   chart: {
      backgroundColor: null,
      borderWidth: 0,
      plotBackgroundColor: null,
      plotShadow: false,
      plotBorderWidth: 0
   },
   title: {
      style: { 
         color: '#FFF',
         font: '16px Lucida Grande, Lucida Sans Unicode, Verdana, Arial, Helvetica, sans-serif'
      }
   },
   subtitle: {
      style: { 
         color: '#DDD',
         font: '12px Lucida Grande, Lucida Sans Unicode, Verdana, Arial, Helvetica, sans-serif'
      }
   },
   xAxis: {
      gridLineWidth: 0,
      lineColor: '#999',
      tickColor: '#999',
      labels: {
         style: {
            color: '#999',
            fontWeight: 'bold'
         }
      },
      title: {
         style: {
            color: '#AAA',
            font: 'bold 12px Lucida Grande, Lucida Sans Unicode, Verdana, Arial, Helvetica, sans-serif'
         }            
      }
   },
   yAxis: {
      alternateGridColor: null,
      minorTickInterval: null,
      gridLineColor: 'rgba(255, 255, 255, .1)',
      lineWidth: 0,
      tickWidth: 0,
      labels: {
         style: {
            color: '#999',
            fontWeight: 'bold'
         }
      },
      title: {
         style: {
            color: '#AAA',
            font: 'bold 12px Lucida Grande, Lucida Sans Unicode, Verdana, Arial, Helvetica, sans-serif'
         }            
      }
   },
   legend: {
      itemStyle: {
         color: '#CCC'
      },
      itemHoverStyle: {
         color: '#FFF'
      },
      itemHiddenStyle: {
         color: '#888'
      }
   },
   labels: {
      style: {
         color: '#CCC'
      }
   },
   tooltip: {
      backgroundColor: {
         linearGradient: [0, 0, 0, 50],
         stops: [
            [0, 'rgba(96, 96, 96, .8)'],
            [1, 'rgba(16, 16, 16, .8)']
         ]
      },
      borderWidth: 0,
      style: {
         color: '#FFF'
      }
   },
   
   
   plotOptions: {
      line: {
         dataLabels: {
            color: '#CCC'
         },
         marker: {
            lineColor: '#333'
         }
      },
      spline: {
         marker: {
            lineColor: '#333'
         }
      },
      scatter: {
         marker: {
            lineColor: '#333'
         }
      },
      candlestick: {
         lineColor: 'white'
      },
      column: {
         dataLabels: {
            color: '#111'
         },
      }
   },
   
   toolbar: {
      itemStyle: {
         color: '#CCC'
      }
   },
   
   navigation: {
      buttonOptions: {
         backgroundColor: {
            linearGradient: [0, 0, 0, 20],
            stops: [
               [0.4, '#606060'],
               [0.6, '#333333']
            ]
         },
         borderColor: '#000000',
         symbolStroke: '#C0C0C0',
         hoverSymbolStroke: '#FFFFFF'
      }
   },
   
   exporting: {
      buttons: {
         exportButton: {
            symbolFill: '#55BE3B'
         },
         printButton: {
            symbolFill: '#7797BE'
         }
      }
   },
   
   // scroll charts
   rangeSelector: {
      buttonTheme: {
         fill: {
            linearGradient: [0, 0, 0, 20],
            stops: [
               [0.4, '#888'],
               [0.6, '#555']
            ]
         },
         stroke: '#000000',
         style: {
            color: '#CCC',
            fontWeight: 'bold'
         },
         states: {
            hover: {
               fill: {
                  linearGradient: [0, 0, 0, 20],
                  stops: [
                     [0.4, '#BBB'],
                     [0.6, '#888']
                  ]
               },
               stroke: '#000000',
               style: {
                  color: 'white'
               }
            },
            select: {
               fill: {
                  linearGradient: [0, 0, 0, 20],
                  stops: [
                     [0.1, '#000'],
                     [0.3, '#333']
                  ]
               },
               stroke: '#000000',
               style: {
                  color: 'yellow'
               }
            }
         }               
      },
      inputStyle: {
         backgroundColor: '#333',
         color: 'silver'
      },
      labelStyle: {
         color: 'silver'
      }
   },
   
   navigator: {
      handles: {
         backgroundColor: '#666',
         borderColor: '#AAA'
      },
      outlineColor: '#CCC',
      maskFill: 'rgba(16, 16, 16, 0.5)',
      series: {
         color: '#7798BF',
         lineColor: '#A6C7ED'
      }
   },
   
   scrollbar: {
      barBackgroundColor: {
            linearGradient: [0, 0, 0, 20],
            stops: [
               [0.4, '#888'],
               [0.6, '#555']
            ]
         },
      barBorderColor: '#CCC',
      buttonArrowColor: '#CCC',
      buttonBackgroundColor: {
            linearGradient: [0, 0, 0, 20],
            stops: [
               [0.4, '#888'],
               [0.6, '#555']
            ]
         },
      buttonBorderColor: '#CCC',
      rifleColor: '#FFF',
      trackBackgroundColor: {
         linearGradient: [0, 0, 0, 10],
         stops: [
            [0, '#000'],
            [1, '#333']
         ]
      },
      trackBorderColor: '#666'
   },
   
   // special colors for some of the demo examples
   legendBackgroundColor: 'rgba(48, 48, 48, 0.8)',
   legendBackgroundColorSolid: 'rgb(70, 70, 70)',
   dataLabelsColor: '#444',
   textColor: '#E0E0E0',
   maskColor: 'rgba(255,255,255,0.3)'
};
/**
 * Gray theme for Highcharts JS
 * @author Torstein Hønsi
 */


Highcharts.themelight = {
colors: ['#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4'],
   chart: {
      backgroundColor: null,
      borderWidth: 0,
      plotBackgroundColor: null,
      plotShadow: false,
      plotBorderWidth: 0
   },
   title: {
      style: { 
         color: '#111',
         font: '16px Lucida Grande, Lucida Sans Unicode, Verdana, Arial, Helvetica, sans-serif'
      }
   },
   subtitle: {
      style: { 
         color: '#666',
         font: '12px Lucida Grande, Lucida Sans Unicode, Verdana, Arial, Helvetica, sans-serif'
      }
   },
   xAxis: {
      gridLineWidth: 0,
      lineColor: '#333',
      tickColor: '#333',
      labels: {
         style: {
            color: '#111',
            fontWeight: 'bold'
         }
      },
      title: {
         style: {
            color: '#333',
            font: 'bold 12px Lucida Grande, Lucida Sans Unicode, Verdana, Arial, Helvetica, sans-serif'
         }            
      }
   },
   yAxis: {
      alternateGridColor: null,
      minorTickInterval: null,
      gridLineColor: 'rgba(0, 0, 0, .3)',
      lineWidth: 0,
      tickWidth: 0,
      labels: {
         style: {
            color: '#111',
            fontWeight: 'bold'
         }
      },
      title: {
         style: {
            color: '#333',
            font: 'bold 12px Lucida Grande, Lucida Sans Unicode, Verdana, Arial, Helvetica, sans-serif'
         }            
      }
   },
   legend: {
      itemStyle: {
         color: '#333'
      },
      itemHoverStyle: {
         color: '#111'
      },
      itemHiddenStyle: {
         color: '#444'
      }
   },
   labels: {
      style: {
         color: '#111'
      }
   },
   tooltip: {
      backgroundColor: {
         linearGradient: [0, 0, 0, 50],
         stops: [
            [0, 'rgba(96, 96, 96, .8)'],
            [1, 'rgba(16, 16, 16, .8)']
         ]
      },
      borderWidth: 0,
      style: {
         color: '#333'
      }
   },
   
   
   plotOptions: {
      line: {
         dataLabels: {
            color: '#666'
         },
         marker: {
            lineColor: '#333'
         }
      },
      spline: {
         marker: {
            lineColor: '#333'
         }
      },
      scatter: {
         marker: {
            lineColor: '#333'
         }
      },
      candlestick: {
         lineColor: '#111'
      },
      column: {
         dataLabels: {
            color: '#111'
         }
      }
   },
   
   toolbar: {
      itemStyle: {
         color: '#CCC'
      }
   },
   
   navigation: {
      buttonOptions: {
         backgroundColor: {
            linearGradient: [0, 0, 0, 20],
            stops: [
               [0.4, '#606060'],
               [0.6, '#333333']
            ]
         },
         borderColor: '#000000',
         symbolStroke: '#C0C0C0',
         hoverSymbolStroke: '#333'
      }
   },
   
   exporting: {
      buttons: {
         exportButton: {
            symbolFill: '#55BE3B'
         },
         printButton: {
            symbolFill: '#7797BE'
         }
      }
   },
   
   // scroll charts
   rangeSelector: {
      buttonTheme: {
         fill: {
            linearGradient: [0, 0, 0, 20],
            stops: [
               [0.4, '#888'],
               [0.6, '#555']
            ]
         },
         stroke: '#000000',
         style: {
            color: '#CCC',
            fontWeight: 'bold'
         },
         states: {
            hover: {
               fill: {
                  linearGradient: [0, 0, 0, 20],
                  stops: [
                     [0.4, '#BBB'],
                     [0.6, '#888']
                  ]
               },
               stroke: '#000000',
               style: {
                  color: 'white'
               }
            },
            select: {
               fill: {
                  linearGradient: [0, 0, 0, 20],
                  stops: [
                     [0.1, '#000'],
                     [0.3, '#333']
                  ]
               },
               stroke: '#000000',
               style: {
                  color: 'yellow'
               }
            }
         }               
      },
      inputStyle: {
         backgroundColor: '#333',
         color: 'silver'
      },
      labelStyle: {
         color: 'silver'
      }
   },
   
   navigator: {
      handles: {
         backgroundColor: '#666',
         borderColor: '#AAA'
      },
      outlineColor: '#CCC',
      maskFill: 'rgba(16, 16, 16, 0.5)',
      series: {
         color: '#7798BF',
         lineColor: '#A6C7ED'
      }
   },
   
   scrollbar: {
      barBackgroundColor: {
            linearGradient: [0, 0, 0, 20],
            stops: [
               [0.4, '#888'],
               [0.6, '#555']
            ]
         },
      barBorderColor: '#CCC',
      buttonArrowColor: '#CCC',
      buttonBackgroundColor: {
            linearGradient: [0, 0, 0, 20],
            stops: [
               [0.4, '#888'],
               [0.6, '#555']
            ]
         },
      buttonBorderColor: '#CCC',
      rifleColor: '#FFF',
      trackBackgroundColor: {
         linearGradient: [0, 0, 0, 10],
         stops: [
            [0, '#000'],
            [1, '#333']
         ]
      },
      trackBorderColor: '#666'
   },
   
   // special colors for some of the demo examples
   legendBackgroundColor: 'rgba(48, 48, 48, 0.8)',
   legendBackgroundColorSolid: 'rgb(70, 70, 70)',
   dataLabelsColor: '#444',
   textColor: '#E0E0E0',
   maskColor: 'rgba(255,255,255,0.3)'
};

// Apply the theme
var highchartsOptions = Highcharts.setOptions(Highcharts.themelight);
(function() {
  Backbone.Marionette.Renderer.render = function(template, data) {
    if (!_.startsWith(template, "templates")) {
      template = "templates/" + template;
    }
    if (!JST["backbone_app/" + template]) {
      throw I18n.t("marionette.errors.template_not_found", {
        template: template
      });
    }
    return JST["backbone_app/" + template](data);
  };

}).call(this);
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  App.Marionette || (App.Marionette = {});

  App.Marionette.ItemView = (function(_super) {
    __extends(ItemView, _super);

    function ItemView() {
      return ItemView.__super__.constructor.apply(this, arguments);
    }

    ItemView.prototype.serializeData = function() {
      return this.model.attributes;
    };

    return ItemView;

  })(Backbone.Marionette.ItemView);

  App.Marionette.CollectionView = (function(_super) {
    __extends(CollectionView, _super);

    function CollectionView() {
      return CollectionView.__super__.constructor.apply(this, arguments);
    }

    return CollectionView;

  })(Backbone.Marionette.CollectionView);

  App.Marionette.CompositeView = (function(_super) {
    __extends(CompositeView, _super);

    function CompositeView() {
      return CompositeView.__super__.constructor.apply(this, arguments);
    }

    return CompositeView;

  })(Backbone.Marionette.CompositeView);

}).call(this);
(function() {
  App.Lib.Spinner = new Spinner({
    lines: 13,
    length: 7,
    width: 4,
    radius: 10,
    corners: 1,
    rotate: 0,
    color: "#eaeaea",
    speed: 1,
    trail: 60,
    shadow: false,
    hwaccel: false,
    className: "spinner",
    zIndex: 2e9,
    top: "50",
    left: "auto"
  });

}).call(this);
(function() {
  App.Lib.useragentDetection = (function() {
    function useragentDetection() {
      var bw;
      bw = new App.Views.useragentDetectionView({
        browser: $.browser
      });
      $("#wrapper").append(bw.render().el);
    }

    return useragentDetection;

  })();

}).call(this);
