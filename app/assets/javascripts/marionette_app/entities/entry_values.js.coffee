@Qapp.module "Entities", (Entities, App, Backbone, Marionette, $, _) ->
  
  class Entities.EntryValue extends Entities.Model
    urlRoot: Routes.entry_values_path
    paramRoot: 'entry_value'

    initialize:->
      if @get('comments')
        @set("comments", new Entities.Values(@get('comments')))

    entrySetResponseId:->
      @.get('entry_set_response_id') or @collection?.entrySetResponseId
      
      
  class Entities.Values extends Entities.Collection
    model: Entities.EntryValue
    
    
    initialize:(models,options)->
      if options
        {@entrySetResponseId,@sectionId} = options
        @url= ->
          "#{Routes.entry_values_path()}/#{@entrySetResponseId}/#{@sectionId}"



  API = 
    getEntryValues:(options)->
      values = new Entities.Values([],options)
      values.fetch
        reset: true
      values
  
  App.reqres.setHandler "entry:values:entities", (options) ->
    API.getEntryValues(options)


