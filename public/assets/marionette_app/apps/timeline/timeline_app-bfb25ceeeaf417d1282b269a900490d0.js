(function(){var f={}.hasOwnProperty,g=function(b,a){function d(){this.constructor=b}for(var c in a)f.call(a,c)&&(b[c]=a[c]);d.prototype=a.prototype;b.prototype=new d;b.__super__=a.prototype;return b};this.Qapp.module("TimelineApp",function(b,a,d,c,f,h){var e;b.Router=function(b){function a(){return a.__super__.constructor.apply(this,arguments)}g(a,b);a.prototype.appRoutes={"timeline/people/:id":"list"};return a}(c.AppRouter);e={list:function(a,c){null==c&&(c={});return new b.List.Controller(a,c)}};
a.commands.setHandler("show:timeline",function(a){return e.list(a)});return a.addInitializer(function(){return new b.Router({controller:e})})})}).call(this);
