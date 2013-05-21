@Qapp.module "Entities", (Entities, App, Backbone, Marionette, $, _) ->
  
  class Entities.EntrySetSection extends Entities.Model
    paramRoot: 'section'
    nestedAttributeList: ['sections_entry_fields','entry_sets_sections']


    initialize: () ->
      @set("responseId",@collection.responseId) if @collection.responseId
      @url= ()->
        if @isNew()
          Routes.sections_path()
        else
          Routes.section_path(@get('id'))

    
    getSectionEntryFields: (callback)->
      entryFields = new App.Entities.SectionsEntryFieldsCollection([],{sectionId: @get('id')})
      unless @isNew()
        @set('sections_entry_fields',entryFields)
        entryFields.fetch
          reset: true
        entryFields


    addSelectedEntry:(display_order) ->
      if @get('selectedEntry')
        model= 
          entry_field_id: @get('selectedEntry').get('id')
          section_id: @get('id')
          display_order: display_order
          entry_field: @get('selectedEntry').toJSON()
        @get("sections_entry_fields").add [model],{at: display_order}


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
      @get('display_order') == @collection.sectionNo



  










  class Entities.EntrySetSectionsCollection extends Entities.Collection
    model: Entities.EntrySetSection
    
    
    initialize:(models,options)->
      {@entrySetId,@responseId,@sectionNo} = options
      @url = -> 
        Routes.entry_set_sections_path(@entrySetId)

    
    comparator:->
      @get('display_order')

    
    newSection:()->
      attributes= 
        entry_sets_sections: [_.pick(@last().attributes,"display_order","entry_set_id")]
      attributes.entry_sets_sections[0].display_order++
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









