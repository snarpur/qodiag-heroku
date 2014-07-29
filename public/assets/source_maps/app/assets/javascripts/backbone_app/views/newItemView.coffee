App.Views.Timeline ||= {}

class App.Views.Timeline.NewItem extends Backbone.View

  className: "line-overlay new-item state-idle"
  events:
    "click .btn-submit": "saveItem"
    "click .btn-cancel": "close"
    "click span.close": "close"

  
  selectedDate: null
  
  initialize:->
    @timeline = @options.timeline
    @createAndListenToNewItem()
    @model.bind("change:newItemOverlayState",@setIdle)
    
  
  template:->
    JST['backbone_app/templates/newItemTmpl']
  
  close:=>
    @model.set(newItemOverlayState: "closed")

  setIdle:=>
    if @model.get("newItemOverlayState") is "closed"
      $(@el).setCssState("idle")
  
  createAndListenToNewItem:->
    @newItem = new App.Models.ResponderItem()
    @listenTo(@newItem,"change:deadline",@renderSelectedAlert)
    @listenTo(@newItem,"change:deadline",@setLineState)

  saveItem:=>
    @$el.setCssState("sending")
    App.Lib.Spinner.spin(@$(".state-msg .m-sending")[0])
    params = 
      subject_id: @timeline.getSubjectId()
      survey_id: @model.get('survey_id')
      respondent_id: @getSelectedRespondent()
    @newItem.set(params)
    @newItem.save(@newItem.attributes, @saveCallbacks())
      
  saveCallbacks:=>
    view = @
    callbacks =
      success: (model,response) ->
        view.model.addItems(model)
        view.createAndListenToNewItem()
        App.Lib.Spinner.stop()
        view.$el.setCssState("success")
      error: (model,xhr) -> 
        $(view.el).setCssState("error")
   
  getSelectedRespondent:=>
    _.first(@timeline.get("subject").get("respondents")).id
      
  
  renderSelectedAlert:(item,date)->
    if _.isString(date) then return
    @$(".state-msg .m-selected").html(JST['backbone_app/templates/newItemMsgTmpl']({date: item.get('deadline')}))


  setLineState:->
    @$el.setCssState("selected")

  setDeadline:->
    view = @
    (txt,d) ->

      view.newItem.set('deadline',$.datepicker.parseDate("dd/mm/yy",txt))
      


  renderCalendar:=>
    options = 
      onSelect: @setDeadline()
      minDate: Date.today()

    @.$('.calendar').datepicker(options)   
  
  render:->
    $(@el).html(@template()(@model.toJSON()))
    @renderCalendar()
    @
