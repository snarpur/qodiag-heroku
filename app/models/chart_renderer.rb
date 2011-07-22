class ChartRenderer

  def initialize(response_set)
    @response_set = response_set
    @group_names = group_names
    @group_results = group_results
    @group_reference = group_reference(:average)
  end

  def group_names
   names =  @response_set.group_names
   names << 'total'
  end

  def group_results
    results = []
    @group_names.each {|r| results << @response_set.group_result(r) unless r.eql?('total')}
    results << results.sum
  end

  def group_reference(val)
    reference = []
    unless @response_set.norm_reference.nil?
      @group_names.each {|r| reference << @response_set.group_norm_reference(r,val.to_s)}
    end
    reference
  end

  def y_ticks
    all = @group_results + @group_reference
    spacer = 4
    height = all.inject(all[0]) {|max, item| item > max ? item : max }
    padded_height = spacer - (height * 1.1).round.divmod(spacer)[1] + (height * 1.1).round
    steps = []
    0.step(padded_height, padded_height/spacer){|i| steps << i}
    steps
  end

  def data_series
   return if @response_set.norm_reference.nil?
   str = "#{@response_set.norm_reference.age_group_string} "
   str << I18n.t("surveys.terms.age")
   str << " "
   str << I18n.t("surveys.terms.#{@response_set.norm_reference.sex}")
  end

  def standard_deviation_from_average(value, index)
    @group_results[index] - value
  end

  def bar_labels
    labels = []
    standard_deviation = group_reference(:standard_deviation)
    @group_names.enum_for(:each_with_index).map do |name,index|
      item = {}
      item[:name] = "#{I18n.t("surveys.terms.#{name}")}"
      item[:data] = [{:name => "#{I18n.t("surveys.terms.standard_deviation_from_average")}",
                      :value => standard_deviation_from_average(standard_deviation[index], index)}]
      labels << item
    end
    labels
  end

  def result_to_chart

    json = { :start => @response_set.updated_at,
              :legend => "#{I18n.t("surveys.#{@response_set.survey.access_code}")} #{I18n.l(Date.current, :format => :long)}",
              :chart => {
                  :data => [@group_results,@group_reference],
                  :bar_labels => bar_labels,
                  :data_labels => [@response_set.subject.full_name,data_series].collect!{|i| {:label => i}},
                  :increment => y_ticks
              }
            }
  end
end