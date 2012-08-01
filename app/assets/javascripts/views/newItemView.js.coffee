App.Views.Timeline ||= {}

class App.Views.Timeline.NewItem extends Backbone.View

  className: "line-overlay new-item state-idle"
  events:
    "click button": "saveItem"
    "click span.close": "close"

  
  selectedDate: null
  
  initialize:->
    @timeline = @options.timeline
    @model.bind("change:newItemOverlayState",@setIdle)
  
  template:->
    JST['templates/newItemTmpl']
  
  close:=>
    @model.set(newItemOverlayState: "closed")

  setIdle:=>
    if @model.get("newItemOverlayState") is "closed"
      $(@el).setCssState("idle")
  
  saveItem:=>
    $(@el).setCssState("sending")
    params = 
      subject_id: @timeline.getSubjectId()
      survey_id: @model.get('survey_id')
      deadline: @.selectedDate.toString()
      respondent_id: @getSelectedRespondent()
    item = new App.Models.ResponderItem
    item.save(params, @saveCallbacks())
      
  saveCallbacks:=>
    that = @
    callbacks =
      success: (model,response) -> 
        that.model.addItems(model)
        $(that.el).setCssState("success")
      error: (model,response) -> 
        $(that.el).setCssState("error")
   
  getSelectedRespondent:=>
    _.first(@timeline.get("subject").get("respondents")).id


  setDate:=>
    that = @
    (txt,d) ->
      $(that.el).setCssState("selected")
      that.selectedDate = $.datepicker.parseDate("dd/mm/yy",txt)
      that.$(".state-msg .m-selected").html(JST['templates/newItemMsgTmpl']({date: that.selectedDate}))
      
  renderCalendar:=>
    options = 
      onSelect: @setDate()
      minDate: Date.today()

    @.$('.calendar').datepicker(options)   
  
  render:->
    $(@el).html(@template()(@model.toJSON()))
    @renderCalendar()
    @
