/* DO NOT MODIFY. This file was compiled Wed, 20 Jul 2011 16:21:29 GMT from
 * /Users/orripalsson/Dev/snarpur/app/02/snarpur/app/coffeescripts/views/show.coffee
 */

(function() {
  var _base;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  (_base = App.Views).ResponderItems || (_base.ResponderItems = {});
  App.Views.ResponderItems.Show = (function() {
    __extends(Show, Backbone.View);
    function Show() {
      this.render = __bind(this.render, this);
      this.inlineAttributes = __bind(this.inlineAttributes, this);
      this.barLabels = __bind(this.barLabels, this);
      this.getElClass = __bind(this.getElClass, this);
      this.chart = __bind(this.chart, this);
      this.setPosition = __bind(this.setPosition, this);
      this.dialog = __bind(this.dialog, this);
      this.dialogId = __bind(this.dialogId, this);
      this.chartDivId = __bind(this.chartDivId, this);
      this.contractLine = __bind(this.contractLine, this);
      this.expandLine = __bind(this.expandLine, this);
      this.line = __bind(this.line, this);
      this.remove = __bind(this.remove, this);
      this.initialize = __bind(this.initialize, this);
      Show.__super__.constructor.apply(this, arguments);
    }
    Show.prototype.template = function() {
      return JST['show'];
    };
    Show.prototype.events = {
      "click .close": "remove"
    };
    Show.prototype.initialize = function(item) {
      this.el = $(this.el);
      return this.model.view = this;
    };
    Show.prototype.elements = {};
    Show.prototype.remove = function() {
      this.contractLine();
      return this.el.remove();
    };
    Show.prototype.line = function() {
      var _base2, _ref;
            if ((_ref = (_base2 = this.elements).line) != null) {
        _ref;
      } else {
        _base2.line = $("#line-" + (this.model.get('access_code')));
      };
      return this.elements.line;
    };
    Show.prototype.expandLine = function() {
      return this.line().switchClass('closed', 'open', 1000);
    };
    Show.prototype.contractLine = function() {
      return this.line().switchClass('open', 'closed', 1000);
    };
    Show.prototype.chartDivId = function() {
      return "" + (this.model.get('access_code')) + "-chart";
    };
    Show.prototype.dialogId = function() {
      return "chart-dialog";
    };
    Show.prototype.dialog = function() {
      return $("#" + (this.dialogId()));
    };
    Show.prototype.setPosition = function() {
      return this.el.css({
        top: this.line().position().top + this.model.getTimeline('line_height')
      });
    };
    Show.prototype.chart = function(item) {
      return this.model.get('chart')[item];
    };
    Show.prototype.getElClass = function() {
      return "chart-dialog";
    };
    Show.prototype.barLabels = function() {
      return this.chart('bar_labels').map(function(label) {
        return JST.bar_labels(label);
      });
    };
    Show.prototype.inlineAttributes = function() {
      var attr;
      attr = {
        id: this.dialogId(),
        "class": this.getElClass()
      };
      return attr;
    };
    Show.prototype.chartConfig = function() {
      var opt;
      console.log(this.model);
      opt = {
        legend: {
          show: true,
          placement: 'outsideGrid'
        },
        seriesDefaults: {
          renderer: $.jqplot.BarRenderer,
          pointLabels: {
            show: true,
            edgeTolerance: 5
          }
        },
        series: this.chart('data_labels'),
        axes: {
          xaxis: {
            renderer: $.jqplot.CategoryAxisRenderer,
            ticks: this.barLabels(),
            autoscale: true
          },
          yaxis: {
            min: 0,
            ticks: this.chart('increment')
          }
        }
      };
      return opt;
    };
    Show.prototype.render = function() {
      var plot;
      $(this.el).attr(this.inlineAttributes());
      $(this.el).html(this.template()(this.model.toJSON()));
      $("#" + (this.dialogId())).remove();
      $("#canvas").append(this.el);
      this.setPosition();
      plot = $.jqplot(this.chartDivId(), _.values(this.chart('data')), this.chartConfig());
      console.log(plot);
      this.expandLine();
      return this;
    };
    return Show;
  })();
}).call(this);
