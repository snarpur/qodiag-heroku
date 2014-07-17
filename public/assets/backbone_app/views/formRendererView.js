(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  App.Views.FormRenderer = (function(_super) {
    __extends(FormRenderer, _super);

    function FormRenderer() {
      this.render = __bind(this.render, this);
      this.renderForm = __bind(this.renderForm, this);
      this.renderStepNavigation = __bind(this.renderStepNavigation, this);
      this.renderSteps = __bind(this.renderSteps, this);
      this.bindForm = __bind(this.bindForm, this);
      this.submitForm = __bind(this.submitForm, this);
      this.validateForm = __bind(this.validateForm, this);
      this.initialize = __bind(this.initialize, this);
      return FormRenderer.__super__.constructor.apply(this, arguments);
    }

    FormRenderer.prototype.id = "form-wizard";

    FormRenderer.prototype.className = "form-base form-horizontal";

    FormRenderer.prototype.events = {
      "click button.submit-btn": "validateForm"
    };

    FormRenderer.prototype.initialize = function() {
      this.router = this.options.router;
      this.listenTo(this.model, "destructionComplete", this.submitForm);
      return this;
    };

    FormRenderer.prototype.template = function() {
      return JST['backbone_app/templates/multistepFormTmpl'];
    };

    FormRenderer.prototype.validateForm = function() {
      var errors;
      errors = this.form.commit();
      if (_.isEmpty(errors)) {
        return this.model.destroyInQueue();
      }
    };

    FormRenderer.prototype.submitForm = function() {
      return this.model.save(this.model.toJSON(), this.submitCallbacks());
    };

    FormRenderer.prototype.submitCallbacks = function() {
      var callbacks, view;
      view = this;
      return callbacks = {
        success: function(model, response) {
          if (!(_.isEmpty(response.errors))) {
            view.renderSteps();
            return model.get('formModel').set('formErrors', response.errors);
          } else if (view.model.onLastStep()) {
            return window.location.href = view.model.urlOnComplete();
          } else {
            return view.model.nextStep();
          }
        },
        error: function(model, response) {
          throw I18n.t("marionette.errors.model_not_saved", {
            model: model
          });
        }
      };
    };

    FormRenderer.prototype.bindForm = function(form, model) {
      return _.each(form.fields, function(v, k) {
        return v.model.bindToForm(v.form);
      });
    };

    FormRenderer.prototype.renderSteps = function() {
      var rootModel;
      rootModel = this.model.get("formModel");
      this.form = new Backbone.Form({
        model: rootModel
      }).render();
      $(this.form.el).addClass("form-horizontal");
      this.$('#wizard-fields').empty();
      this.$('#wizard-fields').append(this.form.el);
      return rootModel.set("form", this.form);
    };

    FormRenderer.prototype.renderStepNavigation = function() {
      var step;
      step = new App.Views.MultistepFormNavigation({
        model: this.model
      });
      this.$("." + step.className).remove();
      return $(this.el).prepend(step.render().el);
    };

    FormRenderer.prototype.renderForm = function() {
      this.renderSteps();
      return this.renderStepNavigation();
    };

    FormRenderer.prototype.render = function() {
      $(this.el).html(this.template()({}));
      return this;
    };

    return FormRenderer;

  })(Backbone.View);

}).call(this);
