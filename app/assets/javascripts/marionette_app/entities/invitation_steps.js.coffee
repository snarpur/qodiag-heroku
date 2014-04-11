@Qapp.module "Entities", (Entities, App, Backbone, Marionette, $, _) ->
  
  class Entities.InvitationItem extends Entities.Model
    
    isCurrentStep:->
      @get('step_num')  == @collection.currentStep


  class Entities.InvitationItemsCollection extends Entities.Collection
    model: Entities.InvitationItem
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

      new Entities.InvitationItemsCollection models,options


  App.reqres.setHandler "set:invitation:steps", (options) ->
    API.getSteps options
