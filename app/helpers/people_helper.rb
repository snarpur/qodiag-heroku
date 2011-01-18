module PeopleHelper
  
  def set_parent_gender(parent)
    gender = parent == "mother"? "female" : "male"
  end
  
  def mother_or_father(parent)
    parent = parent.sex == "female" ? "mother": "father"
  end
  
  def get_relationship_inverse_relationship(person, opposit, name)
    relationship = person.relationships.select{|i| i.name == name && (i.relation_id == opposit.id || i.person_id == opposit.id)}
    if relationship.empty?
      person.relationships.build(:relation_id => opposit.id, :name => name)
    else
      relationship.first
    end
  end
  
  def get_relationship(person,patient,name)
    relationship = person.relationships.select {|i| i.name == name && i.relation_id == patient.id}
    if relationship.empty?
      person.relationships.build(:relation_id => patient.id, :name => name)
    else
      relationship.first
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
    # if person.nil?
    #      []
    #    elsif patient.opposite_parent(person).nil?
    #       person.spouse_relationships
    #    else
    #      parent_id = patient.opposite_parent(person).id
    #      person.spouse_relationships.select{|i| i.person_id != parent_id && i.relation_id != parent_id}
    #    end
  end
  
  def patient_has_one_parent_and_person_is_not_parent(patient,person)
    @patient.opposite_parent(@person) && !@patient.is_person_parent(@person)
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
  
  def is_disabled(relationship)
    if relationship.status.nil? || relationship.status == true
      'disabled'
    else
      nil
    end
  end
end
