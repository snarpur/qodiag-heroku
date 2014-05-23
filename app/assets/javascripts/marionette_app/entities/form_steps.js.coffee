@Qapp.module "Entities", (Entities, App, Backbone, Marionette, $, _) ->
  
  class Entities.FormStep extends Entities.Model
    
    isCurrentStep:->
      @get('step_num')  == @collection.currentStep


  class Entities.FormSteps extends Entities.Collection
    model: Entities.FormStep
    initialize: (models,options) ->
      if @correctStep(options.step)
        @currentStep = options.step  
      else
        @currentStep = 1
        

    correctStep: (step) ->
      ((/^([0-9])$/.test(step)) and @models.length <= step and step > 0)
    
    setCurrentStep:(step)->
      @currentStep = step

    isCurrentLast: ->
      @currentStep  == @length

    isCurrentFirst: ->
      @currentStep  == 1

    getNextStep: ->
      @currentStep  = @currentStep + 1

    getPreviousStep: ->
      @currentStep  = @currentStep - 1

    isMovingForward:(new_step) ->
      new_step > @currentStep

    isSameStep:(new_step)->
      @currentStep == new_step  
  
  API =
    getSteps: (options) ->
      {type,step} = options
      if type is "guardian"
        models = [
          {
            step_num: 1, 
            step_name: I18n.t("forms.guardian_invitation.steps.guardian_info")
          },
          {
            step_num: 2, 
            step_name: I18n.t("forms.guardian_invitation.steps.patient_info")
          }
        ]
      else
        models = [
          {
            step_num: 1, 
            step_name: I18n.t("forms.guardian_invitation.steps.patient_info")
          }
        ]

      new Entities.FormSteps models,options

    getPreRegistrationSteps: (options) ->
      {type,subtype} = options
      if type is "subject"
        models = [
          {
            step_num: 1, 
            step_name: I18n.t("forms.guardian_invitation.steps.patient_info")
          }
        ]
      else
        # NOTE: Comment for Form Config Preprocessor 
        # if subtype is "parent"
        #   models = [
        #     {
        #       step_num: 1, 
        #       step_name: I18n.t("forms.guardian_invitation.steps.patient_info")
        #     },
        #     {
        #       step_num: 2, 
        #       step_name: I18n.t("forms.guardian_invitation.steps.guardian_info")
        #     },
        #     {
        #       step_num: 3, 
        #       step_name: I18n.t("forms.pre_registration_as_guardian_and_parent.steps.contact_info")
        #     }
        #   ]
        # else
          models = [
            {
              step_num: 1, 
              step_name: I18n.t("forms.guardian_invitation.steps.patient_info")
            },
            {
              step_num: 2, 
              step_name: I18n.t("forms.pre_registration_as_guardian_and_parent.steps.contact_info")
            }
          ]
      

      new Entities.FormSteps models,options


  App.reqres.setHandler "set:invitation:steps", (options) ->
    API.getSteps options

  App.reqres.setHandler "set:pre_registration:steps", (options) ->
    API.getPreRegistrationSteps options
