@Qapp.module "ProfilesApp.EditCreate", (EditCreate, App, Backbone, Marionette, $, _) ->

  class EditCreate.Controller extends App.Controllers.Base

    initialize:(options)->
      {@activeView,@collection,@model,@subjectId} = options


    showGuardian:(guardian)->
      #NOTE: Try to refector these
      #Depends on the template we use either Subject or Guardian View
      if @activeView.template.indexOf("guardian") isnt -1
        dialogView = new EditCreate.Guardian model: guardian
      else
        dialogView = new EditCreate.Subject model: guardian

      App.dialogRegion.show dialogView

      @listenTo dialogView, "save:clicked", (options) => 
        guardian.save guardian.attributes
        @activeView.render()

      @listenTo guardian, "created", =>
        dialogView.trigger("dialog:close")
        @activeView.render()


      @listenTo guardian, "updated", =>
        dialogView.trigger("dialog:close")

    edit:->
      @showGuardian(@model)

     create:-> 
      relationships = [ 
        name: "parent"
        relation_id: @subjectId
      ]

      @model.set('relationships',relationships)
      @showGuardian(@model)
      