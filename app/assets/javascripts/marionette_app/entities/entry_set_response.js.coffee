@Qapp.module "Entities", (Entities, App, Backbone, Marionette, $, _) ->
  
  class Entities.EntrySetResponse extends Entities.Model
    nestedAttributeList: ['entry_values']
    paramRoot: "entry_set_response"
    urlRoot: () ->
      Routes.entry_set_responses_path()

    
    getSectionEntries:->
      entries = App.request "entry:values:entities",
                  entrySetResponseId: @id
                  sectionId: @get('sectionId')

     

  class Entities.EntrySetResponses extends Entities.Collection
    model: Entities.EntrySetResponse
    
    
    initialize:(models,options)->
      @url= ->
        Routes.entry_set_responses_path()


  
  App.reqres.setHandler "entry:set:response:entities", (options) ->
    API.getEntryResponses options

