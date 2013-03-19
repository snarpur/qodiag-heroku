module AnswerCustomMethods

  def self.included(base)

  end


  def text_for(position = nil, context = nil, locale = nil)
    I18n.t("surveys.#{common_namespace}.answers", :locale => locale)[weight]
  end

end

class Answer < ActiveRecord::Base
  include Surveyor::Models::AnswerMethods
  include AnswerCustomMethods
end