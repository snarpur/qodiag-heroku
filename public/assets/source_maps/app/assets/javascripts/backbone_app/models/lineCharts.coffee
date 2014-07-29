class App.Models.LineChart extends Backbone.Model
  
  initialize:()->
    @item = @.get('item')
    @.urlRoot = "/people/:subject_id/responder_items/responses/"

    @.url = ()->
      base = @.urlRoot.replace(/:subject_id/, @item.get('subject_id'))
      "#{base}#{'' if _.endsWith(base,'/')}#{@addParametersToUrl()}"
    
    @.bind("change:charts",@setContainerName)


    
  surveyUrlSegment:=>
    encodeURIComponent(@item.get('survey_id'))

  respondentUrlSegment:=>
    encodeURIComponent(@item.get('respondent_id'))

  addParametersToUrl:=>
    "#{@respondentUrlSegment()}/#{@surveyUrlSegment()}"

  setContainerName:=>
    if @.get("charts")?
      _.each(@.get("charts"), (c) ->
        c.chart.renderTo = "line-#{c.chart.renderTo}"
      )
        
 
