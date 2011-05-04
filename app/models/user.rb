class User < ActiveRecord::Base
  has_many :rights
  has_many :roles, :through => :rights
  belongs_to :person
  attr_accessor :users_attributes, :invitation


  devise :invitable, :database_authenticatable,
         :recoverable, :rememberable, :trackable


  attr_accessible :email, :password, :password_confirmation, :role_ids, :remember_me, :person_attributes, :invitation
  accepts_nested_attributes_for :person
  validates_presence_of :email
  validates_format_of :email, :with => /\A([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})\Z/i
  validates_uniqueness_of :email
  validates_confirmation_of :password
  validates_presence_of :password, :password_confirmation, :unless => :invitation?
  validates_length_of :password, :in => 6..20, :unless => :invitation?
  validates_associated :person


  def invitation?
    self.invitation ||= false
  end

  def role?(role)
    return !!self.roles.find_by_name(role.to_s)
  end

  def role_names
    self.roles.map{|r| r[:name]}
  end

end

