snarpur["action_items"] =
{
  defaults: {
    //nested context false ::>> form input for item is not nested within the triggers nested context
    nested_context: ".nested-context",
    nested_item: ".nested-item",
    container: "",
    item: "",
    //multiple false allows only one nested item for current association
    //multiple false allows many nested items for current association
    multiple: false
  },
  init: function(element, item)
  {
    var data = $.extend({}, snarpur.action_items.item_config(item), $.metadata.get(element));
    data.elements = {};
    data.template = eval(data.item);
    data.elements.trigger = element;
    data.elements.nested_context = snarpur.action_items.get_nested_context(data);
    data.elements.container = snarpur.action_items.get_container(data);
    return data;
  },
  item_config: function(item)
  {
    var defaults = snarpur.action_items.defaults;
    defaults.item = item;
    defaults.container = "div."+item;
    
    var item_config = snarpur.action_items[item];
    var data = $.extend({},defaults, item_config);
    return data;
  },
  
  get_container: function(item)
  {
    if (item.container.search("#") == -1)
      container = $(item.container,item.elements.nested_context)
    else
      container = $(item.container);
    
    return container;
  },
  get_nested_context: function(item)
  {
    var nested_context = item.nested_context;
    if(nested_context != "")
      nested_context = $(item.elements.trigger).parents(item.nested_context+":first");
    
    return nested_context; 
  },
  get_nested_item: function(item)
  {
      return $(item.nested_item+":last", item.elements.container);   
  },
  
  guardian_relationship:
  {
    nested_context: false, 
    container: ".guardianship"
  },
  spouse_relationship:
  {
    container: ".spouse", 
    multiple : true
  },

  added_spouse_relationship_period_start:
  {
    container: ".added_spouse_relationship_period .start" 
  },
  added_spouse_relationship_period_end:
   {
     container: ".added_spouse_relationship_period .end" 
   },
  parents_relationship_period_end:
  {

   },
  address:
  {
    nested_context: "",
    container: "#address" 

  },
  existing_parent_address:
  {
    nested_context: "",
    container: "#existing_parent_address" 
    //multiple: false
  }
}