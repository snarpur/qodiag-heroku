(function(){var f={}.hasOwnProperty,g=function(b,a){function e(){this.constructor=b}for(var c in a)f.call(a,c)&&(b[c]=a[c]);e.prototype=a.prototype;b.prototype=new e;b.__super__=a.prototype;return b};this.Qapp.module("EntrySetSectionsApp",function(b,a,e,c,f,h){var d;b.Router=function(b){function a(){return a.__super__.constructor.apply(this,arguments)}g(a,b);a.prototype.appRoutes={"settings/entry_sets/:entry_set_id/sections(/:section_id)":"list"};return a}(c.AppRouter);d={list:function(a,c){var d;
d={entrySetId:Number(a),currentSectionId:c?Number(c):void 0};return(new b.List.Controller).list(d)},createSection:function(a){return(new b.EditCreate.Controller).create(a)},editSection:function(a){return(new b.EditCreate.Controller).edit(a)}};a.commands.setHandler("create:section",function(a){return d.createSection(a)});a.commands.setHandler("edit:section",function(a){return d.editSection(a)});return a.addInitializer(function(){return new b.Router({controller:d})})})}).call(this);