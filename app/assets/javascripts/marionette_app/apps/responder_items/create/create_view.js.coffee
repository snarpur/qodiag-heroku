@Qapp.module "ResponderItemsApp.Create", (Create, App, Backbone, Marionette, $, _) ->
  
  class Create.Layout extends App.Views.Layout
    template: "responder_items/create/templates/create_layout"
    className: 'modal'
    triggers:
      "click .cancel" : "dialog:close"
      "click .save"   : "dialog:save"



    regions:
      itemSelectRegion : '#item-select-region'
      respondentsRegion : '#respondents-region'
      itemControlRegion: '#item-control-region'


  
  

  

  class Create.Respondent extends App.Views.ItemView
    template: "responder_items/create/templates/_respondent"
    tagName: 'option'
  

  class Create.Respondents extends App.Views.CompositeView
    itemView: Create.Respondent
    template: "responder_items/create/templates/respondents"
    itemViewContainer: 'select'
    className: 'control-group'
    
    events:
      "change select" : "triggerSelect"


    triggerSelect:(event)->
      selectedIndex = event.currentTarget.selectedIndex
      selected = if selectedIndex is 0 then {} else @children.findByIndex(selectedIndex-1)
      @trigger "respondent:selected", selected

    ui:
      validationError: "span.help-inline"

     modelEvents:
      "change:_errors":(model,errors)->
        if errors?.respondent_id
          @$el.addClass('error')
          @ui.validationError.html(errors.respondent_id)
        else
          @$el.removeClass('error')
          @ui.validationError.html('')


    appendHtml: (collectionView, itemView, index)->
      collectionView.$('option:last').after(itemView.el)

  


  



  class Create.Item extends App.Views.ItemView
    template: "responder_items/create/templates/_item"
    tagName: 'option'
    

  class Create.Items extends App.Views.CompositeView
    template: "responder_items/create/templates/items"
    itemView: Create.Item
    itemViewContainer: 'select'
    className: 'control-group'
  
    events:
      "change select" : "triggerSelect"
    
    ui:
      validationError: "span.help-inline"

 


    triggerSelect:(event)->
      selectedIndex = event.currentTarget.selectedIndex
      selected = if selectedIndex is 0 then {} else @children.findByIndex(selectedIndex-1)
      @trigger "item:selected", selected
    

    modelEvents:
      "change:_errors":(model,errors)->
        if errors?.entry_set_response
          @$el.addClass('error')
          @ui.validationError.html(errors.entry_set_response)
        else
          @$el.removeClass('error')
          @ui.validationError.html('')



    appendHtml: (collectionView, itemView, index)->
      collectionView.$('option:last').after(itemView.el)
  



  





  class Create.ItemControl extends App.Views.ItemView
    template: "responder_items/create/templates/item_control"
    className: 'control-group'

    ui:
      heading: 'p strong'
      validationError: "span.help-inline"
      datepickerWrapper: "div[data-date-wrapper='true']"

    onRender:->
      _this = @
      @ui.datepickerWrapper.datepicker
        dateFormat: "dd/mm/yy"
        minDate: new Date().addDays(1)
        onSelect:(date,obj)->
          _this.model.set('deadline',date)

    
    modelEvents:
      "change:deadline" : ()->
        @ui.heading.html("Skilast fyrir #{@formatDeadline()}")
        @ui.heading.effect('highlight',2000)
      
      "change:_errors":(model,errors)->
        if errors?.deadline
          @$el.addClass('error')
          @ui.validationError.html(errors.deadline)
        else
          @$el.removeClass('error')
          @ui.validationError.html('')

    
    onClose:->
      @addOpacityWrapper(false)

    

    formatDeadline:->
      moment(@model.get('deadline'),"DD/MM/YYYY").fromNow()
