(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  App.Models.Line = (function(_super) {
    __extends(Line, _super);

    function Line() {
      this.removeItems = __bind(this.removeItems, this);
      this.addItems = __bind(this.addItems, this);
      this.clearDialogItem = __bind(this.clearDialogItem, this);
      this.hasDialog = __bind(this.hasDialog, this);
      this.previousDialogView = __bind(this.previousDialogView, this);
      this.currentDialogView = __bind(this.currentDialogView, this);
      this.previousDialogItem = __bind(this.previousDialogItem, this);
      this.currentDialogItem = __bind(this.currentDialogItem, this);
      this.setPreviousDialogItem = __bind(this.setPreviousDialogItem, this);
      this.setCurrentDialogItem = __bind(this.setCurrentDialogItem, this);
      this.subjectId = __bind(this.subjectId, this);
      this.url = __bind(this.url, this);
      return Line.__super__.constructor.apply(this, arguments);
    }

    Line.prototype.initialize = function() {
      this.urlRoot = "/people/:subject_id/responder_items/survey/";
      this.timeline = this.get('timeline');
      return this.on("updateDialog", this.setCurrentDialogItem);
    };

    Line.prototype.url = function() {
      var base;
      base = this.urlRoot.replace(/:subject_id/, this.subjectId());
      return "" + base + (_.endsWith(base, '/') ? '' : void 0) + (encodeURIComponent(this.get('survey_id')));
    };

    Line.prototype.subjectId = function() {
      return this.get("timeline").getSubjectId();
    };

    Line.prototype.setCurrentDialogItem = function(item) {
      this.setPreviousDialogItem(item);
      return this.set({
        currentDialogItem: item
      });
    };

    Line.prototype.setPreviousDialogItem = function() {
      if (this.currentDialogItem() != null) {
        return this.set({
          previousDialogItem: this.currentDialogItem()
        });
      }
    };

    Line.prototype.currentDialogItem = function() {
      return this.get('currentDialogItem');
    };

    Line.prototype.previousDialogItem = function() {
      return this.get('previousDialogItem');
    };

    Line.prototype.currentDialogView = function() {
      return this.currentDialogItem().get("dialogView");
    };

    Line.prototype.previousDialogView = function() {
      return this.previousDialogItem().get("dialogView");
    };

    Line.prototype.hasDialog = function() {
      return this.get('currentDialogItem') != null;
    };

    Line.prototype.clearDialogItem = function() {
      return this.set({
        previousDialogItem: null
      });
    };

    Line.prototype.addItems = function(items) {
      return this.get('items').add(items);
    };

    Line.prototype.removeItems = function() {
      this.trigger('remove', this);
      return this.collection.remove(this, {
        silent: true
      });
    };

    return Line;

  })(Backbone.Model);

  App.Collections.LineCollection = (function(_super) {
    __extends(LineCollection, _super);

    function LineCollection() {
      this.addLine = __bind(this.addLine, this);
      this.subjectId = __bind(this.subjectId, this);
      this.setSubjectId = __bind(this.setSubjectId, this);
      return LineCollection.__super__.constructor.apply(this, arguments);
    }

    LineCollection.prototype.model = App.Models.Line;

    LineCollection.prototype.url = "/people/:subject_id/";

    LineCollection.prototype.initialize = function(lines, timeline) {
      this.models = lines;
      return this.timeline = timeline;
    };

    LineCollection.prototype.setSubjectId = function(id) {
      return this.subjectId = id;
    };

    LineCollection.prototype.subjectId = function() {
      return this.subjectId;
    };

    LineCollection.prototype.addLine = function(params) {
      var line, that;
      params.timeline = this.timeline;
      line = new App.Models.Line(params);
      that = this;
      return line.fetch({
        success: function(model, response) {
          var items;
          items = new App.Collections.ResponderItemsCollection(response);
          params.items = items;
          line = new App.Models.Line(params);
          return that.add(line);
        },
        error: function(response) {
          throw "ERROR: in fetching line with id: " + params;
        }
      });
    };

    return LineCollection;

  })(Backbone.Collection);

}).call(this);
