class Relationship < ActiveRecord::Base
  #validates_presence_of :status, :if => Proc.new {|a| a.name == 'spouse' || a.name == 'guardian'}
  
  belongs_to :person
  belongs_to :relation, :class_name => "Person"
  belongs_to :inverse_relation, :class_name => "Person"
  
  attr_accessor :status
  accepts_nested_attributes_for :person, :relation
  attr_accessible :person_id, :relation_id, :name, :start, :end, :status, :relation_attributes
  
  def status
    if self.new_record?
      status = -1
    elsif self.end.nil?
      status = 0
    else
      status = 1
    end
  end
  
  
end
