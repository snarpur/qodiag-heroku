var co = console.log



action_params = {
  toggleClass: "active",
  hide: "slow",
  show: "slow"
  }

var snarpur = {
  
  nested_input : {
    
    init : function(){
      snarpur.nested_input.add_nested_item.init();
      snarpur.nested_input.remove_nested_item.init();
    },
    
    add_nested_item : {
      
      init : function(){
        var obj = this
        $(".add_item").live('click',function() {
          data = obj.process_item(this);
          template = obj.replace_ids(data.template);
          obj.append_item(data,template);
          obj.run_callback(data);

        });
        
        $(".add_nested_item").live('click',function() {
          data = obj.process_item(this);
          template = obj.replace_ids(data.template);
          obj.append_item(data,template);
          obj.run_callback(data);

        });          
      
        $('.add_nested_item_lvl2').live('click', function(){
          data = obj.process_item(this);  
          parent_object_id = $(this).parents(".nested-context").first().find('input:first').attr("name").match(/.*\[(\d+)\]/)[1]  
          co($(this).parents(".nested-context").first().find('input:first'))
          co(parent_object_id)

          template = obj.replace_nested_ids.replace(data.template, parent_object_id);
          obj.append_item(data,template);
          
        });
      },
      
      replace_ids : function(s,id) {
        var new_id = arguments.length == 1 ? new Date().getTime(): id;
        return s.replace(/NEW_RECORD/g, new_id)
      },
      
      replace_null : function(s) {
        
        return s.replace(/NEW_RECORD/g, 0)
      },
      
      process_item : function(element){
          var data = {}
          data = $.metadata.get(element);
          $.extend(data,snarpur.nested_input.config[data.item]);
          
          data.template = eval(data.item);
          data.container =  $(element).parents('.nested-context').first().find("."+data.container);
          return data;
      },
      
      replace_nested_ids: {
        
        replace: function(template, parent_id){
          var obj = this;
          template = $(template);
          return obj.replace_parent_ids(template, parent_id)
        },
        
        replace_parent_ids: function(template, parent_id){
          var obj = this;
          var add_nested_obj = snarpur.nested_input.add_nested_item
          $("input,select,textarea,label",template).each(function(){
              obj.replace_attributes($(this),parent_id)
            });
          return template
        },
        
        replace_attributes : function(element,parent_id){
          var obj = this;
          var add_nested_obj = snarpur.nested_input.add_nested_item
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
        replace_first_id : function(str, parent_id){
          return str.replace(/NEW_RECORD/, parent_id)
        }
      },
      
      
      append_item : function(data,template){
        var obj = this;
        co("adding item: ", data)
        if(data.multiple == false)
          obj.append_if_empty(data.container, template)
        else
          data.container.append(template)
        
      },
      
      append_if_empty : function(container,template){
        var obj = this
        if(container.children().size() == 0)
          container.append(template)
      },
      
      run_callback: function(data){
        co("running callback")
        var obj = this;
        var container = $("#"+data.item);
        var callback = data.item
        if(obj.callbacks[callback] != undefined)
          obj.callbacks[callback].call(this,container)
      },
      
      callbacks : {
        
        spouse_relationship : function(container){
          container = arguments[0][0];
          $(".added-spouse:last", container).show("slow", function(){
            $(this).addClass("status-open");
          });

        }

      }
    },
    remove_nested_item: {
      
      init: function(){
        var obj = this
        $(".remove_nested_item").live('click', function() {
          var data = $.metadata.get(this);
          $.extend(data,snarpur.nested_input.config[data.item]);
          var container = $(this).parents('.nested-context').first().find("."+data.container);
          var callback = data.item;
          container.find(".nested-item:last").remove();
          if(obj.callbacks[callback] != undefined)
            obj.callbacks[callback].call(this,container)

        });
      },
      callbacks: {}
    },
    
    config : {
      guardian_relationship : {container: "guardianship", multiple : false},
      spouse_relationship : {container: "spouse", multiple : true},
      guardian_spouse_relationship : {container: "guardianship", multiple : false},
      added_spouse_relationship_period : {container: "relationship-period", multiple : false},
      parents_relationship_period : {container: "relationship-period", multiple : false}
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
  $(".tabbed").tabs();
  
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