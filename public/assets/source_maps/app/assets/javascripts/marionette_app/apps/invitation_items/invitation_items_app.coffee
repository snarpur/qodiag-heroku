@Qapp.module "InvitationItemsApp", (InvitationItemsApp, App, Backbone, Marionette, $, _) ->

  class InvitationItemsApp.Router extends Marionette.AppRouter
    appRoutes:
      "invitation_items(/:id)/invite/:type(/step/:step_no)" : "create"

  API =
    create:(id,type, step_no) ->      
      options=
        id: id
        type: type
        step: if step_no? then (Number)(step_no) else 1 

      ctrl = new InvitationItemsApp.EditCreate.Controller
      if id?
        ctrl.edit(options)
      else
        ctrl.create(options)

  App.addInitializer ->
    new InvitationItemsApp.Router
      controller: API
