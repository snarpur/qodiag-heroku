var co = console.log;
$(document).ready(function(){
  
  //Tabs on spouseinfo
  $(".tabbed").tabs();
 
  //collapsable divs in familiy-overview
  $(".family-overview h1").click(function(){
   
    $(this).next().toggle("slow");
   
  });
  
  //editable forms in 
  $(".editable").editable();
  
  $(".open-dialog").click(function(){
    
    $("#dialog").dialog(
      { modal: true }
      );
  });
  
  //optional collapser in family registration
  var metadata = $(".collapser").metadata();
  
  
  $(".collapser").click(function(e){
    if(e.currentTarget.nodeName == "A")
      e.preventDefault();
    var data = $(this).metadata();
    
    if(data.type == 'show')
      $("."+data.target).show("slow");
    else if(data.type == 'hide')
      $("."+data.target).hide("slow");
    else
      $("."+data.target).slideToggle("slow");
    
    if(data.target == "reg-member"){
      $("."+data.target+" input").each(function(){
        $(this).attr("value","");
        $(this).attr("checked" , false)
        
      });
    } 
  });
  
  //Events on save spouse
  $("#save-spouse").click(function(){

    var spousename = $("#spouse-name").val();
    var deleteButton = "<a class ='button red small delete' >Eyða</a>";
    var editButton = "<a class ='button green small edit' >Breyta</a>";
    var addStr = "<div class='added-member'><p>"+spousename+"</p><span>"+editButton+deleteButton+"</span></div>"
    $(addStr).insertAfter($(".icon-container"));
    $(".reg-member").slideToggle("slow" , function(){
      $(".added-member").fadeIn('slow');
      
    });
  });
    
  //Events on cancel to add spouse
  $("#cancel-spouse").click(function(){
    $(".reg-member").slideToggle("slow");
  });

  //Events on edit and change
  $(".added-member a.delete").live("click", function(){
    var addedSpouseDiv = $(this).parents("div.added-member");
    var txt = "<b>Eyða ? &nbsp; </b>";
    var ok = "<a class='aux-btn ok'>Já</a>";
    var cancel = "<a class='aux-btn cancel'>Hætta við</a>";
    $("<div>"+txt+ok+cancel+"</div>").appendTo(addedSpouseDiv);     
  });
    
  //Events on confirm delete spouse
  $(".added-member .aux-btn.ok").live("click", function(){
    $(this).parents("div.added-member").fadeOut('slow', function() {
      $(this).remove();
    });
  });
    
  //Events on cancel delete spouse
  $(".added-memberreg-member .aux-btn.cancel").live("click", function(){
    $(this).parents("div").first().remove();
  });
    
    
  
  
  
  
  
  
  
  
});