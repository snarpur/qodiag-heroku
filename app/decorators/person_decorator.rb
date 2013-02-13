class PersonDecorator < Draper::Decorator
  delegate_all
  decorates :person
  decorates_association :user
  decorates_association :relations

  def user_invitation
   user_model = model.user || model.build_user({:invitation => true})
   user_model.set_role(:respondent) unless user_model.role?(:respondent)
   UserDecorator.decorate(user_model)
  end

  (Person.relationship_names - ["spouse"]).each do |name|        
    define_method("inverse_#{name}_relationship_as_current_subject") do 
      person = if name == 'patient' then model.current_responder_item.caretaker else model.current_responder_item.get_respondent end
      relationship = model.send("inverse_#{name}_relationship_to",person)
      if relationship.empty?
        relationship = model.send("build_inverse_#{name}_relationship_to", person)
      else
        relationship = relationship.first
      end

      relationship
    end

    define_method("#{name}_relationship_to_current_subject") do
      person = model.current_responder_item.subject
      relationship = model.send("#{name}_relationship_to",person)
      if relationship.empty?
       relationship = model.send("build_#{name}_relationship_to", person)
      else
        relationship = relationship.first
      end
      relationship
    end
  end

  def parent0
    p = model.parent0
    p.current_responder_item=(model.current_responder_item)
    p
  end

  def parent1
    p = model.parent1
    p.current_responder_item=(model.current_responder_item)
    p
  end

  def parents_relations
    r = model.inverse_relationships.where(:name => :parent)
    if r.empty?
      [model.inverse_relationships.build(:name => :parent), model.inverse_relationships.build(:name => :parent)]
    elsif r.count == 1
      r + [model.inverse_relationships.build(:name => :parent)]
    end
  end

  def opposite_parent_relation
    p = model.find_or_create_opposite_parent_relation(model.current_responder_item.respondent)
    p.current_responder_item=(model.current_responder_item)
    p
  end

  def spouse_relationship_through_parenting_of_subject
    other_parent = model.other_parent_of(model.current_responder_item.subject)
    spouse_relationship = (model.spouse_relationship_to(other_parent) + model.inverse_spouse_relationship_to(other_parent)).first
    spouse_relationship || model.build_spouse_relationship_to(other_parent)
  end
end
