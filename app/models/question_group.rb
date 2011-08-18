module QuestionGroupCustomMethods

  def self.included(base)
    base.send :scope, :names, QuestionGroup.select('DISTINCT(question_groups.text)')
  end

end

class QuestionGroup < ActiveRecord::Base
  include Surveyor::Models::QuestionGroupMethods
  include QuestionGroupCustomMethods
end