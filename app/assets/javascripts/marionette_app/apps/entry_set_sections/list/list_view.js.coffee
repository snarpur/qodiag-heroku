@Qapp.module "EntrySetSectionsApp.List", (List, App, Backbone, Marionette, $, _) ->
  
  class List.Layout extends App.Views.Layout
    template: "entry_set_sections/list/templates/list_layout"
    
    regions:
      settingsNavigationRegion: "#settings-navigation-region"
      entrySetTitleRegion: "#entry-set-title-region"
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
  
    

    modelEvents:
      'edit:complete': ()-> @render()

    

    onSetCurrentSection:(options)->
      options.model.trigger("change:current:section", options)
    
    

    triggers:
      "click a" : "set:current:section"

    

    initialize: (options) ->
      @model.set("entrySetId",options.entrySetId)

      @model.collection.on "change:current:section", =>

        if @model.isCurrentSection() 
          @$el.addClass('active') 
        else 
          @$el.removeClass('active')
          

  
  

  class List.SectionsNav extends App.Views.CompositeView
    template: "entry_set_sections/list/templates/section_nav"
    itemView: List.SectionNav
    itemViewContainer: "ul"

    triggers:
      "click .button": "add:new:section:clicked"

    

  


  class List.Title extends App.Views.ItemView
    template: "entry_set_sections/list/templates/title"

    triggers:
      "click .edit-item" : "edit:title"

    modelEvents:
      'edit:complete': ()-> @render()








    
