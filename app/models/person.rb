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

  # has_one :user
  has_many :client_responder_items, :class_name => "ResponderItem", :foreign_key => "client_id"
  has_many :patient_responder_items, :class_name => "ResponderItem", :foreign_key => "subject_id"
  has_many :caretaker_responder_items, :class_name => "ResponderItem", :foreign_key => "caretaker_id"
  has_many  :relationships, :dependent => :destroy do
    def child
      where("name = 'parent'")
    end

    def spouse
      where("name = 'spouse'")
    end

    def guardian(id)
      where("name = 'guardian' AND relation_id = #{id}")
    end

  end

  has_many :inverse_relationships, :class_name => "Relationship", :foreign_key => "relation_id" do
    def spouse
      where("name = 'spouse'")
    end
    def parents
      where("name = 'parent'")
    end
  end

  has_many  :relations, :through => :relationships do
    def children
      where("relationships.name = 'parent'")
    end
    def guardian_of
      where("relationships.name = 'guardian'")
    end
    def spouse
      where("relationships.name = 'spouse'")
    end
    def patients
      where("relationships.name = 'patient'")
    end
  end

  has_many :inverse_relations, :through => :inverse_relationships, :source => :person do
    def caretaker
      where("name = 'patient'")
    end

    def mother
      where("name = 'parent' AND people.sex = 'female'" )
    end

    def father
      where("name = 'parent' AND people.sex = 'male'" )
    end

    def spouse
      where("name = 'spouse'")
    end

    def parents
      where("name = 'parent'")
    end

    def guardians
     where("name = 'guardian' AND end IS NULL")
    end
  end


  belongs_to :address
  has_one :user
  accepts_nested_attributes_for :relations, :allow_destroy => true
  accepts_nested_attributes_for :relationships, :allow_destroy => true #,  :reject_if => proc {|attributes| attributes['person_id'].blank?}
  accepts_nested_attributes_for :inverse_relationships, :allow_destroy => true
  accepts_nested_attributes_for :inverse_relations, :allow_destroy => true
  accepts_nested_attributes_for :address, :allow_destroy => true
  accepts_nested_attributes_for :client_responder_items, :allow_destroy => true
  accepts_nested_attributes_for :patient_responder_items, :allow_destroy => true


  attr_accessible :firstname, :lastname, :sex, :ispatient, :dateofbirth, :cpr, :workphone, :mobilephone, :occupation, :workplace, :full_cpr,
                  :address_id,
                  :relations_attributes, :inverse_relations_attributes, :relationships_attributes, :inverse_relationships_attributes,  :address_attributes, :factory,
                  :client_responder_items_attributes, :patient_responder_items_attributes #, :user_attributes

  validates_associated :relationships, :inverse_relationships, :address

  delegate :email,
           :to => :user, :prefix => true


  def self.new_as_guardian_by_invitation(inviter)
    person = Person.new
    child = person.relations.build
    person.relationships.build(:name => "guardian").inverse_relation  = child
    registration = person.client_responder_items.build( :registration_identifier => "client_registration",
                                                        :caretaker_id => inviter.id,
                                                        :deadline => Time.zone.now.advance(:weeks => 2))
    child.inverse_relationships.build(:name=> "patient", :person_id => inviter.id)
    person
  end

  def responder_items
    self.send("#{self.role}_responder_items")
  end

  def responder_items_by_name_and_status(name,status=:all)
      status = status.is_a?(Array) ? status : [status]
      items = []

      status.each do |s|
        if name.eql?(:all)
          item_group = self.responder_items & ResponderItem.send(s)
        else
          item_group = self.responder_items & ResponderItem.send(name).send(s)
        end
        items << {:name => s, :items => item_group} unless item_group.empty?
      end
      items
  end

  def responder_items_by_group
    items = self.responder_items.surveys_by_group
    groups, groups_arr = {},[]
    items.each_with_index do |item,index|
      groups[item.access_code] ||= []
      groups[item.access_code] << item
        if item == items.last || items[index + 1].access_code != item.access_code
          groups_arr << {:name => item.access_code, :items => groups[item.access_code]}
        end
     end
     groups_arr
  end

  def role
    role = self.user.nil? ? 'patient' : self.user.role_name
  end

  def age
   Time.diff(Date.current.end_of_day,self.dateofbirth)[:year]
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
  def full_name
    "#{self.firstname} #{self.lastname}"
  end

  # def user
  #   User.where(:person_id => self.id).first
  # end

  def mother
      self.inverse_relations.mother.first
    end

  def guardian_client
      User.joins(:person => :relationships).
        where("relationships.name = 'guardian' AND relationships.relation_id = #{self.id}").
        first.person
  end

  def new_patient_request(patient_id)
    ResponderItem.new_patient_item(patient_id, self)
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

  def set_responder_item_subject
   responder_items = self.client_responder_items
    unless responder_items.empty?
      responder_items.last.update_attribute("subject_id", self.relations.guardian_of.last.id)
    end
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
