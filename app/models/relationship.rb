class Relationship < ActiveRecord::Base
  #validates_presence_of :status, :if => Proc.new {|a| a.name == 'spouse' || a.name == 'guardian'}
  belongs_to :person
  belongs_to :relation, :class_name => "Person"
  belongs_to :inverse_relation, :class_name => "Person"
  

  accepts_nested_attributes_for :person, :relation
  attr_accessible :person_id, :relation_id, :name, :start, :end, :status, :relation_attributes

    
end
