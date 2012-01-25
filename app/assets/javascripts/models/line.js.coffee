class App.Models.Line extends Backbone.Model

  # urlRoot: "/people/:subject_id/"
  
  initialize:->    
    @.bind("updateDialog", @setCurrentDialogItem)
    @timeline = @.get('timeline')
    @.urlRoot = "/people/:subject_id/responder_items/survey/"
  
  url:()=>
    base = @.urlRoot.replace(/:subject_id/,@subjectId())
    "#{base}#{'' if _.endsWith(base,'/')}#{encodeURIComponent(@.get('survey_id'))}"
  
  subjectId:()=>
    @.get("timeline").get("subject_id")

  itemsCollection:=>
    _.first(@.get('items')).collection
  
  setCurrentDialogItem:(item)=>
    @setPreviousDialogItem(item) 
    @.set(currentDialogItem: item)

  setPreviousDialogItem:=>
    @.set(previousDialogItem: @currentDialogItem()) if @currentDialogItem()?
  
  currentDialogItem:=>
    @.get('currentDialogItem')
  
  previousDialogItem:=>
    @.get('previousDialogItem')
  
  currentDialogView:=>
    @currentDialogItem().get("dialogView")

  previousDialogView:=>
    @previousDialogItem().get("dialogView")
    
  hasDialog:=>
    @.get('currentDialogItem')?
  
  clearDialogItem:=>
    @.set(previousDialogItem: null)
  
  addItems:(items)=>
    @timeline.get("items").add(items,{silent: true})
    
  removeItems:()=>
    @.trigger('remove',@)
    @.collection.remove(@,{silent: true})


class App.Collections.LineCollection extends Backbone.Collection
  model: App.Models.Line
  url: "/people/:subject_id/"

  initialize:(lines, timeline)->
    @.models = lines
    @.timeline = timeline
    console.log "collection arguments  ",arguments


  setSubjectId:(id)=>
    @.subjectId = id

  subjectId:=>
    @.subjectId

  addLine:(params) =>
    params.timeline = @.timeline
    line = new App.Models.Line(params)
    that = @
    line.fetch(
      success:(model,response) ->
        items = new App.Collections.ResponderItemsCollection(response)
        params.items = items
        line = new App.Models.Line(params)
        that.add(line)
      error:(response)->
        console.log("ERROR: in fetching line with id:", params)
    )
