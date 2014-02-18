class ResponderItemDecorator < Draper::Decorator
  delegate_all
  decorates :responder_item
  decorates_association :respondent
  decorates_association :subject
  
  def respondent
    person = model.respondent || model.build_respondent
    person.current_responder_item= model
    PersonDecorator.decorate(person)
  end
  
  def subject
    person = model.subject || model.build_subject
    person.current_responder_item= model
    PersonDecorator.decorate(person)
  end

  def respondent_registration_partial
    if !model.respondent.parent_relationship_to(model.subject).empty?
      "parent"
    elsif !model.respondent.guardian_relationship_to(model.subject).empty?
      "guardian"
    end
  end

  def subject_registration_partial
    "subject"
  end

  def pre_registration_base_template
    "pre_registrations/#{model.registration_identifier}"
  end

  def pre_registration_template
    partial = "#{model.registration_identifier}_partial"
    "#{pre_registration_base_template}/#{send(partial)}"
  end


end
