(function(){var h={}.hasOwnProperty,k=function(b,a){function f(){this.constructor=b}for(var c in a)h.call(a,c)&&(b[c]=a[c]);f.prototype=a.prototype;b.prototype=new f;b.__super__=a.prototype;return b};this.Qapp.module("SubjectEntriesApp",function(b,a,f,c,h,g){var d;b.Router=function(b){function a(){return a.__super__.constructor.apply(this,arguments)}k(a,b);a.prototype.appRoutes={"people/:person_id/entries":"list","people/:person_id/entries/:entry_set_response_id(/section/:section_id)":"list"};return a}(c.AppRouter);
d={list:function(a,c,d){var e;e=g.map(g.compact(arguments),function(a){return Number(a)});e=g.object(["personId","entrySetResponseId","sectionId"],e);return new b.List.Controller(e)},create:function(a){return(new b.New.Controller(a)).newEntry()},show:function(a){return(new b.Show.Controller).show(a)}};a.commands.setHandler("new:entry:comment",function(a){return d.create(a)});a.commands.setHandler("show:entry:values",function(a){return d.show(a)});return a.addInitializer(function(){return new b.Router({controller:d})})})}).call(this);