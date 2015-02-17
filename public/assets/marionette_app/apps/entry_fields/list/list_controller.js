(function(){var g=function(a,b){return function(){return a.apply(b,arguments)}},f={}.hasOwnProperty,h=function(a,b){function e(){this.constructor=a}for(var d in b)f.call(b,d)&&(a[d]=b[d]);e.prototype=b.prototype;a.prototype=new e;a.__super__=b.prototype;return a};this.Qapp.module("EntryFieldsApp.List",function(a,b,e,d,f,k){return a.Controller=function(d){function c(){this.getLayout=g(this.getLayout,this);return c.__super__.constructor.apply(this,arguments)}h(c,d);c.prototype.list=function(a){this.executeSettingsNavigation();
b.contentRegion.show(this.getLayout());this.executeSettingsNavigation();return this.showEntryFields()};c.prototype.showEntryFields=function(a){var c;null==a&&(a={});c=b.request("entry:fields:entities");return b.execute("when:fetched",c,function(a){return function(){var b;b=c.createSearchCollection();return a.showEntryFieldsView(b,c)}}(this))};c.prototype.getEntryFieldsView=function(b){return new a.EntryFields({collection:b})};c.prototype.executeSettingsNavigation=function(){return b.execute("show:settings:navigation",
{iconClass:"fa fa-question",i18n:"terms.question"})};c.prototype.showEntryFieldsView=function(a,c){var d;d=this.getEntryFieldsView(a);this.listenTo(a,"updated",function(a){return function(a,b){return toastr.success(I18n.t("entry_set.messages.question_edited"),a.get("title"))}}(this));this.listenTo(d,"create:field:clicked",function(a){return function(a){return b.execute("create:entry:field",{collection:a.collection})}}(this));this.listenTo(d,"childview:edit:clicked",function(a){return function(a){return b.execute("edit:entry:field",
{model:a.model})}}(this));this.listenTo(d,"childview:destroy:clicked",function(a){return function(a){return bootbox.confirm(I18n.t("entry_set.messages.confirm_delte_question"),function(b){if(b)return a.model.destroy()})}}(this));return this.show(d,{region:this.getLayout().listRegion,loading:!0})};c.prototype.getLayout=function(){return null!=this.layout?this.layout:this.layout=new a.Layout};return c}(b.Controllers.Base)})}).call(this);