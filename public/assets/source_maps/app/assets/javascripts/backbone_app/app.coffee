window.App =
  Lib: {}
  Models: {
    Aliases: {}
  }
  Collections: {
    Aliases: {}
  }
  Controllers: {}
  Views: {}
  Timeline: {}
  Event: new Backbone.Model
  init:->
    Backbone.history.start();
