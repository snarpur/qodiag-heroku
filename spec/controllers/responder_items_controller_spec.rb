require 'spec_helper'

describe ResponderItemsController do
  login_user('caretaker')
  describe "GET new" do
    it "should set correct subject" do
      patient = setup_patient[:patient]
      get :new, :person_id => patient.id
    end
  end

  describe "POST create" do
    before do
      @setup = setup_patient
      @params = { :survey_id => 1,
                  :subject_id => @setup[:patient].id,
                  :caretaker_id => @current_user.person.id,
                  :respondent_id => @setup[:respondent].person.id
                }
    end
    it "should redirect to person page" do
      post :create, :responder_item => @params
      response.should redirect_to person_url(@setup[:patient])
    end
    it "should save responder item" do
      lambda{
        post :create, :responder_item => @params
      }.should change(ResponderItem,:count).by(1)
    end

    it "should save responder item" do
      @params[:survey_id] = nil
      lambda{
        post :create, :responder_item => @params
      }.should_not change(ResponderItem,:count)
                assigns(:responder_item).should_not be_nil
                assigns(:responder_item).should be_kind_of(ResponderItem)
    end
    it "should render to new" do
      @params[:survey_id] = nil
      post :create, :responder_item => @params
      response.should render_template("new")
    end
  end

end