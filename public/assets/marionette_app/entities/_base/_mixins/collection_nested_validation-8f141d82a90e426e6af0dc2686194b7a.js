(function(){this.Qapp.module("CollectionMixins",function(d,e,f,g,h,b){return d.NestedValidation={validateNested:function(){this.modelCids=b.pluck(this.models,"cid");this.validated=[];this._errors=[];return this.each(function(a){return function(c){a.listenTo(c,"validated:invalid validated:valid",function(c,d){a.validated.push(c.cid);if(b.isEmpty(b.difference(a.modelCids,a.validated)))return b.each(a.parents,function(b){return b.trigger("validated:"+a.parentRelationsKey+":collection",a)})});return c.validateNested()}}(this))}}})}).call(this);
