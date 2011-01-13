module PeopleHelper
  
  def set_parent_gender(parent)
    gender = parent == "mother"? "female" : "male"
  end
  
  def mother_or_father(parent)
    parent = parent.sex == "female" ? "mother": "father"
  end

  def get_or_create_child_parent_relationship(child, parent, person)
    parent = child.inverse_relations.send(parent)
    if parent.empty?
      parent_relationship = person.relationships.build
    else  
      parent_relationship = parent
    end
  end
  
  def get_or_create_guardian_relationship(person,patient)
    guardianship = person.relationships.guardian(patient.id)
    if guardianship.empty? 
      person.relationships.build(:relation_id => patient.id, :name => 'guardian')
    else
      guardianship.first
    end
  end
  
  def get_opposite_parent_type(parent)
    opposite = parent == "mother"? "father" : "mother"
  end
  
  def get_spouses_exclude_patient_parent(person, patient)
    spouses = person.relationships.select{|i| i[:name] == "spouse"}
    unless patient.parents.empty?
      opposite_parent_id = patient.opposite_parent(person).id
      spouses =  spouses.select{|i| i[:relation_id] != opposite_parent_id }
    end
    spouses
  end
  
  def sibling_partial(partial)
    "people/siblings/#{partial}"
  end
  
  def partial(group, partial)
    "people/#{group}/#{partial}"
  end
  
  def get_patient(patient_id)
    patient = patient_id.nil? ? Person.new : Person.find(patient_id)  
  end
  
  def patient_has_one_parent_and_person_is_not_parent(patient,person)
    @patient.opposite_parent(@person) && !@patient.is_person_parent(@person)
  end
  
  def get_or_create_parents_relationship(patient,person)
    opposite_parent = patient.opposite_parent(person)
     logger.debug "xx - opposite parent #{opposite_parent.inspect}"
    relationship = person.spouse_relationships{|attributes| attributes['person_id'] == opposite_parent.id || attributes['relation_id'] == opposite_parent.id}
    relationship = relationship.empty? ? person.relationships.build : relationship.first 
  end
  
  def set_actions_element(action)
    action = "action_element {name: '#{action}'}" unless action.nil?
  end
  
  def parent_relationship_direction(patient, person)
    relationship = patient.parents_relationship
    if relationship.nil?
      :relationships
    elsif person.id == relationship[0].person_id
      :relationships
    else
      :inverse_relationships
    end
  end
  
  def new_or_edit_link(patient,step_no,step_name)

    if patient.new_record?
      link_to step_name, :controller => "people", :action => "new", :step => step_no
    else
      person = case
       when step_no == 1 : patient
       when step_no == 2 : patient.mother
       when step_no == 3 : patient.father
       when step_no == 4 : patient
      end
    
      if !person
        link_to step_name, :controller => "people", :action => "new", :step => step_no
      else
        link_to step_name, :controller => "people", :id => person.id, :action => "edit", :step => step_no
      end
    
    end
  
  end 
  
  def list_siblings(siblings)

      render :partial => "people/siblings/sibling", :collection => siblings

  end
  
  def sibling_relation(person, sibling)
    relation = case
      when person.full_siblings.include?(sibling) : "full_sibling"
      when person.half_siblings(person.father).include?(sibling) : "half_sibling_father"
      when person.half_siblings(person.mother).include?(sibling) : "half_sibling_mother"
      when person.foster_siblings.include?(sibling) : "foster_sibling"
      else "none"
    end
  end
  
end
