(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.Qapp.module("EntrySetsApp.EditCreate", function(EditCreate, App, Backbone, Marionette, $, _) {
    return EditCreate.Controller = (function(_super) {
      __extends(Controller, _super);

      function Controller() {
        this.getFieldsView = __bind(this.getFieldsView, this);
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.initialize = function(options) {
        return this.activeView = options.activeView, this.model = options.model, options;
      };

      Controller.prototype.create = function() {
        var response;
        response = this.getResponse();
        this.rootModel = new App.Entities.FormEntrySetModel(response);
        return this.showDialog();
      };

      Controller.prototype.edit = function() {
        this.rootModel = new App.Entities.FormEntrySetModel(this.model.attributes);
        return this.showDialog();
      };

      Controller.prototype.formConfig = function() {
        var options;
        options = {
          modal: true,
          title: _(I18n.t("terms.new") + " " + I18n.t("entry_set.model_name")).capitalize(),
          formClass: "form-horizontal",
          collection: false
        };
        return options;
      };

      Controller.prototype.showDialog = function() {
        var config, formView, view;
        config = this.getFormConfig();
        this.fieldCollection = new App.Entities.FieldCollection(config, {
          rootModel: this.rootModel
        });
        view = this.getFieldsView(this.fieldCollection);
        formView = App.request("form:wrapper", view, this.formConfig());
        this.listenTo(formView.model, "created", (function(_this) {
          return function() {
            _this.activeView.trigger("entry:set:created", _this.rootModel);
            return view.trigger("dialog:close");
          };
        })(this));
        this.listenTo(formView.model, "updated", (function(_this) {
          return function() {
            _this.model.set("name", _this.rootModel.get("name"));
            _this.model.trigger("edit:complete");
            return view.trigger("dialog:close");
          };
        })(this));
        return App.dialogRegion.show(formView);
      };

      Controller.prototype.getFieldsView = function(collection) {
        return new App.Components.Form.FieldCollectionView({
          collection: collection,
          model: this.rootModel
        });
      };

      Controller.prototype.getFormConfig = function() {
        return EditCreate.FormConfig;
      };

      Controller.prototype.getResponse = function() {
        var response;
        return response = {
          name: null,
          description: null,
          editable: true
        };
      };

      return Controller;

    })(App.Controllers.Base);
  });

}).call(this);
