@Qapp.module "Components.Chart", (Chart, App, Backbone, Marionette, $, _) ->

  Chart.Formatter ||= {}

  class Chart.Formatter.Column extends Chart.Formatter.Base 
    
    plotOptionsColumnDataLabelsFormatter:()=>
      ()->
        if @point.options.name? and @point.options.name.data_label
          @point.options.name.data_label
        else
          @.y
      
    xAxisLabelsFormatter:=>
      accessCode = @chart.accessCode

      standardDeviation = (@chart.chart.type == 'areaspline')
      ()->
        if standardDeviation
          return @.value
        else if _.isNaN(parseInt(@.value))
          str = I18n.t("surveys.#{accessCode}.terms.#{@.value}") 
        else
          str = I18n.t("surveys.#{accessCode}.terms.terms")[parseInt(@.value) - 1] 
        
        str = @.value if _.includes(str,'missing')
        # str.replace(/\s/,"\n")
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
