module ChartRenderer::Drilldown
class Chart

  def initialize(response_set,groups,data)
    @response_set = response_set
    @groups = groups
    @data = data
  end

  def responses
    @responses ||= @response_set.group_result(@groups)
  end

  def chart_config
    @chart_config = ChartConfig::Bar::Chart.instance.raw_config[:chart_config]
  end

  
  
  def results
    drilldown = []
    responses.each do |i|
      index = @groups.index(i.question.question_group.text)
      drilldown[index] ||= []
      # drilldown[index] <<  {:y => i.answer.weight, :name => i.question.display_order}
      
      params = {:low =>i.answer.weight, 
                :high => i.answer.weight+1, 
                :name => i.answer.weight, 
                :color => chart_config[:colors][i.answer.weight]}
      drilldown[index] << params
    end
    drilldown
  end

  def series_with_drill_down
    series_config = {}#{:cursor => 'pointer',:point => {:events => {:click =>'drilldown'}}}
    drilldown = results
    drilldown_data = []
    @data.each_with_index do |i,index|
      drilldown_data[index] = {
        :y => i, 
        :drilldown => {
          :chart => {:type => 'columnrange'},
          :series => [{
              :data =>  drilldown[index]
          }],
          :xAxis => {:categories => responses.map{|k| k.question.display_order}}
        }
      }

      get_bar_chart_config.each do |k,v|
        drilldown_data[index][:drilldown][k] ||= {}
        if v.is_a?(Array)
          drilldown_data[index][:drilldown][k] = v
        else
          drilldown_data[index][:drilldown][k].merge!(v)
        end
        
      end
    end
    # return series_config.merge({:data => drilldown_data})
    drilldown_data.first
  end

  def get_bar_chart_config
    ChartConfig::Bar::Chart.instance.raw_config[:chart_config]
  end
end
end