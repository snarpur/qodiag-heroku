@Qapp.module "EntryFieldsSectionApp.List", (List, App, Backbone, Marionette, $, _) ->
  
  class List.Controller extends App.Controllers.Base


    list: (options) ->
      @getSectionEntryFields(options)


    XgetSectionEntryFields:(options)->  
      {model,region} = options
      sectionEntryFields = model
      


    getSectionEntryFields:(options)->
      {model,region,loaderRegion} = options

      entries = model.getSectionEntryFields()

      view = @getEntriesView(entries,model)


      @listenTo view, "section:entries:updated", (options) =>
        model.addSelectedField options if options.field 
        entries.setDisplayOrder()

      @show view,
       region: region
       loaderRegion: loaderRegion
       loading: false

      @listenTo view, "save:clicked", (options)=>
        model.saveEntryFields()
        
      @listenTo model, "updated", =>
        toastr.success(I18n.t("activerecord.sucess.messages.saved",model: model.get('name')))

    getEntriesView:(entries,section)->
      entriesView = new List.Fields
        collection: entries
        model: section



