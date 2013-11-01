(function(){var __hasProp={}.hasOwnProperty,__extends=function(child,parent){for(var key in parent){if(__hasProp.call(parent,key)){child[key]=parent[key]}}function ctor(){this.constructor=child}ctor.prototype=parent.prototype;child.prototype=new ctor();child.__super__=parent.prototype;return child};this.Qapp.module("SettingsApp.List",function(List,App,Backbone,Marionette,$,_){var _ref,_ref1,_ref2,_ref3,_ref4;List.Layout=(function(_super){__extends(Layout,_super);function Layout(){_ref=Layout.__super__.constructor.apply(this,arguments);return _ref}Layout.prototype.template="settings/list/templates/list_layout";Layout.prototype.regions={navigationRegion:"#navigation-region"};return Layout})(App.Views.Layout);List.NavigationItem=(function(_super){__extends(NavigationItem,_super);function NavigationItem(){_ref1=NavigationItem.__super__.constructor.apply(this,arguments);return _ref1}NavigationItem.prototype.template="settings/list/templates/_navigation";NavigationItem.prototype.tagName="li";NavigationItem.prototype.className=function(){if(this.model.collection.currentSetting===this.model.get("name")){return"active"}};return NavigationItem})(App.Views.ItemView);List.Breadcrumb=(function(_super){__extends(Breadcrumb,_super);function Breadcrumb(){_ref2=Breadcrumb.__super__.constructor.apply(this,arguments);return _ref2}Breadcrumb.prototype.template="settings/list/templates/breadcrumb";Breadcrumb.prototype.tagName="ul";Breadcrumb.prototype.className="breadcrumb";Breadcrumb.prototype.triggers={"click a":"back"};return Breadcrumb})(App.Views.ItemView);List.Header=(function(_super){__extends(Header,_super);function Header(){_ref3=Header.__super__.constructor.apply(this,arguments);return _ref3}Header.prototype.template="settings/list/templates/header";Header.prototype.className="content_title";Header.prototype.tagName="h1";return Header})(App.Views.ItemView);return List.Navigation=(function(_super){__extends(Navigation,_super);function Navigation(){_ref4=Navigation.__super__.constructor.apply(this,arguments);return _ref4}Navigation.prototype.itemView=List.NavigationItem;Navigation.prototype.className="tabs fullwidth";Navigation.prototype.tagName="ul";return Navigation})(App.Views.CollectionView)})}).call(this);