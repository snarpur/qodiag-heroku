class ResponderItemDecorator < Draper::Decorator
  delegate_all
  decorates :responder_item
  decorates_association :respondent
  decorates_association :subject
  
  def respondent
   model.get_respondent
  end
  
  def subject
    model.get_subject
  end
end
