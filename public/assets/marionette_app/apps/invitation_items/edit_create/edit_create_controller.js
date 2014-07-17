(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.Qapp.module("InvitationItemsApp.EditCreate", function(EditCreate, App, Backbone, Marionette, $, _) {
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

      Controller.prototype.create = function(options) {
        if (options == null) {
          options = {};
        }
        this.type = options.type, this.step = options.step, this.id = options.id;
        this.steps = App.request("set:invitation:steps", options);
        this.step = 1;
        return this.showFormSteps(this.steps, options);
      };

      Controller.prototype.edit = function(options) {
        var responderItem;
        if (options == null) {
          options = {};
        }
        this.type = options.type, this.step = options.step, this.id = options.id;
        this.steps = App.request("set:invitation:steps", options);
        this.step = this.steps.currentStep;
        responderItem = App.request("get:responder:item", {
          id: this.id,
          step_no: this.step,
          type: this.type
        });
        return App.execute("when:fetched", responderItem, (function(_this) {
          return function() {
            if (responderItem.id == null) {
              _this.step = 1;
              _this.steps.setCurrentStep(_this.step);
              _this.steps.trigger("change:current:step");
            }
            _this.id = responderItem.get("id");
            _this.rootModel = new App.Entities.FormInvitationItemModel(responderItem.attributes);
            return _this.showFormSteps(_this.steps, options);
          };
        })(this));
      };

      Controller.prototype.showFormSteps = function(options) {
        var stepsView;
        stepsView = this.getFormStepsView(this.steps);
        if (this.step != null) {
          App.navigate(this.invitationUrl(this.step), {
            replace: true
          });
          this.steps.setCurrentStep(this.step);
        }
        this.getLayout().formStepsRegion.show(stepsView);
        return this.showForm();
      };

      Controller.prototype.showForm = function() {
        var config, response, view;
        if (this.id == null) {
          response = this.getResponse();
          this.rootModel = new App.Entities.FormInvitationItemModel(response);
        }
        config = this.getFormConfig();
        this.controllerModel = new App.Entities.Model();
        this.fieldCollection = new App.Entities.FieldCollection(config, {
          rootModel: this.rootModel,
          controllerModel: this.controllerModel
        });
        if (this.step === 2 && this.type === "guardian") {
          this.getChildren();
        }
        view = this.getFieldsView(this.fieldCollection);
        this.formView = App.request("form:wrapper", view, this.buttonsConfig());
        this.listenTo(this.controllerModel, "change:children", (function(_this) {
          return function(model, value, options) {
            if (value !== "") {
              return _this.rootModel.get("subject").set("full_cpr", value);
            }
          };
        })(this));
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

      Controller.prototype.getChildren = function() {
        var children_data, _ref;
        if ((((_ref = this.rootModel.get("respondent")) != null ? _ref.get("full_cpr") : void 0) != null) && this.rootModel.get("respondent").get("full_cpr").length === 10) {
          children_data = App.request("get:national_register:family", this.rootModel.get("respondent").get("full_cpr"));
          return App.execute("when:fetched", children_data, (function(_this) {
            return function() {
              if (!children_data.isEmpty()) {
                return _this.controllerModel.set("_children_options", children_data);
              }
            };
          })(this));
        } else {
          return this.controllerModel.set("_children_options", []);
        }
      };

      Controller.prototype.invitationUrl = function(step) {
        if (this.id != null) {
          return "invitation_items/" + this.id + "/invite/" + this.type + "/step/" + step;
        } else {
          return "invitation_items/invite/" + this.type + "/step/" + step;
        }
      };

      Controller.prototype.saveFormData = function() {
        return this.listenToOnce(this.rootModel, 'created updated', (function(_this) {
          return function(options) {
            toastr.success(I18n.t("activerecord.sucess.messages.saved", {
              model: ""
            }));
            if (_this.steps.isCurrentLast()) {
              return window.location.href = "/users";
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
        responderItem = App.request("get:responder:item", {
          id: this.rootModel.get('id'),
          step_no: this.step,
          type: this.type
        });
        return App.execute("when:fetched", responderItem, (function(_this) {
          return function() {
            _this.id = responderItem.get("id");
            _this.rootModel = new App.Entities.FormInvitationItemModel(responderItem.attributes);
            App.navigate(_this.invitationUrl(_this.step), {
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
          formClass: "form-horizontal",
          errors: false,
          buttons: {
            primary: false,
            save: false,
            cancel: false
          }
        };
        if (this.steps.isCurrentLast()) {
          if (this.type === "guardian") {
            _.extend(options.buttons, {
              primary: false,
              save: {
                text: I18n.t("actions.save"),
                buttonType: 'save',
                order: 2,
                className: 'btn btn-success'
              },
              back: {
                text: "<< " + I18n.t("terms.go_back"),
                buttonType: 'back',
                className: "btn btn-info",
                order: 1
              }
            });
          } else {
            _.extend(options.buttons, {
              primary: false
            }, {
              save: {
                text: I18n.t("actions.save"),
                buttonType: 'save',
                order: 2,
                className: 'btn btn-success'
              },
              back: false
            });
          }
        } else {
          if (this.type === "guardian") {
            _.extend(options.buttons, {
              primary: {
                text: I18n.t("actions.save_and_continue", {
                  model: ""
                }) + " >>",
                className: 'btn btn-info',
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
        return EditCreate.FormConfig[this.type]["step_" + this.step];
      };

      Controller.prototype.getResponse = function() {
        var response;
        if (this.type === "subject") {
          return response = {
            deadline: null,
            registration_identifier: "subject_registration",
            subject: {
              firstname: null,
              address: {
                street_1: null
              },
              user: {
                email: null,
                invitation: true
              },
              inverse_relationships: [
                {
                  name: "patient",
                  person_id: this.curentUser.get("person_id")
                }
              ]
            }
          };
        } else {
          return response = {
            deadline: null,
            registration_identifier: "respondent_registration",
            respondent: {
              firstname: null,
              address: {
                street_1: null
              },
              user: {
                email: null,
                invitation: true
              }
            }
          };
        }
      };

      Controller.prototype.getFormStepsView = function(steps) {
        return new EditCreate.FormSteps({
          collection: this.steps
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
