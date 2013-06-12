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


  class Create.Respondents extends App.Views.CollectionView
    itemView: Create.Respondent

    events:
      'change input[type=radio]': (e)-> @trigger("respondent:selected", e.target.defaultValue)

  class Create.Item extends App.Views.ItemView
    template: "responder_items/create/templates/_item"


  class Create.Items extends App.Views.CollectionView
    itemView: Create.Item

    events:
      'change input[type=radio]': (e)-> @trigger("entry:set:selected", e.target.defaultValue)


  class Create.ItemControl extends App.Views.ItemView
    template: "responder_items/create/templates/item_control"

    ui:
      heading: 'h4'

    onRender:->
      _this = @
      @$el.datepicker
        dateFormat: "dd/mm/yy"
        onSelect:(date,obj)->
          _this.model.set('deadline',date)

    modelEvents:
      "change:deadline" : ()->
        @ui.heading.html("skilast fyrir #{@formatDeadline()}")
        @ui.heading.effect('highlight')


    formatDeadline:->
      moment(@model.get('deadline'),"DD/MM/YYYY").fromNow()
