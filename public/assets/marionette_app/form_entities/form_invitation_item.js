(function(){var f={}.hasOwnProperty,h=function(c,a){function d(){this.constructor=c}for(var e in a)f.call(a,e)&&(c[e]=a[e]);d.prototype=a.prototype;c.prototype=new d;c.__super__=a.prototype;return c};this.Qapp.module("Entities",function(c,a,d,e,f,k){var g;c.FormInvitationItemModel=function(c){function b(){return b.__super__.constructor.apply(this,arguments)}h(b,c);b.prototype.urlRoot=Routes.invitation_items_path();b.prototype.initialize=function(){this.validation={};return b.__super__.initialize.apply(this,
arguments)};b.prototype.relations=[{type:d.One,key:"subject",relatedModel:function(){return a.Entities.FormPersonModel}},{type:d.One,key:"respondent",relatedModel:function(){return a.Entities.FormPersonModel}}];return b}(c.ResponderItem);g={getResponderItemForId:function(a){var b;b=new c.FormInvitationItemModel;b.url=Routes.invitation_item_step_path(a.id,{step_no:a.step_no,type:a.type});b.fetch({reset:!0});return b}};return a.reqres.setHandler("get:responder:item",function(a){return g.getResponderItemForId(a)})})}).call(this);