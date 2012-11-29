class App.Models.FormRootObject extends App.Models.Base

  initialize:=>
    super
    @.on("change:formHandler",@setFormHandler)
    @.on("change:url",@setUrl)
    @
  
  setFormHandler:(self,handler)=>
    if handler?
      handler.on("submitForm",@submitForm)

  setUrl:(self,url)=>
    @.url = ()->
      url
  
  getFormRootObject:=>
    model = @
    root = {}
    _.each(@.schema,(v,k)->
        schema = $.extend(true,{},{schema: model.schema[k].schema})
        attributes = $.extend(true,model.get(k),schema)
        root = {}
        root[k] = new v.model(attributes)
      )  
    root
  
  formAttributes:=>
    attributes = {content:{}}
    root = @getFormRootObject()
    model = @
    _.each(root,(v,k) ->
      attributes.content[k] = $.extend(true, {}, v.toJSON())
    )
    attributes

  submitForm:(url)=>
    attrs = @formAttributes()
    @.get('formHandler').off()
    @.clear()
    @.set("url",url)
    @.trigger("readyToSave",attrs)


  
   



