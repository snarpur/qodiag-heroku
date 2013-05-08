@Qapp.module "EntrySetSectionsApp.Create", (Create, App, Backbone, Marionette, $, _) ->
  
  Create.Controller =

    new:(sections)->
      newSection = sections.newSection()
      dialogView = new Create.Section model: newSection
      App.dialogRegion.show dialogView

      dialogView.on "save:section", ()=>
        _this = @
        newSection.save newSection.attributes,
          success: ->
            sections.add(newSection)
            dialogView.trigger("dialog:close")
            App.navigate(_this.successPath(newSection), trigger: true)
          error: ->
            throw "entry_set_sections/create/create_controller.js.coffee:new()"
   
    successPath: (section) ->
      "settings#{Routes.entry_set_section_path(section.get('entry_set_id'),section.get('display_order'))}"