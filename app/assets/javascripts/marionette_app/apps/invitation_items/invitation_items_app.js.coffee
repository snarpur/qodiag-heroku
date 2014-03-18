@Qapp.module "InvitationItemsApp", (InvitationItemsApp, App, Backbone, Marionette, $, _) ->
  
  class InvitationItemsApp.Router extends Marionette.AppRouter
    appRoutes:
      "invitation_items/invite/:type(/step/:step_no)" : "create"

  API =
    create:(type, step_no) ->
      
      options=
        type: type
        step: if step_no? then (Number)(step_no) else 1 
      
      ctrl = new InvitationItemsApp.EditCreate.Controller
      ctrl.create(options)
      
  App.addInitializer ->
    new InvitationItemsApp.Router
      controller: API