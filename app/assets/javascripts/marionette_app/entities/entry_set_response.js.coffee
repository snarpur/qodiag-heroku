@Qapp.module "Entities", (Entities, App, Backbone, Marionette, $, _) ->
  
  class Entities.EntrySetResponse extends Entities.Model
    nestedAttributeList: ['entry_values']
    blacklist: ['entry_set_name']
    paramRoot: "entry_set_response"
    urlRoot: () ->
      Routes.entry_set_responses_path()

   
    relations:[{
      type: Backbone.One
      key: 'entry_set'
      relatedModel:->
        App.Entities.EntrySet
      },
      {
      type: Backbone.Many
      key: 'entry_values'
      collectionType: "#{App.Qodiag.namespace}.Entities.EntryValues"
      relatedModel:->
        App.Entities.EntryValue
      }]
   


    
    currentSection:->
      sections = @get('entry_set').get('sections') unless not @get('entry_set')?
      sections?.getCurrentSection()
      


    getSectionResponses:->
      @currentSection().getSectionEntryResponses(@id)


    
    getEntryValuesForSection:->
      _.chain(@get('entry_fields').models)
        .map((i)-> i.get("entry_values").models)
        .flatten()
        .value()
        
        

  

  class Entities.EntrySetResponses extends Entities.Collection
    model: Entities.EntrySetResponse
    
    initialize:(models,options)->
      @url= ->
        Routes.entry_set_responses_path()
      super

  API = 
    getEntrySetResponse: (options) ->
      responseSet = new Entities.EntrySetResponse id: options.id
      responseSet.fetch
        reset: true
      responseSet

  
  App.reqres.setHandler "entry:set:response:entities", (options) ->
    API.getEntrySetResponse options

