class Address < ActiveRecord::Base
  has_many :people, :before_add => :set_parents_address
  #validates_presence_of :street_1
  #validates_length_of :street_1, :minimum => 2
 

  
  accepts_nested_attributes_for :people
  attr_accessible :street_1, :street_2, :zip_code, :town, :country, :home_phone


end
