class App.Models.FormRootObject extends App.Models.Base

  initialize:=>
    super
    @.on("change:formHandler",@setFormHandler)
    @.on("change:url",@setUrl)
    @
  
  setFormHandler:(self,handler)=>
    if handler?
      $(handler.model.get("form").el).addClass("form-horizontal")
      handler.on("submitForm",@submitForm)

  setUrl:(self,url)=>
    @.url = ()->
      url
  
  getFormRootObjectName:=>
    _.first(_.keys(@.schema))

  getFormRootObject:=>
    model = @
    root = {}
    _.each(@.schema,(v,k)->
        schema = $.extend(true,{},{schema: model.schema[k].schema})
        attributes = $.extend(true,model.get(k),schema)
        root = new v.model(_.extend(attributes,{formRenderModel: model.getFormRenderModel()}))
      )  
    root
  
  formAttributes:=>
    attributes = {form_content:{}}
    root = {} 
    root[@getFormRootObjectName()] =  @getFormRootObject()
    model = @
    _.each(root,(v,k) ->
      attributes.form_content[k] = $.extend(true, {}, v.toJSON())
    )
    attributes

  submitForm:(url)=>
    attrs = @formAttributes()
    @.get('formHandler').off()
    @.clear()
    @.set("url",url)
    @.trigger("readyToSave",attrs)


  
   



