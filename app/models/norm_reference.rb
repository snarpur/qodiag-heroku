class NormReference < ActiveRecord::Base

  belongs_to :survey
  has_many :scores

  def self.sex(sex)
    where(:sex => sex)
  end

  def self.age(age)
    where("age_start <= ? AND age_end >= ?", age, age)
  end 

  def self.survey_id(survey)
    where(:survey_id => survey)
  end

  def self.find_match(params)
    ref = self.where(:survey_id => params[:survey_id]).limit(1).first
    attributes = ref.attributes.merge({"age" =>  ref.age})
    matchers = attributes.with_indifferent_access.slice(*params.keys).delete_if{|k,v| v.nil?}
    reference_match = matchers.keys.inject(NormReference) do |memo,value|
      obj = memo.send(value,params[value.to_sym])
      memo = obj
    end  
    reference_match.first
  end
  
  def age
    self.age_start || self.age_end 
  end

  def self.get_norm_reference_for_oldest(survey_id, sex = "male", responder = "parent")
    NormReference.where('survey_id = ? AND sex = ? AND responder = ?',survey_id,sex,responder).order('age_start DESC').first()
  end

  def scores_by_names_and_result_names(names,result_names)
    self.scores.by_names_and_result_names_in_groups(names,result_names)
  end

  def age_group_string
    age = self.age_start == self.age_end ? self.age_start.to_s : "#{self.age_start} - #{self.age_end}"
  end
 
  def norm_reference_group_name
    title = []
    title << [:survey,survey.access_code]
    title << [:respondent,responder] unless responder.nil?
    title << [:sex ,sex] unless sex == nil or sex.empty?
    title << [:age,age_group_string] unless age_group_string == nil or age_group_string.empty?
    title
  end
  
end
