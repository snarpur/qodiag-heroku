class App.Views.SimpleForm extends Backbone.Marionette.ItemView
  className: "simple-form editable-item"
  template: "simpleFormTmpl"  

  events:
    "click .btn-submit":"validateForm"
    "click .btn-cancel":"destroyForm"

  onRender:()->
    @form = new Backbone.Form({ model: @model}).render()
    # @model.set("form",@form)
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
        view.triggerDestroy(model,response)
      error:(model, xhr)->
        throw "could not save model with id : #{view.model.get('id')}"
    
    @model.save(@model.toJSON(),callbacks)

  triggerDestroy:(model,response)=>
    paramRoot = @model.paramRoot
    params = if _.has(response, paramRoot) then response[paramRoot] else response
    @trigger("destroy", @)
  
  container:=>
    @.$el.parent()

  destroyForm:()=>
    @.trigger("destroy",@)
