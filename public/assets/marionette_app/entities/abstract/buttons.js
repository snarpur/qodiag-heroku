(function(){var k={}.hasOwnProperty,l=function(c,d){function e(){this.constructor=c}for(var g in d)k.call(d,g)&&(c[g]=d[g]);e.prototype=d.prototype;c.prototype=new e;c.__super__=d.prototype;return c};this.Qapp.module("Entities",function(c,d,e,g,k,f){var m;c.Button=function(b){function a(){return a.__super__.constructor.apply(this,arguments)}l(a,b);a.prototype.defaults={buttonType:"button"};return a}(e.Model);c.ButtonsCollection=function(b){function a(){return a.__super__.constructor.apply(this,arguments)}
l(a,b);a.prototype.model=c.Button;a.prototype.comparator=function(b){return b.get("order")};return a}(e.Collection);m={getFormButtons:function(b,a){var h;b=this.getDefaultButtons(b,a);h=new c.ButtonsCollection(b);h.placement=b.placement;return h},getDefaultButtons:function(b,a){var c;c={primary:{text:I18n.t("actions.save"),className:"btn btn-success",order:1,buttonType:"submit"},cancel:{text:I18n.t("actions.cancel"),className:"btn btn-default",order:2,buttonType:"cancel",dataDismiss:"data-dismiss='modal'"}};
return f.chain(f.union(f.keys(b),f.keys(c))).map(function(a){if(!1!==b[a])return null==c[a]&&(c[a]={}),f.extend(c[a],b[a])}).compact().value()}};return d.reqres.setHandler("form:button:entities",function(b,a){null==b&&(b={});return m.getFormButtons(b,a)})})}).call(this);