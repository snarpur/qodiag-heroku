class Role < ActiveRecord::Base
  has_many :rights
  has_many :users, :through => :rights


  validates_presence_of :name



end