(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.Qapp.module("ResponderItemsApp.Create", function(Create, App, Backbone, Marionette, $, _) {
    return Create.Controller = (function(_super) {
      __extends(Controller, _super);

      function Controller() {
        this.getSurveyItem = __bind(this.getSurveyItem, this);
        this.getEntrySetItem = __bind(this.getEntrySetItem, this);
        this.getFieldsView = __bind(this.getFieldsView, this);
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.initialize = function(options) {
        this.collection = options.collection;
        this.itemCollection = options.itemCollection;
        this.respondents = this.getSubject().get('respondents');
        return this.controllerModel = new App.Entities.Model();
      };

      Controller.prototype.create = function() {
        this.entrySets = App.request("entry:sets:entities");
        return this.showResponderItem();
      };

      Controller.prototype.createSurvey = function() {
        this.surveys = App.request("get:surveys");
        return this.showSurveyResponderItem();
      };

      Controller.prototype.showSurveyResponderItem = function() {
        return App.execute("when:fetched", this.surveys, (function(_this) {
          return function() {
            var config, formView, view;
            config = _this.getSurveyFormConfig();
            _this.rootModel = _this.getSurveyItem();
            _this.rootModel.set("_survey_id_options", _this.surveys);
            _this.rootModel.set("_respondent_id_options", _this.respondents);
            _this.fieldCollection = new App.Entities.FieldCollection(config, {
              rootModel: _this.rootModel,
              controllerModel: _this.controllerModel
            });
            view = _this.getFieldsView(_this.fieldCollection);
            formView = App.request("form:wrapper", view, _this.buttonsConfig());
            App.dialogRegion.show(formView);
            _this.listenTo(formView, "before:form:submit", function() {
              return _this.listenTo(_this.rootModel, "created", function(model) {
                return _this.itemCollection.add(model.clone());
              });
            });
            return view;
          };
        })(this));
      };

      Controller.prototype.showResponderItem = function() {
        return App.execute("when:fetched", this.entrySets, (function(_this) {
          return function() {
            var config, formView, view;
            config = _this.getEntrySetFormConfig();
            _this.rootModel = _this.getEntrySetItem();
            _this.rootModel.get("entry_set_response").set("_entry_set_id_options", _this.entrySets);
            _this.listenTo(_this.rootModel, "change:entry_set_response.entry_set_id", function(model, value, options) {
              if (options.modelSelected != null) {
                return _this.rootModel.get("entry_set_response").set("name", options.modelSelected.get("name"));
              }
            });
            _this.fieldCollection = new App.Entities.FieldCollection(config, {
              rootModel: _this.rootModel,
              controllerModel: _this.controllerModel
            });
            _this.listenTo(_this.rootModel, "created", function(model) {
              return _this.collection.add(model);
            });
            view = _this.getFieldsView(_this.fieldCollection);
            formView = App.request("form:wrapper", view, _this.buttonsConfig());
            App.dialogRegion.show(formView);
            return _this.rootModel.set("_respondent_id_options", _this.respondents);
          };
        })(this));
      };

      Controller.prototype.getEntrySetFormConfig = function() {
        return Create.EntrySet.FormConfig;
      };

      Controller.prototype.getSurveyFormConfig = function() {
        return Create.Survey.FormConfig;
      };

      Controller.prototype.getFieldsView = function(collection) {
        return new App.Components.Form.FieldCollectionView({
          collection: collection,
          model: this.rootModel
        });
      };

      Controller.prototype.getEntrySetItem = function() {
        if (this.item == null) {
          this.item = new App.Entities.FormResponderItemModel({
            caretaker_id: App.request("get:current:user").get('person_id'),
            subject_id: this.getSubject().id,
            entry_set_response: {
              entry_set_id: null
            }
          });
        }
        return this.item;
      };

      Controller.prototype.getSurveyItem = function() {
        if (this.item == null) {
          this.item = new App.Entities.FormResponderItemModel({
            caretaker_id: App.request("get:current:user").get('person_id'),
            subject_id: this.getSubject().id,
            item_type: "survey",
            response_set: {
              id: null
            },
            survey_id: null
          });
        }
        return this.item;
      };

      Controller.prototype.getSubject = function() {
        return App.request("get:current:subject");
      };

      Controller.prototype.buttonsConfig = function() {
        var options;
        options = {
          errors: false,
          modal: true,
          title: I18n.t("views.responder_items.requests.submit"),
          formClass: "form-horizontal"
        };
        return options;
      };

      return Controller;

    })(App.Controllers.Base);
  });

}).call(this);
