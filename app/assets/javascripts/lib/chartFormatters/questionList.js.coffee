class App.Lib.chartFormatters.questionList extends App.Lib.chartFormatters.column


  xAxisLabelsFormatter:=>
    accessCode = @chart.accessCode
    ()->
      if _.isNaN(parseInt(@.value))
        str = I18n.t("surveys.#{accessCode}.terms.#{@.value}") 
      else
        str = I18n.t("surveys.#{accessCode}.questions")[parseInt(@.value) - 1] 
      str = @.value if _.includes(str,'missing')
      str.replace(/\s/,"\n")
      height = @.chart.plotBox.height / @.axis.categories.length
      css = "'height:#{height}px; line-height:#{height}px;'"
      "<span style=#{css}>#{_.capitalize(str)}</span>"

  yAxisLabelsFormatter:=>
    accessCode = @chart.accessCode
    ()->
      str = I18n.t("surveys.#{accessCode}.answers")[parseInt(@.value)]
      width = @.chart.plotBox.width / @.axis.max
      css = "'widt:#{width}px; margin-left:#{width}px;'"
      "<span style=#{css}>#{_.capitalize(str)}</span>"


  legendLabelFormatter:=>
    accessCode = @chart.accessCode
    () ->
      str = I18n.t("surveys.#{accessCode}.terms.#{@.name}")
      str = @.name if _.includes(str,'missing')
      _.capitalize(str)

