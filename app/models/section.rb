class Section < ActiveRecord::Base
  has_and_belongs_to_many :entry_sets
  has_many :sections_entry_fields
  has_many :entry_fields, :through => :sections_entry_fields
  
  accepts_nested_attributes_for :entry_fields, :sections_entry_fields
  attr_accessible :description, :name , :sections_entry_fields_attributes #, :section_entry_fields


end
