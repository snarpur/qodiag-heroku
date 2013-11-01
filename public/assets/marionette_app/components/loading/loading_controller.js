(function(){var __hasProp={}.hasOwnProperty,__extends=function(child,parent){for(var key in parent){if(__hasProp.call(parent,key)){child[key]=parent[key]}}function ctor(){this.constructor=child}ctor.prototype=parent.prototype;child.prototype=new ctor();child.__super__=parent.prototype;return child};this.Qapp.module("Components.Loading",function(Loading,App,Backbone,Marionette,$,_){var _ref;Loading.LoadingController=(function(_super){__extends(LoadingController,_super);function LoadingController(){_ref=LoadingController.__super__.constructor.apply(this,arguments);return _ref}LoadingController.prototype.initialize=function(options){var activeRegion,config,loadingView,view;view=options.view,config=options.config;config=_.isBoolean(config)?{}:config;_.defaults(config,{loadingType:"opacity-spinner",debug:false,entities:this.getEntities(view)});activeRegion=options.loaderRegion?options.loaderRegion:this.region;switch(config.loadingType){case"opacity-spinner":$(activeRegion.el).toggleWrapper({spinner:true});break;case"opacity":$(activeRegion.el).css("opacity",0.5);break;case"spinner":loadingView=this.getLoadingView(config);this.show(loadingView);break;default:throw new Error("Invalid loadingType")}return this.showRealView(view,loadingView,config,activeRegion)};LoadingController.prototype.showRealView=function(realView,loadingView,config,activeRegion){var _this=this;return App.execute("when:fetched",config.entities,function(){switch(config.loadingType){case"opacity-spinner":$(activeRegion.el).toggleWrapper({spinner:true},false);break;case"opacity":$(activeRegion.el).removeAttr("style");break;case"spinner":if(activeRegion.currentView!==loadingView){return realView.close()}}if(config!=null?config.callback:void 0){config.callback()}return _this.show(realView)})};LoadingController.prototype.getEntities=function(view){return _.chain(view).pick("model","collection").toArray().compact().value()};LoadingController.prototype.getLoadingView=function(config){return new Loading.LoadingView({model:config.entities})};return LoadingController})(App.Controllers.Base);return App.commands.setHandler("show:loading",function(view,options){return new Loading.LoadingController({view:view,region:options.region,loaderRegion:options.loaderRegion,config:options.loading})})})}).call(this);