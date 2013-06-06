@Qapp.module "EntrySetSectionsApp.Create", (Create, App, Backbone, Marionette, $, _) ->
  
  #NOTE: Change from object literal to Controller
  Create.Controller =

    create:(options)->
      options.action = 'create'
      @showDialog(options)


    edit:(options)->
      options.action = 'edit'
      @showDialog(options)

    
    showDialog:(options)->
      @dialogView = new Create.Section model: options.model
      App.dialogRegion.show @dialogView

      @dialogView.on "save:section", => @saveSection(options)

   
    saveSection:(options)->
      {model,collection,activeView,action} = options
      _this = @
      model.save model.attributes,
        success: ->
          if action is 'create'
            collection.add(model)
            collection.trigger("change:current:section", {model: model})
            App.navigate(_this.successPath(model))
          else if action is 'edit'
            model.trigger('edit:complete')


          _this.dialogView.trigger("dialog:close")
          activeView.trigger("section:#{action}:complete")
          
        error: ->
          throw "entry_set_sections/create/create_controller.js.coffee:new()"


    successPath: (section) ->
      "settings#{Routes.entry_set_section_path(section.get('entry_set_id'),section.id)}"