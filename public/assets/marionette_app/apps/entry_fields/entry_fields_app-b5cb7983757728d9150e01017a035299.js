(function(){var f={}.hasOwnProperty,g=function(b,a){function e(){this.constructor=b}for(var c in a)f.call(a,c)&&(b[c]=a[c]);e.prototype=a.prototype;b.prototype=new e;b.__super__=a.prototype;return b};this.Qapp.module("EntryFieldsApp",function(b,a,e,c,f,h){var d;b.Router=function(b){function a(){return a.__super__.constructor.apply(this,arguments)}g(a,b);a.prototype.appRoutes={"settings/entry_fields":"list"};return a}(c.AppRouter);d={list:function(){return(new b.List.Controller).list()},create:function(a){return(new b.EditCreate.Controller(a)).create()},
edit:function(a){return(new b.EditCreate.Controller(a)).edit()}};a.commands.setHandler("create:entry:field",function(a){return d.create(a)});a.commands.setHandler("edit:entry:field",function(a){return d.edit(a)});return a.addInitializer(function(){return new b.Router({controller:d})})})}).call(this);