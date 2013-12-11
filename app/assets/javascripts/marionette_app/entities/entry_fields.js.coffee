# TODO: Create a file for custom validation functions
do (Backbone) ->
  _.extend Backbone.Validation.validators,

   minMultichoiceOptions: (value, attr, customValue, model)=>    
      return model.get("field_type") == "multi-choice" and value.size() < customValue

@Qapp.module "Entities", (Entities, App, Backbone, Marionette, $, _) ->

  class Entities.EntryField extends Entities.Model
    urlRoot: Routes.entry_fields_path()
    paramRoot: 'entry_field'
    blacklist:['index','editable','ok']

    backboneAssociations: [
      {
        type: "Many"
        key: 'entry_values'
        relatedEntity: "App.Entities.EntryValues"
      },
      {
        type: "Many"
        key: 'entry_field_options'
        relatedEntity: "App.Entities.EntryFieldOptions"
      }
    ]



    validation:
      title: 
        required: true
        msg: "Vantar"
      field_type: 
        required: true
        msg: "Vantar"
      entry_field_options:
        minMultichoiceOptions: 1
        msg: "At least one"


    initialize:->
      super
      @url = ->
        if @isNew() then @urlRoot else "#{@urlRoot}/#{@id}"

      @listenTo @get('entry_field_options'), "options:add", @addOption 
      @listenTo @get('entry_field_options'), "options:remove", @removeOption

    
    removeOption:(model,options)->
      @get('entry_values').removeEntryFieldOption(options)
    
    addOption:(model,options)->
      @get('entry_values').addEntryFieldOption(options)
      


  


  class Entities.EntryFields extends Entities.Collection
    model: Entities.EntryField
    
    
    initialize:(models,options)->
      {@sectionId,@entrySetId} = options

      @url = -> 
        if @sectionId
          Routes.section_entry_fields_path(@sectionId)
        else
          Routes.entry_fields_path()


    
    comparator:(entryField)->
      _(entryField.get('title')).capitalize()


    # mergeEntryValues:->
      # new App.Entities.EntryValues _.flatten @pluck('entry_values',true).map (i)-> i.toJSON({acceptsNested : false})

    
    getSearchCollection:->
      @searchCollection
    
    

    getLiveCollection:->
      @liveCollection
    
    

    createSearchCollection:(disabledIds = [])->
      unless _.isEmpty(disabledIds)
        @remove @filter (model)-> _.contains(disabledIds,model.id)
      
      @liveCollection = window.queryEngine.createLiveCollection(@models)
      @liveCollection.setComparator((entry)->
          _(entry.get('title')).capitalize()
        )
      
      @on("search:update",(searchString)-> 
        @updateSearchCollection(searchString)
      )


      @searchCollection = @liveCollection.createLiveChildCollection()
        .setFilter('search', (model,searchString) ->
          return true  if !searchString? or searchString?.length < 3       
          searchRegex = queryEngine.createSafeRegex(searchString)
          pass = searchRegex.test(model.get('title'))
          return pass
        )
        .query()

    

    updateSearchCollection:(searchString)->
      @searchCollection.setSearchString(searchString).query()

  



  API =
    getEntryFieldEntities: (options) ->
      fields = new Entities.EntryFields([],_.omit(options,'callback'))
      fields.fetch
        reset: true
      fields

 

  App.reqres.setHandler "entry:fields:entities", (options = {}) ->
    API.getEntryFieldEntities options


