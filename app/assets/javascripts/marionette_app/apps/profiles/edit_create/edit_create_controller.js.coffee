@Qapp.module "ProfilesApp.EditCreate", (EditCreate, App, Backbone, Marionette, $, _) ->

  class EditCreate.Controller extends App.Controllers.Base

    initialize:(options)->
      {@activeView,@collection,@model,@subjectId} = options
      @rootModel = @model

    showGuardian:(guardian)->
      config = @getFormConfig()
      @controllerModel = new App.Entities.Model()
      @fieldCollection = new App.Entities.FieldCollection(config,{rootModel:@rootModel,controllerModel:@controllerModel})

      view = @getFieldsView(@fieldCollection)

      formView = App.request "form:wrapper", view, @buttonsConfig()
      
      @listenTo formView, "before:form:submit", =>

        @listenTo @rootModel, "created updated", =>
          # NOTE: Keep it for Issue #77 
          console.log "created or updated::",arguments
          # If we are updating the parents, re render every childview
          if @activeView.collection
            _.each(@activeView.children?._views,((i) ->
              i.render()
            ))
          # If we are updating the subject, re render only the subject view
          else
            @activeView.render()

      App.dialogRegion.show formView
     
    getFormConfig:()->
      EditCreate.FormConfig[@activeView.options.name.toLowerCase()]

    #REFACTOR: We could pass this code to the Form Controller
    getFieldsView: (collection) =>
      new App.Components.Form.FieldCollectionView 
        collection: collection
        model: @rootModel

    buttonsConfig:->
      options =
        modal: true
        collection: false
        title: if @rootModel.isNew() then I18n.t("terms.add_information") else I18n.t("terms.edit_information")
        formClass: "form-horizontal"
      options

    edit:->
      @showGuardian(@rootModel)

     create:-> 
      relationships = [ 
        name: "parent"
        relation_id: @subjectId
      ]

      @model.set('relationships',relationships)
      @showGuardian(@rootModel)

    getFormWrapperRegion:->
      @getLayout().formWrapperRegion

    getLayout:->
      @layout ?= new EditCreate.Layout