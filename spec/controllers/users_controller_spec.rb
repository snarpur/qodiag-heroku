require 'spec_helper'


describe UsersController do

 describe "GET new" do
   context "When the super admin is logged in" do
     login_user(:super_admin)
      before do
       Factory(:role, :name => "caretaker")
     end
     it "should new caretaker page" do
       get :new, :role_name => "caretaker"
       response.should be_success
      end
    end
   context "When the caretaker is logged  in" do
     login_user(:caretaker)
     before do
       Factory(:role, :name => "client")
    end
    it "should get new client page" do
       get :new, :role_name => "client"
       response.should be_success
     end
     it "should get error when going to the new cartaker page" do
       get :new, :role_name => "caretaker"
       flash[:error].should eq(I18n.t("cancan.not_authorized"))
     end
   end
  end


  describe "POST create" do
    let(:user){mock_model(User).as_null_object}

    before do
      User.stub(:new).and_return(user)
    end

    it "creates new user" do
      User.should_receive(:new).
        with("email" => "bill@bob.com").
        and_return(user)
      post :create, :user => {"email" => "bill@bob.com"}
    end

    context "when the user saves successfully" do
      before do
        user.stub(:save).and_return(true)
      end

      it "sets a flash[:notice] message" do
        post :create
        flash[:notice].should eq(I18n.t('devise.registrations.signed_up'))
      end

      it "redirects to the User index" do
        post :create
        response.should redirect_to(:action => "index")
      end
    end

    context "when the user failse to save" do
      before do
        user.stub(:save).and_return(false)
      end

      it "assigns @user" do
        post :create
        assigns[:user].should eq(user)
      end

      it "renders the new template" do
        post :create
        response.should render_template("new")
      end
    end
  end
end