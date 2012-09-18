class ResponderItem < ActiveRecord::Base
  belongs_to :person
  belongs_to :respondent, :class_name => "Person"
  belongs_to :caretaker, :class_name => "Person"
  belongs_to :subject, :class_name => "Person"
  belongs_to :survey
  belongs_to :response_set

  delegate :response_to_chart, :to => :response_set
  before_save :set_response_set, :if => :is_uncompleted_survey?

  scope :overdue, where("deadline < ? AND completed IS NULL", Time.zone.now)
  scope :uncompleted, where("deadline >= ? AND completed IS NULL", Time.zone.now)
  scope :recently_completed, where("completed IS NOT NULL")
  scope :completed, where("completed IS NOT NULL")
  scope :surveys, where("survey_id IS NOT NULL").joins(:survey).select("surveys.access_code, responder_items.*")
  scope :surveys_by_id, lambda {|survey_id| where("survey_id = ?", survey_id).joins(:survey).select("surveys.access_code, responder_items.*")}
  scope :registrations, where("registration_identifier IS NOT NULL").order(:id)
  scope :surveys_by_group, ResponderItem.surveys.order('survey_id')
  scope :by_respondent, lambda {|respondent_id| where("respondent_id = ?", respondent_id)}
  scope :by_subject, lambda {|subject_id| where("subject_id = ?", subject_id)} 
  accepts_nested_attributes_for :respondent, :subject, :person

  attr_accessible :registration_identifier, :id, :caretaker_id, :deadline, :completed, :complete_item, :respondent_id, :subject_id, :survey_id, :subject_attributes, :respondent_attributes
  validates_presence_of :registration_identifier, :if => Proc.new { |a| a.survey_id.nil? }
  # validates_associated :respondent


  def self.new_patient_item(params,caretaker)
    ResponderItem.new(params.merge({:caretaker_id => caretaker.id}))
  end

  def self.to_line_chart(params)
    ResponseSet.to_line_chart(params[:survey_id], params[:respondent_id])
  end

  def opposite_parent_relation
    subject.find_or_create_opposite_parent_relation(respondent)
  end

  def opposite_parent_relationship
    subject.find_or_create_opposite_parent_relationship(respondent)
  end

  def opposite_parent_guardian_relationship
    subject.find_or_create_opposite_parent_guardian_relationship(respondent)
  end

  def parents_relationship
    subject.parents_relationship
  end
  
  def access_code
    self.survey.nil? ? self.registration_identifier : self.survey.access_code
  end

  def item_type
    self.survey.nil? ? 'registration' : 'survey'
  end

  def complete_item=(is_complete)
   if is_complete.to_i == 1 && self.completed.nil?
    self.completed = Time.zone.now
   end
  end

  def complete_item
  end

  def result
    self.response_set.result_to_chart
  end

  private
  def is_uncompleted_survey?
    (!self.survey_id.nil? && self.completed.nil?)
  end

  def set_response_set
    self.response_set=(ResponseSet.create(:survey_id => self.survey_id, :user_id => self.respondent.user.id))
  end
end
