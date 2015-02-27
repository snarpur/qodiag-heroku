@Qapp.module "PreRegistrationsApp.EditCreate", (EditCreate, App, Backbone, Marionette, $, _) ->

  class EditCreate.Controller extends App.Controllers.Base

    initialize:()->
      App.contentRegion.show @getLayout()
      @curentUser = App.request "get:current:user"

    edit:(options={})->
      {@step,@id} = options
      responderItem = App.request "get:responder:item:pre:registration",{id: @id, step_no: @step}
      App.execute "when:fetched", responderItem,=>
        @type = responderItem.get("registration_identifier").split("_")[0]
        #NOTE: Change this name to something else more descriptive
        @subtype = responderItem.get("subtype")
        step_options =
          type: @type
          subtype: @subtype


        @steps = App.request "set:pre_registration:steps", step_options


        @rootModel = new App.Entities.FormPreRegistrationModel(responderItem.attributes)

        @showFormSteps()

    showFormSteps:()->
      stepsView = @getFormStepsView(@steps)

      if @step?
        App.navigate(@preRegistrationUrl(@step),{replace: true})
        @steps.setCurrentStep(@step)
           
      @getLayout().formStepsRegion.show stepsView
      @showForm()

    showForm:()->

      config = @getFormConfig()
      @controllerModel = new App.Entities.Model()

      @fieldCollection = new App.Entities.FieldCollection(config,{rootModel:@rootModel,controllerModel:@controllerModel})
     

      view = @getFieldsView(@fieldCollection)

      @formView = App.request "form:wrapper", view, @buttonsConfig()

      @listenTo @formView, "form:back", =>
        @moveToPreviousStep()
      
      @listenTo @formView, "form:saveAndContinue form:save", =>
        @formView.trigger('form:submit',{collection:false})
      
      @listenTo @formView, "before:form:submit", =>
        @saveFormData()

      @getLayout().mainRegion.show @formView

    saveFormData:()->
      @listenToOnce @rootModel, 'created updated', (options) =>
        toastr.success(I18n.t("activerecord.sucess.messages.saved",model: ""))
        if @steps.isCurrentLast()
          App.navigate("items",{trigger: true})
        else
          @step = @steps.getNextStep()
          @changeStep()

    changeStep:()-> 
      @steps.setCurrentStep(@step)
      @steps.trigger("change:current:step")     
      responderItem = App.request "get:responder:item:pre:registration",{id: @id, step_no: @step}
      App.execute "when:fetched", responderItem,=>
        @rootModel = new App.Entities.FormPreRegistrationModel(responderItem.attributes)
        App.navigate(@preRegistrationUrl(@step),{replace: true})
        @showForm()

    moveToPreviousStep:()->
      @step = @steps.getPreviousStep()
      @changeStep()

    buttonsConfig:->
      #If we are in the the last step, we should show Save and Finish button, otherwise, only Save button
      options =
        formClass: "form-base form-horizontal"
        errors: false
        buttons:
          primary: false
          save: false
          cancel: false
      if @type is "subject"
        _.extend options.buttons, primary:false,
            primary: {text: I18n.t("actions.save_and_complete"), buttonType: 'save', order: 2}  
            back: false
      else
        if not @steps.isCurrentFirst()
          _.extend options.buttons, 
            back: {text: "<< " + I18n.t("terms.go_back"), buttonType: 'back', className: "btn", order: 1}

        if @steps.isCurrentLast()
          _.extend options.buttons, 
            primary:{text: I18n.t("actions.save_and_complete"), buttonType: 'save', order: 2}  
        else
          _.extend options.buttons, primary:false,
            primary: {text: I18n.t("actions.save_and_continue",model: "") + " >>", buttonType: 'saveAndContinue', order: 3}
     
      options

    getFieldsView: (collection) =>
      new App.Components.Form.FieldCollectionView 
        collection: collection
        model: @rootModel

    getFormConfig:()->
      #NOTE: Code for FormConfig Preprocessor
      # if @subtype?
      #    App.Components.Form.Builder.buildConfig(EditCreate.FormConfig[@type][@subtype]["step_#{@step}"],@rootModel)
      # else
      #    App.Components.Form.Builder.buildConfig(EditCreate.FormConfig[@type]["step_#{@step}"],@rootModel)

      if @subtype?
         EditCreate.FormConfig[@type][@subtype]["step_#{@step}"]
      else
         EditCreate.FormConfig[@type]["step_#{@step}"]

    preRegistrationUrl:(step)->
      "pre_registrations/#{@id}/step/#{step}"

    getFormStepsView:(steps)->
      new EditCreate.FormSteps collection: steps

    getFormStepsRegion:->
      @getLayout().formStepsRegion

    getLayout:()->
      @layout ?= new EditCreate.Layout
