require 'spec_helper'
describe Timeline do
  before(:each) do
    @item = Factory(:survey_item_with_people)
    @patient = @item.subject
    today = Time.zone.now
    @total_months = 16
    @total_months.times do |i|
      go_back = (i + 1)
      @patient.patient_responder_items << Factory(:survey_item, :created_at => today - go_back.months, :completed => today - go_back.months - 1.week)
    end
    @timeline = Timeline.new(@patient)
  end
  it "timeline calculations" do
    @timeline.diff_in_months.should == @total_months + 2
    @timeline.body_width == (@total_months + 2) * @timeline.month_width
    @timeline.diff_in_days
  end

end