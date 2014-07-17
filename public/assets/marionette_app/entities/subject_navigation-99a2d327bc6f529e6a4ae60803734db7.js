(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.Qapp.module("Entities", function(Entities, App, Backbone, Marionette, $, _) {
    var API;
    Entities.SubjectNavigaion = (function(_super) {
      __extends(SubjectNavigaion, _super);

      function SubjectNavigaion() {
        return SubjectNavigaion.__super__.constructor.apply(this, arguments);
      }

      SubjectNavigaion.prototype.isActive = function() {
        return this.get('name') === this.collection.currentItemName;
      };

      return SubjectNavigaion;

    })(Entities.Model);
    Entities.SubjectNavigationCollection = (function(_super) {
      __extends(SubjectNavigationCollection, _super);

      function SubjectNavigationCollection() {
        return SubjectNavigationCollection.__super__.constructor.apply(this, arguments);
      }

      SubjectNavigationCollection.prototype.model = Entities.SubjectNavigaion;

      SubjectNavigationCollection.prototype.initialize = function(models, options) {
        return this.currentItemName = options.currentItemName;
      };

      return SubjectNavigationCollection;

    })(Entities.Collection);
    API = {
      getNavigation: function(options) {
        var models, personId;
        personId = options.personId;
        models = [
          {
            name: "timeline",
            text: I18n.t("terms.timeline"),
            url: "/#timeline" + (Routes.person_path(personId)),
            iconClass: 'fa-bar-chart-o'
          }, {
            name: "entries",
            text: I18n.t("terms.history"),
            url: "\#" + (Routes.person_path(personId)) + "/entries",
            iconClass: 'fa-list-alt'
          }, {
            name: "profiles",
            text: I18n.t("terms.personal_information"),
            url: "\#" + (Routes.person_path(personId)) + "/profiles",
            iconClass: 'fa-file-text-o'
          }
        ];
        return new Entities.SubjectNavigationCollection(models, options);
      }
    };
    return App.reqres.setHandler("get:subject:navigation", function(options) {
      return API.getNavigation(options);
    });
  });

}).call(this);
