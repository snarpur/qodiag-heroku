class App.Models.QuestionResponse extends Backbone.Model

  initialize:->
    @.set('surveyAccessCode', @collection.surveyAccessCode())


class App.Collections.QuestionResponse extends Backbone.Collection
  
  model: App.Models.QuestionResponse
  urlRoot: "/responder_items/responses/:id/question_group/:question_group_name"
  
  initialize:(questionGroupName,chart) ->
    @questionGroupName = questionGroupName
    @responderItem = chart.responderItem()

    @url = ()->
      url = @.urlRoot.replace(/\:id/,@responderItem.get('id'))
      url = url.replace(/\:question_group_name/, @questionGroupName)
  
  surveyAccessCode:=>
    @responderItem.get('access_code')

  placement:(size)->
    dimensions = App.Timeline.Dimensions
    margin = (dimensions.line_height_expanded  - size)/2
    if margin > (dimensions.line_height / 2)
      margin
    else
      dimensions.line_height / 2

  tableHeight:(size)->
    dimensions = App.Timeline.Dimensions
    if (size + dimensions.line_height) > dimensions.line_height
      size + dimensions.line_height
