(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.Qapp.module("ProfilesApp.EditCreate", function(EditCreate, App, Backbone, Marionette, $, _) {
    return EditCreate.Controller = (function(_super) {
      __extends(Controller, _super);

      function Controller() {
        this.getFieldsView = __bind(this.getFieldsView, this);
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.initialize = function(options) {
        this.activeView = options.activeView, this.collection = options.collection, this.model = options.model, this.subjectId = options.subjectId;
        return this.rootModel = this.model;
      };

      Controller.prototype.showGuardian = function(guardian) {
        var config, formView, view;
        config = this.getFormConfig();
        this.controllerModel = new App.Entities.Model();
        this.fieldCollection = new App.Entities.FieldCollection(config, {
          rootModel: this.rootModel,
          controllerModel: this.controllerModel
        });
        view = this.getFieldsView(this.fieldCollection);
        formView = App.request("form:wrapper", view, this.buttonsConfig());
        this.listenTo(formView, "before:form:submit", (function(_this) {
          return function() {
            return _this.listenToOnce(_this.rootModel, "created updated", function() {
              var _ref;
              if (_this.activeView.collection) {
                return _.each((_ref = _this.activeView.children) != null ? _ref._views : void 0, (function(i) {
                  return i.render();
                }));
              } else {
                return _this.activeView.render();
              }
            });
          };
        })(this));
        return App.dialogRegion.show(formView);
      };

      Controller.prototype.getFormConfig = function() {
        return EditCreate.FormConfig[this.activeView.options.name.toLowerCase()];
      };

      Controller.prototype.getFieldsView = function(collection) {
        return new App.Components.Form.FieldCollectionView({
          collection: collection,
          model: this.rootModel
        });
      };

      Controller.prototype.buttonsConfig = function() {
        var options;
        options = {
          modal: true,
          collection: false,
          title: this.rootModel.isNew() ? I18n.t("terms.add_information") : I18n.t("terms.edit_information"),
          formClass: "form-horizontal"
        };
        return options;
      };

      Controller.prototype.edit = function() {
        return this.showGuardian(this.rootModel);
      };

      Controller.prototype.create = function() {
        var relationships;
        relationships = [
          {
            name: "parent",
            relation_id: this.subjectId
          }
        ];
        this.model.set('relationships', relationships);
        return this.showGuardian(this.rootModel);
      };

      Controller.prototype.getFormWrapperRegion = function() {
        return this.getLayout().formWrapperRegion;
      };

      Controller.prototype.getLayout = function() {
        return this.layout != null ? this.layout : this.layout = new EditCreate.Layout;
      };

      return Controller;

    })(App.Controllers.Base);
  });

}).call(this);
