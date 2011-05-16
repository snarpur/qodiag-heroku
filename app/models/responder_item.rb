class ResponderItem < ActiveRecord::Base
  belongs_to :client, :class_name => "Person"
  belongs_to :caretaker, :class_name => "Person"
  belongs_to :subject, :class_name => "Person"

  # scope :overdue, where("deadline < ? AND completed = ?", Time.zone.now, nil)
  scope :overdue, where("deadline < ? AND completed IS NULL", Time.zone.now)
  scope :uncompleted, where("deadline >= ? AND completed IS NULL", Time.zone.now)
  scope :recently_completed, where("completed IS NOT NULL")
  accepts_nested_attributes_for :client
  accepts_nested_attributes_for :subject

  attr_accessible :registration_identifier, :id, :caretaker_id, :deadline, :client_id, :subject_id, :client_attributes, :subject_attributes

  validates_associated :client

  def complete_item=(complete_item)
   self.completed = Time.zone.now
  end

  def complete_item
  end






end
