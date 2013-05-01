class EntrySet < ActiveRecord::Base
  has_and_belongs_to_many :sections
  attr_accessible :created_by_id, :description, :name, :type
end
