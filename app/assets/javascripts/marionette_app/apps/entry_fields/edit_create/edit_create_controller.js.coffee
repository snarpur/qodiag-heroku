@Qapp.module "EntryFieldsApp.EditCreate", (EditCreate, App, Backbone, Marionette, $, _) ->
  
  class EditCreate.Controller extends App.Controllers.Base

    initialize:(options)->
      {@activeView,@collection,@model} = options
       


    create:-> 
      @showDialog(new App.Entities.EntryField({editable: true}))
    
   
  
    edit:->
      @showDialog(@model)

    
  
    showDialog:(field)->
      dialogView = new EditCreate.Field model: field
      App.dialogRegion.show dialogView
      
      
      @listenTo dialogView, "save:clicked", (options) => 
        field.save field.attributes


      @listenTo field, "created", =>
        @addAsSorted(field, @collection)
        dialogView.trigger("dialog:close")


      @listenTo field, "updated", =>
        dialogView.trigger("dialog:close")

    

    addAsSorted:(model,collection)->
      parent = collection.getParentCollection()
      index = _.sortedIndex(parent.pluck('title'),model.get('title'))

      parent.add(model, {at: index})
      collection.trigger "reset"






