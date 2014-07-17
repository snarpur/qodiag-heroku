(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.Qapp.module("ProfilesApp.List", function(List, App, Backbone, Marionette, $, _) {
    return List.Controller = (function(_super) {
      __extends(Controller, _super);

      function Controller() {
        this.getLayout = __bind(this.getLayout, this);
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.showProfile = function(subjectId) {
        this.person = App.request("get:person:entity", subjectId);
        App.execute("when:fetched", this.person, (function(_this) {
          return function() {
            _this.profile = new App.Entities.FormPersonModel(_this.person.attributes);
            App.execute("show:subject:navigation", {
              person: _this.profile,
              personId: subjectId,
              currentItemName: 'profiles'
            });
            if (_this.profile.get("age") >= 18) {
              return _this.showAdultSubject(_this.profile);
            } else {
              _this.showSubject(_this.profile);
              if (!(_this.profile.get("age") >= 18)) {
                return _this.showGuardians(_this.profile);
              }
            }
          };
        })(this));
        return App.contentRegion.show(this.getLayout());
      };

      Controller.prototype.showSubject = function(person) {
        var subjectView;
        subjectView = this.getSubjectView(person);
        this.getLayout().subjectProfileRegion.show(subjectView);
        return this.listenTo(subjectView, "edit:subject:clicked", (function(_this) {
          return function(childSubjectView) {
            return App.execute("edit:guardian", {
              model: childSubjectView.model,
              activeView: subjectView
            });
          };
        })(this));
      };

      Controller.prototype.showAdultSubject = function(person) {
        var subjectView;
        subjectView = this.getAdultSubjectView(person);
        this.getLayout().subjectProfileRegion.show(subjectView);
        return this.listenTo(subjectView, "edit:guardian:clicked", (function(_this) {
          return function(childSubjectView) {
            return App.execute("edit:guardian", {
              model: childSubjectView.model,
              activeView: subjectView
            });
          };
        })(this));
      };

      Controller.prototype.showGuardian = function(person) {
        var subjectView;
        subjectView = this.getSubjectView(person);
        this.getLayout().subjectProfileRegion.show(subjectView);
        return this.listenTo(subjectView, "edit:subject:clicked", (function(_this) {
          return function(childSubjectView) {
            return App.execute("edit:guardian", {
              model: childSubjectView.model,
              activeView: subjectView
            });
          };
        })(this));
      };

      Controller.prototype.showGuardians = function(person) {
        var parents;
        parents = person.getParents();
        return App.execute("when:fetched", parents, (function(_this) {
          return function() {
            var guardianView;
            _this.addEmptyParent(parents);
            parents = new App.Entities.FormPeopleCollection(parents.toJSON({
              acceptsNested: false
            }));
            guardianView = _this.getGuardiansView(parents);
            _this.getLayout().guardianProfileRegion.show(guardianView);
            _this.listenTo(guardianView, "childview:edit:guardian:clicked", function(childGuardianView) {
              return App.execute("edit:guardian", {
                model: childGuardianView.model,
                activeView: guardianView
              });
            });
            return _this.listenTo(guardianView, "childview:create:guardian:clicked", function(childGuardianView) {
              return App.execute("create:guardian", {
                model: childGuardianView.model,
                activeView: guardianView,
                subjectId: _this.profile.id
              });
            });
          };
        })(this));
      };

      Controller.prototype.addEmptyParent = function(parents) {
        var parent;
        if (parents.size() === 0) {
          parent = new App.Entities.FormPersonModel();
          parent.set({
            address: {}
          });
          parents.add(parent, {
            at: 0
          });
        }
        if (parents.size() === 1) {
          parent = parents.first().clone().clear();
          parent.set({
            address: {}
          });
          return parents.add(parent, {
            at: 1
          });
        }
      };

      Controller.prototype.getSubjectView = function(person) {
        return new List.Subject({
          model: person,
          name: "Subject"
        });
      };

      Controller.prototype.getAdultSubjectView = function(person) {
        return new List.AdultSubject({
          model: person,
          name: "Subject"
        });
      };

      Controller.prototype.getGuardiansView = function(parents) {
        return new List.Guardians({
          collection: parents,
          name: "Guardian"
        });
      };

      Controller.prototype.getGuardianView = function(person) {
        return new List.Guardian({
          model: person,
          name: "Guardian"
        });
      };

      Controller.prototype.getLayout = function() {
        return this.layout != null ? this.layout : this.layout = new List.Layout;
      };

      return Controller;

    })(App.Controllers.Base);
  });

}).call(this);
