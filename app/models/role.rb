class Role < ActiveRecord::Base
  has_many :role_users
  has_many :users, :through => :role_users
  accepts_nested_attributes_for :users, :allow_destroy => true
  attr_accessor :users_attributes
  
  validates_presence_of :name
  
  ROLE_TYPES = [ "System administrator","Staff","Client","Responder" ]
end