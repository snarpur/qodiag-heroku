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
