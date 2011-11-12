class App.Models.Timeline extends Backbone.Model
  
  initialize:->
    console.log @
    years = {years: [@.get("starts")..@.get("ends")]}
    @.set(years)

  
  setOpenLine:(line)=>
    @.set(openLine: line)
  
  getOpenLine:=>
    @.get('openLine')
  
  hasOpenLine:=>
    @getOpenLine()?
  
  step:(steps) =>
    movement = @.get("month_width") * steps
    position = @.get("current_position") + movement
    @changePosition(position)

  endPosition: =>
    @.get("canvas_width") - @.get('history_width')

  changePosition:(position)=>
    gutter = @.get("gutter_width")
    end = @endPosition()
    position = gutter if position > gutter
    position = end if position < end
    @.set(current_position: position)
  
  goToDate:=> 
    position = @monthPixelsFromStart(@centeredDatePosition())
    @changePosition(-position)

  centeredDatePosition:=>
    @.get('current_date').moveToFirstDayOfMonth().add(-7).month()

  monthsFromStart:(date)=>
    starts = new XDate("#{@.get("starts")}")
    Math.floor(starts.diffMonths(date))
     
  monthPixelsFromStart:(date)=>
    @monthsFromStart(date) * @.get('month_width')
  
  dayPixelsFromMonthStart:(date)=>
    daysInMonth = XDate.getDaysInMonth(date.getFullYear(), date.getMonth())
    (@.get('month_width') / daysInMonth) * (date.getDate() - 1) 

  positionOnLine:(date)=>
    date = new XDate(date.toString())
    @monthPixelsFromStart(date) + @dayPixelsFromMonthStart(date)

  getSurveyAccessCode:(id)=>
    _.find(@.get('surveys'), (o) -> o.id is +id)?.access_code







