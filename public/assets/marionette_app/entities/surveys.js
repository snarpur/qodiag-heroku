(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.Qapp.module("Entities", function(Entities, App, Backbone, Marionette, $, _) {
    var API;
    Entities.Survey = (function(_super) {
      __extends(Survey, _super);

      function Survey() {
        return Survey.__super__.constructor.apply(this, arguments);
      }

      return Survey;

    })(Entities.Model);
    Entities.Surveys = (function(_super) {
      __extends(Surveys, _super);

      function Surveys() {
        return Surveys.__super__.constructor.apply(this, arguments);
      }

      Surveys.prototype.model = Entities.Survey;

      return Surveys;

    })(Entities.Collection);
    API = {
      getSurveys: function(options) {
        var surveys;
        surveys = new Entities.Surveys;
        surveys.url = Routes.all_surveys_path();
        surveys.fetch({
          reset: true
        });
        return surveys;
      }
    };
    return App.reqres.setHandler("get:surveys", function(options) {
      return API.getSurveys(options);
    });
  });

}).call(this);
