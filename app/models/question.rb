module QuestionCustomMethods
  def text
    I18n.t("surveys.#{self.common_namespace}.questions")[self.display_order]
  end

end

class Question < ActiveRecord::Base
  include Surveyor::Models::QuestionMethods
  include QuestionCustomMethods
end