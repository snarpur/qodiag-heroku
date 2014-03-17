@Qapp.module "SandboxApp.EditCreate", (EditCreate, App, Backbone, Marionette, $, _) ->

  class EditCreate.Controller extends App.Controllers.Base

    create:()->
      App.contentRegion.show @getLayout()
      response = @getResponse()
      @rootModel = new App.Entities.FormResponderItemModel(response)
      config = @getFormConfig()
      fieldCollection = new App.Entities.FieldCollection(config,{rootModel:@rootModel})
      view = @getFieldsView(fieldCollection)

      formView = App.request "form:wrapper", @getLayout(), @buttonsConfig()

      @getLayout().mainRegion.show formView
      
      # @getLayout().mainRegion.show view

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
          fieldType: "date"
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
          fieldName: "full_cpr"
          translationKey: "person.full_cpr"
          formModel: "subject"
        },
        {
          fieldType: "text"
          fieldName: "email"
          translationKey: "user.email"
          formModel: "subject.user"
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
        },
        {
          fieldType: "text"
          fieldName: "street_1"
          translationKey: "address.street_1"
          formModel: "subject.address"
        },
        {
          fieldType: "text"
          fieldName: "street_2"
          translationKey: "address.street_2"
          formModel: "subject.address"
        },
        {
          fieldType: "text"
          fieldName: "zip_code"
          translationKey: "address.zip_code"
          formModel: "subject.address"
        },
        {
          fieldType: "text"
          fieldName: "town"
          translationKey: "address.town"
          formModel: "subject.address"
        },
        {
          fieldType: "text"
          fieldName: "zip_code"
          translationKey: "address.phone"
          formModel: "subject.address"
        },
        {
          fieldType: "text"
          fieldName: "zip_code"
          translationKey: "address.home_phone"
          formModel: "subject.address"
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
          address:
            street_1: "Hafnarstræti 101"
            street_2: "2 hæð, B"
            zip_code: "600"
            town: "Akureyri"
            phone: "8520754"
          user:
            email: "email@qodiag.com"

    getLayout:()->
      @layout ?= new EditCreate.Layout