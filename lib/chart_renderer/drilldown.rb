module ChartRenderer::Drilldown
class Chart

  def initialize(response_set,groups,data)
    @response_set = response_set
    @groups = groups
    @data = data
  end

  def results
    responses = @response_set.group_result(@groups)
    drilldown = []
    responses.each do |i|
      index = @groups.index(i.question.question_group.text)
      drilldown[index] ||= []
      drilldown[index] <<  {:y => i.answer.weight, :name => i.question.display_order}
    end
    drilldown
  end

  def series_with_drill_down
    series_config = {:cursor => 'pointer',:point => {:events => {:click =>'drilldown'}}}
    drilldown = results
    drilldown_data = []
    @data.each_with_index do |i,index|

      drilldown_data[index] = {
        :y => i, 
        :drilldown => {
          :series => [{
              :data =>  drilldown[index],
              :name => @groups[index] 
          }],
          :xAxis => {:categories => drilldown[index].map{|k| k[:name]}}
        }
      }

      get_bar_chart_config.each do |k,v|
        drilldown_data[index][:drilldown][k] ||= {}
        drilldown_data[index][:drilldown][k].merge!(v)
      end
    end
    return series_config.merge({:data => drilldown_data})
  end

  def get_bar_chart_config
    ChartConfig::Bar::Chart.instance.raw_config[:chart_config]
  end
end
end