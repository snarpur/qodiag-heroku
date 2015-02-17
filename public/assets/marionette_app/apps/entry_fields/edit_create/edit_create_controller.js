(function(){var h={}.hasOwnProperty,k=function(d,c){function g(){this.constructor=d}for(var f in c)h.call(c,f)&&(d[f]=c[f]);g.prototype=c.prototype;d.prototype=new g;d.__super__=c.prototype;return d};this.Qapp.module("EntryFieldsApp.EditCreate",function(d,c,g,f,h,l){return d.Controller=function(f){function b(){return b.__super__.constructor.apply(this,arguments)}k(b,f);b.prototype.initialize=function(a){return this.activeView=a.activeView,this.collection=a.collection,this.model=a.model,a};b.prototype.create=
function(){return this.showDialog(new c.Entities.EntryField({editable:!0,field_type:"text"}))};b.prototype.edit=function(){return this.showDialog(this.model)};b.prototype.showDialog=function(a){this.getFormWrapperView(a);this.getSelectFieldTypeView(a);this.getSelectedView(a);this.listenTo(a,"created",function(e){return function(b){e.addAsSorted(a,e.collection);e.formView.trigger("dialog:close");return toastr.success(I18n.t("entry_set.messages.question_saved"),a.get("title"))}}(this));return this.listenTo(a,
"updated",function(a){return function(b){return a.formView.trigger("dialog:close")}}(this))};b.prototype.getFormWrapperView=function(a){this.formView=c.request("form:wrapper",this.getLayout(a),this.buttonsConfig(a));return c.dialogRegion.show(this.formView)};b.prototype.getSelectedView=function(a){if("text"===a.get("field_type")||"string"===a.get("field_type"))return this.getTextFieldView(a);this.addOptionCollection(a);return this.getMultiChoiceFieldView(a)};b.prototype.getSelectFieldTypeView=function(a){var e;
e=new d.FieldType({model:a,collection:new g.Collection([{name:"text"},{name:"multi-choice"},{name:"single-choice"},{name:"string"}])});this.getFieldTypeRegion(a).show(e);return this.listenTo(e,"fieldtype:change",function(e){return function(b){b=b.view.$el.find(":selected").val();a.set("field_type",b);return e.getSelectedView(a)}}(this))};b.prototype.getTextFieldView=function(a){var b;b=new d.TextFieldType({model:a});this.getFieldConfig(a).show(b);return a.unset("entry_field_options")};b.prototype.addOptionCollection=
function(a){var b;if(null==a.get("entry_field_options"))return b=new c.Entities.EntryFieldOptions(new c.Entities.EntryFieldOption({text_option:"text"})),a.set("entry_field_options",b)};b.prototype.getMultiChoiceFieldView=function(a){var b;b=new d.MultipleChoiceFieldList({model:a,collection:a.get("entry_field_options")});this.getFieldConfig(a).show(b);this.listenTo(b,"add-option:clicked",function(a){return function(a){return a.collection.add(new c.Entities.EntryFieldOption({text_option:"text"}))}}(this));
return this.listenTo(b,"childview:destroy-option:clicked",function(b){return function(b){if(1<a.get("entry_field_options").size())return b.model.destroy()}}(this))};b.prototype.buttonsConfig=function(a){return{modal:!0,title:a.isNew()?I18n.t("terms.add_information"):I18n.t("terms.edit_information"),formClass:"form-horizontal"}};b.prototype.getFieldTypeRegion=function(a){return this.getLayout(a).fieldTypeRegion};b.prototype.getFieldConfig=function(a){return this.getLayout(a).fieldConfig};b.prototype.addAsSorted=
function(a,b){var c,d;d=b.getParentCollection();c=l.sortedIndex(d.pluck("title"),a.get("title"));d.add(a,{at:c});return b.trigger("reset")};b.prototype.getLayout=function(a){return null!=this.layout?this.layout:this.layout=new d.Layout({model:a})};return b}(c.Controllers.Base)})}).call(this);