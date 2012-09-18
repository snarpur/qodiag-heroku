require 'csv'
class NormReferenceCSVParser

  def initialize(survey)
    @survey_id = Survey.find_by_access_code(survey.gsub(/\_/,'-')).id
    data = read_csv(survey)
    header = extract_header!(data)
    @norm_attributes = norm_attributes(header)
    @score_attributes = score_attributes(header)
    parse_data(data)
  end

  def parse_data(data)
    data.each_index do |i|
      norm_object = create_norm_object(data[i])
      create_score_objects(data[i],norm_object)
    end
  end

  def read_csv(file)
    CSV.read("#{Rails.root}/db/survey_data_references/#{file}/norm.csv")
  end

  def extract_header!(csv)
    header = csv.shift
  end

  def norm_attributes(header)
    header.select{|h| !h.starts_with?('score')}
  end

  def create_norm_object(data)
    params = norm_params(data)
    NormReference.create(params)
  end

  def norm_params(data)
    norm_values = data.slice!(0,@norm_attributes.length)
    params = Hash[*@norm_attributes.zip(norm_values).flatten].merge(:survey_id => @survey_id)
    set_norm_age_group(params)
  end
  
  def score_attributes(header)
    attributes = header.select{|h| h.starts_with?('score')}
    attributes.map! do |v|
      v.gsub(/score[\[]/,"").gsub(/\]/,"").split("-")
    end
  end

  def create_score_objects(data,norm_object)
    params = create_score_params(data,norm_object)
    Score.create(params)
  end

  def create_score_params(data, norm_object)
    score_params = []
    data.each_index do |i|
      params = {:name => @score_attributes[i][0],:result_name => @score_attributes[i][1], :norm_reference_id => norm_object.id} 
      score_params << params.merge!(score_value(data[i]))
    end
    score_params
  end

  def set_norm_age_group(norm_params)
    age_group = norm_params['age'].nil? ? [nil,nil] : norm_params['age'].split("-") 
    norm_params.delete('age')
    norm_params.merge({:age_start => age_group[0], :age_end => age_group[1]})
 
  end

  def score_value(value)
    score_params = {}
    if value.include?("-")
      values = value.split("-")
      score_params = {:start_value => values[0], :end_value => values[1]}
    else
      score_params = {:value => value}
    end
  end

  def get_survey_id(csv)
    survey_access_code = csv[1][csv[0].index('survey')]
    survey_id = Survey.find_by_access_code(survey_access_code).id
  end
end