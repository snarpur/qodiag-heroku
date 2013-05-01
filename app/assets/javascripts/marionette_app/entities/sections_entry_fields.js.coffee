@Qapp.module "Entities", (Entities, App, Backbone, Marionette, $, _) ->
  
  class Entities.SectionsEntryFields extends Entities.Model
  
  class Entities.SectionsEntryFieldsCollection extends Entities.Collection
    model: Entities.SectionsEntryFields
    
    
    initialize:(models,options)->
      @on("itemview:remove:entry",@removeFromSection)
      @sectionId = options.sectionId
      @url = -> 
        if @sectionId
          Routes.section_sections_entry_fields_path(@sectionId)


    removeFromSection: (model) ->
      model.destroy
        error:->
          throw "error in - entities/sections_entry_fields.js.coffee:removeFromSection()"



  API =
    getEntryFieldEntities: (options) ->
      fields = new Entities.EntryFieldsCollection([],_.omit(options,'callback'))
      callback = options.callback
      fields.fetch
        success: ->
          callback fields

  




