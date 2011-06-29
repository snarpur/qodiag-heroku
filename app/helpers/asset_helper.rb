module AssetHelper

  def surveyor_assets
     surveyor_css + surveyor_js
   end

   def surveyor_css
     stylesheet_link_tag 'surveyor/reset', 'surveyor/dateinput', 'surveyor', 'main'
   end

   def surveyor_js
     javascript_include_tag 'surveyor/jquery.tools.min' #, 'surveyor/jquery.surveyor'
   end

   def jqplot_includes
     jqplot_js + jqplot_css
   end

   def jqplot_js
     files = ['jqplot.categoryAxisRenderer.min.js', 'jqplot.barRenderer.min.js','jqplot.pointLabels.min.js']
     javascript_include_tag 'jqplot/jquery.jqplot.min.js', files.collect! {|js| 'jqplot/plugins/' + js }
   end

   def jqplot_css
     stylesheet_link_tag 'jqplot/jquery.jqplot.min.css'
   end

   def snarpur_chart_js
     files = ['snap','app/model/chart/Chart.js','app/model/chart/Bar.js']
     javascript_include_tag  files.collect! {|js| 'snarpur/' + js }
   end

   def snarpur_timeline_js
     screen = ["model/Screen"]
     models = %w{TimeLineScreen Line ItemLine Item PointItem ItemDetail}.map!{|m| "model/Timeline/#{m}.js"}
     views = %w{timeLineScreen line itemLine item}.map!{|v| "view/timeline/#{v}.js"}
     config = %w{locale/jquery.is.json locale/jquery.is.strings.json}
     data = ["timeline_test_data.js"]
     files =  config + screen + models + views + data
     tm_js = javascript_include_tag  files.collect! {|js| "snarpur/app/" + js }
     tm_js + timeline_extras_js
  end

  def timeline_extras_js
    date = %w{date/build/date-is-IS i18n/i18n}
    utils = %w{color decoration iconizer}.map!{|m| "utils/#{m}"}
    files = date + utils
    javascript_include_tag  files.collect! {|js| "snarpur/#{js}.js" }
  end

end