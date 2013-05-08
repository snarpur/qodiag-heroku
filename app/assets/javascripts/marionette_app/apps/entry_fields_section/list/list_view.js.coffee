@Qapp.module "EntryFieldsSectionApp.List", (List, App, Backbone, Marionette, $, _) ->
  
  class List.Empty extends App.Views.ItemView
    template: "entry_fields_section/list/templates/_empty"
    tagName: 'li'



  
  class List.Field extends App.Views.ItemView
    template: "entry_fields_section/list/templates/_field"
    tagName: 'li'
    
    events:
      "click span.trash" : "removeEntry"
      "update" : "updateDisplayOrder" 

    updateDisplayOrder:(e, display_order)=>
      squeeze = if (display_order - @model.get('display_order')) > 0 then 0.5 else -0.5
      @model.set("display_order",display_order+squeeze)
    
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
          display_order = $('li',this).index(ui.item)
          _this.model.addSelectedEntry(display_order)
          ui.item.trigger("update",display_order)
          _this.collection.setDisplayOrder()
        
        change: (e,ui) ->
          _this.placeHolderElement = ui.item
        
        deactivate: (e,ui) ->
          _this.model.unset("selectedEntry")

      listEl.sortable(options)
      listEl.on "item:selected",(e,model) ->
        _this.model.set("selectedEntry",model)

    initialize: (options) ->
      options.collection.on("add",@removePlaceHolder)
      @listenTo(@collection,"new:order",()-> _this.renderCollection())
      
    removePlaceHolder: () =>
      @placeHolderElement.remove()

    events:
      "click button": "save"
    
   
    save: =>
      @model.saveEntryFields()


