module PeopleHelper
  # STEPS = ["patient", "mother", "father", "finnish"]
  
 
  def set_parent_gender(parent)
    gender = parent == "mother"? "female" : "male"
  end
  
  # def next_step(current_step)
  #   next_step_index = STEPS.index(current_step)  + 1
  #   STEPS.at(next_step_index)
  # end
  
  def get_opposite_parent_type(parent)
    opposite = parent == "mother"? "father" : "mother"
  end

  def patient_has_one_parent_and_person_is_not_parent(patient,person)
    @patient.opposite_parent(@person) && !@patient.is_person_parent(@person)
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
  
  def parent_relationship_type(patient, person)
    relationship = patient.parents_relationship
     RAILS_DEFAULT_LOGGER.debug "xx - relationship[0] #{patient.parents_relationship}"
    if person.id == relationship[0].person_id
      :relationships
    else
      :inverse_relationships
    end
  
  end
  
  
end
