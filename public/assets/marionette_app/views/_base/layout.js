(function(){var e={}.hasOwnProperty,f=function(b,a){function d(){this.constructor=b}for(var c in a)e.call(a,c)&&(b[c]=a[c]);d.prototype=a.prototype;b.prototype=new d;b.__super__=a.prototype;return b};this.Qapp.module("Views",function(b,a,d,c,e,g){return b.Layout=function(b){function a(){return a.__super__.constructor.apply(this,arguments)}f(a,b);a.prototype.serializeData=function(){if(this.model)return this.model.attributes};a.prototype.initialize=function(){a.__super__.initialize.apply(this,arguments);
return this.extendTemplateHelpers(this.templateHelpers)};return a}(c.Layout)})}).call(this);