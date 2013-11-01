Backbone.Wreqr=(function(Backbone,Marionette,_){var Wreqr={};Wreqr.Handlers=(function(Backbone,_){var Handlers=function(options){this.options=options;this._wreqrHandlers={};if(_.isFunction(this.initialize)){this.initialize(options)}};Handlers.extend=Backbone.Model.extend;_.extend(Handlers.prototype,Backbone.Events,{setHandlers:function(handlers){_.each(handlers,function(handler,name){var context=null;if(_.isObject(handler)&&!_.isFunction(handler)){context=handler.context;handler=handler.callback}this.setHandler(name,handler,context)},this)},setHandler:function(name,handler,context){var config={callback:handler,context:context};this._wreqrHandlers[name]=config;this.trigger("handler:add",name,handler,context)},hasHandler:function(name){return !!this._wreqrHandlers[name]},getHandler:function(name){var config=this._wreqrHandlers[name];if(!config){throw new Error("Handler not found for '"+name+"'")}return function(){var args=Array.prototype.slice.apply(arguments);return config.callback.apply(config.context,args)}},removeHandler:function(name){delete this._wreqrHandlers[name]},removeAllHandlers:function(){this._wreqrHandlers={}}});return Handlers})(Backbone,_);Wreqr.CommandStorage=(function(){var CommandStorage=function(options){this.options=options;this._commands={};if(_.isFunction(this.initialize)){this.initialize(options)}};_.extend(CommandStorage.prototype,Backbone.Events,{getCommands:function(commandName){var commands=this._commands[commandName];if(!commands){commands={command:commandName,instances:[]};this._commands[commandName]=commands}return commands},addCommand:function(commandName,args){var command=this.getCommands(commandName);command.instances.push(args)},clearCommands:function(commandName){var command=this.getCommands(commandName);command.instances=[]}});return CommandStorage})();Wreqr.Commands=(function(Wreqr){return Wreqr.Handlers.extend({storageType:Wreqr.CommandStorage,constructor:function(options){this.options=options||{};this._initializeStorage(this.options);this.on("handler:add",this._executeCommands,this);var args=Array.prototype.slice.call(arguments);Wreqr.Handlers.prototype.constructor.apply(this,args)},execute:function(name,args){name=arguments[0];args=Array.prototype.slice.call(arguments,1);if(this.hasHandler(name)){this.getHandler(name).apply(this,args)}else{this.storage.addCommand(name,args)}},_executeCommands:function(name,handler,context){var command=this.storage.getCommands(name);_.each(command.instances,function(args){handler.apply(context,args)});this.storage.clearCommands(name)},_initializeStorage:function(options){var storage;var StorageType=options.storageType||this.storageType;if(_.isFunction(StorageType)){storage=new StorageType()}else{storage=StorageType}this.storage=storage}})})(Wreqr);Wreqr.RequestResponse=(function(Wreqr){return Wreqr.Handlers.extend({request:function(){var name=arguments[0];var args=Array.prototype.slice.call(arguments,1);return this.getHandler(name).apply(this,args)}})})(Wreqr);Wreqr.EventAggregator=(function(Backbone,_){var EA=function(){};EA.extend=Backbone.Model.extend;_.extend(EA.prototype,Backbone.Events);return EA})(Backbone,_);return Wreqr})(Backbone,Backbone.Marionette,_);