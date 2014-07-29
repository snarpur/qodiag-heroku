# @Qapp.module "Entities", (Entities, App, Backbone, Marionette, $, _) ->

#   class Entities.Chart extends Entities.Model

#     initialize:->
#       @url = ()->
#         base = "#{@.urlRoot}/#{@get('id')}/column"
#       super

#   class Entities.ColumnChart extends Entities.Model
#     urlRoot: "/responder_items/responses"
    
#     initialize:->

#       @url = ()->
#         base = "#{@.urlRoot}/#{@get('id')}/column"
#       super


#     chartWidth:->
#       (@get('size') / @collection.totalSize())
    

#     # drillDownSetup:->
#     #   if @.get('questionListDrilldown')
#     #     drilldown = new App.Views.Drilldown({chart: @})
   


#   class Entities.ColumnCharts extends Backbone.Collection
#     model: Entities.ColumnChart
    
    

#     initialize:(models,options)->
#       @options = options
#       @setCurrentMetric(options.currentMetric)


#       @url = ->
#         url = "/responder_items/responses/:id/column"
#         url = url.replace(/\:id/,@responderItemId())
#         if not _.isEmpty(@currentMetric)
#           if not _.isEmpty(@normReferenceId)
#             url = "#{url}/norm_reference/#{@normReferenceId}/#{@currentMetric}"
#           else
#             url = "#{url}/#{@currentMetric}"
#         else
#           if not _.isEmpty(@normReferenceId)
#             url = "#{url}/norm_reference/#{@normReferenceId}"
#         url

#     parse:(response)->
#       _.extend(@options, _.omit(response, "charts"))
#       response.charts
      


#     totalSize:->
#       _.reduce(@pluck("size"),((memo, num)-> memo + num), 0)



#     getChartMenu:->
#       if @chartMenu 
#         @chartMenu 
#       else 
#         @chartMenu = new Backbone.Collection @options.chartMetrics 
      

#     responderItemId:->
#       @options.responderItem.get("id")

    
#     responderItem:->
#       @options.responderItem

    

#     setCurrentMetric:(name)->
#       @currentMetric = name


#   # class Entities.QuestionResponse extends Backbone.Model

#   #   initialize:->
#   #     @.set('surveyAccessCode', @collection.surveyAccessCode())


#   # class Entities.QuestionResponse extends Backbone.Collection
  
#   #   model: App.Models.QuestionResponse
#   #   urlRoot: "/responder_items/responses/:id/question_group/:question_group_name"
  
#   #   initialize:(questionGroupName,chart) ->
#   #     @questionGroupName = questionGroupName
#   #     @responderItem = chart.responderItem()

#   #     @url = ()->
#   #       url = @.urlRoot.replace(/\:id/,@responderItem.get('id'))
#   #       url = url.replace(/\:question_group_name/, @questionGroupName)
  
#   #   surveyAccessCode:=>
#   #     @responderItem.get('access_code')



#   API = 
#     getCharts:(options) =>
#       charts = new Entities.ColumnCharts([],{responderItem: options.item})
#       charts.fetch
#         reset: true
#       charts
  
  
#   App.reqres.setHandler "column:charts", (options) ->
#     API.getCharts(options)

