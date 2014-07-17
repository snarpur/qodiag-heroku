(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.Qapp.module("SubjectEntriesApp.Show", function(Show, App, Backbone, Marionette, $, _) {
    Show.Layout = (function(_super) {
      __extends(Layout, _super);

      function Layout() {
        this.templateHelpers = __bind(this.templateHelpers, this);
        return Layout.__super__.constructor.apply(this, arguments);
      }

      Layout.prototype.template = "subject_entries_app/show/show_layout";

      Layout.prototype.className = "timeline-messages";

      Layout.prototype.templateHelpers = function() {
        return {
          regionId: (function(_this) {
            return function() {
              return _this.options.regionId;
            };
          })(this)
        };
      };

      Layout.prototype.regions = function(options) {
        var regionId, regions;
        regionId = options.regionId;
        return regions = {
          entryRegion: "#entry-region-" + regionId,
          commentsRegion: "#comments-region-" + regionId,
          newCommentRegion: "#new-comment-region-" + regionId
        };
      };

      return Layout;

    })(App.Views.Layout);
    Show.Comment = (function(_super) {
      __extends(Comment, _super);

      function Comment() {
        return Comment.__super__.constructor.apply(this, arguments);
      }

      Comment.prototype.template = "subject_entries_app/show/_comment";

      Comment.prototype.emptyView = Show.EmptyEntry;

      Comment.prototype.className = "msg-time-chat";

      return Comment;

    })(App.Views.ItemView);
    Show.Comments = (function(_super) {
      __extends(Comments, _super);

      function Comments() {
        return Comments.__super__.constructor.apply(this, arguments);
      }

      Comments.prototype.template = "subject_entries_app/show/comments";

      Comments.prototype.itemView = Show.Comment;

      Comments.prototype.itemViewContainer = ".comments";

      Comments.prototype.events = {
        "click button": "newComment"
      };

      Comments.prototype.ui = {
        commentButton: 'button'
      };

      Comments.prototype.initialize = function() {
        return this.on("form:close", this.showButton);
      };

      Comments.prototype.showButton = function() {
        return this.ui.commentButton.show();
      };

      Comments.prototype.newComment = function() {
        this.ui.commentButton.hide();
        return this.trigger("new:comment:clicked", this);
      };

      return Comments;

    })(App.Views.CompositeView);
    Show.Entry = (function(_super) {
      __extends(Entry, _super);

      function Entry() {
        this.templateHelpers = __bind(this.templateHelpers, this);
        return Entry.__super__.constructor.apply(this, arguments);
      }

      Entry.prototype.getTemplate = function() {
        var template;
        if (this.options.field_type === 'multi-choice') {
          template = '_multi_choice_';
        } else if (this.options.field_type === 'single-choice') {
          template = '_single_choice_';
        } else {
          template = '_';
        }
        return "subject_entries_app/show/" + template + "entry";
      };

      Entry.prototype.templateHelpers = function() {
        return {
          index: (function(_this) {
            return function() {
              return _this.options.index;
            };
          })(this),
          field_type: (function(_this) {
            return function() {
              return _this.options.field_type;
            };
          })(this),
          value: (function(_this) {
            return function() {
              var value;
              return value = _this.options.field_type === "string" ? _this.model.get('string_value') : _this.model.get('text_value');
            };
          })(this)
        };
      };

      return Entry;

    })(App.Views.ItemView);
    Show.EmptyEntry = (function(_super) {
      __extends(EmptyEntry, _super);

      function EmptyEntry() {
        return EmptyEntry.__super__.constructor.apply(this, arguments);
      }

      EmptyEntry.prototype.template = "subject_entries_app/show/_entryEmpty";

      EmptyEntry.prototype.tagName = "div";

      return EmptyEntry;

    })(App.Views.ItemView);
    return Show.Entries = (function(_super) {
      __extends(Entries, _super);

      function Entries() {
        return Entries.__super__.constructor.apply(this, arguments);
      }

      Entries.prototype.itemView = Show.Entry;

      Entries.prototype.emptyView = Show.EmptyEntry;

      Entries.prototype.className = "msg-time-chat";

      Entries.prototype.childViewOptions = function() {
        var options;
        return options = {
          field_type: this.options.field_type
        };
      };

      return Entries;

    })(App.Views.CollectionView);
  });

}).call(this);
