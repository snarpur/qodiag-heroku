@Qapp.module "Entities", (Entities, App, Backbone, Marionette, $, _) ->
  
  class Entities.EntrySetSection extends Entities.Model
    paramRoot: 'section'
    blacklist: ['entry_set_id', 'display_order']
    nestedAttributeList: ['sections_entry_fields','entry_sets_sections']


    initialize: () ->
      @set("responseId",@collection.responseId) if @collection?.responseId?

      @url= ()->
        if @isNew()
          Routes.sections_path()
        else
          Routes.section_path(@get('id'))
    


    getSectionEntryResponses:->
      entries = new App.Entities.EntryFields([],{})
      entries.url = Routes.entry_set_response_section_path(@get('responseId'),@id)
      entries.fetch
        reset: true
      entries

    
    
    getSectionEntryFields: (callback)->
      entryFields = new App.Entities.SectionsEntryFieldsCollection([],{section: @})
      unless @isNew()
        @set('sections_entry_fields',entryFields)
        entryFields.fetch
          reset: true
        entryFields


    
    addSelectedField:(options) ->
      {displayOrder, field} = options
      
      model= 
        entry_field_id: field.get('id')
        section_id: @get('id')
        display_order: displayOrder
        entry_field: field.toJSON()
      
      fields = @get("sections_entry_fields")
      fields.add [model],{at: displayOrder}



    saveEntryFields: ->
      _this = @
      fields = new Entities.EntrySetSection(_.pick(@attributes,'id','sections_entry_fields'))
      fields.url = @get('sections_entry_fields').url()
      
      callbacks=
        success:(model, response)->
          _this.get("sections_entry_fields").reset(response)
        error:->
          throw "error in entities/entry_set_sections.js.coffee:saveEntryFields()"
      fields.save(fields.toJSON(),callbacks)



    isCurrentSection:->
      @collection.isCurrentSection(@)
    


    entryFieldIds:->
      if  @get("sections_entry_fields")
        @get("sections_entry_fields").pluck('entry_field_id')
      else
        @get('entry_field_ids')


  

  class Entities.EntrySetSectionsCollection extends Entities.Collection
    model: Entities.EntrySetSection
    
    

    initialize:(models,options)->
      {@entrySetId,@responseId,@currentSectionId,@sectionNo} = options
      
      @url = -> 
        Routes.entry_set_sections_path(@entrySetId)

      @on "change:current:section", (options)->
        @currentSectionId = options.model.id
        @currentSection = options.model
      
      

    entryFieldIds:->
      _.flatten _.map @.models, (i)->  i.entryFieldIds()


    
    hasFieldWithId: (id) ->
      _.contains(@entryFieldIds(), id)



    getCurrentSection: ->
      if @currentSectionId then @get(@currentSectionId) else @first()


    
    isCurrentSection:(section) ->
      section.id == @getCurrentSection().id


    
    comparator:->
      @get('display_order')


    
    newSection:()->
      attributes= 
        entry_sets_sections: [{entry_set_id: @entrySetId, display_order: @length + 2 }]
      new @model(attributes)

    
    
    getLastDisplayNo:->
      @last().get("display_order")


    
    setCurrentToLast:->
      @sectionNo = @last().get("display_order")



    isCurrentLast:->
      @size() == @sectionNo



    isCurrentFirst:->
      @sectionNo == 1



    addNewSection:->
      section = @newSection()
      @add(section,{silent:true})
      @setCurrentToLast()
      @trigger("reset")
      section

  



  API =
    getSectionEntities: (options) ->
      sections = new Entities.EntrySetSectionsCollection([],options)
      sections.fetch({reset: true})
      sections

  
  App.reqres.setHandler "entry:set:sections:entities", (options) ->
    API.getSectionEntities options









