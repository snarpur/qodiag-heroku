class App.Models.PreRegistrationForm extends Backbone.Model

  initialize:=>
    @.schema = @.get("schema")
    @.url = ()->
      @.get('url') 
    @
  
  getFormRootObject:=>
    model = @
    root = {}
    _.each(@.schema,(v,k)->
        schema = $.extend(true,{},{schema: model.schema[k].schema})
        attributes = $.extend(true,model.get("person"),schema)
        root = {}
        root[k] = new v.model(attributes)
      )  
    root
  
  formAttributes:=>
    attributes = {content:{}}
    root = @getFormRootObject()
    model = @
    _.each(root, (v,k) ->
      attributes.content[k] = $.extend(true, {}, v.toJSON())
    )
    attributes
  
   



