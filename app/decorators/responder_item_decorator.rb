class ResponderItemDecorator < Draper::Base
  decorates :responder_item
  decorates_association :respondent
  decorates_association :subject
  
  def respondent
    p = model.respondent || model.build_respondent
    PersonDecorator.decorate(p)
  end
  
  def subject
    p = model.subject || model.build_subject
    PersonDecorator.decorate(p)
  end
end
