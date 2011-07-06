require 'spec_helper'
describe Timeline do
  describe "months" do
    before(:each) do
       @starts = Time.zone.now - 2.years - 7.months - 3.weeks
       @item = Factory(:survey_item_with_people, :created_at => @starts)
       @tl = Timeline.new(@item.subject)
    end
    it "does something" do
      @tl.months.first.to_s.should eq((@starts - 1.month).to_s)
    end

  end
end