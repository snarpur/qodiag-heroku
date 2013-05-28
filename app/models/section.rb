class Section < ActiveRecord::Base
  has_many :entry_sets_sections
  has_many :sections_entry_fields
  has_many :entry_sets, :through => :entry_sets_sections
  has_many :entry_fields, :through => :sections_entry_fields
  
  accepts_nested_attributes_for :entry_fields, :sections_entry_fields, :entry_sets_sections
  attr_accessible :description, :name, :sections_entry_fields_attributes, :entry_sets_sections_attributes 



end
