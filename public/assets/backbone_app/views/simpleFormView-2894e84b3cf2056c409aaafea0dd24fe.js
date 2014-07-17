(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  App.Views.SimpleForm = (function(_super) {
    __extends(SimpleForm, _super);

    function SimpleForm() {
      this.destroyForm = __bind(this.destroyForm, this);
      this.container = __bind(this.container, this);
      this.triggerDestroy = __bind(this.triggerDestroy, this);
      this.submitForm = __bind(this.submitForm, this);
      this.validateForm = __bind(this.validateForm, this);
      return SimpleForm.__super__.constructor.apply(this, arguments);
    }

    SimpleForm.prototype.className = "simple-form editable-item";

    SimpleForm.prototype.template = "simpleFormTmpl";

    SimpleForm.prototype.events = {
      "click .btn-submit": "validateForm",
      "click .btn-cancel": "destroyForm"
    };

    SimpleForm.prototype.onRender = function() {
      this.form = new Backbone.Form({
        model: this.model
      }).render();
      this.$el.prepend(this.form.el);
      return this.form.$el.addClass('form-horizontal');
    };

    SimpleForm.prototype.validateForm = function() {
      var errors;
      errors = this.form.commit();
      if (_.isEmpty(errors)) {
        return this.submitForm();
      }
    };

    SimpleForm.prototype.submitForm = function() {
      var callbacks, view;
      view = this;
      callbacks = {
        success: function(model, response) {
          return view.destroyForm();
        },
        error: function(model, xhr) {
          throw I18n.t("marionette.errors.model_not_saved", {
            model: model
          });
        }
      };
      return this.model.save(this.model.attributes, callbacks);
    };

    SimpleForm.prototype.triggerDestroy = function(model, response) {
      var paramRoot;
      return paramRoot = this.model.paramRoot;
    };

    SimpleForm.prototype.container = function() {
      return this.$el.parent();
    };

    SimpleForm.prototype.destroyForm = function() {
      return this.trigger("destroy", this);
    };

    return SimpleForm;

  })(Backbone.Marionette.ItemView);

}).call(this);
