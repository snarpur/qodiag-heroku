@Qapp.module "ProfilesApp", (ProfilesApp, App, Backbone, Marionette, $, _) ->
  
  class ProfilesApp.Router extends Marionette.AppRouter
    appRoutes:
       "people/:id/profiles" : "listProfile"
  
  

  API =
    listProfile: (subjectId)->
      list = new ProfilesApp.List.Controller
      list.showProfile(subjectId)

    edit:(options)->
      ctrl = new ProfilesApp.EditCreate.Controller(options)
      ctrl.edit()

    create:(options)->
      ctrl = new ProfilesApp.EditCreate.Controller(options)
      ctrl.create()

  App.commands.setHandler "create:guardian",(options) ->
    API.create(options) 

  App.commands.setHandler "edit:guardian",(options) ->
    API.edit(options)
  
  App.addInitializer ->
    new ProfilesApp.Router
      controller: API