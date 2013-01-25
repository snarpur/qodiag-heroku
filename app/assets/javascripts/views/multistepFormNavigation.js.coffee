class App.Views.MultistepFormNavigation extends Backbone.View

  tagName: 'ul'
  className: 'wizard-nav'

  template:->
    JST['templates/multistepFormNavigationTmpl']
  
  attributes: =>
    @setClass()

  setClass:(step_no)->
    "current-step"  if step_no == @model.get("current_step_no")
  
  render:=>
    opt= 
      rootObjectId: @model.getFormRootObjectlId()
      lastStepNo: @model.get('last_step_no')
    
    _.each(@model.get('step_names'),((item,index)->
        opt.stepNo = index+1
        opt.stepName = @model.i18nStepName(item)
        opt.cssClass = @setClass(index+1)
        $(@el).append(@template()(opt))
      ),@)


    @

