(function(){var f=function(f,h){return function(){return f.apply(h,arguments)}};this.Qapp.module("Components.Charts",function(g,h,k,l,m,e){g.Formatter||(g.Formatter={});return g.Formatter.Base=function(){function d(a){this.titleText=f(this.titleText,this);this.subtitleText=f(this.subtitleText,this);this.legendLabelFormatter=f(this.legendLabelFormatter,this);this.plotOptionsScatterDataLabelsFormatter=f(this.plotOptionsScatterDataLabelsFormatter,this);this.getFormatterFunction=f(this.getFormatterFunction,
this);this.setFormatters=f(this.setFormatters,this);this.findKeyAndValue=f(this.findKeyAndValue,this);this.chart=a}d.prototype.formatters=function(){return"plotOptions.column.dataLabels.formatter plotOptions.scatter.dataLabels.formatter xAxis.labels.formatter yAxis.labels.formatter legend.labelFormatter tooltip.formatter subtitle.text title.text".split(" ")};d.prototype.findValue=function(a,b){var c;c=b.split(".");return e.reduce(c,function(a,b){if(null!=(null!=a?a[b]:void 0))return a[b]},a)};d.prototype.findKey=
function(a,b){var c;c=b.split(".");return e.reduce(e.initial(c),function(a,b){if(null!=(null!=a?a[b]:void 0))return a[b]},a)};d.prototype.findKeyAndValue=function(a,b){var c,d;c=b.split(".");d=e.last(c);c=e.reduce(e.initial(c),function(a,b){if(null!=(null!=a?a[b]:void 0))return a[b]},a);if(null!=c)return{key:c,value:d}};d.prototype.setFormatters=function(){e.each(this.formatters(),function(a){var b,c;b=this.findKeyAndValue(this.chart,a);if(null!=(null!=b?null!=(c=b.key)?c[b.value]:void 0:void 0))return c=
b.key[b.value],b.key[b.value]=this.getFormatterFunction(a,c)},this);return this.chart};d.prototype.getFormatterFunction=function(a,b){var c;c=e.camelize(a.replace(/\./g,"-"));!0===b&&(b={name:"default"});return this[c].call(this,b)};d.prototype.plotOptionsColumnDataLabelsFormatter=function(){return function(){return null!=this.point.config.name&&this.point.config.name.data_label?this.point.config.name.data_label:this.y}};d.prototype.plotOptionsScatterDataLabelsFormatter=function(){var a;a=this.chart.accessCode;
return function(){var b;b=e.capitalize(I18n.t("surveys."+a+".terms."+this.series.name.name));return""+this.series.name.value+" "+b}};d.prototype.legendLabelFormatter=function(){var a;a=this.chart.accessCode;return function(){var b;b=I18n.t("surveys."+a+".terms."+this.name);e.includes(b,"missing")&&(b=this.name);return e.capitalize(b)}};d.prototype.subtitleText=function(){return"<span class='label label-inverse'>"+I18n.l("date.formats.long",this.chart.subtitle.text)+"</span>"};d.prototype.titleText=
function(){return e.chain(this.chart.title.text).map(function(a){return this["title"+e(a[0]).capitalize()].call(this,a[1])},this).flatten().value().join(" ")};d.prototype.titleSurvey=function(a){return e(I18n.t("surveys."+a+".name")).capitalize()};d.prototype.titleSex=function(a){return I18n.t("surveys.terms."+a)};d.prototype.titleAge=function(a){return(""+a+" ").concat(I18n.t("surveys.terms.age"))};d.prototype.titleRespondent=function(a){return I18n.t("surveys.terms.norm_reference."+a)};return d}()})}).call(this);