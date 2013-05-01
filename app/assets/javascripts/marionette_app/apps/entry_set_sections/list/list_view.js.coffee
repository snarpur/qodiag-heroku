@Qapp.module "EntrySetSectionsApp.List", (List, App, Backbone, Marionette, $, _) ->
  
  class List.Layout extends App.Views.Layout
    template: "entry_set_sections/list/templates/list_layout"
    
    regions:
      navigationRegion: "#sections-navigation-region"
      sectionContentRegion: "#section-content-region"
      entryFieldsSidebarRegion: "#entry-fields-sidebar-region"
    

  class List.SectionNav extends App.Views.ItemView
    template: "entry_set_sections/list/templates/_section_nav"
    tagName: "li"

    initialize: (options) ->
      @model.set("entrySetId",options.entrySetId)

  
  class List.SectionsNav extends App.Views.CollectionView
    itemView: List.SectionNav
    tagName: "ul"
    className: "nav nav-tabs nav-stacked"

  class List.Section extends App.Views.ItemView
    template: "entry_set_sections/list/templates/_section"
    tagName: "li"
    events:
      "click span.trash" : "removeEntry"

    removeEntry:()->
      @model.collection.trigger("itemview:remove:entry",@model)


  class List.Sections extends App.Views.CompositeView
    itemView: List.Section
    template: "entry_set_sections/list/templates/section"
    itemViewContainer: "ul"
    
    onCompositeCollectionRendered: ->
      _this = @
      listEl = @$('ul')
      App.reqres.addHandler "get:section:element", => 
        listEl
      
      options=
        receive: (e,ui) ->
          App.EntrySetSectionsApp.vent.trigger("drop:entryField",_this.collection)
      
      listEl.sortable(options)

    events:
      "click button": "save"
    
      
    save: (callback) =>
      App.EntrySetSectionsApp.vent.trigger("save:sectionFields",@model)

        

    
