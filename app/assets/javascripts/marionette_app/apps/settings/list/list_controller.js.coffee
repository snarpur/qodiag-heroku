@Qapp.module "SettingsApp.List", (List, App, Backbone, Marionette, $, _) ->
  
  class List.Controller extends App.Controllers.Base

    showHeader:(options)->
      headerRegion = App.request "content:header:region"
      headerRegion.show new List.Header model: new Backbone.Model(options)


