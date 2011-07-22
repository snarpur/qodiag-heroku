class NormReferenceParser

  def initialize(survey)
    @survey_name = survey
    @survey_id = Survey.find_by_access_code(survey.gsub(/\_/,'-')).id
    self.get_file
    self.parse
  end

  def get_file
    @yml = YAML::load(File.open("#{Rails.root}/db/survey_data_references/#{@survey_name}/norm.yml"))
  end

  def parse
    @yml['norm_references'].each do |norm_data|
      norm_reference = NormReference.create(parse_norm_attributes(norm_data))
      create_scores(norm_reference, norm_data)
    end
  end

  def parse_norm_attributes(norm_data)
    norm_attributes = {:survey_id => @survey_id}
    norm_data['group'].each_with_index do |item, index|
      norm_attributes[get_norm_attribute_name(index)] = item
    end
    norm_attributes
  end

  def get_norm_attribute_name(index)
    @yml['norm_reference_attributes'][index]
  end

  def create_scores(norm_reference, norm_data)
    norm_data['scores'].each_with_index do |item, index|
      if item.is_a?(Hash)
        name = item.first.first
        item[name].each do |nested_item|
          score_attributes = {:name => name}.merge!(get_score_values(nested_item))
          norm_reference.scores.create(score_attributes)
        end
      else
        score_attributes = {:name => get_score_name(index)}.merge!(get_score_values(item))
        norm_reference.scores.create(score_attributes)
      end
    end
  end

  def get_score_values(score)
    values = {}
    score.each_with_index do |value,index|
      values[get_score_attribute(index)] = value
    end
    values
  end

  def get_score_name(index)
   @yml['score_name_attribute_values'][index]
  end

  def get_score_attribute(index)
   @yml['score_attributes'][index]
  end
end