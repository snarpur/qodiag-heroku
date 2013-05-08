 @Qapp.module "EntrySetSectionsApp", (EntrySetSectionsApp, App, Backbone, Marionette, $, _) ->
  # @startWithParent = false
  class EntrySetSectionsApp.Router extends Marionette.AppRouter
    appRoutes:
      "settings/entry_sets/:entry_set_id/sections(/:id)" : "listSections"


  API =
    listSections: (entrySetId,sectionNo) ->
      sectionNo ?= 1
      options=
        entrySetId: (Number)(entrySetId)
        sectionNo: (Number)(sectionNo)
      EntrySetSectionsApp.List.Controller.listSections(options)
  
    newSection:(sections)->
      console.log "creating new section"
      EntrySetSectionsApp.Create.Controller.new(sections)

  EntrySetSectionsApp.on "start", (options)->
    @vent = new Backbone.Wreqr.EventAggregator()

    @vent.on "new:section",(sections) ->
      API.newSection(sections) 

  
  App.reqres.addHandler("settings:sections:content:region", => EntrySetSectionsApp.List.Controller.getContentRegion())
  App.reqres.addHandler("settings:sections:sidebar:region", => EntrySetSectionsApp.List.Controller.getSidebarRegion())
  
  App.addInitializer ->
    new EntrySetSectionsApp.Router
      controller: API