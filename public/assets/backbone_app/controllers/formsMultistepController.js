(function() {
  var _base,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (_base = App.Controllers).Forms || (_base.Forms = {});

  App.Controllers.Forms.Multistep = (function(_super) {
    __extends(Multistep, _super);

    function Multistep() {
      this.setStep = __bind(this.setStep, this);
      return Multistep.__super__.constructor.apply(this, arguments);
    }

    Multistep.prototype.routes = {
      "": "index",
      "step/s:step_no": "step",
      "step/s:step_no/i:itemId": "step"
    };

    Multistep.prototype.initialize = function(options) {
      this.formRenderer = new App.Models.FormRenderer(options);
      this.formRenderer.on("change:step", this.setStep);
      this.invitationsView = new App.Views.FormRenderer({
        router: this,
        model: this.formRenderer
      });
      return $("#content").append(this.invitationsView.render().el);
    };

    Multistep.prototype.index = function() {
      return this.invitationsView.renderForm();
    };

    Multistep.prototype.step = function(step_no, id) {
      this.formRenderer.get('formMetaData').set('currentStep', step_no);
      this.formRenderer.get('formModel').set("id", id);
      return this.formRenderer.fetch(this.step_callbacks());
    };

    Multistep.prototype.setStep = function(formRenderer) {
      return this.navigate("step/s" + (formRenderer.currentStepNo()) + "/i" + (formRenderer.formModelId()), {
        trigger: true,
        replace: true
      });
    };

    Multistep.prototype.step_callbacks = function() {
      var callbacks, router;
      router = this;
      return callbacks = {
        success: function(model, response) {
          return router.invitationsView.renderForm();
        },
        error: function(model, response) {
          throw I18n.t("marionette.errors.error_in_function", {
            "function": "App.Controllers.Forms.Multistep:step_callbacks()"
          });
        }
      };
    };

    return Multistep;

  })(Backbone.Router);

}).call(this);