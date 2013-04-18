class App.Views.MultistepFormNavigation extends Backbone.View

  tagName: 'ul'
  className: 'wizard-nav'

  template:->
    JST['backbone_app/templates/multistepFormNavigationTmpl']

  attributes: =>
    @setClass()

  setClass:(step_no)->
    "current-step"  if step_no == @model.currentStepNo()
  
  render:=>
    opt = {}
    _.each(@model.get('formMetaData').get('stepNames'),((item,index)->
        opt.stepNo = index+1
        opt.stepName = @model.i18nStepName(item)
        opt.cssClass = @setClass(index+1)
        opt.formModelId = @model.formModelId()
        $(@el).append(@template()(opt))
      ),@)


    @

