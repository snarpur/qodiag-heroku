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


    templateHelpers: =>
        #REFACTOR: Try to see if we could use the template helper of the base class
        dialogTitle: =>
          type = if @model instanceof App.Entities.EntrySet then I18n.t("entry_set.model_name") else I18n.t("terms.step")
          action = if @model.isNew() then I18n.t("terms.new") else I18n.t("terms.edit")
          suffix = if @model.isNew() then "" else I18n.t("terms.in")
          _("#{action} #{type}#{suffix}").capitalize()


    onShow:->
      @.stickit()
  
  class EditCreate.SectionsNav extends App.Views.CompositeView
    template: "entry_set_sections/edit_create/templates/section_nav"
    itemView: EditCreate.SectionNav
    itemViewContainer: "ul"






    
