class App.Models.Timeline extends Backbone.Model

  initialize:(model) ->
    @model = model
    @history = $("#tml-history")
    @.bind("change:current_position", @move)

  step:(steps) =>
    movement = @.get("month_width") * steps
    position = @.get("current_position") + movement
    setCanvasEndPosition:(position)
    @changePosition(position)


  setCanvasEndPosition:(position) ->
      @.set(canvas_end_position: @.get("canvas_width") - position)

  changePosition:(position)->
    gutter = @.get("gutter_width")
    end = @.get("end_position")
    position = gutter if position > gutter
    position = end if position < end
    @.set(current_position: position)


  move:()->
    @history.animate(left: @.get("current_position"), 500)



