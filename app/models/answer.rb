module AnswerCustomMethods

  def self.included(base)

  end

end

class Answer < ActiveRecord::Base
  include Surveyor::Models::AnswerMethods
  include AnswerCustomMethods
end