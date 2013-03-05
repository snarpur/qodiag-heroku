class App.Models.Base extends Backbone.Model

  initialize:=>
    @on("change:form", @bindToForm)
    @.schema = @setSchema()
    @initializeNestedModels()
    if @get("urlRoot")?
      @.urlRoot = @get("urlRoot")

    if @get('paramRoot')
      @.paramRoot = @get("paramRoot")
    @

  
  setSchema:=>
    if @.schema?
      @.schema
    else if @.get('schema')?
      @.get('schema')      
    else if !@.get('schema')? and @?.collection?.schema?
      ()->
        schemaFromCollection = @collection.schemaForModel(@)
        if _.isArray(@.get("schema")) and schemaFromCollection?
          @set("schema",schemaFromCollection)
          
        @get("schema")
  
  
  getSchema:=>
    if  _.isFunction(@.schema) then @schema() else @schema

  
  fieldTemplate:(schemaType)->
    str = "#{schemaType[0].toLowerCase()}#{schemaType.substr(1)}"
    if App.Templates.Forms[str]? then str else false

  
  fieldTitle:(field)->
    return "" if @getSchema()[field]?.type == "Hidden" or @getSchema()[field] == "Hidden" 
    root = @.paramRoot || @get("object_class")
    if _.isObject(@get(field)) then @nestedFieldTitle(field) else @i18nTitle("#{root}.#{field}")

  
  nestedFieldTitle:(field)->
    title = @getSchema()[field].title
    return "" unless title?
    _.capitalize(@i18nTitle("forms.#{title}"))

  
  i18nTitle:(str)->
    I18n.t(str,{defaultValue: str})

  
  initializeNestedModels:=>
    model = @
    _.each(@getNestedFields(), (nestedModel)->
      model.set(nestedModel, model.getOrCreateNestedModel(nestedModel),{silent: true})
    )

  
  getModelFromString:(item)=>
    _.reduce(_.rest(item.split(".")),((mem,val) -> mem[val] ),App)

  
  getOrCreateNestedModel:(modelName)->
    nestedModel = @.get(modelName)
    unless @isModelOrCollection(nestedModel)
      type =  @getSchema()[modelName].type.match(/Collection|Model/)[0].toLowerCase()
      modelStr = if _.isString(@getSchema()[modelName][type]) then @getSchema()[modelName][type] else @getSchema()[modelName].modelStr
      @getSchema()[modelName].modelStr = modelStr
      schemaModel = @getModelFromString(modelStr)
      @getSchema()[modelName].model = schemaModel
      nestedSchema = @getSchema()[modelName].schema    
      nestedAttributes = _.extend(@.get(modelName),{schema: nestedSchema})
      if _.isArray(nestedAttributes)
        nestedModel = new schemaModel(nestedAttributes,{schema:nestedSchema})
      else
        nestedModel = new schemaModel(_.extend(nestedAttributes,{schema:nestedSchema}))
    nestedModel
  
  
  isModelOrCollection:(obj)->
    obj instanceof Backbone.Model or obj instanceof Backbone.Collection
  
  
  getSchemaFields:=>
    _.keys(@getSchema())
  
  
  getNonSchemaFields:=>
    _.difference(_.keys(@.attributes),@getSchemaFields())

  
  getNestedModelNames:=>
    base = @
    _.chain(@getSchema())
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
    _.chain(@getSchema())
      .map(((v,k) ->
        k if v?.type == "NestedModel" or v?.type == "NestedCollection"
      ),@)
      .compact().flatten().value()

  
  bindToForm:=>
    _.each(@get('form').fields,((v,k)->
      if v.schema?.type?.match(/Nested(Model|Collection)/)
        if _.isArray(v.editor.form)
          _.each(v.editor.form,(i)-> i.model.set("form",i))
        else
          v.editor.form.model.set("form",v.editor.form)
      else
        @.on("change:#{k}",(model,value,options)->
          if options?.formUpdate == true
            @.get('form').setValue(k,value)
        )
        v.editor.on("change",(form,editor)->
          v.editor.model.set(v.editor.key,v.editor.getValue())
        )
    ),@)


  clearFormAttributes:->
    clearAttrs = _.map(@.get("form").fields,(v,k)-> [k,null])
    @.set(_.object(clearAttrs),{formUpdate: true})


  
  disableFields:->
    @get("form").$("input").attr("disabled","disabled")
    @set("submitDisabled",true)

  
  enableFields:->
    @get("form").$("input").removeAttr("disabled")
    @unset("submitDisabled")


  jsonWithNestedSuffix:(json)=>
    nestedFields = @getNestedFields()
    _.each(nestedFields,((i)->
      nestedModel = @getOrCreateNestedModel(i)
      unless nestedModel.get("submitDisabled")
        nestedJson = nestedModel.toJSON() 
        unless _.isEmpty(nestedJson)
          json["#{i}_attributes"] = nestedJson
          delete json["#{i}"]
      else
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
    @.schema = options.schema if options?.schema?
    @setModelSchema(models)
    @
  

  schemaForModel:(model)=>
    @schema[_.pluck(@models,'cid').indexOf(model.cid)] 


  setModelSchema:(models)=>
    if @.schema
      if _.isArray(@schema)
        _.each(@schema,((item,index)-> models[index].schema = @schema[index]),@)
      else
        _.each(models,((item,index)-> item.schema = @schema ),@)


  toJSON:=>
    _.chain(@.models)
      .map(((i)->i.toJSON()),@)
      .compact()
      .value()
  
      

