(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  App.Models.Subject = (function(_super) {
    __extends(Subject, _super);

    function Subject() {
      this.getUrlRoot = __bind(this.getUrlRoot, this);
      return Subject.__super__.constructor.apply(this, arguments);
    }

    Subject.prototype.paramRoot = "subject";

    Subject.prototype.initialize = function() {
      Subject.__super__.initialize.apply(this, arguments);
      return this.urlRoot = this.getUrlRoot();
    };

    Subject.prototype.getUrlRoot = function() {
      return function() {
        var urlRoot;
        if (this.collection == null) {
          urlRoot = App.Collections.Subject.prototype.url;
          return urlRoot.replace(/\:id/, this.get("caretaker_id"));
        } else {
          return this.collection.url();
        }
      };
    };

    return Subject;

  })(App.Models.Person);

  App.Collections.Subject = (function(_super) {
    __extends(Subject, _super);

    function Subject() {
      return Subject.__super__.constructor.apply(this, arguments);
    }

    Subject.prototype.model = App.Models.Subject;

    Subject.prototype.url = "/caretaker/:id/subjects";

    Subject.prototype.initialize = function(models, options) {
      this.caretakerId = options.caretaker_id;
      return this.url = function() {
        return this.url.replace(/\:id/, this.caretakerId);
      };
    };

    return Subject;

  })(App.Collections.Person);

}).call(this);
