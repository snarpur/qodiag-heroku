@Qapp.module "EntrySetsApp.EditCreate", (EditCreate, App, Backbone, Marionette, $, _) ->
  
  class EditCreate.Controller extends App.Controllers.Base

    initialize:(options)->
      {@activeView,@model} = options
       
    create:->
      response = @getResponse()
      @rootModel = new App.Entities.FormEntrySetModel(response)
      @showDialog()

    edit:->
      # response = @getResponse()
      @rootModel = new App.Entities.FormEntrySetModel(@model.attributes)
      @showDialog()
    

    formConfig:->
      options =
        modal: true
        title: _(I18n.t("terms.new") + " " + I18n.t("entry_set.model_name")).capitalize()
        formClass: "form-horizontal"
        collection: false
      options
  
    showDialog:()->
      config = @getFormConfig()
      @fieldCollection = new App.Entities.FieldCollection(config,{rootModel:@rootModel})

      view = @getFieldsView(@fieldCollection)

      formView = App.request "form:wrapper", view, @formConfig()

      @listenTo formView.model, "created", =>
        @activeView.trigger "entry:set:created",  @rootModel
        view.trigger("dialog:close")


      @listenTo formView.model, "updated", =>
        #NOTE: To make the title in entry_set_section change
        @model.set("name",@rootModel.get("name"))
        @model.trigger "edit:complete"
        view.trigger("dialog:close")

      
      App.dialogRegion.show formView

    getFieldsView: (collection) =>
      new App.Components.Form.FieldCollectionView 
        collection: collection
        model: @rootModel

    getFormConfig:()->
      EditCreate.FormConfig

    getResponse:()->
      response =
        name: null
        description: null
        editable: true
        

