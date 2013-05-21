@Qapp.module "Entities", (Entities, App, Backbone, Marionette, $, _) ->
  
  class Entities.SectionsEntryFields extends Entities.Model
    
    initialize:->
      @on("update:display:order",@updateDisplayOrder)
      @url= ->
        Routes.section_sections_entry_fields_path(@id)
     

    updateDisplayOrder:(displayOrder)=>
      displayOrder += 1
      squeeze = if (displayOrder - @get('display_order')) > 0 then 0.5 else -0.5
      @.set("display_order",displayOrder+squeeze)

    destroy:->
      @url = "section_entry_fields/#{@id}"
      super
  
  


  class Entities.SectionsEntryFieldsCollection extends Entities.Collection
    model: Entities.SectionsEntryFields
    
    
    initialize:(models,options)->
      @on("itemview:remove:entry",@removeFromSection)

      @sectionId = options.sectionId
      @url = -> 
        if @sectionId
          Routes.section_sections_entry_fields_path(@sectionId)

    
    comparator: (entry) ->
      entry.get('display_order')

    
    setDisplayOrder:->
      @sort()
      @each((item,index)->item.set("display_order",index+1))
      @trigger("reset")

    
    removeFromSection: (model) ->
      _this = @
      model.destroy
        success:->
          _this.setDisplayOrder()
        error:->
          throw "error in - entities/sections_entry_fields.js.coffee:removeFromSection()"



  API =
    getEntryFieldEntities: (options) ->
      fields = new Entities.EntryFieldsCollection([],_.omit(options,'callback'))
      callback = options.callback
      fields.fetch
        reset: true
        success: ->
          callback fields

  




