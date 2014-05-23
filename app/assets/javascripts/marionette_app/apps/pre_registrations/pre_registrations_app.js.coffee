@Qapp.module "PreRegistrationsApp", (PreRegistrationsApp, App, Backbone, Marionette, $, _) ->

  class PreRegistrationsApp.Router extends Marionette.AppRouter
    appRoutes:
      "pre_registrations/:id(/step/:step_no)" : "edit"

  API =
    edit:(id,step_no) ->     
      options=
        id: id
        step: if step_no? then (Number)(step_no) else 1 

      ctrl = new PreRegistrationsApp.EditCreate.Controller
      ctrl.edit(options)

  App.addInitializer ->
    new PreRegistrationsApp.Router
      controller: API