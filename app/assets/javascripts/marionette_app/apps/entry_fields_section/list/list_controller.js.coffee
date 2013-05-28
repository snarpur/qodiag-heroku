@Qapp.module "EntryFieldsSectionApp.List", (List, App, Backbone, Marionette, $, _) ->
  
  class List.Controller extends App.Controllers.Base


    list: (options) ->
      # App.vent.on("save:sectionFields",(options)=> 
      #   @saveSectionFields(options)
      # )

      @getSectionEntryFields(options)
      
      
    getSectionEntryFields:(options)->
      {model,region} = options
      entries = model.getSectionEntryFields()
      
      App.execute "when:fetched",entries, =>
        view = @getEntriesView(entries,model)
        model.collection.trigger("fields:fetched")

        @listenTo view, "section:entries:updated", (options) =>
          model.addSelectedField options if options.field 
          entries.setDisplayOrder()
        
        region.show view
   

    
    getEntriesView:(entries,section)->
      entriesView = new List.Fields
        collection: entries
        model: section



