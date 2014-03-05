class Person < ActiveRecord::Base

  validate :uniqueness_of_full_cpr
  #validates_presence_of :firstname , :sex, :lastname
  #validate :presence_of_full_cpr
  #validates_length_of :full_cpr, :is => 10, :allow_nil => true
  #validates_length_of :cpr, :is => 4
  #validates_length_of :firstname, :minimum => 4
  #validate :presence_of_parent_occupation

  
  

  belongs_to :address
  has_one :user
  has_many :respondent_responder_items, :class_name => "ResponderItem", :foreign_key => "respondent_id"
  has_many :patient_responder_items, :class_name => "ResponderItem", :foreign_key => "subject_id"
  has_many :caretaker_responder_items, :class_name => "ResponderItem", :foreign_key => "caretaker_id"

  scope :with_valid_user, where("EXISTS(SELECT 1 from users where users.person_id = relationships.person_id)")
  
  # Added in order to reflect the relationship between  entry_sets and users
  has_many :entry_sets, :foreign_key => "created_by_id"

  # Added in order to reflect the relationship between  entry_sets and users
  has_many :entry_fields, :foreign_key => "created_by_id"


  has_many  :relationships,:dependent => :destroy do
    def child
      where("name = 'parent'")
    end

    def spouse
      where("name = 'spouse'")
    end
  end

  has_many :inverse_relationships, :class_name => "Relationship", :foreign_key => "relation_id" do
    def spouse
      where("name = 'spouse'")
    end
    def parents
      where("name = 'parent'")
    end

    def guardians
     where("name = 'guardian'")
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
    def caretakers
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
      where("name = 'guardian'")
    end

    def respondents
      where("name = 'respondent'")
    end
  end
  



  accepts_nested_attributes_for :user, :allow_destroy => true
  accepts_nested_attributes_for :relations, :allow_destroy => true
  accepts_nested_attributes_for :relationships, :allow_destroy => true
  accepts_nested_attributes_for :inverse_relationships, :allow_destroy => true
  accepts_nested_attributes_for :inverse_relations, :allow_destroy => true
  accepts_nested_attributes_for :address, :allow_destroy => true
  accepts_nested_attributes_for :respondent_responder_items, :allow_destroy => true
  accepts_nested_attributes_for :patient_responder_items, :allow_destroy => true


  attr_accessible :id, :firstname, :lastname, :sex, :ispatient, :dateofbirth, :cpr, :workphone, :mobilephone, :occupation, :workplace, :full_cpr,
                  :avatar,
                  :address_id, :relations_attributes, :inverse_relations_attributes, :relationships_attributes, :inverse_relationships_attributes, :address_attributes, 
                  :spouse_relationships_attributes, :respondent_responder_items_attributes, :patient_responder_items_attributes, :user_attributes
                 
  validates_associated :relationships, :inverse_relationships, :address 

  

  has_attached_file :avatar,
    :styles => {
        :tiny=> "64x64#",
        :thumb=> "100x100#",
        :small  => "150x150#",
        :medium => "200x200#",
        :large =>   "400x400#" },
    :default_url => "/avatars/:style/:sex.png"


  def sex?
    self.sex == nil
  end

  def is_user?
    !self.user.nil?
  end

  attr_accessor :current_responder_item
  
  delegate :email, :is_invited?,:invite!,
           :to => :user, :prefix => true


  RELATIONSHIP_NAMES = %w{parent respondent guardian patient spouse}


  def self.relationship_names
    RELATIONSHIP_NAMES
  end

   RELATIONSHIP_NAMES.each do |name|
    define_method("inverse_#{name}_relationship_to") do |person|
      self.inverse_relationships & Relationship.where(:person_id => person.id, :name => name)
    end
    
    define_method("#{name}_relationship_to") do |person|
      self.relationships & Relationship.where(:relation_id => person.id, :name => name)
    end

    define_method("build_inverse_#{name}_relationship_to") do |person,*arg|
      status = arg[0] || {:status => true}
      self.inverse_relationships.build({:person_id => person.id, :name => name}.merge(status))
    end

    define_method("build_#{name}_relationship_to") do |person,*arg|
      status = arg[0] || {:status => true}
      self.relationships.build({:relation_id => person.id, :name => name}.merge(status))
    end

    define_method("find_or_build_inverse_#{name}_relationship_to") do |person,*arg|
      status = arg[0] || {:status => true}
      relationship = self.inverse_relationships & Relationship.where(:person_id => person.id, :name => name)
      if relationship.empty?
        relationship = self.inverse_relationships.build({:person_id => person.id, :name => name}.merge(status))
      else
        relationship.first
      end
    end
    
    define_method("find_or_build_#{name}_relationship_to") do |person,*arg|
      status = arg[0] || {:status => true}
      relationship = self.relationships & Relationship.where(:relation_id => person.id, :name => name)
      if relationship.empty?
        relationship =  self.relationships.build({:relation_id => person.id, :name => name}.merge(status))
      else
        relationship.first
      end
    end
  end

  def guardianship_relations
    self.relations.guardian_of
  end
  
  def responder_items
    self.send("#{self.role}_responder_items")
  end

  def responder_items_by_type_and_status(name,status=:all)
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

  #DELETE: Used in the test files
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
    if dateofbirth
      if Date.current.month > dateofbirth.month
        Date.current.year - dateofbirth.year
      elsif Date.current.month >= dateofbirth.month && Date.current.day >= dateofbirth.day
        Date.current.year - dateofbirth.year
      else
        if (Date.current.year - dateofbirth.year != 0)
          Date.current.year - dateofbirth.year - 1
        else
          Date.current.year - dateofbirth.year
        end
      end
    end
  end

  def uniqueness_of_full_cpr
    if self.id?
      if (Person.where(:dateofbirth => dateofbirth, :cpr => cpr).where('id != ?', id).exists?)
        errors.add(:full_cpr, I18n.t("activerecord.errors.messages.taken"))
        return false
      end
      return true
    else
      if (Person.where(:dateofbirth => dateofbirth, :cpr => cpr).exists?)
        errors.add(:full_cpr, I18n.t("activerecord.errors.messages.taken"))
        return false
      end
      return true
    end
  end

  def valid_cpr?
    cpr.to_s.length == 4 ? true : false
  end

  def full_cpr
    unless self.dateofbirth.nil?
      "#{self.dateofbirth.strftime("%d%m%y")}#{self.cpr}"
    end
  end

  #FIX: Exception on invalid date
  def full_cpr=(cpr)
    unless cpr.empty?
      day = cpr[0..1]
      month = cpr[2..3]
      flag = cpr[9]
      if (flag == "0") 
        year = "20" << cpr[4..5] 
      else 
        year = "19" << cpr[4..5]
      end
      self.dateofbirth = Date.civil(year.to_i,month.to_i,day.to_i)
      self.cpr = cpr[6..9]
    end
  end

  def family
    unless cpr.empty?
      r = [0 => '--']
      entry = NationalRegister.find_by_kennitala(full_cpr)
      unless entry.nil?
        family = NationalRegister.where(:fjolskyldunumer => entry.fjolskyldunumer)

        family.each do |member|
          day = member.kennitala[0..1]
          month = member.kennitala[2..3]
          year = member.kennitala[4..5].to_i > 10 ? "19" << member.kennitala[4..5] : "20" << member.kennitala[4..5]
          dob = Date.civil(year.to_i,month.to_i,day.to_i)
          age = Date.today.strftime("%Y").to_i - dob.year

          if age <= 18
            r.push(member.kennitala => "#{member.nafn} [#{member.kennitala}]")
          end
        end
      end
      r
    end
  end

  def full_name
    "#{self.firstname} #{self.lastname}"
  end

  def parents
    self.inverse_relations.parents
  end

  #DELETE: Not sure if it is in use
  def guardians
    self.inverse_relations.guardians
  end
  
  def caretakers
    self.inverse_relations.caretakers
  end
  
  def spouse_relationships
    self.relationships.spouse + self.inverse_relationships.spouse
  end

  def spouse_relationships_attributes=(params)
    params.each do |i|
      if !i.has_key?(:id) || i[:id] == nil
        if i[:relation_id] == self.id
          self.inverse_relationships.build(i)
        else
          self.relationships.build(i)
        end
      elsif i[:relation_id] == self.id
        self.inverse_relationships.find(i[:id]).update_attributes(i)
      elsif i[:person_id] == self.id
        self.relationships.find(i[:id]).update_attributes(i)
      end
    end
  end

  #DELETE: Not sure if it is in use
  def mother
    self.inverse_relations.mother.first
  end

  #DELETE: Not sure if it is in use
  def father
    self.inverse_relations.father.first
  end


  def respondents
    self.inverse_relations.respondents.with_valid_user
  end
  

  def guardian_respondent
    guardian = User.joins(:person => :relationships).
    where("relationships.name = 'guardian' AND relationships.relation_id = #{self.id}")

    if (guardian.empty?)
      return nil
    else
      return guardian.first.person
    end
  end

  def opposite_parent_relation(parent)
      self.parents.select{|i| i.id != parent.id}.first
  end

  def find_or_create_opposite_parent_relation(parent)
    opposite_parent_relation(parent) || self.inverse_relations.build() 
  end

  def other_parent_of(child)
    return child.parents.first if self.new_record?
    Person.joins(:relationships).where('relationships.name = ? AND relationships.relation_id = ? AND relationships.person_id != ?', 'parent', child.id, self.id).first
  end
  
end    