(function() {
  (function(Backbone) {
    return _.extend(Backbone.Marionette.Application.prototype, {
      navigate: function(route, options) {
        if (options == null) {
          options = {};
        }
        return Backbone.history.navigate(route, options);
      },
      routeToCaretakerRoot: function(currentUser) {
        if (_.contains(currentUser.get('role_names'), 'caretaker') && this.getCurrentRoute() === null) {
          return true;
        } else {
          return false;
        }
      },
      getCurrentRoute: function() {
        var frag;
        frag = Backbone.history.fragment;
        if (_.isEmpty(frag)) {
          return null;
        } else {
          return frag;
        }
      },
      showHideSidebar: function(fragment) {
        var routeMatched, routesWithoutSideBar;
        routesWithoutSideBar = ["invitation_items", "pre_registration", "items", "entry_set_responses"];
        routeMatched = _.find(routesWithoutSideBar, function(route) {
          return fragment.indexOf(route) !== -1;
        });
        if (routeMatched !== void 0) {
          if (!this.contentRegion.$el.parents("body").hasClass("full-width")) {
            return this.contentRegion.$el.parents("body").addClass("full-width");
          }
        }
      },
      rootUrl: function(user) {
        var currentRole, roles, rootUrls;
        rootUrls = {
          caretaker: "settings",
          respondent: "items"
        };
        roles = user.get('role_names');
        currentRole = _.filter(roles, function(s) {
          return s === "caretaker" || s === "respondent";
        });
        console.log(rootUrls[_.first(currentRole)]);
        return rootUrls[_.first(currentRole)];
      },
      startHistory: function() {
        if (Backbone.history) {
          return Backbone.history.start();
        }
      },
      register: function(instance, id) {
        if (this._registry == null) {
          this._registry = {};
        }
        return this._registry[id] = instance;
      },
      unregister: function(instance, id) {
        return delete this._registry[id];
      },
      resetRegistry: function() {
        var controller, key, msg, oldCount, _ref;
        oldCount = this.getRegistrySize();
        _ref = this._registry;
        for (key in _ref) {
          controller = _ref[key];
          controller.region.close();
        }
        msg = "There were " + oldCount + " controllers in the registry, there are now " + (this.getRegistrySize());
        if (this.getRegistrySize() > 0) {
          return console.warn(msg, this._registry);
        } else {
          return console.log(msg);
        }
      },
      getRegistrySize: function() {
        return _.size(this._registry);
      }
    });
  })(Backbone);

}).call(this);
