(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.Qapp.module("EntrySetsApp.List", function(List, App, Backbone, Marionette, $, _) {
    List.Layout = (function(_super) {
      __extends(Layout, _super);

      function Layout() {
        return Layout.__super__.constructor.apply(this, arguments);
      }

      Layout.prototype.template = "entry_sets/list/templates/list_layout";

      Layout.prototype.className = "row";

      Layout.prototype.regions = {
        settingsNavigationRegion: "#settings-navigation-region",
        listRegion: "#list-region"
      };

      return Layout;

    })(App.Views.Layout);
    List.EntrySet = (function(_super) {
      __extends(EntrySet, _super);

      function EntrySet() {
        return EntrySet.__super__.constructor.apply(this, arguments);
      }

      EntrySet.prototype.template = "entry_sets/list/templates/_entry_set";

      EntrySet.prototype.tagName = "tr";

      EntrySet.prototype.triggers = {
        "click a.destroy": 'delete:entry:set'
      };

      return EntrySet;

    })(App.Views.ItemView);
    List.Empty = (function(_super) {
      __extends(Empty, _super);

      function Empty() {
        return Empty.__super__.constructor.apply(this, arguments);
      }

      Empty.prototype.template = "entry_sets/list/templates/_empty";

      Empty.prototype.tagName = "tr";

      return Empty;

    })(App.Views.ItemView);
    return List.EntrySets = (function(_super) {
      __extends(EntrySets, _super);

      function EntrySets() {
        return EntrySets.__super__.constructor.apply(this, arguments);
      }

      EntrySets.prototype.template = "entry_sets/list/templates/entry_sets";

      EntrySets.prototype.itemView = List.EntrySet;

      EntrySets.prototype.emptyView = List.Empty;

      EntrySets.prototype.itemViewContainer = "tbody";

      EntrySets.prototype.ui = {
        wrapper: 'div#entry_sets_wrapper',
        table: "table#entry_sets"
      };

      EntrySets.prototype.onShow = function() {
        var filter, select;
        this.ui.table.dataTable({
          'sDom': "<'row'<'col-sm-6'l><'col-sm-6'f>r>t<'row'<'col-sm-6'i><'col-sm-6'p>>",
          'sPaginationType': "bootstrap",
          'language': {
            'url': "assets/data-tables/locales/" + I18n.locale + ".json"
          },
          'aoColumnDefs': [
            {
              'bSortable': true,
              'aTargets': [0]
            }, {
              'bSortable': false,
              'sClass': 'thin',
              'aTargets': [1]
            }
          ]
        });
        filter = this.ui.wrapper.find(".dataTables_filter input");
        select = this.ui.wrapper.find(".dataTables_length select");
        filter.addClass("form-control");
        return select.addClass("form-control");
      };

      EntrySets.prototype.triggers = {
        'click button': 'new:entry:set'
      };

      return EntrySets;

    })(App.Views.CompositeView);
  });

}).call(this);
