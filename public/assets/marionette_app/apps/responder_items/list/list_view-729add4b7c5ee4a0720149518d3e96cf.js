(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  this.Qapp.module("ResponderItemsApp.List", function(List, App, Backbone, Marionette, $, _) {
    List.Layout = (function(_super) {
      __extends(Layout, _super);

      function Layout() {
        return Layout.__super__.constructor.apply(this, arguments);
      }

      Layout.prototype.template = "responder_items/list/templates/list_layout";

      Layout.prototype.regions = {
        uncompleteItemsRegion: "#uncomplete-items-region",
        completeItemsRegion: "#complete-items-region"
      };

      return Layout;

    })(App.Views.Layout);
    List.Item = (function(_super) {
      __extends(Item, _super);

      function Item() {
        return Item.__super__.constructor.apply(this, arguments);
      }

      Item.prototype.template = "responder_items/list/templates/_item";

      Item.prototype.tagName = 'tr';

      return Item;

    })(App.Views.ItemView);
    List.NoRequests = (function(_super) {
      __extends(NoRequests, _super);

      function NoRequests() {
        this.templateHelpers = __bind(this.templateHelpers, this);
        return NoRequests.__super__.constructor.apply(this, arguments);
      }

      NoRequests.prototype.template = "responder_items/list/templates/_empty";

      NoRequests.prototype.templateHelpers = function() {
        return {
          tableTitle: (function(_this) {
            return function() {
              return I18n.t("responder_item.status.uncompleted");
            };
          })(this)
        };
      };

      return NoRequests;

    })(App.Views.ItemView);
    return List.Items = (function(_super) {
      __extends(Items, _super);

      function Items() {
        this.templateHelpers = __bind(this.templateHelpers, this);
        return Items.__super__.constructor.apply(this, arguments);
      }

      Items.prototype.template = "responder_items/list/templates/items";

      Items.prototype.itemView = List.Item;

      Items.prototype.className = "col-lg-12";

      Items.prototype.itemViewContainer = 'tbody';

      Items.prototype.ui = {
        wrapper: 'div.table_wrapper',
        table: "table.table"
      };

      Items.prototype.onShow = function() {
        var filter, select;
        this.ui.table.dataTable({
          'sDom': "<'row'<'col-sm-6'l><'col-sm-6'f>r>t<'row'<'col-sm-6'i><'col-sm-6'p>>",
          'sPaginationType': "bootstrap",
          'language': {
            'url': "assets/data-tables/locales/" + I18n.locale + ".json"
          }
        });
        filter = this.ui.wrapper.find(".dataTables_filter input");
        select = this.ui.wrapper.find(".dataTables_length select");
        filter.addClass("form-control");
        return select.addClass("form-control");
      };

      Items.prototype.templateHelpers = function() {
        return {
          tableTitle: (function(_this) {
            return function() {
              return I18n.t("responder_item.status." + _this.options.status);
            };
          })(this),
          tableId: (function(_this) {
            return function() {
              return "" + _this.options.status;
            };
          })(this)
        };
      };

      return Items;

    })(App.Views.CompositeView);
  });

}).call(this);
