@Qapp.module "Entities", (Entities, App, Backbone, Marionette, $, _) ->
  
  
  class Entities.EntryValue extends Entities.Model
    urlRoot: Routes.entry_values_path
    paramRoot: 'entry_value'
  


    entrySetResponseId:->
      @.get('entry_set_response_id') or @collection?.entrySetResponseId
      
    

  class Entities.EntryValues extends Entities.Collection
    model: Entities.EntryValue
    
    
    initialize:(models,options)->
      if options
        {@entrySetResponseId,@entryField,@sectionId,@personId} = options
        @url= ->
          "#{Routes.entry_values_path()}/#{@entrySetResponseId}/#{@sectionId}"
      super
    
    addEntryFieldOption:(options)->
      existing = @findWhere({entry_field_option_id: options.entry_field_option_id})
      if existing
        existing.unset('_destroy')
      else
        @add(options)

    selectEntryFieldOption:(options)->
      existing = @findWhere({entry_field_option_id: options.entry_field_option_id})
      if @size() is 0
        @add(options)

    removeEntryFieldOption:(options)->
      existing = @findWhere({entry_field_option_id: options.entry_field_option_id})
      if existing and existing.id?
        existing.set('_destroy',true)
      else
        @remove(options)

  API = 
    getEntryValues:(options)->
      values = new Entities.EntryValues([],options)
      values.fetch
        reset: true
      values
  
  App.reqres.setHandler "entry:values:entities", (options) ->
    API.getEntryValues(options)


