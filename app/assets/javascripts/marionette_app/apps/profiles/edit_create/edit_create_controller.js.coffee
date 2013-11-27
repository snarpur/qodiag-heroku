@Qapp.module "ProfilesApp.EditCreate", (EditCreate, App, Backbone, Marionette, $, _) ->

  class EditCreate.Controller extends App.Controllers.Base

    initialize:(options)->
      {@activeView,@collection,@model,@subjectId} = options
      #App.dialogRegion.show @getLayout(),model: @model


    showGuardian:(guardian)->

      #NOTE: Try to refector these stuff
      #Depends on the template we use either Subject or Guardian View
      if @activeView.template.indexOf("guardian") isnt -1
        dialogView = new EditCreate.Guardian model: @model
      else
        dialogView = new EditCreate.Subject model: @model

      
      formView = App.request "form:wrapper", dialogView, @buttonsConfig()
      App.dialogRegion.show formView

      @listenTo formView.model, "created updated", =>
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