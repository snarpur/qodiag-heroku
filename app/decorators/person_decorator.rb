class PersonDecorator < Draper::Decorator
  delegate_all
  decorates_finders
  decorates :person
  decorates_association :user
  decorates_association :relations
  decorates_association :address

  def user_invitation
   user_model = model.user || model.build_user({:invitation => true})
   user_model.set_role(:respondent) unless user_model.role?(:respondent)
   UserDecorator.decorate(user_model)
  end

  def opposite_parent_relation
    p = model.find_or_create_opposite_parent_relation(model.current_responder_item.respondent)
    p.current_responder_item=(model.current_responder_item)
    PersonDecorator.decorate(p)
  end

  def parents
    model.parents.map{|p| PersonDecorator.decorate(p)}
  end

  def address
    model.address || model.build_address
  end
  
  def spouse_relationship_through_parenting_of_subject
    other_parent = model.other_parent_of(model.current_responder_item.subject)
    spouse_relationship = (model.spouse_relationship_to(other_parent) + model.inverse_spouse_relationship_to(other_parent)).first
    spouse_relationship || model.build_spouse_relationship_to(other_parent,{:status => false})
  end

  def list_respondents
    respondents = model.respondents
    if model.age >= 18
      respondents.push(model)
    end
    respondents
  end
end
