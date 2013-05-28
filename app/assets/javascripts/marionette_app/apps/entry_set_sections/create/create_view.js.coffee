@Qapp.module "EntrySetSectionsApp.Create", (Create, App, Backbone, Marionette, $, _) ->
  


  class Create.Section extends App.Views.ItemView
    template: "entry_set_sections/create/templates/section"
    events:
      "click button.save" : -> @trigger "save:section"
      "click button.cancel" : -> @trigger "dialog:close"
    
    bindings:
      '#section_name' : 'name',
      '#section_description' : 'description'

    dialog:
      title: ""
      buttons: []

    onShow:->
      @.stickit()
  
  class Create.SectionsNav extends App.Views.CompositeView
    template: "entry_set_sections/create/templates/section_nav"
    itemView: Create.SectionNav
    itemViewContainer: "ul"






    
