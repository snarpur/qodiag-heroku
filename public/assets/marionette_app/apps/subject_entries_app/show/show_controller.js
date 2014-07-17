(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.Qapp.module("SubjectEntriesApp.Show", function(Show, App, Backbone, Marionette, $, _) {
    return Show.Controller = (function(_super) {
      __extends(Controller, _super);

      function Controller() {
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.show = function(options) {
        this.region = options.region, this.entryField = options.entryField, this.entries = options.entries;
        this.entryValue = this.entryField.get('entry_values');
        this.region.show(this.getLayout());
        this.showEntryValue();
        return this.showComments();
      };

      Controller.prototype.showEntryValue = function() {
        var entryView;
        entryView = new Show.Entries({
          collection: this.entryValue,
          field_type: this.entryField.get('field_type')
        });
        return this.getEntryRegion().show(entryView);
      };

      Controller.prototype.showComments = function() {
        var comments, commentsView;
        comments = new App.Entities.EntryValues(this.entryField.get('caretaker_entry_values'));
        this.entryField.set('caretaker_entry_values', comments);
        commentsView = new Show.Comments({
          collection: comments
        });
        this.getCommentsRegion().show(commentsView);
        return this.listenTo(commentsView, "new:comment:clicked", (function(_this) {
          return function(view) {
            App.execute("new:entry:comment", {
              region: _this.getNewCommentRegion(),
              entry: _this.entryField
            });
            return _this.listenTo(_this.getNewCommentRegion(), "form:close", function() {
              return view.trigger("form:close");
            });
          };
        })(this));
      };

      Controller.prototype.getEntryRegion = function() {
        return this.getLayout().entryRegion;
      };

      Controller.prototype.getCommentsRegion = function() {
        return this.getLayout().commentsRegion;
      };

      Controller.prototype.getNewCommentRegion = function() {
        return this.getLayout().newCommentRegion;
      };

      Controller.prototype.getRegionId = function() {
        return _.first(this.region.el.match(/view[0-9]*/));
      };

      Controller.prototype.getLayout = function() {
        return this.layout != null ? this.layout : this.layout = new Show.Layout({
          regionId: this.getRegionId()
        });
      };

      return Controller;

    })(App.Controllers.Base);
  });

}).call(this);
