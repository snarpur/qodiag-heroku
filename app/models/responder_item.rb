class ResponderItem < ActiveRecord::Base
  belongs_to :person
  belongs_to :client, :class_name => "Person"
  belongs_to :caretaker, :class_name => "Person"
  belongs_to :subject, :class_name => "Person"
  belongs_to :survey
  belongs_to :response_set

  before_save :set_response_set, :if => :is_uncompleted_survey?

  # scope :include_survey, ResponderItem
  scope :overdue, where("deadline < ? AND completed IS NULL", Time.zone.now)
  scope :uncompleted, where("deadline >= ? AND completed IS NULL", Time.zone.now)
  scope :recently_completed, where("completed IS NOT NULL")
  scope :completed, where("completed IS NOT NULL")
  scope :surveys, where("survey_id IS NOT NULL").joins(:survey).select("surveys.access_code, responder_items.*")
  scope :surveys_by_id, lambda {|survey_id| where("survey_id = ?", survey_id).joins(:survey).select("surveys.access_code, responder_items.*")}
  scope :registrations, where("registration_identifier IS NOT NULL").order(:id)
  scope :surveys_by_group, ResponderItem.surveys.order('survey_id')
  scope :by_responder, lambda {|responder_id| where("client_id = ?", responder_id)}
  scope :by_subject, lambda {|subject_id| where("subject_id = ?", subject_id)} 
  accepts_nested_attributes_for :client, :subject, :person

  attr_accessible :registration_identifier, :id, :caretaker_id, :deadline, :completed, :complete_item, :client_id, :subject_id, :survey_id, :subject_attributes, :client_attributes
  validates_presence_of :registration_identifier, :if => Proc.new { |a| a.survey_id.nil? }
  # validates_associated :client


  # TODO: NEXT refactoring step send relevant parameters in http request instead of infering caretaker and client progmatically change newItemView in backbone
  def self.new_patient_item(params,caretaker)
    KK.log "PARAMS :: #{params.inspect}"
    item = ResponderItem.new(params)
    patient = Person.find(params[:subject_id]).guardian_client
    item.subject = patient
    item.caretaker = caretaker
    item.client = patient.guardian_client
    item
  end

  def to_column_chart
    self.response_set.result_to_chart
  end

  #REFACTOR: pass responder name in http requeust
  def self.to_line_chart(params)
      responder = Person.find(params[:subject_id]).guardian_client
      KK.log "RESPONDER #{responder.inspect}"
      ResponseSet.to_line_chart(params[:survey_id], responder)
  end

  def access_code
    self.survey.nil? ? self.registration_identifier : self.survey.access_code
  end

  def item_type
    self.survey.nil? ? 'registration' : 'survey'
  end

  def complete_item=(is_complete)
    KK.log "in complete"
    KK.log is_complete.to_i
    KK.log self.completed.nil?
   if is_complete.to_i == 1 && self.completed.nil?
    self.completed = Time.zone.now
   end
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
    self.response_set=(ResponseSet.create(:survey_id => self.survey_id, :user_id => self.client.user.id))
  end
end
