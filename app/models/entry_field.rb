class EntryField  < ActiveRecord::Base
  has_many :entry_values do
   def person(person_id)
      where(:person_id => person_id)
    end
  end 
  has_many :sections_entry_fields
 
  has_many :sections, :through => :sections_entry_fields
  
  # Added in order to reflect the relationship between  entry_sets and users
  belongs_to :person

  scope :public_sets, where("visibility = 1")
  scope :by_author, lambda {|person_id| where("created_by_id = ?", person_id)} 

  def self.by_author_or_public(person_id) 
    where("visibility = ? OR created_by_id = ?", 1, person_id)
  end

  def get_or_initialize_entry_value(entry_set_response_id)
    self.entry_values.by_response(entry_set_response_id).first #_or_initialize
  end

  def response_values_for_person(person,entry_set_response)
    self.entry_values.person(person.id).by_response(entry_set_response.id)
  end

end
