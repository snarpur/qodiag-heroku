require 'spec_helper'
describe Timeline do
  before(:each) do
    @item = Factory(:survey_item_with_people)

    @patient = @item.subject
    @patient.responder_items.clear
    @today = (Time.zone.now).end_of_month
    @total_months = 16
    @total_months.times do |i|
      go_back = (i + 1)
      created_at = (@today - go_back.months).beginning_of_month + go_back.days
      @patient.patient_responder_items << Factory(:survey_item, :created_at => created_at, :completed => created_at + 1.week)
    end

    @timeline = Timeline.new(@patient)
    @timeline.responder_items = @patient.responder_items
  end

  it "timeline calculations" do

    @patient.responder_items.each_with_index do |item,index|
      @timeline.diff_in_months(item.created_at,@today).should == index +1
    end
    @timeline.body_width == (@total_months + 2) * @timeline.month_width
  end

end