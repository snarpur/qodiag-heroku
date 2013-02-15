class App.Views.QuestionResponseItem extends Backbone.Marionette.ItemView
    template: 'templates/questionResponseItemTmpl'
    tagName: 'tr'

    className:=>
      "answer-level-#{@model.get('answer')}"

class App.Views.QuestionResponseList extends Backbone.Marionette.CollectionView
  template: 'templates/questionResponseListTmpl'
  itemView: App.Views.QuestionResponseItem
  tagName: 'table'
  className: 'question-list'


  initialize:->
    params=
      questionGroupName: @collection.questionGroupName
      surveyAccessCode: @collection.surveyAccessCode()
    @$el.html(Backbone.Marionette.Renderer.render(@template,params))

  adjustTable:->
    @marginTop()
    App.Event.trigger("chartHeight",@collection.tableHeight(@.$el.height()))

  marginTop:->
    margin = @collection.placement(@.$el.height())
    @.$el.css('marginTop',"#{margin}px")

  appendHtml:(collectionView, itemView)->
    collectionView.$("tbody").append(itemView.el);