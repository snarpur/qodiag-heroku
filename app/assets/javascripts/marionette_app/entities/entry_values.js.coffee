@Qapp.module "Entities", (Entities, App, Backbone, Marionette, $, _) ->
  
  
  class Entities.EntryValue extends Entities.Model
    urlRoot: Routes.entry_values_path
    paramRoot: 'entry_value'
  
    validation:
      text_value: 
        required: true
    
    backboneAssociations: [
      {
        type: "One"
        key: 'entry_field_option'
        relatedEntity: "App.Entities.EntryFieldOption"
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

    
    addEntryFieldOption:(options)->
      existing = @findWhere({entry_field_option_id: options.entry_field_option_id})
      if existing
        existing.unset('_destroy')
      else
        @add(options)

      console.info "Adding values::",@models

    removeEntryFieldOption:(options)->
      existing = @findWhere({entry_field_option_id: options.entry_field_option_id})
      if existing and existing.id?
        existing.set('_destroy',true)
      else
        @remove(options)

      console.info "Removing values::",@models

    #DELETE: sooner the better
    # buildEntryValue:(field_id,field_option_id)->
    #   new Entities.EntryValue
    #     person_id: @personId
    #     entry_set_response_id: @entrySetResponseId
    #     entry_field_id: field_id


  



  API = 
    getEntryValues:(options)->
      values = new Entities.EntryValues([],options)
      values.fetch
        reset: true
      values
  
  App.reqres.setHandler "entry:values:entities", (options) ->
    API.getEntryValues(options)


