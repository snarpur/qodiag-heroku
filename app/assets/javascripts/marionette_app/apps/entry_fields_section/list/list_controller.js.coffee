@Qapp.module "EntryFieldsSectionApp.List", (List, App, Backbone, Marionette, $, _) ->
  
  List.Controller =
    
    listFields: (options) ->
      App.EntryFieldsSectionApp.vent.on("save:sectionFields",(options)=> @saveSectionFields(options))
      @section = options.section
      @getSectionEntryFields()
      
      
    getSectionEntryFields:()->
      @section.getSectionEntryFields((collection) =>
        @entriesCollection = collection
        view = @getEntriesView(collection)
        @showSection(view)
      )

    
    showSection: (view)->
      @getContentRegion().show view

    
    getContentRegion: ()->
      App.request "settings:sections:content:region"

    
    getEntriesView: (collection)->
      @entriesView = new List.Fields
        collection: collection
        model: @section

