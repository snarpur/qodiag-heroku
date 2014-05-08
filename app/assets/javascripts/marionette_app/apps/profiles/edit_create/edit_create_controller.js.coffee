@Qapp.module "ProfilesApp.EditCreate", (EditCreate, App, Backbone, Marionette, $, _) ->

  class EditCreate.Controller extends App.Controllers.Base

    initialize:(options)->
      {@activeView,@collection,@model,@subjectId} = options

    showGuardian:(guardian)->
      config = @getFormConfig()
      @controllerModel = new App.Entities.Model()
      @fieldCollection = new App.Entities.FieldCollection(config,{rootModel:@model,controllerModel:@controllerModel})

      view = @getFieldsView(@fieldCollection)

      formView = App.request "form:wrapper", view, @buttonsConfig()
      
      @listenTo formView, "before:form:submit", =>

        @listenTo @model, "created updated", =>
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
        model: @model

    buttonsConfig:->
      options =
        modal: true
        collection: false
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