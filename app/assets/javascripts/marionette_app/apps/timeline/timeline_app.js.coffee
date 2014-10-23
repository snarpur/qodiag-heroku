@Qapp.module "TimelineApp", (TimelineApp, App, Backbone, Marionette, $, _) ->

  # TimelineApp.rootRoute = "settings#{Routes.entry_sets_path()}"

  class TimelineApp.Router extends Marionette.AppRouter
    appRoutes:
      "timeline/people/:id" : "list"



  API =
    list: (id, options = {} ) ->
      ctrl = new TimelineApp.List.Controller(id, options)






  App.commands.setHandler "show:timeline", (options) ->
    API.list(options)


  App.addInitializer ->
    new TimelineApp.Router
      controller: API
