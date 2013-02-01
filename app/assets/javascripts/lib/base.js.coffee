class App.Models.Base extends Backbone.Model

  initialize:=>
    @.schema = @setSchema()
    @initializeNestedModels()
    @

  setSchema:=>
    
    if @.schema?
      @.schema
    else if @.get('schema')?
      @.get('schema')      
    else if !@.get('schema')? and @?.collection?.schema?
      $.extend(true,{},@.collection.schema)
    


  fieldTemplate:(schemaType)->
    str = "#{schemaType[0].toLowerCase()}#{schemaType.substr(1)}"
    if App.Templates.Forms[str]? then str else false

  fieldTitle:(field)->
    return "" if @.schema[field]?.type == "Hidden" or @.schema[field] == "Hidden" 
    if _.isObject(@get(field)) then @nestedFieldTitle(field) else @i18nTitle("#{@.get('object_class')}.#{field}")

  nestedFieldTitle:(field)->
    title = @.schema[field].title
    return "" unless title?
    _.capitalize(@i18nTitle("forms.#{title}"))

  i18nTitle:(str)->
    I18n.t(str,{defaultValue: str})

  initializeNestedModels:=>
    model = @
    _.each(@getNestedModelNames(), (i)->
      nestedModel = model.getModelFromString(i.modelStr)
      schema = model.schema[i.name]
      schema.modelStr = i.modelStr
      schema.model = nestedModel
      nestedSchema = schema.schema
      nestedAttributes = model.get(i.name)
      unless nestedAttributes instanceof Backbone.Model or nestedAttributes instanceof Backbone.Collection
        if _.isArray(nestedAttributes) 
          collection = new nestedModel(nestedAttributes,{schema:nestedSchema,formRenderModel: model.getFormRenderModel()})
          model.set(i.name, collection)
        else
          model.set(i.name, new nestedModel(_.extend(nestedAttributes,{schema:nestedSchema,formRenderModel: model.getFormRenderModel()}))) 
    )

  getModelFromString:(item)=>
    _.reduce(_.rest(item.split(".")),((mem,val) -> mem[val] ),App)

  getOrCreateNestedModel:(modelName)=>
    nestedModel = @.get(modelName)
    unless nestedModel instanceof Backbone.Model or nestedModel instanceof Backbone.Collection
      console.error @.schema, modelName
      console.error "CREATING NEW MODEL::",@.schema[modelName].model ," #{modelName}  :with attributes: ",@.get(modelName)
    else
      nestedModel
  
  getFormRenderModel:=>
    if @.get('formRenderModel')? then @.get('formRenderModel') else @.collection.getFormRenderModel()
  
  getSchemaFields:=>
    _.keys(@.schema)
  
  getNonSchemaFields:=>
    _.difference(_.keys(@.attributes),@getSchemaFields())

  getNestedModelNames:=>
    base = @
    _.chain(@.schema)
      .map((v,k) ->
        if v?.type == "NestedModel" || v?.type == "NestedCollection"
          associationType =  if v?.type == "NestedCollection"  then 'collection' else 'model'
          modelStr = if _.has(v,'modelStr') then v.modelStr else v[associationType]
          {name: k, modelStr: modelStr}
      )
      .compact()
      .flatten()
      .value()

  getNestedFields:=>
    _.chain(@.schema)
      .map(((v,k) ->
        k if v?.type == "NestedModel" or v?.type == "NestedCollection"
      ),@)
      .compact().flatten().value()

  bindToForm:(form)=>
    model = @
    _.each(form.fields,((v,k)->
      if v.schema?.type?.match(/Nested(Model|Collection)/)
        if _.isArray(v.editor.form)
          _.each(v.editor.form,(i)-> i.model.bindToForm(i))
        else
          v.editor.form.model.bindToForm(v.editor.form)
      else
        v.editor.model = @
        v.editor.on("change",(form,editor)->
          model.set(v.editor.key,v.editor.getValue())
        )
    ),@)
    @.set("form", form)

  jsonWithNestedSuffix:(json)=>
    nestedFields = @getNestedFields()
    _.each(nestedFields,((i)->
      nestedModel = @getOrCreateNestedModel(i)
      if nestedModel instanceof Backbone.Collection
        nestedJson = nestedModel.toJSON() 
      else
        nestedJson = nestedModel.toJSON()
      unless _.isEmpty(nestedJson)
        json["#{i}_attributes"] = nestedJson
        delete json["#{i}"]
    ),@)
    json
  
  removeNonSchemaFields:(json)=>
    _.each(@getNonSchemaFields(),((i)->
      delete json["#{i}"]
    ),@)
    json
  
  toJSON:=>
    json = $.extend(true,{},@.attributes)
    json = @removeNonSchemaFields(json)
    @jsonWithNestedSuffix(json)

class App.Collections.Base extends Backbone.Collection
  
  model: App.Models.Base

  initialize:(models,options)=>
    @formRenderModel= options.formRenderModel if options?.formRenderModel?
    @.schema = options.schema if options?.schema?
    @

  getFormRenderModel:=>
    @formRenderModel
      

