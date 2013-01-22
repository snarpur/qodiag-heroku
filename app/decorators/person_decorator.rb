class PersonDecorator < Draper::Base
  decorates :person
  decorates_association :user
  decorates_association :relations

  def user_invitation
   user_model = model.user || model.build_user({:invitation => true})
   user_model.set_role(:respondent) unless user_model.role?(:respondent)
   UserDecorator.decorate(user_model)
  end

  Person.relationship_names.each do |name|        
    define_method("inverse_#{name}_relationship_as_current_subject") do 
      person = if name == 'patient' then model.current_responder_item.caretaker else model.current_responder_item.respondent end
      relationship = model.send("inverse_#{name}_relationship_to_person",person)
      if relationship.empty?
       relationship = model.send("build_inverse_#{name}_relationship_to_person", person)
      else
        relationship = relationship.first
      end
      relationship
    end
  end
end
