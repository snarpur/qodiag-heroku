class App.Models.Line extends Backbone.Model

  initialize:->
    @.bind("updateDialog", @setCurrentDialogItem)
    @timeline = @.get('timeline')
 
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
    @.set(items: @.get('items').concat(items), {newItem: items})
    console.log "REMEMBER ADD NEW ITEM TO RESPONDERITE_MCOLLECTION"
    
    
class App.Collections.LineCollection extends Backbone.Collection
  model: App.Models.Line
