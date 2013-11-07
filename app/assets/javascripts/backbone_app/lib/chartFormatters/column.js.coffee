class App.Lib.ChartFormatters.Column extends App.Lib.ChartFormatters.Chart
 
  plotOptionsColumnDataLabelsFormatter:()=>
    ()->
      if @point.config.name? and @point.config.name.data_label
        @point.config.name.data_label
      else
        @.y
    # formatters = 
    #   countHighScores:()->
    #     console.log "@",@
    #     if typeof @point.config is "object"
    #       totalHighScores = _.countBy(_.toArray(_.pluck(@point.config.values,'weight')), (num) -> _.contains(options.argument,num)).true
    #       labelText = '<strong>' + @.y + '</strong>'
    #       if totalHighScores > 0
    #         labelText += '<div class="label-high-scores"><strong>' + options.argument.join(I18n.t("terms.y")) + ': </strong>'
    #         labelText += totalHighScores + '/' + @point.config.values.length + '</div>'            
    #     else
    #       @.y          

    #   default:()->
    #     if @point.config.name? and @point.config.name.data_label
    #       @point.config.name.data_label
    #     else
    #       @.y

    # formatters[options.name]
 
  xAxisLabelsFormatter:=>
    accessCode = @chart.accessCode

    standardDeviation = (@chart.chart.type == 'areaspline')
    ()->
      if standardDeviation
        return @.value
      else if _.isNaN(parseInt(@.value))
        str = I18n.t("surveys.#{accessCode}.terms.#{@.value }") 
      else
        str = I18n.t("surveys.#{accessCode}.terms.terms")[parseInt(@.value) - 1] 
      
      str = @.value if _.includes(str,'missing')
      str.replace(/\s/,"\n")
      
      _.capitalize(str)
 
  tooltipFormatter:(options)=>

    formatters = 
      countHighScores:()->
        labelText = ""
        if typeof @points is "object"
          totalHighScores = _.countBy(_.toArray(_.pluck(@points[0].point.values,'weight')), (num) -> _.contains(options.argument,num)).true
          if totalHighScores > 0
            labelText += '<strong>' + options.argument.join(I18n.t("terms.y")) + ': </strong>'
            labelText += totalHighScores + '/' + @points[0].point.values.length
        
        labelText    

      default:()->
       ""

    formatters[options.name]

    # ()->
    #   str = ""
    #   _.each(@.points, (p) ->
    #     str += "<span style=text-align:center;color:#eaeaea;font-size:14px;font-weight:bold;text-decoration:underline;>#{p.series.tooltipOptions.heading}</span>"
    #     str += "<br/>"
    #     str +=  "  <span style=text-align:center;color:#fcf9ae;background-color: #999999;>#{p.series.tooltipOptions.content[p.x]}</span>"
    #     str += "<br/><br/>"
    #   )
    #   str
