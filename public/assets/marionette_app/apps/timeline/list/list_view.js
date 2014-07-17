(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.Qapp.module("TimelineApp.List", function(List, App, Backbone, Marionette, $, _) {
    List.Layout = (function(_super) {
      __extends(Layout, _super);

      function Layout() {
        return Layout.__super__.constructor.apply(this, arguments);
      }

      Layout.prototype.template = "timeline/list/templates/list_layout";

      Layout.prototype.regions = {
        timelineRegion: "#timeline-region",
        menuRegion: "#menu-region"
      };

      Layout.prototype.triggers = {
        "click .add-survey": "add:survey:clicked"
      };

      return Layout;

    })(App.Views.Layout);
    List.Select = (function(_super) {
      __extends(Select, _super);

      function Select() {
        return Select.__super__.constructor.apply(this, arguments);
      }

      Select.prototype.template = "timeline/list/templates/menu";

      Select.prototype.ui = function() {
        return {
          select: "#menu"
        };
      };

      Select.prototype.events = {
        "change #menu": "triggerSelect"
      };

      Select.prototype.triggerSelect = function(event) {
        return this.trigger("select:menu:changed", event);
      };

      Select.prototype.onRender = function() {
        this.ui.select.val(this.options.initialSurveys);
        this.ui.select.select2({
          multiple: true,
          initSelection: (function(_this) {
            return function(element, callback) {
              var data;
              data = [];
              _.each(element.val().split(","), function(item) {
                var query, survey;
                query = {
                  id: Number(item)
                };
                survey = _this.collection.findWhere(query);
                return data.push({
                  id: Number(item),
                  text: survey.get('text')
                });
              });
              return callback(data);
            };
          })(this),
          query: (function(_this) {
            return function(query) {
              var data;
              data = {
                results: _this.collection.toJSON()
              };
              return query.callback(data);
            };
          })(this)
        });
        return this.listenTo(this.options.items, "add", (function(_this) {
          return function(model, collection) {
            var surveysSelected;
            surveysSelected = _this.ui.select.select2('val');
            if (_.indexOf(surveysSelected, model.get("survey_id")) === -1) {
              surveysSelected.push(model.get("survey_id"));
              return _this.ui.select.select2('val', surveysSelected);
            }
          };
        })(this));
      };

      return Select;

    })(App.Views.ItemView);
    return List.Timeline = (function(_super) {
      __extends(Timeline, _super);

      function Timeline() {
        return Timeline.__super__.constructor.apply(this, arguments);
      }

      Timeline.prototype.template = "timeline/list/templates/timeline";

      Timeline.prototype.id = "timeline-visualization";

      Timeline.prototype.timelineOptions = {
        width: "100%",
        align: 'center',
        orientation: "top",
        height: 500
      };

      Timeline.prototype.onShow = function() {
        this.setTimeline();
        this.setOptions();
        return this.listenTo(this.timeline, "select", (function(_this) {
          return function(selected) {
            var selectedItem;
            selectedItem = _this.model.get('items').get(_.first(selected.items));
            if (!_.isEmpty(selectedItem)) {
              return _this.trigger("item:selected", {
                item: selectedItem
              });
            }
          };
        })(this));
      };

      Timeline.prototype.start = function() {
        return moment(new Date()).subtract("months", 6);
      };

      Timeline.prototype.end = function() {
        return moment(new Date()).add("months", 6);
      };

      Timeline.prototype.startEnd = function() {
        return {
          start: this.start(),
          end: this.end()
        };
      };

      Timeline.prototype.setTimeline = function() {
        this.timeline = new vis.Timeline(this.el, this.model.get('visItems'), {});
        return this.model.set("timeline", this.timeline);
      };

      Timeline.prototype.setOptions = function() {
        var config;
        config = _.extend(this.timelineOptions, this.startEnd());
        return this.timeline.setOptions(config);
      };

      return Timeline;

    })(App.Views.ItemView);
  });

}).call(this);
