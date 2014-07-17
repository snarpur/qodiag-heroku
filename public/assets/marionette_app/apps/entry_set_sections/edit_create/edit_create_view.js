(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.Qapp.module("EntrySetSectionsApp.EditCreate", function(EditCreate, App, Backbone, Marionette, $, _) {
    EditCreate.Section = (function(_super) {
      __extends(Section, _super);

      function Section() {
        this.templateHelpers = __bind(this.templateHelpers, this);
        return Section.__super__.constructor.apply(this, arguments);
      }

      Section.prototype.template = "entry_set_sections/edit_create/templates/section";

      Section.prototype.triggers = {
        "click button.save": "save:section",
        "click button.cancel": "dialog:close",
        "click button.close": "dialog:close"
      };

      Section.prototype.bindings = {
        '#section_name': 'name',
        '#section_description': 'description'
      };

      Section.prototype.templateHelpers = function() {
        return {
          dialogTitle: (function(_this) {
            return function() {
              var action, suffix, type;
              type = _this.model instanceof App.Entities.EntrySet ? I18n.t("entry_set.model_name") : I18n.t("terms.step");
              action = _this.model.isNew() ? I18n.t("terms.new") : I18n.t("terms.edit");
              suffix = _this.model.isNew() ? "" : I18n.t("terms.in");
              return _("" + action + " " + type + suffix).capitalize();
            };
          })(this)
        };
      };

      Section.prototype.onShow = function() {
        return this.stickit();
      };

      return Section;

    })(App.Views.ItemView);
    return EditCreate.SectionsNav = (function(_super) {
      __extends(SectionsNav, _super);

      function SectionsNav() {
        return SectionsNav.__super__.constructor.apply(this, arguments);
      }

      SectionsNav.prototype.template = "entry_set_sections/edit_create/templates/section_nav";

      SectionsNav.prototype.itemView = EditCreate.SectionNav;

      SectionsNav.prototype.itemViewContainer = "ul";

      return SectionsNav;

    })(App.Views.CompositeView);
  });

}).call(this);
