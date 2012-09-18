class Relationship < ActiveRecord::Base
  #validates_presence_of :status, :if => Proc.new {|a| a.name == 'spouse' || a.name == 'guardian'}
  belongs_to :person
  belongs_to :relation, :class_name => "Person", :foreign_key => :person_id
  belongs_to :inverse_relation, :class_name => "Person", :foreign_key => :relation_id

  



  # after_save :delete_nameless, :if => :is_nameless?
  after_create :split_names
  validate :name_presence
  accepts_nested_attributes_for :person, :relation
  attr_accessible :person_id, :relation_id, :name, :start, :end, :relation_attributes, :inverse_relation_attributes

  def name_presence
    name.delete("") if name.is_a?(Array)
    errors.add(:name, I18n.t('activerecord.errors.messages.blank')) if
      name.is_a?(Array) && name.empty?
  end

  private
  def delete_nameless
     self.destroy 
  end
  
  def is_nameless?
    (name == nil)
  end

  def split_names
     self.name.delete("") if self.name.is_a?(Array)
    if self.name.is_a?(Array) && !self.name.empty?
      names = self.name
      first = names.pop
      names.each do |n|
        copy = self.clone
        copy.name = n.strip
        copy.save
      end
      self.update_attribute(:name,first)
    end
  end
end
