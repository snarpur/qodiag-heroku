class EntrySet < ActiveRecord::Base
  has_many :entry_sets_sections
  has_many :sections, :through => :entry_sets_sections
  has_one :entry_set_response
  attr_accessible :created_by_id, :description, :name, :type
end
