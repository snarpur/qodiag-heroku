(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.Qapp.module("SubjectNavigationApp.List", function(List, App, Backbone, Marionette, $, _) {
    return List.Controller = (function(_super) {
      __extends(Controller, _super);

      function Controller() {
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.list = function(options) {
        var items;
        items = App.request("get:subject:navigation", options);
        this.showLayout();
        this.showNavigation(items);
        this.setCurrentSubject(options.person);
        return this.showSubjectDetails(options.person);
      };

      Controller.prototype.getNavigationView = function(items) {
        return new List.Navigation({
          collection: items
        });
      };

      Controller.prototype.showNavigation = function(items) {
        var view;
        view = this.getNavigationView(items);
        return this.getLayout().subjectNavigationRegion.show(view);
      };

      Controller.prototype.getSubjectView = function(subject) {
        return new List.SubjectDetails({
          model: subject
        });
      };

      Controller.prototype.showSubjectDetails = function(subject) {
        var view;
        view = this.getSubjectView(subject);
        this.getLayout().subjectDetailsRegion.show(view);
        return this.listenTo(subject, "created updated", (function(_this) {
          return function() {
            return view.render();
          };
        })(this));
      };

      Controller.prototype.showLayout = function() {
        return this.getHeaderRegion().show(this.getLayout());
      };

      Controller.prototype.getLayout = function() {
        return this.layout != null ? this.layout : this.layout = new List.Layout;
      };

      Controller.prototype.getHeaderRegion = function() {
        return App.request("content:header:region");
      };

      Controller.prototype.setCurrentSubject = function(subject) {
        return App.reqres.setHandler("get:current:subject", function() {
          return subject;
        });
      };

      return Controller;

    })(App.Controllers.Base);
  });

}).call(this);
