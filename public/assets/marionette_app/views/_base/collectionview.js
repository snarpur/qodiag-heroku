(function(){var f=function(b,a){return function(){return b.apply(a,arguments)}},e={}.hasOwnProperty,g=function(b,a){function d(){this.constructor=b}for(var c in a)e.call(a,c)&&(b[c]=a[c]);d.prototype=a.prototype;b.prototype=new d;b.__super__=a.prototype;return b};this.Qapp.module("Views",function(b,a,d,c,e,h){return b.CollectionView=function(b){function a(){this.itemViewOptions=f(this.itemViewOptions,this);return a.__super__.constructor.apply(this,arguments)}g(a,b);a.prototype.itemViewEventPrefix=
"childview";a.prototype.itemViewOptions=function(a,b){var c;c={index:b};return null!=this.childViewOptions?h.extend(c,this.childViewOptions()):c};return a}(c.CollectionView)})}).call(this);
