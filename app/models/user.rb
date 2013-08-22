class User < ActiveRecord::Base
  has_many :rights
  has_many :roles, :through => :rights
  belongs_to :person


  attr_accessor  :invitation


  devise :invitable, :database_authenticatable,
         :recoverable, :rememberable, :trackable


  attr_accessible :email, :password, :password_confirmation, :role_ids, :remember_me, :person_attributes, :invitation_token, :invitation, :invited_by_id
  accepts_nested_attributes_for :person
  validates_presence_of :email
  validates_format_of :email, :with => /\A([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})\Z/i
  validates_uniqueness_of :email
  validates_confirmation_of :password
  validates_presence_of :password, :password_confirmation, :unless => :invitation?
  validates_length_of :password, :in => 6..20, :unless => :invitation?
  validates_associated :person

  scope :by_role, lambda {|r| joins(:roles).where("roles.name" => r)}
  
  def invitation?
    self.invitation ||= false
  end
  
  def is_invited?
    !invitation_sent_at.nil?
  end

  def role?(role)
    return !!self.roles.find_by_name(role.to_s)
  end

  def role_names
    self.roles.map{|r| r[:name]}
  end

  def role_name
    self.roles.first.name
  end

  def set_role(name)
    self.roles << Role.find_by_name(name.to_sym)
  end

  def is_superadmin?
    role?('super_admin')
  end

  def is_caretaker?
    role?('caretaker')
  end

end

