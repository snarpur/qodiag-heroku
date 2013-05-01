 @Qapp.module "EntrySetSectionsApp", (EntrySetSectionsApp, App, Backbone, Marionette, $, _) ->
  # @startWithParent = false
 
  class EntrySetSectionsApp.Router extends Marionette.AppRouter
    appRoutes:
      "settings/entry_sets/:entry_set_id/sections(/:id)" : "listSections"

  API =
    listSections: (entrySetId,sectionId) ->
      EntrySetSectionsApp.List.Controller.listSections(entrySetId,sectionId)

    newSection: (entrySetId) ->
      console.log "cla"
  
  EntrySetSectionsApp.on "start", (options)->
    @vent = new Backbone.Wreqr.EventAggregator()
  
  App.addInitializer ->
    new EntrySetSectionsApp.Router
      controller: API