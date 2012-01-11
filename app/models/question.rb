module QuestionCustomMethods
  

end

class Question < ActiveRecord::Base
  include Surveyor::Models::QuestionMethods
  include QuestionCustomMethods

end