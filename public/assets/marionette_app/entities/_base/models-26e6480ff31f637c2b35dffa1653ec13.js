(function(){var k=function(e,f){return function(){return e.apply(f,arguments)}},n={}.hasOwnProperty,p=function(e,f){function g(){this.constructor=e}for(var h in f)n.call(f,h)&&(e[h]=f[h]);g.prototype=f.prototype;e.prototype=new g;e.__super__=f.prototype;return e};(function(e){_.extend(e.Model.prototype,e.Validation.mixin);return _.extend(e.Model.prototype,Qapp.ModelMixins.NestedValidation)})(Backbone);this.Qapp.module("Entities",function(e,f,g,h,l,d){return e.Model=function(f){function b(){this.toJSON=
k(this.toJSON,this);this.saveError=k(this.saveError,this);this.saveSuccess=k(this.saveSuccess,this);return b.__super__.constructor.apply(this,arguments)}p(b,f);b.prototype.attributeList=[];b.prototype.nestedAttributeList=[];b.prototype.blacklist=["_errors","_nestedErrors"];b.prototype.nestedErrors={};b.prototype.validation={};b.prototype.initialize=function(){this.url=function(){var a,c;a=null!=(c=d.result(this,"urlRoot"))?c:this.collection.url();return this.id?""+a+"/"+this.id:a};this.validateOnChange();
this.on("validated:invalid",this.onInvalid);this.on("validated:valid",this.onValid);return b.__super__.initialize.apply(this,arguments)};b.prototype.validateOnChange=function(){var a;a=d.map(d.keys(this.validation),function(a){return"change:"+a}).join(" ");return this.on(a,function(a){return function(){if(null!=a.get("_errors"))return a.validate()}}(this))};b.prototype.destroy=function(a){null==a&&(a={});d.defaults(a,{wait:!0});this.set({_destroy:!0});return b.__super__.destroy.call(this,a)};b.prototype.isDestroyed=
function(){return this.get("_destroy")};b.prototype.save=function(a,c){var m;null==c&&(c={});m=this.isNew();d.defaults(c,{wait:!0,success:d.bind(this.saveSuccess,this,m,c.collection),error:d.bind(this.saveError,this)});this.unset("_errors");return b.__super__.save.call(this,a,c)};b.prototype.saveSuccess=function(a,c){if(a)return c&&c.add(this),c&&c.trigger("model:created",this),this.trigger("created",this);null==c&&(c=this.collection);c&&c.trigger("model:updated",this);return this.trigger("updated",
this)};b.prototype.saveError=function(a,c,b){var d;if(!(500===c.status||404===c.status))return a.off("created updated"),this.setNestedServerErrors(null!=(d=l.parseJSON(c.responseText))?d.errors:void 0)};b.prototype._getEntityClass=function(a){return e[d(a).chain().capitalize().camelize().value()]};b.prototype._createNestedEntity=function(a,c){var b;if(!(this._isBackbone(this.get("key"))&&null!=c))return b=new (this._getEntityClass(a))(c),this.set(a,b,{silent:!0}),this.listenTo(b,"change",function(c){return function(){return c.trigger("change:"+
a,a,b)}}(this))};b.prototype._isBackbone=function(a){return a instanceof g.Model||a instanceof g.Collection};b.prototype._isBackboneAssociation=function(a){return d.contains(d.pluck(this.relations,"key"),a)};b.prototype._isHelper=function(a,c){return d.isObject(c)&&!this._inNestedAttributeList(a)&&!d.endsWith(a,"_attributes")||d.isFunction(c)};b.prototype._inNestedAttributeList=function(a){return d.contains(this.nestedAttributeList,a)};b.prototype._inAttributeList=function(a){return d.contains(this.attributeList,
a)};b.prototype._inBlacklist=function(a){return d.contains(this.blacklist,a)};b.prototype.onValid=function(a,c){return a.set("_errors",null)};b.prototype.onInvalid=function(a,c){return a.set("_errors",c)};b.prototype.toJSON=function(a){var c;if(!1===(null!=a?a.acceptsNested:void 0))return b.__super__.toJSON.apply(this,arguments);c=l.extend(!0,{},this.attributes);d.each(c,function(a,b){if((this._inNestedAttributeList(b)||this._isBackboneAssociation(b))&&!(d.isNull(a)||0===(null!=a?a.length:void 0))){if(!this._isBackbone(a)||
!(c[""+b+"_attributes"]=a.toJSON()))c[""+b+"_attributes"]=a;return delete c[b]}if(this._isHelper(b,a)||this._inBlacklist(b))return delete c[b]},this);return c};return b}(g.AssociatedModel)})}).call(this);
