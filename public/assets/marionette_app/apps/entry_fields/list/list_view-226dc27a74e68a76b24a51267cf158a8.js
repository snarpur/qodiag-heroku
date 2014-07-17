(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  this.Qapp.module("EntryFieldsApp.List", function(List, App, Backbone, Marionette, $, _) {
    List.Layout = (function(_super) {
      __extends(Layout, _super);

      function Layout() {
        return Layout.__super__.constructor.apply(this, arguments);
      }

      Layout.prototype.template = "entry_fields/list/templates/list_layout";

      Layout.prototype.className = "row";

      Layout.prototype.regions = {
        settingsNavigationRegion: "#settings-navigation-region",
        listRegion: "#list-region",
        searchRegion: "#search-region"
      };

      return Layout;

    })(App.Views.Layout);
    List.EntryField = (function(_super) {
      __extends(EntryField, _super);

      function EntryField() {
        this.templateHelpers = __bind(this.templateHelpers, this);
        return EntryField.__super__.constructor.apply(this, arguments);
      }

      EntryField.prototype.template = "entry_fields/list/templates/_entry_field";

      EntryField.prototype.tagName = 'tr';

      EntryField.prototype.triggers = {
        'click a.edit': 'edit:clicked',
        'click a.destroy': 'destroy:clicked'
      };

      EntryField.prototype.modelEvents = {
        'updated': 'highlight',
        'created': 'highlight'
      };

      EntryField.prototype.highlight = function() {
        this.render();
        return this.$el.effect('highlight', {
          easing: 'swing'
        }, 2000);
      };

      EntryField.prototype.templateHelpers = function() {
        return {
          type: (function(_this) {
            return function() {
              switch (_this.model.get("field_type")) {
                case "multi-choice":
                  return "check-square-o";
                case "single-choice":
                  return "dot-circle-o";
                default:
                  return "font";
              }
            };
          })(this)
        };
      };

      return EntryField;

    })(App.Views.ItemView);
    return List.EntryFields = (function(_super) {
      __extends(EntryFields, _super);

      function EntryFields() {
        return EntryFields.__super__.constructor.apply(this, arguments);
      }

      EntryFields.prototype.template = "entry_fields/list/templates/entry_fields";

      EntryFields.prototype.itemView = List.EntryField;

      EntryFields.prototype.itemViewContainer = 'tbody';

      EntryFields.prototype.triggers = {
        "click .add-question": "create:field:clicked"
      };

      EntryFields.prototype.ui = {
        wrapper: 'div#entry_fields_wrapper',
        table: "table#entry_fields"
      };

      EntryFields.prototype.onShow = function() {
        return this.ui.table.dataTable({
          'order': [[1, "asc"]],
          'sDom': "<'row'<'col-sm-6'l><'col-sm-6'f>r>t<'row'<'col-sm-6'i><'col-sm-6'p>>",
          'sPaginationType': "bootstrap",
          'language': {
            'url': "assets/data-tables/locales/" + I18n.locale + ".json"
          },
          'aoColumnDefs': [
            {
              'bSortable': false,
              'sClass': 'thin',
              'aTargets': [0]
            }, {
              'bSortable': true,
              'aTargets': [1]
            }, {
              'bSortable': false,
              'sClass': 'thin',
              'aTargets': [2]
            }
          ]
        });
      };

      return EntryFields;

    })(App.Views.CompositeView);
  });

}).call(this);
