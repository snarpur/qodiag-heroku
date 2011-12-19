class ResponderItem < ActiveRecord::Base
  belongs_to :client, :class_name => "Person"
  belongs_to :caretaker, :class_name => "Person"
  belongs_to :subject, :class_name => "Person"
  belongs_to :survey
  belongs_to :response_set

  before_save :set_response_set, :if => :is_uncompleted_survey?

  scope :overdue, where("deadline < ? AND completed IS NULL", Time.zone.now)
  scope :uncompleted, where("deadline >= ? AND completed IS NULL", Time.zone.now)
  scope :recently_completed, where("completed IS NOT NULL")
  scope :completed, where("completed IS NOT NULL")
  scope :surveys, where("survey_id IS NOT NULL")
  scope :surveys_by_id, lambda {|survey_id| where("survey_id = ?", survey_id)}
  scope :registrations, where("registration_identifier IS NOT NULL").order(:id)
  scope :surveys_by_group, ResponderItem.surveys.order('survey_id')

  accepts_nested_attributes_for :client, :subject

  attr_accessible :registration_identifier, :id, :caretaker_id, :deadline, :completed, :complete_item, :client_id, :subject_id, :survey_id, :client_attributes, :subject_attributes
  validates_presence_of :registration_identifier, :if => Proc.new { |a| a.survey_id.nil? }
  validates_associated :client

  def self.new_patient_item(params,caretaker)
    item = ResponderItem.new(params)
    patient = Person.find(params[:subject_id])
    item.subject = patient
    item.caretaker = caretaker
    item.client = patient.guardian_client
    item
  end

  def self.to_chart(params)
    if params[:survey_id]
      responder = Person.find(params[:subject_id]).guardian_user
      {:charts => ResponseSet.to_chart(params[:survey_id], responder)}
    else  
      responder_item = ResponderItem.find(params[:id])
      responder_item.response_set.result_to_chart
    end

  end

  def access_code
    self.survey.nil? ? self.registration_identifier : self.survey.access_code
  end

  def item_type
    self.survey.nil? ? 'registration' : 'survey'
  end

  def complete_item=(complete_at=Time.zone.now)
   self.completed = completed_at
  end

  def result
    self.response_set.result_to_chart
  end

  def complete_item
  end

  private
  def is_uncompleted_survey?
    (!self.survey_id.nil? && self.completed.nil?)
  end

  def set_response_set
   self.response_set=(ResponseSet.create(:survey => self.survey, :user_id => self.client.user.id))
  end
end
