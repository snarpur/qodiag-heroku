@Qapp.module "EntryFieldsSectionApp.List", (List, App, Backbone, Marionette, $, _) ->
  
  class List.Empty extends App.Views.ItemView
    template: "entry_fields_section/list/templates/_empty"
    tagName: 'li'



  
  class List.Field extends App.Views.ItemView
    template: "entry_fields_section/list/templates/_field"
    tagName: 'li'
    
    triggers:
      "click span.trash" : "remove:field"

    events:
      'update:display:order': 'setDisplayOrder'



    setDisplayOrder:(e,displayOrder)->
      @model.updateDisplayOrder(displayOrder)

    onRemoveField: ->
      @model.collection.removeField(@model)
 


  class List.Fields extends App.Views.CompositeView
    template: "entry_fields_section/list/templates/fields"
    itemView: List.Field
    emptyView: List.Empty
    itemViewContainer: "ul"

    onCompositeCollectionRendered: ->
      _this = @
      listEl = @$('ul')
      @model.trigger "change:current:dropzone", listEl    
      

      options=
        update: (e,ui) ->
          displayOrder = $('li',this).index(ui.item)
          ui.item.trigger("update:display:order",displayOrder)
          _this.trigger("section:entries:updated", {displayOrder: displayOrder, field: _this.newField})
        
        change: (e,ui) ->
          _this.placeHolderElement = ui.item
        
        deactivate: (e,ui) ->
          _this.newField = null

        placeholder: "dropzone"

            

      listEl.sortable(options)
      
      listEl.on "item:selected",(e,model) ->
        _this.newField = model

    initialize: (options) ->
      @listenTo @collection, "add",@removePlaceHolder
      
    removePlaceHolder: () =>
      @placeHolderElement.remove()

    triggers:
      "click button": "save:clicked"
    


