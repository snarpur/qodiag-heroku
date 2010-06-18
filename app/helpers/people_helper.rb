module PeopleHelper
  STEPS = ["patient", "mother", "father", "finnish"]
  
 
  def set_parent_gender(parent)
    gender = parent == "mother"? "female" : "male"
  end
  
  def next_step(current_step)
    next_step_index = STEPS.index(current_step)  + 1
    STEPS.at(next_step_index)
  end
  
  def get_opposite_parent_type(parent)
    opposite = parent == "mother"? "father" : "mother"
  end
  
  def patient_has_opposite_parent(patient,current_parent)
    !patient.send(get_opposite_parent_type(current_parent)).empty?
  end
  
  def get_opposite_parent(patient,current_parent)
    patient.send(get_opposite_parent_type(current_parent)).first
  end
end
