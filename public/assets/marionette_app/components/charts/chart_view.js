(function(){var h={}.hasOwnProperty,d=function(c,b){function d(){this.constructor=c}for(var e in b)h.call(b,e)&&(c[e]=b[e]);d.prototype=b.prototype;c.prototype=new d;c.__super__=b.prototype;return c},e=function(c,b){return function(){return c.apply(b,arguments)}};this.Qapp.module("Components.Charts",function(c,b,h,l,k,g){c.ChartLayout=function(b){function a(){return a.__super__.constructor.apply(this,arguments)}d(a,b);a.prototype.template="charts/templates/chart_layout";a.prototype.regions={chartsRegion:"#charts-region",
chartsHeadingRegion:"#charts-heading-region",chartsMenuRegion:"#charts-menu-region",chartsFilterRegion:"#charts-filter-region"};a.prototype.onShow=function(){return this.chartsRegion.on("show",function(a){return function(b){var f,d;d=new c.ChartsMenu({collection:b.collection.getChartMenu()});f=new c.ChartsFilters({collection:b.collection.getChartFilter()});f.chart;a.setHeading(b);a.listenTo(b.collection,"charts:rendered",function(a){return this.setHeading(a)});a.listenTo(d,"childview:active",function(b){return a.trigger("active:chart:selected",
b)});a.listenTo(f,"childview:selected",function(b,c){return a.trigger("filter:changed",b,c)});a.chartsMenuRegion.show(d);return a.chartsFilterRegion.show(f)}}(this))};a.prototype.setHeading=function(a){a=a.groupTitle();k(this.chartsHeadingRegion.el).find(".modal-title").remove();return k(this.chartsHeadingRegion.el).append("<h4 class='modal-title'>"+a+"</h4>")};return a}(b.Views.Layout);c.ColumnChart=function(b){function a(){this.drillup=e(this.drillup,this);this.attributes=e(this.attributes,this);
return a.__super__.constructor.apply(this,arguments)}d(a,b);a.prototype.template="charts/templates/_column";a.prototype.id=function(){return"chart-"+this.options.index};a.prototype.attributes=function(){return{style:function(a){return function(){return"float: left; width: "+90*a.model.chartWidth()+"%;"}}(this)}};a.prototype.ui={chart:".chart",drillup:".drillup"};a.prototype.events={"click .drillup":"drillup"};a.prototype.modelEvents={"change:drilldownHistory":"updateChart"};a.prototype.initialize=
function(){this.chartSetUp(this.model.get("chartOptions"));return a.__super__.initialize.apply(this,arguments)};a.prototype.onShow=function(){return this.createChart(this.model.get("chartOptions"))};a.prototype.updateChart=function(a){this.createChart(a.config);return this.triggerMethod("chart:updated")};a.prototype.createChart=function(a){return this.currentChart=new Highcharts.Chart(a)};a.prototype.drilldown=function(a){return this.options.chart.appView().triggerMethod("drilldown",{e:a,chart:this})};
a.prototype.drillup=function(){return this.model.back()};a.prototype.toggleDrillupButton=function(){var a;a=this.model.isChartRoot()?"hidden":"visible";return this.ui.drillup.css("visibility",a)};a.prototype.onChartUpdated=function(){return this.toggleDrillupButton()};a.prototype.onDrilldown=function(a){a=this.model.get("drilldownSeries")[a.e.point.name];return this.model.addChartToHistory(a)};a.prototype.setFormatters=function(a){return(new c.Formatter.Column(a)).setFormatters()};a.prototype.setDrilldown=
function(a){var b;b=this;return a.chart.appView=function(){return b}};a.prototype.setAppView=function(a){return a.chart.events.drilldown=this.drilldown};a.prototype.setContainer=function(a){return a.chart.renderTo=this.ui.chart[0]};a.prototype.chartSetUp=function(a){this.setDrilldown(a);this.setAppView(a);return this.setFormatters(a)};return a}(b.Views.ItemView);c.ColumnCharts=function(b){function a(){this.subtitle=e(this.subtitle,this);this.groupTitle=e(this.groupTitle,this);return a.__super__.constructor.apply(this,
arguments)}d(a,b);a.prototype.itemView=c.ColumnChart;a.prototype.className="row";a.prototype.onRender=function(){return this.collection.trigger("charts:rendered",this)};a.prototype.groupTitle=function(){return""+g.chain(this.collection.options.groupTitle).map(function(a){return this["title"+g(a[0]).capitalize()].call(this,a[1])},this).flatten().value().join(" ")+" | "+this.subtitle()};a.prototype.titleSurvey=function(a){return g(I18n.t("surveys."+a+".name")).capitalize()};a.prototype.titleSex=function(a){return I18n.t("surveys.terms."+
a)};a.prototype.titleAge=function(a){return(""+a+" ").concat(I18n.t("surveys.terms.age"))};a.prototype.titleRespondent=function(a){return I18n.t("surveys.terms.norm_reference."+a)};a.prototype.subtitle=function(){return null!=this.collection.options.completed?"<small class='white'><em>"+I18n.l("date.formats.long",this.collection.options.completed)+"</em></small>":""};return a}(b.Views.CollectionView);c.ChartsMenuItem=function(b){function a(){this.templateHelpers=e(this.templateHelpers,this);return a.__super__.constructor.apply(this,
arguments)}d(a,b);a.prototype.template="charts/templates/_charts_menu_item";a.prototype.className="btn-group";a.prototype.events={click:"active"};a.prototype.templateHelpers=function(){return{activeChart:function(a){return function(){var b;b=["btn btn-info active","btn btn-white"];return 0===a.options.index?b[0]:b[1]}}(this)}};a.prototype.initialize=function(){this.listenTo(this.options.collectionView,"childview:active",function(a){return function(b){return a.removeClass(b)}}(this));return a.__super__.initialize.apply(this,
arguments)};a.prototype.ui={nav:"button"};a.prototype.removeClass=function(a){if(a.options.index!==this.options.index&&this.ui.nav.hasClass("active"))return this.ui.nav.removeClass("active btn-info"),this.ui.nav.addClass("btn-white")};a.prototype.active=function(){if(!this.ui.nav.hasClass("active"))return this.ui.nav.removeClass("btn-white"),this.ui.nav.addClass("active btn-info"),this.triggerMethod("active")};return a}(b.Views.ItemView);c.ChartsMenu=function(b){function a(){this.childViewOptions=
e(this.childViewOptions,this);return a.__super__.constructor.apply(this,arguments)}d(a,b);a.prototype.itemView=c.ChartsMenuItem;a.prototype.className="btn-group btn-group-justified";a.prototype.childViewOptions=function(){return{collectionView:this}};a.prototype.initialize=function(){null==this.activeIndex&&(this.activeIndex=0);return a.__super__.initialize.apply(this,arguments)};return a}(b.Views.CollectionView);c.ChartsFilter=function(b){function a(){return a.__super__.constructor.apply(this,arguments)}
d(a,b);a.prototype.template="charts/templates/_charts_filters";a.prototype.events={"change select":"normReferenceChanged"};a.prototype.normReferenceChanged=function(a){return this.triggerMethod("selected",{id:a.currentTarget.value})};return a}(b.Views.ItemView);return c.ChartsFilters=function(b){function a(){return a.__super__.constructor.apply(this,arguments)}d(a,b);a.prototype.itemView=c.ChartsFilter;a.prototype.className="form-group";return a}(b.Views.CollectionView)})}).call(this);