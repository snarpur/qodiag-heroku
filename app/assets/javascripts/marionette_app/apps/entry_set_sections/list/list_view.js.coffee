@Qapp.module "EntrySetSectionsApp.List", (List, App, Backbone, Marionette, $, _) ->
  
  class List.Layout extends App.Views.Layout
    template: "entry_set_sections/list/templates/list_layout"
    
    regions:
      navigationRegion: "#sections-navigation-region"
      sectionTitleRegion: "#section-title-region"
      sectionContentRegion: "#section-content-region"
      entryFieldsSidebarRegion: "#entry-fields-sidebar-region"
    

  class List.SectionNav extends App.Views.ItemView
    template: "entry_set_sections/list/templates/_section_nav"
    tagName: "li"
    className:->
      if @model.isCurrentSection()
        "active"

    initialize: (options) ->
      @model.on("change:name",@render)
      @model.set("entrySetId",options.entrySetId)

  
  class List.SectionsNav extends App.Views.CompositeView
    template: "entry_set_sections/list/templates/section_nav"
    itemView: List.SectionNav
    itemViewContainer: "ul"

    events:
      "click button": "addSection"


    addSection:->
      App.EntrySetSectionsApp.vent.trigger("new:section", @collection)


  class List.Title extends App.Views.ItemView
    template: "entry_set_sections/list/templates/title"





    
