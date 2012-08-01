class App.Models.LineChart extends Backbone.Model
  
  initialize:()->
    @.urlRoot = "/people/:subject_id/responder_items/responses/"

    @.url = ()->
      base = @.urlRoot.replace(/:subject_id/, @.get('subject_id'))
      "#{base}#{'' if _.endsWith(base,'/')}#{encodeURIComponent(@.id)}"
    
    @.bind("change:charts",@setContainerName)


    
  
  setContainerName:=>
    if @.get("charts")?
      _.each(@.get("charts"), (c) ->
        c.chart.renderTo = "line-#{c.chart.renderTo}"
      )
        
 
