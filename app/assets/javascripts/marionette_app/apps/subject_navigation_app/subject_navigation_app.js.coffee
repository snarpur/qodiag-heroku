@Qapp.module "SubjectNavigationApp", (SubjectNavigationApp, App, Backbone, Marionette, $, _) ->
 
  API =
    list: (options)->
      ctrl = new SubjectNavigationApp.List.Controller()
      ctrl.list(options)

  App.commands.setHandler "show:subject:navigation",(options)->
    API.list(options)
