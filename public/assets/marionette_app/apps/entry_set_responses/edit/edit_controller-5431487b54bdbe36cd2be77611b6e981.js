(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.Qapp.module("EntrySetResponsesApp.Edit", function(Edit, App, Backbone, Marionette, $, _) {
    return Edit.Controller = (function(_super) {
      __extends(Controller, _super);

      function Controller() {
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.initialize = function(options) {
        App.contentRegion.show(this.getLayout(options));
        return this.executeSettingsNavigation();
      };

      Controller.prototype.edit = function(options) {
        return this.getSections(options);
      };

      Controller.prototype.getSections = function(options) {
        var current_user, entrySetResponseId, sectionId;
        entrySetResponseId = options.entrySetResponseId, sectionId = options.sectionId;
        current_user = App.request("get:current:user");
        this.entrySetResponse = App.request("entry:set:response:entities", {
          id: entrySetResponseId
        });
        return App.execute("when:fetched", this.entrySetResponse, (function(_this) {
          return function() {
            _this.sections = _this.entrySetResponse.get("entry_set").get('sections');
            if (sectionId) {
              _this.sections.trigger("change:current:section", {
                model: _this.sections.get(sectionId)
              });
            }
            _this.showFormSteps();
            if (_this.sections.length !== 0) {
              _this.listenTo(_this.sections, "change:current:section", function() {
                App.navigate(_this.sectionUrl(), {
                  replace: true
                });
                return _this.getEntries();
              });
              return _this.getEntries();
            }
          };
        })(this));
      };

      Controller.prototype.getEntries = function() {
        var entries;
        entries = this.entrySetResponse.getSectionResponses();
        return App.execute("when:fetched", entries, (function(_this) {
          return function() {
            _this.entrySetResponse.set('entry_fields', entries);
            return _this.showForm();
          };
        })(this));
      };

      Controller.prototype.executeSettingsNavigation = function() {
        return App.execute("show:settings:navigation", {
          iconClass: "fa fa-envelope",
          i18n: "views.responder_items.requests.name"
        });
      };

      Controller.prototype.showFormSteps = function() {
        var view;
        view = this.getFormStepsView({
          collection: this.sections
        });
        return this.show(view, {
          region: this.getFormStepsRegion(),
          loading: false
        });
      };

      Controller.prototype.showForm = function() {
        var editView, formView;
        editView = this.getFormView();
        formView = App.request("form:wrapper", editView, this.buttonsConfig());
        this.show(formView, {
          region: this.getFormWrapperRegion(),
          loading: true
        });
        this.listenTo(formView, "form:back", (function(_this) {
          return function() {
            return _this.sections.trigger("change:current:section", {
              model: _this.sections.getPreviousSection()
            });
          };
        })(this));
        this.listenTo(formView, "form:saveAndContinue", (function(_this) {
          return function() {
            return _this.saveAndMoveToNextSection(formView);
          };
        })(this));
        return this.listenTo(formView, "form:saveAndComplete", (function(_this) {
          return function() {
            return _this.saveAsCompleteAndRedirect(formView);
          };
        })(this));
      };

      Controller.prototype.saveAsCompleteAndRedirect = function(formView) {
        this.entrySetResponse.set("entry_values", this.entrySetResponse.getEntryValuesForSection());
        this.entrySetResponse.set("complete_item", 1);
        formView.trigger('form:submit');
        return this.listenToOnce(this.entrySetResponse, 'updated', (function(_this) {
          return function() {
            App.navigate("/items", {
              trigger: true
            });
            return toastr.success(I18n.t("entry_set.messages.entry_set_saved"));
          };
        })(this));
      };

      Controller.prototype.saveAndMoveToNextSection = function(formView) {
        this.entrySetResponse.set("entry_values", this.entrySetResponse.getEntryValuesForSection());
        formView.trigger('form:submit');
        return this.listenToOnce(this.entrySetResponse, 'updated', (function(_this) {
          return function() {
            return _this.sections.trigger("change:current:section", {
              model: _this.sections.getNextSection()
            });
          };
        })(this));
      };

      Controller.prototype.getFormStepsView = function(options) {
        return new Edit.FormSteps(_.extend(options));
      };

      Controller.prototype.getFormView = function() {
        return new Edit.EntryFields({
          collection: this.entrySetResponse.get('entry_fields'),
          model: this.entrySetResponse
        });
      };

      Controller.prototype.getFormStepsRegion = function() {
        return this.getLayout().formStepsRegion;
      };

      Controller.prototype.getFormWrapperRegion = function() {
        return this.getLayout().formWrapperRegion;
      };

      Controller.prototype.buttonsConfig = function() {
        var options;
        options = {
          formClass: "form-base form-horizontal",
          buttons: {
            primary: {
              text: I18n.t("actions.save_and_continue", {
                model: ""
              }) + " >>",
              className: "btn btn-info",
              buttonType: 'saveAndContinue',
              order: 3
            },
            cancel: false
          }
        };
        if (this.sections.isCurrentLast()) {
          options.buttons.primary = _.extend(options.buttons.primary, {
            text: I18n.t("actions.save_and_complete", {
              model: ""
            }),
            className: "btn btn-success",
            buttonType: 'saveAndComplete',
            order: 3
          });
        }
        if (!this.sections.isCurrentFirst()) {
          _.extend(options.buttons, {
            back: {
              text: "<< " + I18n.t("terms.go_back"),
              buttonType: 'back',
              className: "btn btn-default",
              order: 1
            }
          });
        }
        return options;
      };

      Controller.prototype.getLayout = function(options) {
        return this.layout != null ? this.layout : this.layout = new Edit.Layout;
      };

      Controller.prototype.sectionUrl = function() {
        return Routes.entry_set_response_section_path(this.entrySetResponse.id, this.sections.getCurrentSection().id);
      };

      return Controller;

    })(App.Controllers.Base);
  });

}).call(this);
