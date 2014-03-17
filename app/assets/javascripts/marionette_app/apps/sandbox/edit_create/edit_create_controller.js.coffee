@Qapp.module "SandboxApp.EditCreate", (EditCreate, App, Backbone, Marionette, $, _) ->

  class EditCreate.Controller extends App.Controllers.Base

    create:()->
      App.contentRegion.show @getLayout()
      response = @getResponse()
      @rootModel = new App.Entities.FormResponderItemModel(response)
      config = @getFormConfig()
      fieldCollection = new App.Entities.FieldCollection(config,{rootModel:@rootModel})
      view = @getFieldsView(fieldCollection)

      formView = App.request "form:wrapper", view, @buttonsConfig()

      @listenTo formView, "form:save", => 
        @saveFormData(formView)

      @getLayout().mainRegion.show formView

    saveFormData:(formView)->
      formView.trigger('form:submit')
      @listenToOnce @rootModel, 'created updated', (options)=>
        toastr.success(I18n.t("activerecord.sucess.messages.saved",model: ""))
        # console.log "arguments in model after saved::",arguments
        # console.log "@ in model after saved::",options
        # window.location.href = "/users"
        # return

    buttonsConfig:->

      options =
        formClass: "form-base form-horizontal"
        buttons: 
          # primary: {text: I18n.t("actions.save_and_continue",model: "") + " >>", buttonType: 'saveAndContinue', order: 3} 
          primary: false
          save: {text: I18n.t("actions.save"), buttonType: 'save', order: 1,  className: 'btn btn-success'} 
          cancel: {text: I18n.t("actions.cancel"), buttonType: 'cancel', order: 2,  className: 'btn'} 

      options

    getFieldsView: (collection) =>
      new App.Components.FormSandbox.FormFieldCollectionView 
        collection: collection
        model: @rootModel

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
          first_name: null
          last_name: null
          address:
            street_1: null
            street_2: null
            zip_code: null
            town: null
            phone: null
          user:
            email:null

    getLayout:()->
      @layout ?= new EditCreate.Layout