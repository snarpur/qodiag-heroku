@Qapp.module "Entities", (Entities, App, Backbone, Marionette, $, _) ->
  
  class Entities.EntrySetSection extends Entities.Model
    paramRoot: 'section'
    acceptsNestedAttributesFor: ['sections_entry_fields']
    

    initialize: () ->
      @url= ()->
        Routes.section_path(@get('id'))

    getSectionEntryFields: (callback)->
      entryFields = new App.Entities.SectionsEntryFieldsCollection([],{sectionId: @get('id')})
      @set('sections_entry_fields',entryFields)
      entryFields.fetch
        success:->
          callback entryFields
        error:->
          throw "error in entry_set_section.js.coffee:getEntryFields()"


    addEntryField:(entryField)->
      @get("sections_entry_fields").add 
        entry_field_id: entryField.get('id')
        section_id: @get('id')
        entry_field: entryField.toJSON()
        {silent: true}




  class Entities.EntrySetSectionsCollection extends Entities.Collection
    model: Entities.EntrySetSection
    
    
    initialize:(models,options)->
      @entrySetId = options.entrySetId      
      @url = -> 
        Routes.entry_set_sections_path(options.entrySetId)



  API =
    getSectionEntities: (options) ->
      sections = new Entities.EntrySetSectionsCollection([],_.omit(options,'callback'))
      callback = options.callback
      sections.fetch
        success: ->
          callback sections

  
  App.reqres.addHandler "entrySetSections:entities", (options) ->
    API.getSectionEntities options