module QuestionCustomMethods
  
  def self.included(base)
  end

end

class Question < ActiveRecord::Base
  include Surveyor::Models::QuestionMethods
  include QuestionCustomMethods

end