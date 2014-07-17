(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  App.Models.FormRenderer = (function(_super) {
    __extends(FormRenderer, _super);

    function FormRenderer() {
      this.destroyInQueue = __bind(this.destroyInQueue, this);
      this.triggerIfComplete = __bind(this.triggerIfComplete, this);
      this.removeFromDestructionQueue = __bind(this.removeFromDestructionQueue, this);
      this.addToDestructionQueue = __bind(this.addToDestructionQueue, this);
      this.toJSON = __bind(this.toJSON, this);
      this.onLastStep = __bind(this.onLastStep, this);
      this.stepLength = __bind(this.stepLength, this);
      this.currentStepNo = __bind(this.currentStepNo, this);
      this.formTemplate = __bind(this.formTemplate, this);
      this.subjectId = __bind(this.subjectId, this);
      this.formModelId = __bind(this.formModelId, this);
      this.nextStep = __bind(this.nextStep, this);
      this.createFormMetaData = __bind(this.createFormMetaData, this);
      this.createFormModel = __bind(this.createFormModel, this);
      this.initialize = __bind(this.initialize, this);
      return FormRenderer.__super__.constructor.apply(this, arguments);
    }

    FormRenderer.prototype.initialize = function() {
      this.createFormMetaData();
      this.createFormModel();
      this.destructionQueue = new Backbone.Collection;
      this.listenTo(App.Event, "addToDestructionQueue", this.addToDestructionQueue);
      this.listenTo(App.Event, "removeFromDestructionQueue", this.removeFromDestructionQueue);
      this.on("change:formModel", this.createFormModel);
      this.on("change:formMetaData", this.createFormMetaData);
      this.paramRoot = this.get("formModel").get("paramRoot");
      return this.url = function() {
        return "" + (this.get('formModel').url()) + "/step/" + (this.currentStepNo());
      };
    };

    FormRenderer.prototype.createFormModel = function() {
      var formModel;
      formModel = new App.Models.Base(_.extend(this.get('formModel'), {
        schema: this.get('schema')
      }));
      return this.set("formModel", formModel, {
        silent: true
      });
    };

    FormRenderer.prototype.createFormMetaData = function() {
      return this.set('formMetaData', new Backbone.Model(this.get("formMetaData")), {
        silent: true
      });
    };

    FormRenderer.prototype.nextStep = function() {
      this.get("formMetaData").set("currentStep", this.currentStepNo() + 1);
      return this.trigger("change:step", this);
    };

    FormRenderer.prototype.formModelId = function() {
      return this.get("formModel").get("id");
    };

    FormRenderer.prototype.subjectId = function() {
      return this.get("formModel").get("subject").id;
    };

    FormRenderer.prototype.formTemplate = function() {
      return this.get('formMetaData').get('formTemplate');
    };

    FormRenderer.prototype.currentStepNo = function() {
      return Number(this.get('formMetaData').get('currentStep'));
    };

    FormRenderer.prototype.stepLength = function() {
      return this.get("formMetaData").get('stepNames').length;
    };

    FormRenderer.prototype.onLastStep = function() {
      return this.currentStepNo() === this.stepLength();
    };

    FormRenderer.prototype.i18nStepName = function(stepName) {
      return I18n.translate("forms." + (this.formTemplate()) + ".steps." + stepName);
    };

    FormRenderer.prototype.urlOnComplete = function() {
      var location;
      return location = "" + window.location.protocol + "//" + window.location.host;
    };

    FormRenderer.prototype.toJSON = function() {
      return this.get("formModel").toJSON();
    };

    FormRenderer.prototype.addToDestructionQueue = function(model) {
      return this.destructionQueue.add(model);
    };

    FormRenderer.prototype.removeFromDestructionQueue = function(model) {
      return this.destructionQueue.remove(model);
    };

    FormRenderer.prototype.triggerIfComplete = function() {
      if (this.destructionQueue.length === 0) {
        return this.trigger("destructionComplete");
      }
    };

    FormRenderer.prototype.destroyInQueue = function() {
      var callbacks, renderer;
      this.triggerIfComplete();
      renderer = this;
      callbacks = {
        success: function(model, response) {
          return renderer.triggerIfComplete();
        },
        error: function(model, response) {
          throw I18n.t("marionette.errors.error_in_function", {
            "function": "formRenderer.js.coffee:destroyInQueue()"
          });
        }
      };
      return this.destructionQueue.each((function(i) {
        var model;
        model = this.destructionQueue.pop();
        return model.destroy(callbacks);
      }), this);
    };

    return FormRenderer;

  })(Backbone.Model);

}).call(this);
