(function(){var __hasProp={}.hasOwnProperty,__extends=function(child,parent){for(var key in parent){if(__hasProp.call(parent,key)){child[key]=parent[key]}}function ctor(){this.constructor=child}ctor.prototype=parent.prototype;child.prototype=new ctor();child.__super__=parent.prototype;return child};this.Qapp.module("EntrySetSectionsApp.List",function(List,App,Backbone,Marionette,$,_){var _ref,_ref1,_ref2,_ref3,_ref4;List.Layout=(function(_super){__extends(Layout,_super);function Layout(){_ref=Layout.__super__.constructor.apply(this,arguments);return _ref}Layout.prototype.template="entry_set_sections/list/templates/list_layout";Layout.prototype.className=function(){if(this.model.get("editable")===false){return"uneditable-entry-set"}};Layout.prototype.regions={settingsNavigationRegion:"#settings-navigation-region",entrySetTitleRegion:"#entry-set-title-region",navigationRegion:"#sections-navigation-region",sectionTitleRegion:"#section-title-region",sectionContentRegion:"#section-content-region",entryFieldsRegion:"#entry-fields-region",entryFieldsSidebarRegion:"#entry-fields-sidebar-region"};return Layout})(App.Views.Layout);List.SectionNav=(function(_super){__extends(SectionNav,_super);function SectionNav(){_ref1=SectionNav.__super__.constructor.apply(this,arguments);return _ref1}SectionNav.prototype.template="entry_set_sections/list/templates/_section_nav";SectionNav.prototype.tagName="li";SectionNav.prototype.className=function(){if(this.model.isCurrentSection()){return"active"}};SectionNav.prototype.modelEvents={"edit:complete":function(){return this.render()}};SectionNav.prototype.onSetCurrentSection=function(options){return options.model.trigger("change:current:section",options)};SectionNav.prototype.triggers={"click ":"set:current:section"};SectionNav.prototype.initialize=function(options){var _this=this;this.model.set("entrySetId",options.entrySetId);return this.model.collection.on("change:current:section",function(){if(_this.model.isCurrentSection()){return _this.$el.addClass("active")}else{return _this.$el.removeClass("active")}})};return SectionNav})(App.Views.ItemView);List.EmptySectionNav=(function(_super){__extends(EmptySectionNav,_super);function EmptySectionNav(){_ref2=EmptySectionNav.__super__.constructor.apply(this,arguments);return _ref2}EmptySectionNav.prototype.template="entry_set_sections/list/templates/_empty_section_nav";EmptySectionNav.prototype.tagName="li";EmptySectionNav.prototype.className="active";return EmptySectionNav})(App.Views.ItemView);List.SectionsNav=(function(_super){__extends(SectionsNav,_super);function SectionsNav(){_ref3=SectionsNav.__super__.constructor.apply(this,arguments);return _ref3}SectionsNav.prototype.template="entry_set_sections/list/templates/section_nav";SectionsNav.prototype.itemView=List.SectionNav;SectionsNav.prototype.emptyView=List.EmptySectionNav;SectionsNav.prototype.itemViewContainer="ul";SectionsNav.prototype.triggers={"click .button":"add:new:section:clicked"};return SectionsNav})(App.Views.CompositeView);return List.Title=(function(_super){__extends(Title,_super);function Title(){_ref4=Title.__super__.constructor.apply(this,arguments);return _ref4}Title.prototype.template="entry_set_sections/list/templates/title";Title.prototype.triggers={"click .edit-item":"edit:title","click .remove-item":"remove:title"};Title.prototype.modelEvents={"edit:complete":function(){return this.render()}};return Title})(App.Views.ItemView)})}).call(this);