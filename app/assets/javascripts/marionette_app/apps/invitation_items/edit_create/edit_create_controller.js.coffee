@Qapp.module "InvitationItemsApp.EditCreate", (EditCreate, App, Backbone, Marionette, $, _) ->
  
  class EditCreate.Controller extends App.Controllers.Base
    
    initialize: () ->
      App.contentRegion.show @getLayout()
      @curentUser = App.request "get:current:user"
            
    create: (options) ->
      {@type,@step} = options

      params = @buildParams() 
      @responderItem = new App.Entities.ResponderItem(params)
      @steps = App.request "set:invitation:steps", options
      @showFormSteps(@steps,options)

    showFormSteps:(options)->
      view = @getFormStepsView(@steps)

      if @step?
        App.navigate(@invitationUrl(@step),{replace: true})

      @listenTo view, "childview:change:current:step", (options) =>          
        @steps.setCurrentStep(options.model.get("step_num"))
        @steps.trigger("change:current:step")
        App.navigate(@invitationUrl(options.model.get("step_num")),{replace: true})
        @step = options.model.get("step_num") 
        @showForm()

      @getFormStepsRegion().show view
      @showForm()

    showForm:()->
      @nested_model = @getNestedModel()
      @getFieldsFormRegion().show @getFormLayout()

      formView = App.request "form:wrapper", @getFormLayout(), @buttonsConfig()

      @getFormWrapperRegion().show formView

      # Subject or Respondent Fields
      subjectGuardianView = @getSubjectGuardianView()
      @getSubjectGuardianFieldsRegion().show subjectGuardianView

      @listenTo subjectGuardianView.model, "change:full_cpr", (model) => 
        unless model.get("full_cpr").length != 10
          data = App.request "get:national_register:data", model.get("full_cpr")

          App.execute "when:fetched", data, =>
            @mergeNationalRegisterData(subjectGuardianView.model,data)

      if @type is "subject" or (@type is "guardian" and @step is 1)

        #Responder Items Fields
        responderItemView = @getResponderItemView()
        @getResponderItemsFieldsRegion().show responderItemView
 
        #User Fields
        userView = @getUserView()
        @getUserFieldsRegion().show userView

        #Address Fields
        addressView = @getAddressView()
        @getAddressFieldsRegion().show addressView

      else

        if @responderItem.get("respondent")?.get("full_cpr")?
          @children_data = App.request "get:national_register:family",@responderItem.get("respondent").get("full_cpr")
          App.execute "when:fetched", @children_data, =>
            #Children's respondent Fields
            childrenSelectItemView = @getChildrenSelectItemView(@children_data)
            @getResponderItemsFieldsRegion().show childrenSelectItemView

            @listenTo childrenSelectItemView, "change:select:children", (full_cpr) =>
              data = App.request "get:national_register:data", full_cpr
              App.execute "when:fetched", data, =>
                @mergeNationalRegisterData(subjectGuardianView.model,data)
        else
          #Children's respondent Fields
          childrenSelectItemView = @getChildrenSelectItemView()
          @getResponderItemsFieldsRegion().show childrenSelectItemView

        #Guardian is Parent Check Field
        GuardianParentCheckItemView = @getGuardianParentCheck()
        @getAddressFieldsRegion().show GuardianParentCheckItemView


      @listenTo formView, "form:save", =>
        @saveFormData(formView)
      
      @listenTo formView, "form:back", =>
        @moveToPreviousStep(formView)
      
      @listenTo formView, "form:saveAndContinue", =>
        @moveToNextStep(formView)
      
    saveFormData:(formView)->

      formView.trigger('form:submit')
      @listenToOnce @responderItem, 'created updated', (options)=>
        toastr.success(I18n.t("activerecord.sucess.messages.saved",model: ""))
        # console.log "arguments in model after saved::",arguments
        console.log "@ in model after saved::",options
        # window.location.href = "/users"
        # return

    moveToNextStep:(formView)->
      @step = @steps.getNextStep()
      @steps.setCurrentStep(@step)
      @steps.trigger("change:current:step")
      App.navigate(@invitationUrl(@step),{replace: true})
      @showForm()

    moveToPreviousStep:(formView)->
      @step = @steps.getPreviousStep()
      @steps.setCurrentStep(@step)
      @steps.trigger("change:current:step")
      App.navigate(@invitationUrl(@step),{replace: true})
      @showForm()

    mergeNationalRegisterData:(model,data)->
      model.set("firstname",data.get("firstname"))
      model.set("lastname",data.get("lastname"))
      model.set("full_cpr",data.get("full_cpr"))
      model.set("sex",data.get("sex"))
      if model.get("address")?
        model.get("address").set("street_1",data.get("street_1"))
        model.get("address").set("town",data.get("town"))
        model.get("address").set("zip_code",data.get("zip_code"))

  
    invitationUrl:(step)->
      "invitation_items/invite/#{@type}/step/#{step}"

    buttonsConfig:->
      #If we are in the the last step, we should show Save and Finish button, otherwise, only Save button
      options =
        formClass: "form-base form-horizontal"
        buttons:
          # primary: {text: I18n.t("actions.save_and_continue",model: "") + " >>", buttonType: 'saveAndContinue', order: 3}
          # save: {text: I18n.t("actions.save"), buttonType: 'save', order: 2,  className: 'btn btn-success'} 
          primary: false
          save: false
          cancel: false

      if @steps.isCurrentLast()
        if @type is "guardian"
          _.extend options.buttons, 
            primary:false,
            save: {text: I18n.t("actions.save"), buttonType: 'save', order: 2,  className: 'btn btn-success'}  
            back: {text: "<< " + I18n.t("terms.go_back"), buttonType: 'back', className: "btn", order: 1}
        else
          _.extend options.buttons, primary:false,
            save: {text: I18n.t("actions.save"), buttonType: 'save', order: 2,  className: 'btn btn-success'}  
            back: false
      else
        if @type is "guardian"
          _.extend options.buttons, 
            primary: {text: I18n.t("actions.continue",model: "") + " >>", buttonType: 'saveAndContinue', order: 3}
     
      options

    buildParams:->
      if @type is "guardian"
        params =
          registration_identifier: "respondent_registration",
          respondent:
            firstname: "", 
            address: {street_1: ""}, 
            user: {email: "", invitation: true}, 
            inverse_relationships: [{name:"respondent", person_id: @curentUser.get("person_id")}]
          subject:
            firstname: "", 
            inverse_relationships: [{name:"patient", person_id: @curentUser.get("person_id")}]
        
      else
        params =
          registration_identifier: "subject_registration",
          subject:
            firstname: "", 
            address: {street_1: ""}, 
            user: {email: "", invitation: true}, 
            inverse_relationships: [{name:"patient", person_id: @curentUser.get("person_id")}]

      params

    getNestedModel:->
      if @type is "subject" or (@type is "guardian" and @step is 2)
        @nested_model = "subject"
      else
        @nested_model = "respondent"

      @nested_model

    #Views functions
    getFormStepsView:(steps)->
      new EditCreate.FormSteps collection: @steps

    getResponderItemView:()->
      new EditCreate.FormResponderItem
        model: @responderItem

    getSubjectGuardianView:()->
      new EditCreate.FormSubjectOrGuardian
        model: @responderItem.get(@nested_model)
        
    getChildrenSelectItemView:(data={})->
      new EditCreate.FormChildrenSelect
        children: data
        model: @responderItem

    getUserView:()->
      new EditCreate.FormUser
        model: @responderItem.get(@nested_model).get("user")

    getAddressView:()->
      new EditCreate.FormAddress
        model: @responderItem.get(@nested_model).get("address")

    getGuardianParentCheck:()->
      new EditCreate.FormGuardianParentCheck
        model: @responderItem.get(@nested_model)

    # Region functions
    getFormStepsRegion:->
      @getLayout().formStepsRegion

    getResponderItemsFieldsRegion:->
      @getFormLayout().responderItemsFieldsRegion

    getSubjectGuardianFieldsRegion:->
      @getFormLayout().subjectGuardianFieldsRegion

    getUserFieldsRegion:->
      @getFormLayout().userFieldsRegion

    getAddressFieldsRegion:->
      @getFormLayout().addressFieldsRegion

    getFormWrapperRegion:->
      @getLayout().formWrapperRegion

    getFieldsFormRegion:->
      @getLayout().fieldsFormRegion


    # Layout functions
    getLayout:->
      @layout ?= new EditCreate.Layout

    getFormLayout:->
      @formLayout ?= new EditCreate.FormLayout(model:@responderItem)
