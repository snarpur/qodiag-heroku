@Qapp.module "Components.Form", (Form, App, Backbone, Marionette, $, _) ->
  
  class Form.FormWrapper extends App.Views.Layout
    getTemplate: () ->
      if @options.config.modal
        "form/modal-form"
      else
        "form/form"

   
    tagName: "form"
    
   
    className: ()->
      @options.config.formClass


    attributes: ->
      "data-type": @getFormDataType()
       
    
    regions:
      formContentRegion: "#form-content-region"
    

    ui:
      buttonContainer: "ul.inline-list"
      submitButton: 'button.ladda-button'    


    events:
      "click button[data-form-button]" : "formButtonClick"
      "click button[data-dismiss]" : "closeButtonClick"
      "keyup" : "keypressed"


    modelEvents:
      # "change:_errors"  : "changeErrors"
      "sync:start"      : "syncStart"
      "sync:stop"       : "syncStop"
    
    
    initialize:(options) ->
      @setInstancePropertiesFor "config", "buttons"
      # @addOpacityWrapper(false)
      super
    

    formButtonClick:(event)->
      target = $(event.currentTarget)
      buttonType = target.attr('data-form-button')
      if buttonType is 'submit' and @isLoadButton(target)
        @setLoader(target)
      @trigger("form:#{buttonType}",{sourceButton: buttonType})

      

    keypressed: (e)->
      #We sunmit the form when we press Enter and the focus is not in a textarea
      if e.which is 13 and e.target.type isnt "textarea"
        #We should maybe include the option collection in the form
        @trigger("form:submit",{collection:false})


    closeButtonClick:->
      @trigger("form:cancel")

    
    setFormContentRegion:(region)->
      @region.formContentRegion = region


    serializeData: ->
      footer: @config.footer
      modal: @config.modal
      title: @config.title or false
      buttons: @buttons?.toJSON() ? false
        
    
    isLoadButton:(button)->
      button.hasClass('ladda-button')

    
    setLoader:(button)->
      unless button.attr('data-loader-initialized')?
        @laddaLoader = Ladda.create(button[0])
        button.attr('data-loader-initialized',true)
      

    buttonPlacement: ->
      @ui.buttonContainer.addClass @buttons.placement
    
    
    focusFirstInput: ->
      @$el.find('input[type=text],textarea,select').filter(':visible:enabled:first').focus()
    

    getFormDataType: ->
      if @model.isNew() then "new" else "edit"
      
    
    syncStart: (model) ->
      if @laddaLoader
        @laddaLoader.start()
    

    syncStop: (model) ->
      if @laddaLoader
        @laddaLoader.stop()

  class Form.FieldView extends App.Views.ItemView

    initialize:(options)->
      @modelIsNew = options.new
      super
    
    getTemplate:()->
      "form/templates/_#{@model.get("fieldType")}_field"

    onRender:->
      if @model.get("_errors")?
        @changeErrors(@model,@model.get("_errors"))

    getLabel: (option=null)->
      if option? and @model.get("labelKey")?
        if _.has(@model.get("labelKey"), "i18nBase")
          I18n.t(@model.get("labelKey").i18nBase+"."+option.get("#{@model.get("labelKey").key}"))
        else
          option.get("#{@model.get("labelKey").key}")
      else  
        label = if option?.get("label")? then option.get("label") else @model.get("fieldLabel")
        if _.has(label, "i18n")
          I18n.t(label.i18n)
        else
          label

    getValue: (option=null)->
      if option?
        if @model.get("valueKey")?
          option.get("#{@model.get("valueKey")}")
        else
          option.get("value")
      else
        if @model.get("valueKey")?
          @model.get("valueKey")
        else
          "value"

    templateHelpers:=>
      isDisabled:=>
        unless @modelIsNew
          if @model.get("disabled") then "disabled='disabled'"

      label:=>
        @getLabel()

      value:()=>
        @getValue()
    

    modelEvents:
      "change:_errors": "changeErrors"
      "change:options": "optionsChanged"




    # Override when it is needed  
    optionsChanged:=>
 
    changeErrors: (model, errors, options) ->
      @removeErrors()
      @addErrors errors
    
    removeErrors: ->
      @$el.removeClass("has-error")
      @$el.find(".help-block").text("")

    addErrors: (errors = {}) ->
      for name, array of errors
        @addError name, array
    
    addError: (name, error) ->
      el = @$el.find("[id='#{name}_error']")
      el.closest(".form-group").addClass("has-error")
      el.text(error)

    onShow:->
      @bindings = {}
      @bindings["##{@model.get("fieldName")}"] = "fieldValue"
      @.stickit()


  class Form.TextFieldView extends Form.FieldView
    className: "form-group"

  class Form.HiddenFieldView extends Form.FieldView

  

  class Form.TextAreaFieldView extends Form.FieldView
    className: "form-group"

  class Form.SelectFieldView extends Form.FieldView
    className: "form-group"

    optionsChanged:=>
      @render()
      @.stickit()

    templateHelpers:=>
      parent = super
      _.extend(parent,
        selectOptions:=>
          @model.get("options").models

        label:(option)=>
          @getLabel(option)

        value:(option)=>
          @getValue(option)
              
      )

  class Form.TitleFieldView extends Form.FieldView
    
  class Form.SeparatorFieldView extends Form.FieldView
    className: "col-lg-12"
    ui: 
      body: ".panel-body"

  class Form.CheckBoxFieldView extends Form.FieldView
    className: "form-group"

    events:
      "change input[type='checkbox']":"checkboxChange"

    getOptions:=>
      if @model.get('conditions')?
        @model.get('options').where(@model.get('conditions'))
      else
        @model.get("options").models

    getValue: (option=null)->
      if @model.get("labelKey")?
        option.get("#{@model.get("labelKey").key}")
      else  
        label = if option?.get("label")? then option.get("label") else @model.get("fieldLabel")
        if _.has(label, "i18n")
          I18n.t(label.i18n)
        else
          label

    checkboxChange:(event)=>
      key = if @model.get("labelKey")? then @model.get("labelKey").key else "label"
      query = {}
      query[key] = event.currentTarget.value
      modelChecked = @model.get("options").findWhere(query)
      if modelChecked?        
        modelChecked.set("_destroy",!event.currentTarget.checked)
        modelChecked.set("_status",event.currentTarget.checked)


    templateHelpers:=>
      parent = super
      _.extend(parent,
        
        checkBoxOptions:=>
          @getOptions()

        isChecked:(option)=>
          if option.get("_status")? and option.get("_status") then "checked='checked'"

        label:(option)=>
          @getLabel(option)

        value:(option)=>
          @getValue(option)


      )


  class Form.RadioFieldView extends Form.SelectFieldView
    className: "form-group"

    onShow:->
      @bindings = {}
      @bindings[".#{@model.get("fieldName")}"] = "fieldValue"
      @.stickit()

  class Form.DateFieldView extends Form.FieldView
    className: "form-group"



    ui:->
      datepick: "##{@model.get("fieldName")}"
       
    onShow:-> 
      @setBindings()
      if @model.get("fieldType") is "date"
        opt =
          language: I18n.locale
          autoclose: true
          forceParse: false
          format: "dd/mm/yy"
          startDate: new Date().addDays(1)
          todayHighlight: true
        
        @ui.datepick.datepicker(opt)
        
      

    setBindings:->
      @bindings = {}
      @bindings["##{@model.get("fieldName")}"] = {
        observe: "fieldValue",
        onGet: (value,options) ->
          unless value?
            moment(value,"YYYY-MM-DDTHH:mmZ").format("DD/MM/YY")
        onSet: (value,options) ->
          moment(value,"DD/MM/YY").format("YY/MM/DD")

      }
      @.stickit()
     
     
  class Form.FieldCollectionView extends App.Views.CollectionView
    getItemView:(field)-> 
      if field?
        if not field.get('fieldClass')?
          fieldType = "#{_.camelize _.capitalize field.get('fieldType')}FieldView"
          Form[fieldType]
        else
          field.get('fieldClass')
      else 
        Form.TextFieldView

    itemViewOptions: ->
      new: @model.isNew()

    appendHtml: (collectionView, itemView, index)->
      type = itemView.model.get("fieldType")
      if type == "separator"
        @lastSeparator = $(itemView.ui.body)
      if type != "separator" and @lastSeparator
        @lastSeparator.append(itemView.el)
      else
        collectionView.$el.append(itemView.el)