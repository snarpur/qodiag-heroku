@Qapp.module "ProfilesApp.EditCreate", (EditCreate, App, Backbone, Marionette, $, _) ->

  class EditCreate.Controller extends App.Controllers.Base

    initialize:(options)->
      {@activeView,@collection,@model,@subjectId} = options

    showGuardian:(guardian)->

      #Depends on the template we use either Subject or Guardian View
      if @activeView.options.name is "Guardian"
        dialogView = new EditCreate.Guardian model: @model
      else
        dialogView = new EditCreate.Subject model: @model

      
      formView = App.request "form:wrapper", dialogView, @buttonsConfig()
      App.dialogRegion.show formView

      @listenTo formView.model, "created updated", =>
        # If we are updating the parents, re render every childview
        if @activeView.collection
          _.each(@activeView.children?._views,((i) ->
            i.render()
          ))
        # If we are updating the subject, re render only the subject view
        else
          @activeView.render()
     
    buttonsConfig:->
      options =
        modal: true
        title: if @model.isNew() then I18n.t("terms.add_information") else I18n.t("terms.edit_information")
        formClass: "form-horizontal"
      options

    edit:->
      @showGuardian(@model)

     create:-> 
      relationships = [ 
        name: "parent"
        relation_id: @subjectId
      ]

      @model.set('relationships',relationships)
      @showGuardian(@model)

    getFormWrapperRegion:->
      @getLayout().formWrapperRegion

    getLayout:->
      @layout ?= new EditCreate.Layout