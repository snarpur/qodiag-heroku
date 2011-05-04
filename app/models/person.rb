class Person < ActiveRecord::Base

  validates_presence_of :firstname, :sex  #, :lastname, :sex, :full_date
  #validate :presence_of_cpr
  #validates_numericality_of :cpr, :full_date
  #validates_length_of :full_date, :is => 6
  #validates_length_of :cpr, :is => 4
  #validate :presence_of_parent_occupation
  #after_save :set_parents_address

  after_initialize :person_factory, :if => :new_record?

  attr_accessor :factory

  has_many :responder_items

  has_many :responder_items_as_subject, :class_name => "RepsonderItem", :foreign_key => "subject_id"

  has_many  :relationships, :dependent => :destroy do
    def child
      find(:all, :conditions => "name = 'parent'")
    end

    def spouse
      find(:all, :conditions => "name = 'spouse'")
    end

    def guardian(id)
      find(:all, :conditions => "name = 'guardian' AND relation_id = #{id}")
    end

  end

  has_many :inverse_relationships, :class_name => "Relationship", :foreign_key => "relation_id" do
    def spouse
     find(:all, :conditions => "name = 'spouse'")
    end
  end

  has_many  :relations, :through => :relationships do
    def children
      find(:all, :conditions => "name = 'parent'")
    end
    def guardian_of
      find(:all, :conditions => "name = 'guardian'")
    end
    def spouse
      find(:all, :conditions => "name = 'spouse'")
    end
    def patients
      find(:all, :conditions => "name = 'patient'")
    end
  end

  has_many :inverse_relations, :through => :inverse_relationships, :source => :person do
    def parents
      find(:all,:conditions => "relationships.name = 'parent'" )
    end

    def specialists
      find(:all,:conditions => "relationships.name = 'patient'" )
    end

    def mother
      find(:all,:conditions => "relationships.name = 'parent' AND sex = 'female'" )
    end

    def father
      find(:all,:conditions => "relationships.name = 'parent' AND sex = 'male'" )
    end

    def spouse
      find(:all, :conditions => "name = 'spouse'")
    end
    def guardians
     find(:all, :conditions => "name = 'guardian' AND end IS NULL")
    end
  end


  belongs_to :address

  accepts_nested_attributes_for :relations, :allow_destroy => true
  accepts_nested_attributes_for :relationships, :allow_destroy => true #,  :reject_if => proc {|attributes| attributes['person_id'].blank?}
  accepts_nested_attributes_for :inverse_relationships, :allow_destroy => true
  accepts_nested_attributes_for :inverse_relations, :allow_destroy => true
  accepts_nested_attributes_for :address, :allow_destroy => true
  accepts_nested_attributes_for :responder_items, :allow_destroy => true


  attr_accessible :firstname, :lastname, :sex, :ispatient, :dateofbirth, :cpr, :workphone, :mobilephone, :occupation, :workplace, :full_cpr,
                  :address_id,
                  :relations_attributes, :inverse_relations_attributes, :relationships_attributes, :inverse_relationships_attributes,  :address_attributes, :factory,
                  :responder_items_attributes

  validates_associated :relationships, :inverse_relationships, :address
  def user
    User.where(:person_id => self.id).first
  end

  def pending_patient_responder_items
    ResponderItem.joins(:subject => :inverse_relationships).
    where("relationships.name = 'patient' and relationships.person_id = '#{self.id}'")
  end


  def presence_of_cpr
    errors.add(:cpr, "má ekki vera autt") if
      ispatient == true and cpr.nil?
  end

  def presence_of_parent_occupation
    errors.add(:occupation, "má ekki vera autt") if
      !relationships.select{|v|v.name == "guardian" || "parent"}.empty? and occupation.try("empty?")
  end

  def full_cpr
    unless self.dateofbirth.nil?
      date = self.dateofbirth
      day = "%02d" % date.mday
      month = "%02d" % date.month
      year =  date.year.to_s[-2..-1].to_i
      self.full_cpr = "#{day}#{month}#{year}#{self.cpr}"
    end
  end

  def full_cpr=(cpr)
    unless cpr.empty?
      day = cpr[0..1]
      month = cpr[2..3]
      year = cpr[4..5].to_i > 10 ? "19" << cpr[4..5] : "20" << cpr[4..5]
      self.dateofbirth = Date.civil(year.to_i,month.to_i,day.to_i)
      self.cpr = cpr[6..9]
    end
  end

  def mother
    self.inverse_relations.mother.first
  end

  def father
    self.inverse_relations.father.first
  end

  def parents
    self.inverse_relations.parents
  end

  def spouse_relationships
    self.relationships.spouse + self.inverse_relationships.spouse
  end

  def spouses
    self.relations.spouse + self.inverse_relations.spouse
  end

  def full_siblings
    full_siblings = self.mother.relations.children & self.father.relations.children
    full_siblings.delete(self)
    full_siblings
  end

  def non_parent_guardians
    self.inverse_relations.guardians - self.parents
  end

  def half_siblings(parent)
    parent.relations.children - self.opposite_parent(parent).relations.children
  end

  def foster_siblings
    blood_related = self.parents.map {|i| i.relations.children}.flatten
    all = (self.mother.spouses + self.father.spouses).map {|i| i.relations.children}.flatten
    all - blood_related
  end

  def is_person_parent(person)
    self.parents.include?(person)
  end

  def opposite_parent(parent)
      self.parents.select{|i| i != parent}.first
  end

  def parents_relationship
    parents = self.parents
    if parents.size <= 1
      nil
    else
       parents[0].spouse_relationships & parents[1].spouse_relationships
    end
  end


  def get_association(name)
    self.send(:relationships).map {|r| r.name == name.to_s}
  end

  private

  def person_factory
    unless self.factory.nil?
      case self.factory[:name]
      when :patient
        self.factory[:relation].relationships << self.inverse_relationships.build(:name => "patient")
      when :child
       self.factory[:relation].relationships.build(:name => "parent,guardian").inverse_relation  = self
      end
    end
  end

end
