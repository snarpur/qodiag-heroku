(function(){var f={}.hasOwnProperty,g=function(a,c){function e(){this.constructor=a}for(var d in c)f.call(c,d)&&(a[d]=c[d]);e.prototype=c.prototype;a.prototype=new e;a.__super__=c.prototype;return a};this.Qapp.module("Entities",function(a,c,e,d,f,h){a.EntryFieldOption=function(a){function b(){return b.__super__.constructor.apply(this,arguments)}g(b,a);b.prototype.urlRoot="entry_field_options";b.prototype.paramRoot="entry_field_option";return b}(a.Model);return a.EntryFieldOptions=function(c){function b(){return b.__super__.constructor.apply(this,
arguments)}g(b,c);b.prototype.model=a.EntryFieldOption;return b}(a.Collection)})}).call(this);
