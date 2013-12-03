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

  #Relation with EntryFieldOption
  has_many :entry_field_options, dependent: :destroy

  scope :public_sets, where("visibility = 1")
  scope :by_author, lambda {|person_id| where("created_by_id = ?", person_id)} 

  accepts_nested_attributes_for :entry_field_options, :allow_destroy => true, reject_if: :reject_options

  attr_accessible :entry_values_attributes, :entry_field_options_attributes, :field_type, :title, :description

  def reject_options(attributed)
    attributed['text_option'].blank?
  end

  def multichoice_with_options
    if field_type == "multi-choice"
      if entry_field_options.nil? or entry_field_options.size == 0
        errors.add(:field_options, "Multichoice has to have at least one option")
        return false
      end
    end
    return true
  end

  def self.by_author_or_public(person_id) 
    where("visibility = ? OR created_by_id = ?", 1, person_id)
  end

  def get_or_initialize_entry_value(entry_set_response_id)
    KK.log entry_set_response_id
    self.entry_values.by_response(entry_set_response_id).first #_or_initialize
  end

  def response_values_for_person(person,entry_set_response)
    self.entry_values.person(person.id).by_response(entry_set_response.id)
  end

  #Attribute overwritten
  def field_type
    read_attribute(:field_type).nil? ? "text" : read_attribute(:field_type)
  end

end
