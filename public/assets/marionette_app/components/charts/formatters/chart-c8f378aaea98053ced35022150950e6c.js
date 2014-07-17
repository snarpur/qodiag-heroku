(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  this.Qapp.module("Components.Charts", function(Charts, App, Backbone, Marionette, $, _) {
    Charts.Formatter || (Charts.Formatter = {});
    return Charts.Formatter.Base = (function() {
      Base.prototype.formatters = function() {
        return ["plotOptions.column.dataLabels.formatter", "plotOptions.scatter.dataLabels.formatter", "xAxis.labels.formatter", "yAxis.labels.formatter", "legend.labelFormatter", "tooltip.formatter", "subtitle.text", "title.text"];
      };

      function Base(chart_config) {
        this.titleText = __bind(this.titleText, this);
        this.subtitleText = __bind(this.subtitleText, this);
        this.legendLabelFormatter = __bind(this.legendLabelFormatter, this);
        this.plotOptionsScatterDataLabelsFormatter = __bind(this.plotOptionsScatterDataLabelsFormatter, this);
        this.getFormatterFunction = __bind(this.getFormatterFunction, this);
        this.setFormatters = __bind(this.setFormatters, this);
        this.findKeyAndValue = __bind(this.findKeyAndValue, this);
        this.chart = chart_config;
      }

      Base.prototype.findValue = function(obj, path) {
        var nestedValue, pathArray;
        pathArray = path.split(".");
        nestedValue = _.reduce(pathArray, (function(m, i) {
          if ((m != null ? m[i] : void 0) != null) {
            return m[i];
          }
        }), obj);
        return nestedValue;
      };

      Base.prototype.findKey = function(obj, path) {
        var nestedKey, pathArray;
        pathArray = path.split(".");
        nestedKey = _.reduce(_.initial(pathArray), (function(m, i) {
          if ((m != null ? m[i] : void 0) != null) {
            return m[i];
          }
        }), obj);
        return nestedKey;
      };

      Base.prototype.findKeyAndValue = function(obj, path) {
        var nestedKey, nestedValue, pathArray;
        pathArray = path.split(".");
        nestedValue = _.last(pathArray);
        nestedKey = _.reduce(_.initial(pathArray), (function(m, i) {
          if ((m != null ? m[i] : void 0) != null) {
            return m[i];
          }
        }), obj);
        if (nestedKey != null) {
          return {
            key: nestedKey,
            value: nestedValue
          };
        }
      };

      Base.prototype.setFormatters = function() {
        _.each(this.formatters(), (function(f) {
          var target, value, _ref;
          target = this.findKeyAndValue(this.chart, f);
          if ((target != null ? (_ref = target.key) != null ? _ref[target.value] : void 0 : void 0) != null) {
            value = target.key[target.value];
            return target.key[target.value] = this.getFormatterFunction(f, value);
          }
        }), this);
        return this.chart;
      };

      Base.prototype.getFormatterFunction = function(str, options) {
        var functionString;
        functionString = _.camelize(str.replace(/\./g, "-"));
        if (options === true) {
          options = {
            name: 'default'
          };
        }
        return this[functionString].call(this, options);
      };

      Base.prototype.plotOptionsColumnDataLabelsFormatter = function() {
        return function() {
          if ((this.point.config.name != null) && this.point.config.name.data_label) {
            return this.point.config.name.data_label;
          } else {
            return this.y;
          }
        };
      };

      Base.prototype.plotOptionsScatterDataLabelsFormatter = function() {
        var accessCode;
        accessCode = this.chart.accessCode;
        return function() {
          var nameI18n;
          nameI18n = _.capitalize(I18n.t("surveys." + accessCode + ".terms." + this.series.name.name));
          return "" + this.series.name.value + " " + nameI18n;
        };
      };

      Base.prototype.legendLabelFormatter = function() {
        var accessCode;
        accessCode = this.chart.accessCode;
        return function() {
          var str;
          str = I18n.t("surveys." + accessCode + ".terms." + this.name);
          if (_.includes(str, 'missing')) {
            str = this.name;
          }
          return _.capitalize(str);
        };
      };

      Base.prototype.subtitleText = function() {
        return "<span class='label label-inverse'>" + (I18n.l('date.formats.long', this.chart.subtitle.text)) + "</span>";
      };

      Base.prototype.titleText = function() {
        var title;
        title = _.chain(this.chart.title.text).map((function(i) {
          return this["title" + (_(i[0]).capitalize())].call(this, i[1]);
        }), this).flatten().value();
        return title.join(" ");
      };

      Base.prototype.titleSurvey = function(name) {
        return _(I18n.t("surveys." + name + ".name")).capitalize();
      };

      Base.prototype.titleSex = function(sex) {
        return I18n.t("surveys.terms." + sex);
      };

      Base.prototype.titleAge = function(age) {
        var str;
        str = "" + age + " ";
        return str.concat(I18n.t("surveys.terms.age"));
      };

      Base.prototype.titleRespondent = function(respondent) {
        return I18n.t("surveys.terms.norm_reference." + respondent);
      };

      return Base;

    })();
  });

}).call(this);
