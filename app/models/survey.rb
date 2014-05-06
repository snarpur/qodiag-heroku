module SurveyCustomMethods

  def question_weight_max
      self.sections.joins(:questions => :answers).maximum('weight').to_i
  end

  def question_weight_min
      self.sections.joins(:questions => :answers).minimum('weight').to_i
  end

  def question_count
    self.sections_with_questions.map(&:questions).flatten.compact.size
  end

  def max_score
    question_weight_max * question_count
  end


end

class Survey < ActiveRecord::Base
  include Surveyor::Models::SurveyMethods
  include SurveyCustomMethods
end