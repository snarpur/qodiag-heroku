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

  def get_score_by_result_name(result_names, group_by=:result_name)
    self.scores.by_result_names_in_groups(result_names,group_by)
  end

  def get_score_by_name(names,group_by=:name)
     self.scores.by_names_in_groups(names,group_by)
  end

  def age_group_string
    age = self.age_start == self.age_end ? self.age_start.to_s : "#{self.age_start} - #{self.age_end}"
  end
 
  #FIXME: PUT THIS INTO I18N TRANSLATION
  def norm_reference_group_name
    str = I18n.t("surveys.terms.norm_reference.#{self.responder}").capitalize
    str << " og "
    str << "#{I18n.t('surveys.terms.norm_reference.title')} "
    str << "#{I18n.t('surveys.terms.'+ self.sex)} #{age_group_string} "
    str << I18n.t("surveys.terms.age")

  end
end
