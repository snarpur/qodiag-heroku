(function(){var g=function(c,b){return function(){return c.apply(b,arguments)}},f={}.hasOwnProperty,h=function(c,b){function e(){this.constructor=c}for(var d in b)f.call(b,d)&&(c[d]=b[d]);e.prototype=b.prototype;c.prototype=new e;c.__super__=b.prototype;return c};this.Qapp.module("ProfilesApp.EditCreate",function(c,b,e,d,f,k){return c.Controller=function(d){function a(){this.getFieldsView=g(this.getFieldsView,this);return a.__super__.constructor.apply(this,arguments)}h(a,d);a.prototype.initialize=
function(b){this.activeView=b.activeView;this.collection=b.collection;this.model=b.model;this.subjectId=b.subjectId;return this.rootModel=this.model};a.prototype.showGuardian=function(a){a=this.getFormConfig();this.controllerModel=new b.Entities.Model;this.fieldCollection=new b.Entities.FieldCollection(a,{rootModel:this.rootModel,controllerModel:this.controllerModel});a=this.getFieldsView(this.fieldCollection);a=b.request("form:wrapper",a,this.buttonsConfig());this.listenTo(a,"before:form:submit",
function(a){return function(){return a.listenToOnce(a.rootModel,"created updated",function(){var b;return a.activeView.collection?k.each(null!=(b=a.activeView.children)?b._views:void 0,function(a){return a.render()}):a.activeView.render()})}}(this));return b.dialogRegion.show(a)};a.prototype.getFormConfig=function(){return c.FormConfig[this.activeView.options.name.toLowerCase()]};a.prototype.getFieldsView=function(a){return new b.Components.Form.FieldCollectionView({collection:a,model:this.rootModel})};
a.prototype.buttonsConfig=function(){return{modal:!0,collection:!1,title:this.rootModel.isNew()?I18n.t("terms.add_information"):I18n.t("terms.edit_information"),formClass:"form-horizontal"}};a.prototype.edit=function(){return this.showGuardian(this.rootModel)};a.prototype.create=function(){this.model.set("relationships",[{name:"parent",relation_id:this.subjectId}]);return this.showGuardian(this.rootModel)};a.prototype.getFormWrapperRegion=function(){return this.getLayout().formWrapperRegion};a.prototype.getLayout=
function(){return null!=this.layout?this.layout:this.layout=new c.Layout};return a}(b.Controllers.Base)})}).call(this);
