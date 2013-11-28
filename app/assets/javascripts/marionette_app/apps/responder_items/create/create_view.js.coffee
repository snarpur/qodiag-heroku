@Qapp.module "ResponderItemsApp.Create", (Create, App, Backbone, Marionette, $, _) ->
  
  class Create.ResponderItem extends App.Views.ItemView
    template: "responder_items/create/templates/responder_item"

    templateHelpers:=>
      respondents:=>
        @options.respondents

      entrySets:=>
        @options.entrySets

    ui:
      heading: 'label[for="deadline_date"]'
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
        # @ui.heading.html("Skilast fyrir #{@formatDeadline()}")
        @ui.heading.html(I18n.t("views.responder_items.requests.submit", date:@formatDeadline()))
        @ui.heading.effect('highlight',2000)

    formatDeadline:->
      moment(@model.get('deadline'),"DD/MM/YYYY").fromNow()

    events:
      "change select" : "triggerSelect"

    triggerSelect:(event)->
      ident = $(event.target).attr('id')
      value = $(event.target).val()
      nestedKey = $(event.target).attr('data-nested-key')
      value = if nestedKey and !!value then _.object [nestedKey],[value] else value
      @model.set(ident,value)
