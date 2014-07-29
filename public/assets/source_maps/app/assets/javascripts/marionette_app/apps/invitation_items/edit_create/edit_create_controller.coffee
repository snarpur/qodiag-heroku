@Qapp.module "InvitationItemsApp.EditCreate", (EditCreate, App, Backbone, Marionette, $, _) ->

  class EditCreate.Controller extends App.Controllers.Base

    initialize:()->
      App.contentRegion.show @getLayout()
      @curentUser = App.request "get:current:user"

    create:(options={})->
      {@type,@step,@id} = options
      @steps = App.request "set:invitation:steps", options
      #When we are creating a invitation item, we go always to the first step
      @step = 1
      @showFormSteps(@steps,options)

    edit:(options={})->
      {@type,@step,@id} = options
      @steps = App.request "set:invitation:steps", options
      @step = @steps.currentStep
      responderItem = App.request "get:responder:item",{id: @id, step_no: @step, type: @type}
      App.execute "when:fetched", responderItem,=>
        if not responderItem.id?
          @step = 1
          @steps.setCurrentStep(@step)
          @steps.trigger("change:current:step")

        @id = responderItem.get("id")
        @rootModel = new App.Entities.FormInvitationItemModel(responderItem.attributes)
        @showFormSteps(@steps,options)

    showFormSteps:(options)->
      stepsView = @getFormStepsView(@steps)

      if @step?
        App.navigate(@invitationUrl(@step),{replace: true})
        @steps.setCurrentStep(@step)
           
      @getLayout().formStepsRegion.show stepsView
      @showForm()

    showForm:()->
      if not @id?
        response = @getResponse()
        @rootModel = new App.Entities.FormInvitationItemModel(response)

      config = @getFormConfig()
      @controllerModel = new App.Entities.Model()
      @fieldCollection = new App.Entities.FieldCollection(config,{rootModel:@rootModel,controllerModel:@controllerModel})
      @getChildren() if @step is 2 and @type is "guardian"  

      view = @getFieldsView(@fieldCollection)

      @formView = App.request "form:wrapper", view, @buttonsConfig()

      @listenTo @controllerModel, "change:children",(model,value,options) => 
        if value isnt ""
          @rootModel.get("subject").set("full_cpr",value)

      @listenTo @formView, "form:back", =>
        @moveToPreviousStep()
      
      @listenTo @formView, "form:saveAndContinue form:save", =>
        @formView.trigger('form:submit',{collection:false})
      
      @listenTo @formView, "before:form:submit", =>
        @saveFormData()

      @getLayout().mainRegion.show @formView

    getChildren:()->
      if @rootModel.get("respondent")?.get("full_cpr")? and @rootModel.get("respondent").get("full_cpr").length is 10
        children_data = App.request "get:national_register:family",@rootModel.get("respondent").get("full_cpr")
        App.execute "when:fetched", children_data, =>
          if not children_data.isEmpty()
            @controllerModel.set("_children_options",children_data)
      else
        @controllerModel.set("_children_options",[])

      
    invitationUrl:(step)->
      if @id?
        "invitation_items/#{@id}/invite/#{@type}/step/#{step}"
      else
        "invitation_items/invite/#{@type}/step/#{step}"

    saveFormData:()->
      @listenToOnce @rootModel, 'created updated', (options) =>
        toastr.success(I18n.t("activerecord.sucess.messages.saved",model: ""))
        if @steps.isCurrentLast()
          window.location.href = "/users"
        else
          @step = @steps.getNextStep()
          @changeStep()

            
    changeStep:()-> 
      @steps.setCurrentStep(@step)
      @steps.trigger("change:current:step")     
      responderItem = App.request "get:responder:item",{id: @rootModel.get('id'), step_no: @step, type: @type}
      App.execute "when:fetched", responderItem,=>
        @id = responderItem.get("id")
        @rootModel = new App.Entities.FormInvitationItemModel(responderItem.attributes)
        App.navigate(@invitationUrl(@step),{replace: true})
        @showForm()
     
    moveToPreviousStep:()->
      @step = @steps.getPreviousStep()
      @changeStep()


    buttonsConfig:->
      #If we are in the the last step, we should show Save and Finish button, otherwise, only Save button
      options =
        formClass: "form-horizontal"
        errors: false
        buttons:
          primary: false
          save: false
          cancel: false

      if @steps.isCurrentLast()
        if @type is "guardian"
          _.extend options.buttons, 
            primary:false,
            save: {text: I18n.t("actions.save"), buttonType: 'save', order: 2,  className: 'btn btn-success'}  
            back: {text: "<< " + I18n.t("terms.go_back"), buttonType: 'back', className: "btn btn-info", order: 1}
        else
          _.extend options.buttons, primary:false,
            save: {text: I18n.t("actions.save"), buttonType: 'save', order: 2,  className: 'btn btn-success'}  
            back: false
      else
        if @type is "guardian"
          _.extend options.buttons, 
            primary: {text: I18n.t("actions.save_and_continue",model: "") + " >>", className: 'btn btn-info', buttonType: 'saveAndContinue', order: 3}
     
      options

    getFieldsView: (collection) =>
      new App.Components.Form.FieldCollectionView 
        collection: collection
        model: @rootModel

    getFormConfig:()->
      EditCreate.FormConfig[@type]["step_#{@step}"]

    getResponse:()->
      if @type is "subject"
        response =
          deadline: null
          registration_identifier: "subject_registration"
          subject:
            firstname: null
            address:
              street_1: null
            user:
              email: null
              invitation: true
            inverse_relationships: [{name:"patient", person_id: @curentUser.get("person_id")}]
      else
        response =
          deadline: null
          registration_identifier: "respondent_registration"
          respondent:
            firstname: null
            address:
              street_1: null
            user:
              email: null
              invitation: true
           
    getFormStepsView:(steps)->
      new EditCreate.FormSteps collection: @steps

    getFormStepsRegion:->
      @getLayout().formStepsRegion

    getLayout:()->
      @layout ?= new EditCreate.Layout
