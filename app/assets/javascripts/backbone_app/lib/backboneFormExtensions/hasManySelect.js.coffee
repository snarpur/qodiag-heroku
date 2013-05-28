App.FormEditors ||= {}

App.FormEditors.HasManySelect = Backbone.Form.editors.Base.extend({

  tagName: "div"
  extensionType: "HasManySelect"
  
  events:
    change: ->
      
      # The 'change' event should be triggered whenever something happens
      # that affects the result of `this.getValue()`.
      @trigger "change", this

    focus: ->
      
      # The 'focus' event should be triggered whenever an input within
      # this editor becomes the `document.activeElement`.
      @trigger "focus", this

    
    # This call automatically sets `this.hasFocus` to `true`.
    blur: ->
      
      # The 'blur' event should be triggered whenever an input within
      # this editor stops being the `document.activeElement`.
      @trigger "blur", this

  
  # This call automatically sets `this.hasFocus` to `false`.
  initialize: (options) ->
    # Call parent constructor
    Backbone.Form.editors.Base::initialize.call this, options
    # Custom setup code.
    if @schema?.schema?
      _.each(@schema.schema,((v,k)->
        field = @form.fields[k] = @form.createField(k,v)
        fieldEl = field.render().el;
        @.$el.append(fieldEl)
      ),@)

  render: ->
    @setValue @value
    this

  getValue: ->
    @$el.val()

  setValue: (value) ->
    @$el.val value

  focus: ->
    return  if @hasFocus
    
    # This method call should result in an input within this edior
    # becoming the `document.activeElement`.
    # This, in turn, should result in this editor's `focus` event
    # being triggered, setting `this.hasFocus` to `true`. 
    # See above for more detail.
    @$el.focus()

  blur: ->
    return  unless @hasFocus
    @$el.blur()

})

App.FormEditors.NestedCollection = Backbone.Form.editors.NestedModel.extend({

  tagName: "div"
  extensionType: "NestedCollection"
  
  events:
    change: ->
      
      # The 'change' event should be triggered whenever something happens
      # that affects the result of `this.getValue()`.
      @trigger "change", this

    focus: ->
      
      # The 'focus' event should be triggered whenever an input within
      # this editor becomes the `document.activeElement`.
      @trigger "focus", this

    
    # This call automatically sets `this.hasFocus` to `true`.
    blur: ->
      
      # The 'blur' event should be triggered whenever an input within
      # this editor stops being the `document.activeElement`.
      @trigger "blur", this

  
  # This call automatically sets `this.hasFocus` to `false`.
  initialize: (options) ->

    # Call parent constructor
    Backbone.Form.editors.NestedModel.prototype.initialize.call(this, options)
    @.schema.title = ""
    if (!options.schema.model)
      throw 'Missing required "schema.model" option for NestedModel editor'
    

  render: ->
    data = @value or {}
    key = @key
    nestedModel = @schema.model
    #Wrap the data in a model if it isn't already a model instance
    modelInstance = (if (data.constructor is nestedModel) then data else new (@._findNestedModel(nestedModel))(data))
    @._renderModelOrCollection(modelInstance)
    @trigger("blur", @)  if @hasFocus
    @

  validate:->
    if _.isArray(@.form)
      errors =  _.compact(_.map(@.form,(i)-> i.validate()))
      errors = if _.isEmpty(errors) then null else errors

  _renderModelOrCollection: (modelInstance) ->
    form
    if modelInstance instanceof Backbone.Collection
      form = []
      _.each(modelInstance.models,((i) ->
        i.set("schema",modelInstance.schema)
        form.push @._renderNestedForm(i)
      ),@)
    else
      form = @._renderNestedForm(modelInstance)
  
    @form = form
    form = (if _.isArray(form) then form else [form])
    @._observeFormEvents()
    _.each(form, ((i) ->
      @$el.append i.render().el
    ),@)

  _renderNestedForm: (modelInstance) ->
    form = new Backbone.Form(
      model: modelInstance
      idPrefix: @id + "_" + modelInstance.cid + "_"
      fieldTemplate: "nestedField"
    )

    form

  _findNestedModel: (value) ->
    (if _.isString(value) then @._stringToFunction(value) else value)

  
  _stringToFunction: (str) ->
    arr = str.split(".")
    fn = (window or this)
    i = 0
    len = arr.length

    while i < len
      fn = fn[arr[i]]
      i++
    throw "Schema Model not found"  if typeof fn isnt "function"
    fn


  _observeFormEvents: ->
    if _.isArray(@form)
      _.each(@form, ((i) ->
        i.on("all",(()->
          args = _.toArray(arguments)
          args[1] = this
          @trigger.apply(this, args)
        ), @)
      ), @)
    else
      @form.on("all", (()->
        args = _.toArray(arguments)
        args[1] = this
        @trigger.apply this, args
      ),@)

  getValue: ->
    if @.value instanceof Backbone.Collection
      @.value
    else if  @.form? 
      @.form.getValue()
    else
      @.value


  # setValue: (value) ->
  #   @$el.val value

  focus: ->
    return  if @hasFocus
    
    # This method call should result in an input within this edior
    # becoming the `document.activeElement`.
    # This, in turn, should result in this editor's `focus` event
    # being triggered, setting `this.hasFocus` to `true`. 
    # See above for more detail.
    @$el.focus()

  blur: ->
    return  unless @hasFocus
    @$el.blur()

})