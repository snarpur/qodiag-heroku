(function() {
  this.Qapp.module("ResponderItemsApp.List", function(List, App, Backbone, Marionette, $, _) {
    return List.Controller = {
      items: function() {
        var items, user;
        this.executeSettingsNavigation();
        App.contentRegion.show(this.getLayout());
        user = App.request("get:current:user");
        items = App.request("get:person:responder:items", {
          personId: user.get('person_id'),
          concern: 'respondent'
        });
        return App.execute("when:fetched", items, (function(_this) {
          return function() {
            var completed, itemsCompletedView, itemsUncompletedView, noitemsUncompletedView, uncompleted;
            completed = items.select(function(item) {
              return item.get('completed') != null;
            });
            uncompleted = items.filter(function(item) {
              return item.get('completed') == null;
            });
            if (completed.length !== 0) {
              itemsCompletedView = new List.Items({
                collection: new App.Entities.ResponderItems(completed, {}),
                status: "completed"
              });
              _this.getLayout().completeItemsRegion.show(itemsCompletedView);
            }
            if (uncompleted.length === 0) {
              noitemsUncompletedView = new List.NoRequests({
                model: uncompleted
              });
              return _this.getLayout().uncompleteItemsRegion.show(noitemsUncompletedView);
            } else {
              itemsUncompletedView = new List.Items({
                collection: new App.Entities.ResponderItems(uncompleted, {}),
                status: "uncompleted"
              });
              return _this.getLayout().uncompleteItemsRegion.show(itemsUncompletedView);
            }
          };
        })(this));
      },
      executeSettingsNavigation: function() {
        return App.execute("show:settings:navigation", {
          iconClass: "fa fa-envelope",
          i18n: "views.responder_items.requests.name"
        });
      },
      getLayout: (function(_this) {
        return function() {
          return _this.layout != null ? _this.layout : _this.layout = new List.Layout;
        };
      })(this)
    };
  });

}).call(this);
