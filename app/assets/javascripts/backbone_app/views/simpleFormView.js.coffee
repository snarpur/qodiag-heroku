class App.Views.SimpleForm extends Backbone.Marionette.ItemView
  className: "simple-form editable-item"
  template: "simpleFormTmpl"  

  events:
    "click .btn-submit":"validateForm"
    "click .btn-cancel":"destroyForm"

  onRender:()->
    @form = new Backbone.Form({ model: @model}).render()
    @.$el.prepend(@form.el)
    @form.$el.addClass('form-horizontal')
  
  validateForm:=>
    errors = @form.commit()
    if _.isEmpty(errors)
      @submitForm()
  
  submitForm:=>
    view = @
    callbacks= 
      success:(model,response)->
        view.destroyForm()
      error:(model, xhr)->
        throw I18n.t("marionette.errors.model_not_saved", model: model)
        
    @model.save(@model.attributes,callbacks)

  triggerDestroy:(model,response)=>
    paramRoot = @model.paramRoot
  
  container:=>
    @.$el.parent()

  destroyForm:()=>
    @.trigger("destroy",@)
