# encoding: utf-8
require 'faker'
class SurveyPopulateUtil < ResponderItemPopulateUtil
  
  attr_accessor :surveys

  def initialize(surveys = {})
    @surveys = surveys

    @descriptions = [
      "description 1",
      "description 2",
      "description 3",
      "description 4",
      "description 5",
      "description 6",
      "description 7",
      "description 8",
      "description 9",
      "description 10",
      "description 11"
    ]
    
    @survey_ids = Survey.select(:id)

  end

  def complete_response_set(responder_item)
    responder_item.response_set.completed_at = responder_item.created_at.advance(:days => 1)
    responder_item.response_set.save!
  end

  def create_requests(opt)
    if opt[:number] > 0 and 
      days = rand(100) + 700 
      dist = days/opt[:number]
      created_at = Time.now - rand(days).days
      opt[:number].times do |n|
        random_pattern = (rand(0.1)/10) * ([0.9,1.0].at(rand(2)))
        day_dist = n.odd? ? days - (dist * n) :  days - (dist * n) + random_pattern
        created_at = Time.now - day_dist.days
        item = create_responder_item(opt[:survey_id],opt[:people],created_at)
        complete_survey(item)
      end
    end
    self.create_responder_item(opt[:survey_id],opt[:people],Time.zone.now - (rand(10) + 1).days) if rand(2).odd?
    self.create_responder_item(opt[:survey_id],opt[:people],Time.zone.now - (rand(50) + 15).days) if rand(2).odd?
  end

  def generate_surveys
    [Survey, SurveySection, Question, QuestionGroup, Answer, ResponderItem, ResponseSet, Response].each(&:delete_all)
    @surveys.each do |survey|
      system "bundle exec rake surveyor FILE=surveys/#{survey}.rb --trace"
      NormReferenceCSVParser.new(survey)
    end
  end

  def complete_survey(item)
    self.complete_response_set(item)
    
    survey_sections = SurveySection.where(item.survey_id).select(:id)
    survey_sections.each do |section|
      questions = Question.where("survey_section_id = #{section.id}")
      questions_size = questions.size
      questions.each_with_index do |question,index|
        answers = question.answers
        if not answers.empty? and answers.where(:custom_class => "describe").size > 0
          random_answer_no = rand(answers.size - 1)
          random_description = rand(@descriptions.length - 1)
          description = @descriptions[random_description]
        else
          random_answer_no = index % 3 == 0 ? rand(answers.size) : rand(answers.size - 1)
          description = nil
        end

        FactoryGirl.create(:response, 
                       :response_set => item.response_set, 
                       :question_id => question.id,
                       :answer_id => answers[random_answer_no].id,
                       :text_value => description
                      ) unless answers.empty?
      end
    end
  end

end