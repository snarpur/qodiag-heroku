@Qapp.module "Entities", (Entities, App, Backbone, Marionette, $, _) ->
  
  class Entities.EntrySetResponse extends Entities.Model
    nestedAttributeList: ['entry_values']
    blacklist: ['entry_set_name']
    paramRoot: "entry_set_response"
    urlRoot: () ->
      Routes.entry_set_responses_path()

    

    initialize:->
      @initializeSections()
      @initializeEntryFields()
      @on("change:entry_sets_sections", @initializeSections)
      @on("change:entry_sets_sections", @initializeEntryFields)

    
    
    initializeSections:->
      sections = @get('entry_sets_sections') 
      unless sections instanceof Backbone.Collection
        @set("entry_sets_sections", new Entities.EntrySetSections(sections,{entrySetResponse: @}),{silent: true})
    

    
    initializeEntryFields: ->
      fields = @get('entry_fields') 
      unless fields instanceof Backbone.Collection
        @set("entry_fields", new Entities.EntryFields(fields,{entrySetResponse: @}),{silent: true})


    
    currentSection:->
      @get('entry_sets_sections')?.getCurrentSection()

    

    getSectionResponses:->
      @currentSection().getSectionEntryResponses()
      

     

  

  class Entities.EntrySetResponses extends Entities.Collection
    model: Entities.EntrySetResponse
    
    initialize:(models,options)->
      @url= ->
        Routes.entry_set_responses_path()







  API = 
    getEntrySetResponse: (options) ->
      responseSet = new Entities.EntrySetResponse id: options.id
      responseSet.fetch()
      responseSet

  
  App.reqres.setHandler "entry:set:response:entities", (options) ->
    API.getEntrySetResponse options

