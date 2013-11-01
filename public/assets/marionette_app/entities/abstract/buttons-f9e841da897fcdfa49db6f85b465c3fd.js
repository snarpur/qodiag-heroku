(function(){var __hasProp={}.hasOwnProperty,__extends=function(child,parent){for(var key in parent){if(__hasProp.call(parent,key)){child[key]=parent[key]}}function ctor(){this.constructor=child}ctor.prototype=parent.prototype;child.prototype=new ctor();child.__super__=parent.prototype;return child};this.Qapp.module("Entities",function(Entities,App,Backbone,Marionette,$,_){var API,_ref,_ref1;Entities.Button=(function(_super){__extends(Button,_super);function Button(){_ref=Button.__super__.constructor.apply(this,arguments);return _ref}Button.prototype.defaults={buttonType:"button"};return Button})(Entities.Model);Entities.ButtonsCollection=(function(_super){__extends(ButtonsCollection,_super);function ButtonsCollection(){_ref1=ButtonsCollection.__super__.constructor.apply(this,arguments);return _ref1}ButtonsCollection.prototype.model=Entities.Button;ButtonsCollection.prototype.comparator=function(button){return button.get("order")};return ButtonsCollection})(Entities.Collection);API={getFormButtons:function(buttons,model){var buttonCollection;buttons=this.getDefaultButtons(buttons,model);buttonCollection=new Entities.ButtonsCollection(buttons);buttonCollection.placement=buttons.placement;return buttonCollection},getDefaultButtons:function(buttons,model){var defaultButtons;defaultButtons={buttons:{primary:{text:I18n.t("actions.save"),className:"btn btn-primary",order:1,buttonType:"submit"},cancel:{text:I18n.t("actions.cancel"),className:"btn",order:2,buttonType:"cancel"}},config:{placement:"right"}};return _.chain(_.union(_.keys(buttons),_.keys(defaultButtons.buttons))).map(function(i){var _base,_ref2;if(buttons[i]!==false){if((_ref2=(_base=defaultButtons.buttons)[i])==null){_base[i]={}}return _.extend(defaultButtons.buttons[i],buttons[i])}}).compact().value()}};return App.reqres.setHandler("form:button:entities",function(buttons,model){if(buttons==null){buttons={}}return API.getFormButtons(buttons,model)})})}).call(this);