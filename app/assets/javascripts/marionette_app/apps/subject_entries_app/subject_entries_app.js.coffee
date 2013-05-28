 @Qapp.module "SubjectEntriesApp", (SubjectEntriesApp, App, Backbone, Marionette, $, _) ->
  
  class SubjectEntriesApp.Router extends Marionette.AppRouter
    appRoutes:
       "people/:personId/entries" : "list"
       "people/:personId/entries/:entry_set_response_id(/section/:section_id)" : "list"
  

  API =
    list:(personId,entrySetResponseId,sectionId)->
      App.vent.trigger "show:subject:navigation",{app:"SubjectEntriesApp",personId: personId}
      args = _.map _.compact(arguments), (i) -> (Number)(i)
      options = _.object(['personId','entrySetResponseId','sectionId'],args)

      ctrl = new SubjectEntriesApp.List.Controller()
      ctrl.list(options)

    create:(options)->
      ctrl = new SubjectEntriesApp.New.Controller(options)
      ctrl.newEntry()
  
    show:(options)->
      ctrl = new SubjectEntriesApp.Show.Controller()
      ctrl.show(options)

  App.commands.setHandler "new:entry:comment", (options) ->
    API.create options

  App.commands.setHandler "show:entry:values", (options) ->
    API.show options
  
  App.addInitializer ->
    new SubjectEntriesApp.Router
      controller: API

