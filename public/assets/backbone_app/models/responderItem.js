(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  App.Models.ResponderItem = (function(_super) {
    __extends(ResponderItem, _super);

    function ResponderItem() {
      this.status = __bind(this.status, this);
      this.isPending = __bind(this.isPending, this);
      this.isOverdue = __bind(this.isOverdue, this);
      this.isCompleted = __bind(this.isCompleted, this);
      this.deadlineIsPassed = __bind(this.deadlineIsPassed, this);
      return ResponderItem.__super__.constructor.apply(this, arguments);
    }

    ResponderItem.prototype.urlRoot = "/responder_items";

    ResponderItem.prototype.deadlineIsPassed = function() {
      var deadline;
      deadline = Date.parse(this.get('deadline'));
      return deadline.isBefore(Date.today());
    };

    ResponderItem.prototype.isCompleted = function() {
      return this.get('completed') != null;
    };

    ResponderItem.prototype.isOverdue = function() {
      return !this.isPending() && !this.isCompleted();
    };

    ResponderItem.prototype.isPending = function() {
      return !this.isCompleted() && !this.deadlineIsPassed();
    };

    ResponderItem.prototype.status = function() {
      if (this.isCompleted()) {
        return "completed";
      } else if (this.isPending()) {
        return "pending";
      } else if (this.isOverdue()) {
        return "overdue";
      }
    };

    return ResponderItem;

  })(Backbone.Model);

  App.Collections.ResponderItemsCollection = (function(_super) {
    __extends(ResponderItemsCollection, _super);

    function ResponderItemsCollection() {
      return ResponderItemsCollection.__super__.constructor.apply(this, arguments);
    }

    ResponderItemsCollection.prototype.model = App.Models.ResponderItem;

    return ResponderItemsCollection;

  })(Backbone.Collection);

}).call(this);
