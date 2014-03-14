@Qapp.module "SandboxApp.EditCreate", (EditCreate, App, Backbone, Marionette, $, _) ->

  class EditCreate.Controller extends App.Controllers.Base

    create:()->
      App.contentRegion.show @getLayout()
      response = @getResponse()
      @rootModel = new App.Entities.FormResponderItemModel(response)
      config = @getFormConfig()
      fieldCollection = new App.Entities.FieldCollection(config,{rootModel:@rootModel})
      view = @getFieldsView(fieldCollection)

      @getLayout().mainRegion.show view

    getFieldsView: (collection) =>
      new App.Components.FormSandbox.FormFieldCollectionView 
        collection: collection

    getFormConfig:()->
      config = [
        {
          fieldType: "hidden"
          fieldName: "id"
          translationKey: ""
        },
        {
          fieldType: "text"
          fieldName: "deadline"
          translationKey: "responder_item.deadline"

        },
        {
          fieldType: "hidden"
          fieldName: "id"
          translationKey: ""
          formModel: "subject"
        },
        {
          fieldType: "text"
          fieldName: "first_name"
          translationKey: "person.firstname"
          formModel: "subject"
        },
        {
          fieldType: "text"
          fieldName: "last_name"
          translationKey: "person.lastname"
          formModel: "subject"
        }
      ]

    getResponse:()->
      response =
        id: null
        deadline: null
        subject:
          id: null
          first_name: "Gulli"
          last_name: "Gunnarson"

    getLayout:()->
      @layout ?= new EditCreate.Layout