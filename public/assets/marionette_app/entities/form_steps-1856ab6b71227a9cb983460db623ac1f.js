(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.Qapp.module("Entities", function(Entities, App, Backbone, Marionette, $, _) {
    var API;
    Entities.FormStep = (function(_super) {
      __extends(FormStep, _super);

      function FormStep() {
        return FormStep.__super__.constructor.apply(this, arguments);
      }

      FormStep.prototype.isCurrentStep = function() {
        return this.get('step_num') === this.collection.currentStep;
      };

      return FormStep;

    })(Entities.Model);
    Entities.FormSteps = (function(_super) {
      __extends(FormSteps, _super);

      function FormSteps() {
        return FormSteps.__super__.constructor.apply(this, arguments);
      }

      FormSteps.prototype.model = Entities.FormStep;

      FormSteps.prototype.initialize = function(models, options) {
        if (this.correctStep(options.step)) {
          return this.currentStep = options.step;
        } else {
          return this.currentStep = 1;
        }
      };

      FormSteps.prototype.correctStep = function(step) {
        return (/^([0-9])$/.test(step)) && this.models.length <= step && step > 0;
      };

      FormSteps.prototype.setCurrentStep = function(step) {
        return this.currentStep = step;
      };

      FormSteps.prototype.isCurrentLast = function() {
        return this.currentStep === this.length;
      };

      FormSteps.prototype.isCurrentFirst = function() {
        return this.currentStep === 1;
      };

      FormSteps.prototype.getNextStep = function() {
        return this.currentStep = this.currentStep + 1;
      };

      FormSteps.prototype.getPreviousStep = function() {
        return this.currentStep = this.currentStep - 1;
      };

      FormSteps.prototype.isMovingForward = function(new_step) {
        return new_step > this.currentStep;
      };

      FormSteps.prototype.isSameStep = function(new_step) {
        return this.currentStep === new_step;
      };

      return FormSteps;

    })(Entities.Collection);
    API = {
      getSteps: function(options) {
        var models, step, type;
        type = options.type, step = options.step;
        if (type === "guardian") {
          models = [
            {
              step_num: 1,
              step_name: I18n.t("forms.guardian_invitation.steps.guardian_info")
            }, {
              step_num: 2,
              step_name: I18n.t("forms.guardian_invitation.steps.patient_info")
            }
          ];
        } else {
          models = [
            {
              step_num: 1,
              step_name: I18n.t("forms.guardian_invitation.steps.patient_info")
            }
          ];
        }
        return new Entities.FormSteps(models, options);
      },
      getPreRegistrationSteps: function(options) {
        var models, subtype, type;
        type = options.type, subtype = options.subtype;
        if (type === "subject") {
          models = [
            {
              step_num: 1,
              step_name: I18n.t("forms.guardian_invitation.steps.patient_info")
            }
          ];
        } else {
          models = [
            {
              step_num: 1,
              step_name: I18n.t("forms.guardian_invitation.steps.patient_info")
            }, {
              step_num: 2,
              step_name: I18n.t("forms.pre_registration_as_guardian_and_parent.steps.contact_info")
            }
          ];
        }
        return new Entities.FormSteps(models, options);
      }
    };
    App.reqres.setHandler("set:invitation:steps", function(options) {
      return API.getSteps(options);
    });
    return App.reqres.setHandler("set:pre_registration:steps", function(options) {
      return API.getPreRegistrationSteps(options);
    });
  });

}).call(this);
