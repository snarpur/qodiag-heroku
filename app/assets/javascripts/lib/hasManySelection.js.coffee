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

