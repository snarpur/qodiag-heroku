Backbone.Wreqr=function(f,d,e){d={};d.Handlers=function(c,a){var b=function(b){this.options=b;this._wreqrHandlers={};a.isFunction(this.initialize)&&this.initialize(b)};b.extend=c.Model.extend;a.extend(b.prototype,c.Events,{setHandlers:function(b){a.each(b,function(b,c){var g=null;a.isObject(b)&&!a.isFunction(b)&&(g=b.context,b=b.callback);this.setHandler(c,b,g)},this)},setHandler:function(a,b,c){this._wreqrHandlers[a]={callback:b,context:c};this.trigger("handler:add",a,b,c)},hasHandler:function(a){return!!this._wreqrHandlers[a]},
getHandler:function(a){var b=this._wreqrHandlers[a];if(!b)throw Error("Handler not found for '"+a+"'");return function(){var a=Array.prototype.slice.apply(arguments);return b.callback.apply(b.context,a)}},removeHandler:function(a){delete this._wreqrHandlers[a]},removeAllHandlers:function(){this._wreqrHandlers={}}});return b}(f,e);d.CommandStorage=function(){var c=function(a){this.options=a;this._commands={};e.isFunction(this.initialize)&&this.initialize(a)};e.extend(c.prototype,f.Events,{getCommands:function(a){var b=
this._commands[a];b||(b={command:a,instances:[]},this._commands[a]=b);return b},addCommand:function(a,b){this.getCommands(a).instances.push(b)},clearCommands:function(a){this.getCommands(a).instances=[]}});return c}();d.Commands=function(c){return c.Handlers.extend({storageType:c.CommandStorage,constructor:function(a){this.options=a||{};this._initializeStorage(this.options);this.on("handler:add",this._executeCommands,this);var b=Array.prototype.slice.call(arguments);c.Handlers.prototype.constructor.apply(this,
b)},execute:function(a,b){a=arguments[0];b=Array.prototype.slice.call(arguments,1);this.hasHandler(a)?this.getHandler(a).apply(this,b):this.storage.addCommand(a,b)},_executeCommands:function(a,b,c){var d=this.storage.getCommands(a);e.each(d.instances,function(a){b.apply(c,a)});this.storage.clearCommands(a)},_initializeStorage:function(a){a=a.storageType||this.storageType;this.storage=e.isFunction(a)?new a:a}})}(d);d.RequestResponse=function(c){return c.Handlers.extend({request:function(){var a=arguments[0],
b=Array.prototype.slice.call(arguments,1);return this.getHandler(a).apply(this,b)}})}(d);d.EventAggregator=function(c,a){var b=function(){};b.extend=c.Model.extend;a.extend(b.prototype,c.Events);return b}(f,e);return d}(Backbone,Backbone.Marionette,_);
