@Qapp.module "Entities", (Entities, App, Backbone, Marionette, $, _) ->
  
  
  class Entities.EntryValue extends Entities.Model
    urlRoot: Routes.entry_values_path
    paramRoot: 'entry_value'
  
    validation:
      text_value: 
        required: true
    
    backboneAssociations: [
      {
        type: Backbone.One
        key: 'entry_field_option'
        relatedModel: App.Entities.EntryFieldOption
      }
    ] 

    initialize: ->
      super
      if @get('comments')
        @set("comments", new Entities.EntryValues(@get('comments')))

    entrySetResponseId:->
      @.get('entry_set_response_id') or @collection?.entrySetResponseId
      
    

  class Entities.EntryValues extends Entities.Collection
    model: Entities.EntryValue
    
    
    initialize:(models,options)->
      if options
        {@entrySetResponseId,@entryField,@sectionId,@personId} = options
        @url= ->
          "#{Routes.entry_values_path()}/#{@entrySetResponseId}/#{@sectionId}"

    

    buildEntryValue:(field)->
      new Entities.EntryValue
        person_id: @personId
        entry_set_response_id: @entrySetResponseId
        entry_field_id: field.get('id')

  



  API = 
    getEntryValues:(options)->
      values = new Entities.EntryValues([],options)
      values.fetch()
      # reset: true
      values
  
  App.reqres.setHandler "entry:values:entities", (options) ->
    API.getEntryValues(options)


