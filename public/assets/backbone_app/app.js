(function() {
  window.App = {
    Lib: {},
    Models: {
      Aliases: {}
    },
    Collections: {
      Aliases: {}
    },
    Controllers: {},
    Views: {},
    Timeline: {},
    Event: new Backbone.Model,
    init: function() {
      return Backbone.history.start();
    }
  };

}).call(this);