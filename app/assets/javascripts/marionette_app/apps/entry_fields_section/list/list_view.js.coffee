@Qapp.module "EntryFieldsSectionApp.List", (List, App, Backbone, Marionette, $, _) ->
  
  class List.Empty extends App.Views.ItemView
    template: "entry_fields_section/list/templates/_empty"
    tagName: 'li'



  
  class List.Field extends App.Views.ItemView
    template: "entry_fields_section/list/templates/_field"
    tagName: 'li'
    
    events:
      "click span.trash" : "removeEntry"
      "update:display:order" : (e,order)-> @model.trigger("update:display:order",order) 

    
    removeEntry:()->
      @model.collection.trigger("itemview:remove:entry",@model)


  class List.Fields extends App.Views.CompositeView
    template: "entry_fields_section/list/templates/fields"
    itemView: List.Field
    emptyView: List.Empty
    itemViewContainer: "ul"


    onCompositeCollectionRendered: ->
      _this = @
      listEl = @$('ul')
      options=
        update: (e,ui) ->
          displayOrder = $('li',this).index(ui.item)
          ui.item.trigger("update:display:order",displayOrder)
          _this.trigger("section:entries:updated", {displayOrder: displayOrder})
        
        change: (e,ui) ->
          _this.placeHolderElement = ui.item
        deactivate: (e,ui) ->
          _this.model.unset("selectedEntry")

      listEl.sortable(options)
      listEl.on "item:selected",(e,model) ->
        _this.model.set("selectedEntry",model)

    initialize: (options) ->
      @listenTo @collection, "add",@removePlaceHolder
      
    removePlaceHolder: () =>
      @placeHolderElement.remove()

    events:
      "click button": "save"
    
   
    save: =>
      @model.saveEntryFields()


