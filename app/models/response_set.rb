module ResponseSetCustomMethods
 
  def self.included(base)
    base.send :attr_accessor, :status
    base.send :after_save, :complete_responder_item
    #base.send :validate, :validate_mandatory_questions, :on => :update, :unless => Proc.new{|r|r.status.nil?}
  end


  def responder_item
    ResponderItem.where(:response_set_id => self.id).first
  end

  def responder
    self.responder_item.client
  end

  def subject
    self.responder_item.subject
  end

  def group_names
    names = self.responses.joins(:question => :question_group) & QuestionGroup.names
    names.collect{|e| e.text}
  end

  def group_result(group_name)
    result =  self.responses.joins(:answer,:question => :question_group).
              where(:question_groups => {:text => group_name}).
              sum('answers.weight').to_i
    result
  end

  def norm_reference
    NormReference.age(self.subject.age).sex(self.subject.sex).survey(self.survey.id).first
  end

  def chart_renderer
  "#{self.survey.access_code.gsub(/\-/,"_").camelize}ChartRenderer".constantize
  end

  def survey_name
    self.survey.access_code
  end
  
  def results_with_total_for_current_groups(groups)
    total = groups.select{|g| g == "total"}
    data = (groups - total).map{|g| self.group_result(g)}
    data << data.sum unless total.empty?
    data
  end

  def result_to_chart
    chart_renderer.send(:new, self).result_to_chart
  end

  private
  def complete_responder_item
    unless self.completed_at.nil?
      self.responder_item.update_attribute(:completed,self.completed_at)
    end
  end

  def validate_mandatory_questions
    errors.add(:base, "can't be in the past") unless
        self.mandatory_questions_complete?
    end
  end

class ResponseSet < ActiveRecord::Base
  include Surveyor::Models::ResponseSetMethods
  #load "app/chart_renderer.rb"
  include ResponseSetCustomMethods
  #include ChartRenderer

  def self.to_chart(id, user)
    response_sets = ResponseSet.where("survey_id = #{id} and user_id = #{user.id} and completed_at IS NOT NULL").order("completed_at")
    LineChartRenderer.new(response_sets).result_to_chart
  end
end
