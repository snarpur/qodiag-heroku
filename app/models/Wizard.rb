class Wizard
  attr_reader :next_step, :patient_id
  attr_writer :current_step

  def initialize(patient_id=nil)
    @patient_id = patient_id
  end
  
  def current_step
    @current_step || steps.first
  end
  

  def steps
    %w[child mother father finnish]
  end
  
  def step(step_no)
    self.current_step = steps[step_no - 1]
  end
  
  def next_step
    self.current_step = steps[steps.index(current_step)+1]
  end

  def previous_step
    self.current_step = steps[steps.index(current_step)-1]
  end
  
  
  def current_step_no
    steps.index(current_step)+1
  end
  
  def next_step_no
    steps.index(current_step)+2
  end

  def previous_step_no
    steps.index(current_step)
  end

  def first_step?
    current_step == steps.first
  end

  def last_step?
    current_step == steps.last
  end
  
  def next_is_last?
    next_step_no  == steps.size
    
  end
  
 
end
