(function(){(function(c){return _.extend(c.Marionette.Application.prototype,{navigate:function(a,b){null==b&&(b={});return c.history.navigate(a,b)},routeToCaretakerRoot:function(a){return _.contains(a.get("role_names"),"caretaker")&&null===this.getCurrentRoute()?!0:!1},getCurrentRoute:function(){var a;a=c.history.fragment;return _.isEmpty(a)?null:a},showHideSidebar:function(a){if(void 0!==_.find(["invitation_items","pre_registration","items","entry_set_responses"],function(b){return-1!==a.indexOf(b)})&&
!this.contentRegion.$el.parents("body").hasClass("full-width"))return this.contentRegion.$el.parents("body").addClass("full-width")},rootUrl:function(a){var b;b={caretaker:"settings",respondent:"items"};a=a.get("role_names");a=_.filter(a,function(a){return"caretaker"===a||"respondent"===a});console.log(b[_.first(a)]);return b[_.first(a)]},startHistory:function(){if(c.history)return c.history.start()},register:function(a,b){null==this._registry&&(this._registry={});return this._registry[b]=a},unregister:function(a,
b){return delete this._registry[b]},resetRegistry:function(){var a,b,c,d;c=this.getRegistrySize();d=this._registry;for(b in d)a=d[b],a.region.close();a="There were "+c+" controllers in the registry, there are now "+this.getRegistrySize();return 0<this.getRegistrySize()?console.warn(a,this._registry):console.log(a)},getRegistrySize:function(){return _.size(this._registry)}})})(Backbone)}).call(this);
