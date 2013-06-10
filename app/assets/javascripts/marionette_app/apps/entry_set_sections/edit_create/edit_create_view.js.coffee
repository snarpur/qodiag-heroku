@Qapp.module "EntrySetSectionsApp.EditCreate", (EditCreate, App, Backbone, Marionette, $, _) ->
  


  class EditCreate.Section extends App.Views.ItemView
    template: "entry_set_sections/edit_create/templates/section"
    className: "modal"
    
    triggers:
      "click button.save" : "save:section"
      "click button.cancel" : "dialog:close" 
      "click button.close" : "dialog:close"
    
    bindings:
      '#section_name' : 'name',
      '#section_description' : 'description'


    templateHelpers: ->
        dialogTitle:()=>
          type = if @model instanceof App.Entities.EntrySet then "eyðublað" else "skref"
          action = if @model.isNew() then "nýtt" else "breyta"
          suffix = if @model.isNew() then "" else "i"
          _("#{action} #{type}#{suffix}").capitalize()


    onShow:->
      @.stickit()
  
  class EditCreate.SectionsNav extends App.Views.CompositeView
    template: "entry_set_sections/edit_create/templates/section_nav"
    itemView: EditCreate.SectionNav
    itemViewContainer: "ul"






    
