@Qapp.module "Entities", (Entities, App, Backbone, Marionette, $, _) ->
  
  class Entities.SectionsEntryFields extends Entities.Model
    #ISSUE: #17 Accossiation and naming structure/convention on front-end side should be re considered on many to many relationships     
    blacklist: ['index']
    initialize:->
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

      @section = options.section
      
      @on "add remove", (model,collection,opt) => 
        action = if opt.add then 'add' else 'remove'
        @section.trigger "#{action}:fields",{model: model}
              

      @url = ->
        if @section
          Routes.section_sections_entry_fields_path(@section.id)

    
    comparator: (entry) ->
      entry.get('display_order')

    
    setDisplayOrder:->
      @sort()
      @each((item,index)->item.set("display_order",index+1))
      @trigger("reset")

    
    removeField: (model) ->
      _this = @
      if model.id
        model.destroy
          success:->
            _this.setDisplayOrder()
          error:->
            throw I18n.t("marionette.errors.error_in_function", function: " - entities/sections_entry_fields.js.coffee:removeFromSection()")
      else
        @remove(model)
        @setDisplayOrder()



  API =
    getEntryFieldEntities: (options) ->
      fields = new Entities.EntryFields([],_.omit(options,'callback'))
      callback = options.callback
      fields.fetch
        reset: true
        success: ->
          callback fields

  




