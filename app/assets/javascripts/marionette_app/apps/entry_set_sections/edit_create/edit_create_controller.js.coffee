@Qapp.module "EntrySetSectionsApp.EditCreate", (EditCreate, App, Backbone, Marionette, $, _) ->
  
  #NOTE: Change from object literal to Controller
  EditCreate.Controller =

    create:(options)->
      options.action = 'create'
      @showDialog(options)


    edit:(options)->
      options.action = 'edit'
      @showDialog(options)

    
    showDialog:(options)->      
      @dialogView = new EditCreate.Section model: options.section
      App.dialogRegion.show @dialogView
      @dialogView.on "save:section", => @saveSection(options)

   
    saveSection:(options)->
      {section,collection,activeView,action} = options
      _this = @
      section.save section.attributes,
        success: (model,response)->
          if action is 'create'
            collection.add(response)
            collection.trigger("change:current:section", {model: collection.last()})
            App.navigate(_this.successPath(model))
          else if action is 'edit'
            model.trigger('edit:complete')


          _this.dialogView.trigger("dialog:close")
          activeView.trigger("section:#{action}:complete")
          
        error: ->
          throw "entry_set_sections/create/create_controller.js.coffee:new()"


    successPath: (section) ->
      "settings#{Routes.entry_set_section_path(section.get('entry_set_id'),section.id)}"