(function(){var g={}.hasOwnProperty,h=function(a,c){function f(){this.constructor=a}for(var e in c)g.call(c,e)&&(a[e]=c[e]);f.prototype=c.prototype;a.prototype=new f;a.__super__=c.prototype;return a};this.Qapp.module("Entities",function(a,c,f,e,g,l){var k;a.Survey=function(a){function b(){return b.__super__.constructor.apply(this,arguments)}h(b,a);return b}(a.Model);a.Surveys=function(d){function b(){return b.__super__.constructor.apply(this,arguments)}h(b,d);b.prototype.model=a.Survey;return b}(a.Collection);
k={getSurveys:function(d){d=new a.Surveys;d.url=Routes.all_surveys_path();d.fetch({reset:!0});return d}};return c.reqres.setHandler("get:surveys",function(a){return k.getSurveys(a)})})}).call(this);