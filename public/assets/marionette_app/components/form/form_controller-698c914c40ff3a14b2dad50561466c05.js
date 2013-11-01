(function(){var __hasProp={}.hasOwnProperty,__extends=function(child,parent){for(var key in parent){if(__hasProp.call(parent,key)){child[key]=parent[key]}}function ctor(){this.constructor=child}ctor.prototype=parent.prototype;child.prototype=new ctor();child.__super__=parent.prototype;return child};this.Qapp.module("Components.Form",function(Form,App,Backbone,Marionette,$,_){var _ref;Form.Controller=(function(_super){__extends(Controller,_super);function Controller(){_ref=Controller.__super__.constructor.apply(this,arguments);return _ref}Controller.prototype.initialize=function(options){var bindings,_ref1;if(options==null){options={}}this.contentView=options.view;this.modal=options.config.modal;this.formLayout=this.getFormLayout(options.config);this.listenTo(this.formLayout,"show",this.formContentRegion);this.listenTo(this.formLayout,"form:submit",this.formSubmit);this.listenTo(this.formLayout,"form:cancel",this.formCancel);if(this.modal){bindings=_.values(this.contentView.bindings);return this.previous=(_ref1=this.contentView.model).pick.apply(_ref1,bindings)}};Controller.prototype.formCancel=function(){if(this.modal){this.contentView.model.set(this.previous);this.contentView.model.unset("_errors");return App.dialogRegion.closeDialog()}else{return this.contentView.triggerMethod("form:cancel")}};Controller.prototype.formSubmit=function(options){var collection,errors,model;this.contentView.triggerMethod("form:submit");model=this.contentView.model;collection=this.contentView.collection;errors=model.validate();this.formLayout.addErrors(model.validationError);if(!errors){return this.processFormSubmit(model,collection)}};Controller.prototype.processFormSubmit=function(model,collection){var _this=this;model.save(model.toJSON(),{collection:collection});if(this.modal){return this.listenTo(model,"created updated",function(){return App.dialogRegion.closeDialog()})}};Controller.prototype.onClose=function(){};Controller.prototype.formContentRegion=function(){this.region=this.formLayout.formContentRegion;return this.show(this.contentView)};Controller.prototype.getFormLayout=function(options){var buttons,config;if(options==null){options={}}config=this.getDefaultConfig(_.result(this.contentView,"form"));_.extend(config,options);buttons=this.getButtons(config.buttons);return new Form.FormWrapper({config:config,model:this.contentView.model,buttons:buttons,view:this.contentView})};Controller.prototype.getDefaultConfig=function(config){if(config==null){config={}}return _.defaults(config,{footer:true,focusFirstInput:true,errors:true,syncing:false,modal:false,formClass:""})};Controller.prototype.getButtons=function(buttons){if(buttons==null){buttons={}}if(buttons!==false){return App.request("form:button:entities",buttons,this.contentView.model)}};return Controller})(App.Controllers.Base);return App.reqres.setHandler("form:wrapper",function(contentView,options){var formController;if(options==null){options={}}if(!contentView.model){throw new Error("No model found inside of form's contentView")}formController=new Form.Controller({view:contentView,config:options});return formController.formLayout})})}).call(this);