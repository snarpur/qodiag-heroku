$(document).ready(function() {
  //snarpur.nested_input.init();
  $(".accordion").accordion();
  $("#flash .error:not(:empty), #flash .alert:not(:empty)").show();

  $("#flash .notice:not(:empty)")
    .fadeIn(100)
    .delay(2000)
    .fadeOut(1000);
    //sn.activeViewObj = $("#canvas").timelineScreen({data: timeline_data}).data('obj');
    //_o.create(sn.Chart.Bar).init(chartData);

});