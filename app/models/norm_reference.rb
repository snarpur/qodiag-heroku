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
    (self.scores & Score.get_score(name, value)).map{|i| {:name => i.result_name,:value => i.get_value}}
  end

  def get_score_by_result_name(name, group_by=:result_name)
    scores = (self.scores & Score.result_name(name).order('result_name'))
    scores.group_by{|n|n.send(group_by)}
  end

  def get_score_by_name(name, group_by=:name)
    scores = (self.scores & Score.score_name(name).order('name'))
    scores.group_by{|n|n.send(group_by)}
  end

  def age_group_string
    age = self.age_start == self.age_end ? self.age_start.to_s : "#{self.age_start} - #{self.age_end}"
  end

  def norm_reference_group_name
    str = I18n.t("surveys.terms.norm_reference.#{self.responder}").capitalize
    str << " og REF, "
    str << "#{I18n.t('surveys.terms.'+ self.sex)} #{age_group_string} "
    str << I18n.t("surveys.terms.age")

  end
end
