var snarpur = {
  
  nested_input: 
  {
    config: {
      dialog: "#dialog"  
    },
    init : function()
    {
       snarpur.nested_input.action_elements.init();
    },
    
    action_elements:
    {
      init: function()
      {
        var obj = snarpur.nested_input;
        var actions = [];
        
        $(".action_element").live("click",function()
        {
          
           var data = {},
               element = this
               data = $.metadata.get(element),
               action = data.name.match(/add|remove/) == null ? false : data.name.match(/add|remove/)[0],
               action_name_arr = data.name.split("_");
           if(snarpur.action_elements[data.name] == undefined && action)
           {
             var full_action = action+'_nested_item';
             obj.add_to_action_elements(data, full_action);
             obj.add_to_action_items(data);
             obj[full_action].call(obj,element);
             //obj.add_nested_item(element)
           }
           else
           {
             $.each(snarpur.action_elements[data.name].actions,function(k,v)
             {
               snarpur.nested_input[k].call(snarpur.nested_input,element);
             }); 
           }
        });
      },
    },
    add_to_action_elements: function(data,full_action)
    {
        var action_config = {};
        action_config[full_action] = [data.name];
        snarpur.action_elements[data.name] = {actions : action_config}
    },
    add_to_action_items: function(data)
    {

        var template = _.rest(data.name.split("_"),1).join("_"),
            item_config = {container: "."+template, item: template};
        if(snarpur.action_items[data.name] != undefined)
        {
            item_config = $.extend({},item_config, snarpur.action_items[data.name]);
        }
        snarpur.action_items[data.name] = item_config;    
    },
    add_item: function(element)
    {

        var processed_items = obj.process_item(this,"add_item");
        template = obj.replace_ids(data.template);
        obj.append_item(data,template);
        obj.run_callback(data, "add");

    },
    
    add_nested_item: function(element)
    { 
      var obj = snarpur.nested_input;
      var processed_items = obj.process_item(element, "add_nested_item");
      $.each(processed_items, function(i,v)
      {
        v.template = obj.replace_ids(v.template);
        obj.append_item(v);
        obj.run_callback(v, "add");
      });

    },
    
    add_nested_item_lvl2: function(element)
    {
      var obj = snarpur.nested_input,
          processed_items = obj.process_item(element,"add_nested_item_lvl2");   
      $.each(processed_items, function(i,v)
      {
        parent_object_id = $("input:first",v.elements.nested_context).attr("name").match(/.*\[(\d+)\]/)[1]  
        v.template = obj.replace_nested_ids.replace(v.template, parent_object_id);
        obj.append_item(v);
        obj.run_callback(v, "add");
      });      
    },
    
    remove_nested_item: function(element)
    {
      var obj = this,
          processed_items = obj.process_item(element, "remove_nested_item");
      $.each(processed_items, function(index,data)
       {
         obj.remove_item(data);
         obj.run_callback(data, "remove");
       });
    },
    replace_ids : function(s,id) 
    {
      var new_id = arguments.length == 1 ? new Date().getTime(): id;
      return s.replace(/NEW_RECORD/g, new_id)
    },
    
    replace_null : function(s) 
    {  
      return s.replace(/NEW_RECORD/g, 0)
    },
    
    process_item : function(element,action)
    {
        var obj = this
        var items = obj.process_if_action_element(element,action)
        var processed_items = []
        $.each(items, function(i,v)
        {
          var data = snarpur.action_items.init(element, v)
          processed_items.push(data);
        });
        
        return processed_items;
    },
    
    process_if_action_element: function(element,action)
    {
      var data = {},
          obj = this,
          item = [],
          data = $.metadata.get(element);
      if(snarpur.action_elements[data.name])
      {
        item = snarpur.action_elements[data.name].actions[action]
      }
      else
      {
        item = [data.item]
      }
      return item
    },
    
    replace_nested_ids: 
    {
      
      replace: function(template, parent_id)
      {
        var obj = this;
        template = $(template);
        return obj.replace_parent_ids(template, parent_id)
      },
      
      replace_parent_ids: function(template, parent_id)
      {
        var obj = this;
        var add_nested_obj = snarpur.nested_input
        $("input,select,textarea,label",template).each(function(){
            obj.replace_attributes($(this),parent_id)
          });
        return template
      },
      
      replace_attributes : function(element,parent_id)
      {
        var obj = this;
        var add_nested_obj = snarpur.nested_input
        if(element[0].nodeName != "LABEL"){         
          element.attr("id",obj.replace_first_id(element.attr("id"), parent_id));
          element.attr("id",add_nested_obj.replace_ids(element.attr("id"),0));
          element.attr("name",obj.replace_first_id(element.attr("name"), parent_id));
          element.attr("name",add_nested_obj.replace_ids(element.attr("name"),0));
        }
        else{
          element.attr("for",obj.replace_first_id(element.attr("for"), parent_id));
          element.attr("for",add_nested_obj.replace_ids(element.attr("for"),0));
        }
        
      },
      replace_first_id : function(str, parent_id)
      {
        return str.replace(/NEW_RECORD/, parent_id)
      }
    },

    append_item : function(data)
    {
      var obj = this; 
      if(data.replace == true)
          obj.replace_and_append(data);
      else if(data.multiple == false)
        obj.append_if_empty(data)
      else if(data.container === snarpur.nested_input.config.dialog)
        obj.append_and_open_dialog(data);
      else
       data.elements.container.append(data.template)   
    },
    
    append_if_empty : function(data)
    {
      var obj = this
      if(data.elements.container.children().size() == 0)
        data.elements.container.append(data.template)
    },
    
    replace_and_append: function(data)
    {
      data.elements.container.empty()
      data.elements.container.append(data.template)
    },
    append_and_open_dialog: function(data){
        var dialog = $(snarpur.nested_input.config.dialog);
        dialog.append(data.template);
        $("#dialog").dialog({
            modal: true,
            close: function(){$(this).empty()},
            width: 600,
            resizable:false
        });
        return false;
    },
    remove_item: function(data)
    {
      snarpur.action_items.get_nested_item(data).remove();
    },
  
    run_callback: function(data, add_remove)
    {
      var obj = this;
      var container = $("#"+data.item);
      var callback = data.item
      if(obj.callbacks[callback] != undefined)
        obj.callbacks[add_remove].call(this,container)
    },
    
    callbacks : 
    {
      add:
      {
        spouse_relationship : function(container)
        {
          container = arguments[0][0];
          $(".added-spouse:last", container).show("slow", function()
          {
            $(this).addClass("status-open");
          });
        }
      },
      remove:
      {

      }
    }
  }
}

$('.added-spouse .delete').live('click',function(){
    var trash = $(this),
        container = trash.closest('.added-spouse');

    container.effect('blind',null,400,function(){
        container.remove();
    });
});

$('#dialog .cancel').live('click', function(){
    $('#dialog').dialog('close');
});

$('.parent-guardianship input:radio').live('click',function(){
    var elem = $(this),
        section = elem.closest('.frm-section'),
        select = section.find('select'),
        div = section.find('.inp-sel');
   console.info(elem.is(':checked'))
   if(elem.attr('value') == 1){
     select.attr('disabled','disabled');
     div.addClass("disabled")
   }
   else{
     select.removeAttr('disabled');
     div.removeClass('disabled');  
   }
});




