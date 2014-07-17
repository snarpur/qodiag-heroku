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
