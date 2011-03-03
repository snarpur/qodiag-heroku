class Role < ActiveRecord::Base
  has_and_belongs_to_many :users
  accepts_nested_attributes_for :users, :allow_destroy => true
  attr_accessor :users_attributes
  
  validates_presence_of :name
  
  ROLE_TYPES = [ "System administrator","Staff","Client","Responder" ]
end