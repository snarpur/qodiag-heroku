(function(){var h={}.hasOwnProperty,k=function(c,d){function f(){this.constructor=c}for(var e in d)h.call(d,e)&&(c[e]=d[e]);f.prototype=d.prototype;c.prototype=new f;c.__super__=d.prototype;return c};this.Qapp.module("Entities",function(c,d,f,e,h,l){var g;c.NationalRegister=function(b){function a(){return a.__super__.constructor.apply(this,arguments)}k(a,b);a.prototype.urlRoot=function(){return Routes.lookup_path(this.get("kennitala"))};a.prototype.isEmpty=function(){return 1===l.size(this.attributes)?
!0:!1};return a}(c.Model);c.NationalRegisters=function(b){function a(){return a.__super__.constructor.apply(this,arguments)}k(a,b);a.prototype.model=c.NationalRegister;a.prototype.isEmpty=function(){return 0===this.length?!0:!1};return a}(c.Collection);g={getNationalRegisterInformation:function(b){b=new c.NationalRegister({kennitala:b});b.fetch();return b},getNationalRegisterFamily:function(b){var a;a=new c.NationalRegisters;a.url=Routes.family_path(b);a.fetch();return a}};d.reqres.setHandler("get:national_register:data",
function(b){return g.getNationalRegisterInformation(b)});return d.reqres.setHandler("get:national_register:family",function(b){return g.getNationalRegisterFamily(b)})})}).call(this);