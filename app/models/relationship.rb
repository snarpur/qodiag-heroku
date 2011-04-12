class Relationship < ActiveRecord::Base
  #validates_presence_of :status, :if => Proc.new {|a| a.name == 'spouse' || a.name == 'guardian'}
  belongs_to :person
  belongs_to :relation, :class_name => "Person"
  belongs_to :inverse_relation, :class_name => "Person"
  after_create :split_names

  accepts_nested_attributes_for :person, :relation
  attr_accessible :person_id, :relation_id, :name, :start, :end, :status, :relation_attributes, :inverse_relation_attributes


  private
  def split_names
    unless self.name =~ /,/.nil?
      names = self.name.split(",")
      first = names.pop.split
      names.each do |n|
        copy = self.clone
        copy.name = n.strip
        copy.save
      end
      self.update_attribute(:name,first)
    end
  end
end
