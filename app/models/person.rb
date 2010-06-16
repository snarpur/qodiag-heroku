class Person < ActiveRecord::Base
  has_many :relationships, :dependent => :destroy
  has_many :relations, :through => :relationships
  
  accepts_nested_attributes_for :relations, :allow_destroy => true
  accepts_nested_attributes_for :relationships, :allow_destroy => true
  
  attr_accessible :firstname, :lastname, :sex, :ispatient, 
                  :relations_attributes, :relationships_attributes
end
