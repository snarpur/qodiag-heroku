(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.Qapp.module("PreRegistrationsApp.EditCreate", function(EditCreate, App, Backbone, Marionette, $, _) {
    return EditCreate.Controller = (function(_super) {
      __extends(Controller, _super);

      function Controller() {
        this.getFieldsView = __bind(this.getFieldsView, this);
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.initialize = function() {
        App.contentRegion.show(this.getLayout());
        return this.curentUser = App.request("get:current:user");
      };

      Controller.prototype.edit = function(options) {
        var responderItem;
        if (options == null) {
          options = {};
        }
        this.step = options.step, this.id = options.id;
        responderItem = App.request("get:responder:item:pre:registration", {
          id: this.id,
          step_no: this.step
        });
        return App.execute("when:fetched", responderItem, (function(_this) {
          return function() {
            var step_options;
            _this.type = responderItem.get("registration_identifier").split("_")[0];
            _this.subtype = responderItem.get("subtype");
            step_options = {
              type: _this.type,
              subtype: _this.subtype
            };
            _this.steps = App.request("set:pre_registration:steps", step_options);
            _this.rootModel = new App.Entities.FormPreRegistrationModel(responderItem.attributes);
            return _this.showFormSteps();
          };
        })(this));
      };

      Controller.prototype.showFormSteps = function() {
        var stepsView;
        stepsView = this.getFormStepsView(this.steps);
        if (this.step != null) {
          App.navigate(this.preRegistrationUrl(this.step), {
            replace: true
          });
          this.steps.setCurrentStep(this.step);
        }
        this.getLayout().formStepsRegion.show(stepsView);
        return this.showForm();
      };

      Controller.prototype.showForm = function() {
        var config, view;
        config = this.getFormConfig();
        this.controllerModel = new App.Entities.Model();
        this.fieldCollection = new App.Entities.FieldCollection(config, {
          rootModel: this.rootModel,
          controllerModel: this.controllerModel
        });
        view = this.getFieldsView(this.fieldCollection);
        this.formView = App.request("form:wrapper", view, this.buttonsConfig());
        this.listenTo(this.formView, "form:back", (function(_this) {
          return function() {
            return _this.moveToPreviousStep();
          };
        })(this));
        this.listenTo(this.formView, "form:saveAndContinue form:save", (function(_this) {
          return function() {
            return _this.formView.trigger('form:submit', {
              collection: false
            });
          };
        })(this));
        this.listenTo(this.formView, "before:form:submit", (function(_this) {
          return function() {
            return _this.saveFormData();
          };
        })(this));
        return this.getLayout().mainRegion.show(this.formView);
      };

      Controller.prototype.saveFormData = function() {
        return this.listenToOnce(this.rootModel, 'created updated', (function(_this) {
          return function(options) {
            toastr.success(I18n.t("activerecord.sucess.messages.saved", {
              model: ""
            }));
            if (_this.steps.isCurrentLast()) {
              return App.navigate("items", {
                trigger: true
              });
            } else {
              _this.step = _this.steps.getNextStep();
              return _this.changeStep();
            }
          };
        })(this));
      };

      Controller.prototype.changeStep = function() {
        var responderItem;
        this.steps.setCurrentStep(this.step);
        this.steps.trigger("change:current:step");
        responderItem = App.request("get:responder:item:pre:registration", {
          id: this.id,
          step_no: this.step
        });
        return App.execute("when:fetched", responderItem, (function(_this) {
          return function() {
            _this.rootModel = new App.Entities.FormPreRegistrationModel(responderItem.attributes);
            App.navigate(_this.preRegistrationUrl(_this.step), {
              replace: true
            });
            return _this.showForm();
          };
        })(this));
      };

      Controller.prototype.moveToPreviousStep = function() {
        this.step = this.steps.getPreviousStep();
        return this.changeStep();
      };

      Controller.prototype.buttonsConfig = function() {
        var options;
        options = {
          formClass: "form-base form-horizontal",
          errors: false,
          buttons: {
            primary: false,
            save: false,
            cancel: false
          }
        };
        if (this.type === "subject") {
          _.extend(options.buttons, {
            primary: false
          }, {
            primary: {
              text: I18n.t("actions.save_and_complete"),
              buttonType: 'save',
              order: 2
            },
            back: false
          });
        } else {
          if (!this.steps.isCurrentFirst()) {
            _.extend(options.buttons, {
              back: {
                text: "<< " + I18n.t("terms.go_back"),
                buttonType: 'back',
                className: "btn",
                order: 1
              }
            });
          }
          if (this.steps.isCurrentLast()) {
            _.extend(options.buttons, {
              primary: {
                text: I18n.t("actions.save_and_complete"),
                buttonType: 'save',
                order: 2
              }
            });
          } else {
            _.extend(options.buttons, {
              primary: false
            }, {
              primary: {
                text: I18n.t("actions.save_and_continue", {
                  model: ""
                }) + " >>",
                buttonType: 'saveAndContinue',
                order: 3
              }
            });
          }
        }
        return options;
      };

      Controller.prototype.getFieldsView = function(collection) {
        return new App.Components.Form.FieldCollectionView({
          collection: collection,
          model: this.rootModel
        });
      };

      Controller.prototype.getFormConfig = function() {
        if (this.subtype != null) {
          return EditCreate.FormConfig[this.type][this.subtype]["step_" + this.step];
        } else {
          return EditCreate.FormConfig[this.type]["step_" + this.step];
        }
      };

      Controller.prototype.preRegistrationUrl = function(step) {
        return "pre_registrations/" + this.id + "/step/" + step;
      };

      Controller.prototype.getFormStepsView = function(steps) {
        return new EditCreate.FormSteps({
          collection: steps
        });
      };

      Controller.prototype.getFormStepsRegion = function() {
        return this.getLayout().formStepsRegion;
      };

      Controller.prototype.getLayout = function() {
        return this.layout != null ? this.layout : this.layout = new EditCreate.Layout;
      };

      return Controller;

    })(App.Controllers.Base);
  });

}).call(this);
