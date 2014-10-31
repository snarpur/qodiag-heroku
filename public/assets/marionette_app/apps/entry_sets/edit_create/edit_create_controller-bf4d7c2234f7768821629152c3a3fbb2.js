(function(){var g=function(c,b){return function(){return c.apply(b,arguments)}},f={}.hasOwnProperty,h=function(c,b){function e(){this.constructor=c}for(var d in b)f.call(b,d)&&(c[d]=b[d]);e.prototype=b.prototype;c.prototype=new e;c.__super__=b.prototype;return c};this.Qapp.module("EntrySetsApp.EditCreate",function(c,b,e,d,f,k){return c.Controller=function(d){function a(){this.getFieldsView=g(this.getFieldsView,this);return a.__super__.constructor.apply(this,arguments)}h(a,d);a.prototype.initialize=
function(b){return this.activeView=b.activeView,this.model=b.model,b};a.prototype.create=function(){var a;a=this.getResponse();this.rootModel=new b.Entities.FormEntrySetModel(a);return this.showDialog()};a.prototype.edit=function(){this.rootModel=new b.Entities.FormEntrySetModel(this.model.attributes);return this.showDialog()};a.prototype.formConfig=function(){return{modal:!0,title:k(I18n.t("terms.new")+" "+I18n.t("entry_set.model_name")).capitalize(),formClass:"form-horizontal",collection:!1}};a.prototype.showDialog=
function(){var a,c;a=this.getFormConfig();this.fieldCollection=new b.Entities.FieldCollection(a,{rootModel:this.rootModel});c=this.getFieldsView(this.fieldCollection);a=b.request("form:wrapper",c,this.formConfig());this.listenTo(a.model,"created",function(a){return function(){a.activeView.trigger("entry:set:created",a.rootModel);return c.trigger("dialog:close")}}(this));this.listenTo(a.model,"updated",function(a){return function(){a.model.set("name",a.rootModel.get("name"));a.model.trigger("edit:complete");
return c.trigger("dialog:close")}}(this));return b.dialogRegion.show(a)};a.prototype.getFieldsView=function(a){return new b.Components.Form.FieldCollectionView({collection:a,model:this.rootModel})};a.prototype.getFormConfig=function(){return c.FormConfig};a.prototype.getResponse=function(){return{name:null,description:null,editable:!0}};return a}(b.Controllers.Base)})}).call(this);
