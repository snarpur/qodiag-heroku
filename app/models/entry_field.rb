class EntryField  < ActiveRecord::Base
  has_many :entry_values do
   def caretaker(caretaker_id,entry_set_response_id)
      where(:person_id => caretaker_id, :entry_set_response_id => entry_set_response_id)
    end
  end 
  has_many :sections_entry_fields
 
  has_many :sections, :through => :sections_entry_fields
  

  def get_or_initialize_entry_value(entry_set_response_id)
    self.entry_values.by_response(entry_set_response_id).first #_or_initialize
  end

end
