var co = console.info



action_params = {
  toggleClass: "active",
  hide: "slow",
  show: "slow"
  }

var snarpur = {
  
  nested_input: 
  {
    
    init : function()
    {
       snarpur.nested_input.add_item(null)
       //snarpur.nested_input.add_nested_item(".action_element, .add_nested_item")
       snarpur.nested_input.add_nested_item_lvl2(null)
       //snarpur.nested_input.remove_nested_item(".action_element, .remove_nested_item");
       snarpur.nested_input.action_elements.init();
    },
    
    action_elements:
    {
      init: function()
      {
        var obj = snarpur.nested_input;
        var actions = [];
        
        $(".action_element").each(function()
        {
           var data = {}
           var element = this
           data = $.metadata.get(element);
           $.each(snarpur.nested_input.config.action_elements[data.name].actions,function(k,v)
           {
             if($.inArray(k,actions) == -1)
             {
               co("adding action %s --- for --- %s ", k,v)
               actions.push(k)
               
             }
              
           });
        });
        
        $.each(actions,function(i,v)
        {
          snarpur.nested_input[v].call(snarpur.nested_input, ".action_element")
        });
      }
    },

    add_item: function(element)
    {
      var obj = snarpur.nested_input;
      var element = element == null ? ".add_item" : element
      $(element).live('click',function() {

        var processed_items = obj.process_item(this,"add_item");
        template = obj.replace_ids(data.template);
        obj.append_item(data,template);
        obj.run_callback(data, "add");

      }); 
    },
    
    add_nested_item: function(element)
    {
      var obj = snarpur.nested_input;
      var element = element == null ? ".add_nested_item" : element
      
      $(element).live('click',function()
      {
        var processed_items = obj.process_item(this, "add_nested_item");

        $.each(processed_items, function(i,v)
        {
          template = obj.replace_ids(v.template);
          obj.append_item(v,template);
          //obj.run_callback(v, "add");
        });
      }); 
    },
    
    add_nested_item_lvl2: function(element)
    {
      var obj = snarpur.nested_input;
      var element = element == null ? ".add_nested_item_lvl2" : element
      $(element).live('click',function() {
        var processed_items = obj.process_item(this,"add_nested_item_lvl2");  
        parent_object_id = $(this).parents(".nested-context").first().find('input:first').attr("name").match(/.*\[(\d+)\]/)[1]  
        co($(this).parents(".nested-context").first().find('input:first'))
        co(parent_object_id)

        template = obj.replace_nested_ids.replace(data.template, parent_object_id);
        obj.append_item(data,template);
        
      }); 
    },
    
    remove_nested_item: function(element)
    {
      var obj = this
      var element = element == null ? ".remove_nested_item" : element
      
      $(element).live('click', function() 
      {
        co("clicking in removed")
        var processed_items = obj.process_item(this, "remove_nested_item");
        $.each(processed_items, function(index,data)
         {
           obj.remove_item(this, data)
           obj.run_callback(data, "remove");
         });
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
        co(action)
        var obj = this
        var items = obj.process_if_action_element(element,action)
        var processed_items = []
        co(items)
        $.each(items, function(i,v)
        {
          var data = {}
          data = $.extend({},$.metadata.get(element) ,snarpur.nested_input.config.items[v]);
          data.template = eval(data.item);
          processed_items.push(data)

        });
        
        return processed_items;
    },
    
    process_if_action_element: function(element,action)
    {
      var data = {}
      var obj = this
      var item = []
      data = $.metadata.get(element);
      
      if(obj.config.action_elements[data.name])
      {
        item = obj.config.action_elements[data.name].actions[action]
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

    append_item : function(data,template)
    {
      var obj = this;
      if(data.multiple == false)
        obj.append_if_empty($(data.container), template)
      else
        $(data.container).append(template)
      
    },
    
    append_if_empty : function(container,template)
    {
      var obj = this
      co("container :: ", container)
      if(container.children().size() == 0)
        container.append(template)
    },
    
    remove_item: function(element,data)
    {
      co("in remove")
      var obj = this;
      var nested_context = obj.get_nested_context(element,data);
      obj.get_nested_item(nested_context, data).remove();
    },
    
    get_nested_context: function(element, data)
    {
      var nested_context;
      if(data.nested_context == true)
        nested_context = $(element).parents(".nested-context:first");
        
      return nested_context;
    },
    
    get_nested_item: function(nested_context, data)
    {
      var nested_item;
      co("nested_context :: ", nested_context)
      co(" $(data.container:last, nested_context):: ",$(data.container+":last", nested_context))
      co(" $(data.container+ > .nested-item):: ", $(data.container+" > .nested-item"))
      if(data.multiple == true)
        nested_item = $(data.container+":last", nested_context);
      else
        nested_item = $(data.container+" > .nested-item");
      
      return nested_item; 
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
    },
    
    config : {
      items:
      {
        guardian_relationship:
        {
          item: "guardian_relationship",
          nested_context: false, 
          container: ".guardianship", 
          multiple : false
        },
        spouse_relationship:
        {
          item: "spouse_relationship",
          nested_context: true, 
          container: ".spouse", 
          multiple : true
        },
        guardian_spouse_relationship:
        {
          item: "guardian_spouse_relationship",
          nested_context: true, 
          container: ".guardianship", 
          multiple : false
        },
        added_spouse_relationship_period_start:
        {
          item: "added_spouse_relationship_period_start",
          nested_context: true, 
          container: ".added_spouse_relationship_period .start", 
          multiple : false
        },
        added_spouse_relationship_period_end:
         {
           item: "added_spouse_relationship_period_end",
           nested_context: true, 
           container: ".added_spouse_relationship_period .end", 
           multiple : false
         },
        parents_relationship_period:
        {
          item: "parents_relationship_period",
          nested_context: false, 
          container: ".parents_relationship_period",
          multiple : false
         },
        address:
        {
          item: "address",
          nested_context: false, 
          container: ".address", 
          multiple: false
        },
        existing_parent_address:
        {
          item: "existing_parent_address", 
          nested_context: false,
          container: ".existing_parent_address", 
          multiple: false
        }
      },
      action_elements:
      {
        parents_status_on:
        {  
          actions:
          {
            remove_nested_item:["parents_relationship_period", "address"],
            add_nested_item:["existing_parent_address"]
          }
        },
        parents_status_off:
        {  
          actions:
          {
            add_nested_item:["parents_relationship_period","address"],
            remove_nested_item:["existing_parent_address"]
          }
        },
        spouse_status_on:
        {  
          actions:
          {
            add_nested_item:["added_spouse_relationship_period_start"],
            remove_nested_item:["added_spouse_relationship_period_end"]
          }
        },
        spouse_status_off:
        {  
          actions:
          {
            add_nested_item:["added_spouse_relationship_period_start","added_spouse_relationship_period_end"]
          }
        },
        add_spouse_relationship:
        {  
          actions:
          {
            add_nested_item:["spouse_relationship"]
          }
        }
      }
    }  
  },
  spouse_status_switch : {
    
    init: function(){
      var obj = this; 
      $(".spouse-status").live("click",function(){
        var data = $.metadata.get(this)
        var period_section = $(this).parents(".nested-context").first();
        var address_section = $("#address");
        obj.toggle(period_section, data.status);
        obj.toggle(address_section, data.status)
        //obj.toggle_period()
        //obj.toggle_address();
      });
    },
    toggle: function(section, status){
      var toggle_fields = section.hasClass("toggle") ? section : $(".toggle",section)
      var opposite_status = status == "on" ? "off" : "on"
      toggle_fields.each(function(){
        if(!$(this).hasClass(status)){
          $(this).addClass(status)
          $(this).removeClass(opposite_status)
        }
      });
      if(status == "off"){
        section.find("select").each(function(){
          co(this)
        });
      }
    }
  }

}

$(document).ready(function() {
  
  snarpur.nested_input.init();
  snarpur.spouse_status_switch.init();
  $(".accordion").accordion();
  
  $(".close-spouse").live('click',function(){
    var added_spouse = $(this).parents('div.added-spouse')
    var firstname = $("input[id $= firstname]", added_spouse).attr("value");
    var lastname = $("input[id $= lastname]", added_spouse).attr("value");
    added_spouse.remove("em");
    $(".spouse-form", added_spouse).slideToggle("slow");
    added_spouse.prepend("<em>"+firstname+" "+lastname+"</em>");
    added_spouse.addClass("status-closed");
    added_spouse.removeClass("status-open");
  });
  
  $(".edit-spouse").live('click', function(){
    var added_spouse = $(this).parents('div.added-spouse');
    $(".spouse-form", added_spouse).slideToggle("slow");
    added_spouse.addClass("open");
    added_spouse.removeClass("closed");
    
    
  });
  
  $(".remove-spouse").live('click',function(){
    var added_spouse = $(this).parents("div.added-spouse");
    var txt = "<b>Eyða ? &nbsp;</b>";
    var ok = "<a class='confirm button x-small black'>Já</a>";
    var cancel = "<a class='cancel button x-small black'>Hætta við</a>";
    $("<div class='mask'><p>"+txt+ok+cancel+"</p></div>").appendTo(added_spouse); 
  });
  
  $(".mask .confirm").live("click",function(){
    $(this).parents("div.added-spouse").fadeOut("slow",function(){$(this).remove()})
  });
  
  $(".mask .cancel").live("click",function(){
    var added_spouse = $(this).parents("div.added-spouse");
    $(".mask", added_spouse).fadeOut("slow",function(){$(this).remove()})
  });
  
  
  
  
  $(".collapser").click(function(e){
    if(e.currentTarget.nodeName == "A")
      e.preventDefault();
    
    var data = $(this).metadata({type:'attr',name:'actions'});

    $.each(data, function(i,v){
      co("v.action ", v.action)
      co("v.target ", v.target)
      co("action_params[v.action] ",action_params[v.action])
      co(eval("$('"+v.target+"')."+v.action+"('"+action_params[v.action]+"')"))
      
    })
    
  });





});