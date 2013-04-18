class EntrySet < ActiveRecord::Base
  attr_accessible :created_by_id, :description, :name, :type
end
