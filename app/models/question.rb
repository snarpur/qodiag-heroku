module QuestionCustomMethods
  
  def self.included(base)
  end

  # def custom_class
  #   "survey-question pick-one"
  # end

end

class Question < ActiveRecord::Base
  include Surveyor::Models::QuestionMethods
  include QuestionCustomMethods

end