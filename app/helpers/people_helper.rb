module PeopleHelper
  # STEPS = ["patient", "mother", "father", "finnish"]
  
  #RAILS_DEFAULT_LOGGER.debug "xx - relationship[0] #{patient.parents_relationship}"
  
  def ssn(person)
   day = pad_with_zero(person.dateofbirth.mday) 
   month = pad_with_zero(person.dateofbirth.month)
   year = pad_with_zero(person.dateofbirth.year)
   last = person.cpr
   ssn = "#{day}#{month}#{year}-#{last}"
  end
  
  def date_of_birth_format(date)
    day = pad_with_zero(date.mday) 
    month = pad_with_zero(date.month)
    year = pad_with_zero(date.year)
    dob_string = "#{day}#{month}#{year}"
  end
  
  def pad_with_zero(item)
    if(item > 12)
      item = item.to_s[-2..-1].to_i
    end
    item = item < 10 ? "0#{item}" : item
  end
  
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
    guardianship = person.relationships.select{|i| i['name'] == 'guardian' && i['relation_id'] == patient.id}
    if guardianship.empty? 
      person.relationships.build
    else
      guardianship
    end
  end
  
  def guardian_is_checked(relationship, param)
    !relationship.name.nil?
  end
  
  def guardian_is_unchecked(relationship,param)
    param['action'] != 'new' && relationship.name.nil?
  end
  
  def get_opposite_parent_type(parent)
    opposite = parent == "mother"? "father" : "mother"
  end

  def new_or_edit_link(patient,step_no,step_name)

    if patient.new_record?
      link_to step_name, :controller => "people", :action => "new", :step => step_no
    else
      person = case
       when step_no == 1 : patient
       when step_no == 2 : patient.mother.first
       when step_no == 3 : patient.father.first
       when step_no == 4 : patient
      end
    
      if !person
        link_to step_name, :controller => "people", :action => "new", :step => step_no
      else
        link_to step_name, :controller => "people", :id => person.id, :action => "edit", :step => step_no
      end
    
    end
  
  end
  
  def get_patient(patient_id)
    patient = patient_id.nil? ? Person.new : Person.find(patient_id)  
  end
  
  def patient_has_one_parent_and_person_is_not_parent(patient,person)
    @patient.opposite_parent(@person) && !@patient.is_person_parent(@person)
  end
  
  def get_or_create_parents_relationship(patient,person)
    opposite_parent = patient.opposite_parent(person)
    relationship = person.relationships.select{|attributes| attributes['person_id'] == opposite_parent.id || attributes['relation_id'] == opposite_parent.id}
    relationship = relationship.empty? ? person.relationships.build : relationship.first 
  end
  
  def set_actions_element(action)
    Rails.logger.debug "xx - action :: #{action} is :: #{action.nil?}"
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
  
  
end
