@Qapp.module "EntrySetsApp.EditCreate", (EditCreate, App, Backbone, Marionette, $, _) ->
  
  class EditCreate.Controller extends App.Controllers.Base

    initialize:(options)->
      {@activeView} = options
       


    create:-> 
      @showDialog(new App.Entities.EntrySet({editable: true}))
    

    
  
    showDialog:(entrySet)->
      dialogView = new EditCreate.EntrySet model: entrySet
      App.dialogRegion.show dialogView
      
      
      @listenTo dialogView, "save:clicked", (options) => 
        entrySet.save entrySet.attributes


      @listenTo entrySet, "created", =>
        @activeView.trigger "entry:set:created",  entrySet
        dialogView.trigger("dialog:close")


      @listenTo entrySet, "updated", =>
        dialogView.trigger("dialog:close")




