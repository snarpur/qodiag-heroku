(function(){var e={}.hasOwnProperty,f=function(b,a){function d(){this.constructor=b}for(var c in a)e.call(a,c)&&(b[c]=a[c]);d.prototype=a.prototype;b.prototype=new d;b.__super__=a.prototype;return b};this.Qapp.module("SettingsApp.List",function(b,a,d,c,e,g){return b.Header=function(b){function a(){return a.__super__.constructor.apply(this,arguments)}f(a,b);a.prototype.template="settings/list/templates/header";a.prototype.className="state-overview";return a}(a.Views.ItemView)})}).call(this);