@Qapp.module "SubjectNavigationApp", (SubjectNavigationApp, App, Backbone, Marionette, $, _) ->
 
  API =
    list: (options)->
      ctrl = new SubjectNavigationApp.List.Controller()
      ctrl.list(options)

  App.vent.on "show:subject:navigation",(options)->
    API.list(options)
