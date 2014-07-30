(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  App.Lib.ChartFormatters.Line = (function(_super) {
    __extends(Line, _super);

    function Line() {
      this.xAxisLabelsFormatter = __bind(this.xAxisLabelsFormatter, this);
      return Line.__super__.constructor.apply(this, arguments);
    }

    Line.prototype.formatters = function() {
      return ["plotOptions.column.dataLabels.formatter", "xAxis.labels.formatter", "legend.labelFormatter"];
    };

    Line.prototype.xAxisLabelsFormatter = function() {
      return function() {
        return I18n.l("date.formats.default", new Date(this.value));
      };
    };

    return Line;

  })(App.Lib.ChartFormatters.Chart);

}).call(this);