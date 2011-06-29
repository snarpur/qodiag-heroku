class NormReference < ActiveRecord::Base
  belongs_to :survey
  has_many :scores

  def self.sex(sex)
    where(:sex => sex)
  end

  def self.age(age)
    where("age_start <= ? AND age_end >= ?", age, age)
  end

  def self.survey(survey)
    where(:survey_id => survey)
  end

  def get_score(name,value)
    self.scores.where(:name => name).select(value).first.average
  end

  def age_group_string
    age = self.age_start == self.age_end ? self.age_start : "#{self.age_start} - #{self.age_end}"
  end



end
