class EntrySet < ActiveRecord::Base
  has_many :entry_sets_sections
  has_many :sections, :through => :entry_sets_sections
  has_many :entry_set_response
  attr_accessible :created_by_id, :description, :name, :type, :visibility
  
  # Added in order to reflect the relationship between  entry_sets and users
  belongs_to :person

  scope :public_sets, where("visibility = 0")
  scope :by_author, lambda {|person_id| where("created_by_id = ?", person_id)} 

  def self.by_author_or_public(person_id) 
  	where("visibility = ? OR created_by_id = ?", 0, person_id)
  end

end
