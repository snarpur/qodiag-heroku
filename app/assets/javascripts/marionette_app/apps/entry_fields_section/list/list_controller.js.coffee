@Qapp.module "EntryFieldsSectionApp.List", (List, App, Backbone, Marionette, $, _) ->
  
  class List.Controller extends App.Controllers.Base


    listFields: (options) ->
      App.vent.on("save:sectionFields",(options)=> 
        @saveSectionFields(options)
      )
      @section = options.section
      @getSectionEntryFields()
      
      
    getSectionEntryFields:()->
      @entriesCollection = @section.getSectionEntryFields()
      App.execute "when:fetched",@entriesCollection, =>
        view = @getEntriesView()
        
        @listenTo view, "section:entries:updated", (options) =>
          @section.addSelectedEntry(options.displayOrder)
          @entriesCollection.setDisplayOrder()
        

        @showSection(view)


    
    showSection: (view)->
      @getContentRegion().show view

    
    getContentRegion: ->
      App.request "settings:sections:content:region"

    
    getEntriesView: ->
      @entriesView = new List.Fields
        collection: @entriesCollection
        model: @section

