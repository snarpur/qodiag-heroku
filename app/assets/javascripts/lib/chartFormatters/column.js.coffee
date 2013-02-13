class App.Lib.chartFormatters.column extends App.Lib.chartFormatters.chart
 
  plotOptionsColumnDataLabelsFormatter:()=>
    ()->
      if @point.config.name? and @point.config.name.data_label
        @point.config.name.data_label
      else
        @.y
 
  xAxisLabelsFormatter:=>
    accessCode = @chart.accessCode
    ()->
      if _.isNaN(parseInt(@.value))
        str = I18n.t("surveys.#{accessCode}.terms.#{@.value }") 
      else
        str = I18n.t("surveys.#{accessCode}.terms.terms")[parseInt(@.value) - 1] 
      str = @.value if _.includes(str,'missing')
      str.replace(/\s/,"\n")
      _.capitalize(str)
 
  tooltipFormatter:()=>
    ()->
      str = ""
      _.each(@.points, (p) ->
        str += "<span style=text-align:center;color:#eaeaea;font-size:14px;font-weight:bold;text-decoration:underline;>#{p.series.tooltipOptions.heading}</span>"
        str += "<br/>"
        str +=  "  <span style=text-align:center;color:#fcf9ae;background-color: #999999;>#{p.series.tooltipOptions.content[p.x]}</span>"
        str += "<br/><br/>"
      )
      str
