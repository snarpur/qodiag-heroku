@Qapp.module "EntryFieldsSidebarApp.List", (List, App, Backbone, Marionette, $, _) ->
  
  class List.Layout extends App.Views.Layout
    template: "entry_fields_sidebar/list/templates/list_layout"
    
    regions:
      searchRegion: "#entry-fields-search-region"
      listRegion: "#entry-fields-list-region"
      formRegion: "#entry-fields-form-region"

  class List.EntryField extends App.Views.ItemView
    template: "entry_fields_sidebar/list/templates/_entry_field"
    tagName: "li"

    triggers:
      'mouseenter' : 'connect:to:sortable'

    onConnectToSortable:() ->
      droppableEl = @model.collection.droppableElement
      _this = @
      options=
        revert: 'invalid'
        revertDuration: 100
        helper: 'clone'
        opacity: .4
        addClasses: false
        connectToSortable: droppableEl
        start: (e,ui)->
          droppableEl.trigger("item:selected",_this.model)
        stop: (e,ui)->
          _this.trigger "drag:stopped"



      
      @$el.draggable(options)





  class List.Search extends App.Views.ItemView
    template: "entry_fields_sidebar/list/templates/_search"
    tagName: 'form'
    events:
      "keyup input": "setSearch"

    setSearch:(event)->
      @model.set("search",$(event.target).val())
  

  class List.EntryFields extends App.Views.CollectionView
    itemView: List.EntryField
    tagName: "ul"
    className: "reset content"




