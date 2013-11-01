(function(){var __hasProp={}.hasOwnProperty,__extends=function(child,parent){for(var key in parent){if(__hasProp.call(parent,key)){child[key]=parent[key]}}function ctor(){this.constructor=child}ctor.prototype=parent.prototype;child.prototype=new ctor();child.__super__=parent.prototype;return child};this.Qapp.module("Entities",function(Entities,App,Backbone,Marionette,$,_){var API,_ref,_ref1;Entities.Setting=(function(_super){__extends(Setting,_super);function Setting(){_ref=Setting.__super__.constructor.apply(this,arguments);return _ref}return Setting})(Entities.Model);Entities.SettingsCollection=(function(_super){__extends(SettingsCollection,_super);function SettingsCollection(){_ref1=SettingsCollection.__super__.constructor.apply(this,arguments);return _ref1}SettingsCollection.prototype.model=Entities.Setting;SettingsCollection.prototype.rootSetting="entry_sets";SettingsCollection.prototype.initialize=function(models,options){return this.currentSetting=options.currentSetting,this.subView=options.subView,options};SettingsCollection.prototype.getCurrentSetting=function(){var setting,_ref2;setting=this.findWhere({name:(_ref2=this.currentSetting)!=null?_ref2:this.rootSetting});if(this.subView){setting.set("subView",this.subView)}return setting};return SettingsCollection})(Entities.Collection);API={setCurrentSetting:function(currentSetting){return new Entities.Setting(currentSetting)},getSettingsEntities:function(options){var settings;settings=new Entities.SettingsCollection([{name:"entry_sets",text:"Eyðublöð"},{name:"entry_fields",text:"Spurningar"}],options);return settings}};return App.reqres.setHandler("get:settings",function(options){return API.getSettingsEntities(options)})})}).call(this);