require 'spec_helper'

describe EntrySet do
  
  describe "GET entry_sets_path" do

    context "With user NOT logged in" do

      before :each do
        get entry_sets_path, :format => :json
      end

      it "Gives us the expected status code (UNAUTHORIZED)" do
        response.status.should be(401)
      end

      it "Renders Error 401 page" do
        expect(response).to render_template("pages/error_401")
      end

    end

    context "With user logged in" do

      context "as a respondent" do
      
        before :each do
          sign_in_as_a_valid_user(:respondent)
          get entry_sets_path, :format => :json
        end

        it "Gives us the expected status code (UNAUTHORIZED)" do
           response.status.should be(401)
        end

        it "Renders Error 401 page" do
        expect(response).to render_template("pages/error_401")
      end

      end

      context "as a caretaker" do
      
        before :each do
          sign_in_as_a_valid_user(:caretaker)
          get entry_sets_path, :format => :json
        end

        it "Gives us the expected status code (OK)" do
           response.status.should be(200)
        end

        it "Renders index template" do
          expect(response).to render_template(:index)
        end

      end

    end

  end

  describe "GET entry_set_path" do

    before :each do
      #NOTE: Make the Entry_Set public to test only the authorization     
      @entry_set = FactoryGirl.create(:entry_set, :visibility => "1")
    end

    context "With user NOT logged in" do

      before :each do
        get entry_set_path(@entry_set.id), :format => :json
      end
      

      it "Gives us the expected status code (UNAUTHORIZED)" do
        response.status.should be(401)
      end

      it "Renders Error 401 page" do
        expect(response).to render_template("pages/error_401")
      end

    end

    context "With user logged in" do

      context "as a respondent" do 

        before :each do
          sign_in_as_a_valid_user(:respondent)
          get entry_set_path(@entry_set.id), :format => :json
        end

        it "Gives us the expected status code (UNAUTHORIZED)" do
          response.status.should be(401)
        end

        it "Renders Error 401 page" do
          expect(response).to render_template("pages/error_401")
        end

      end

      context "as a caretaker" do 

        before :each do
          sign_in_as_a_valid_user(:caretaker)
          get entry_set_path(@entry_set.id), :format => :json
          
        end

        it "Gives us the expected status code (OK)" do
          response.status.should be(200)
        end

        it "Renders show template" do
          expect(response).to render_template(:show)
        end

      end

    end

  end

  describe "POST entry_set_path" do

    before :each do
      #NOTE: Make the Entry_Set public to test only the authorization     
      @entry_set = FactoryGirl.create(:entry_set, :visibility => "1")
    end

    context "With user NOT logged in" do

      before :each do
        post entry_sets_path, entrySet: @entry_set
      end
      

      it "Gives us the expected status code (UNAUTHORIZED)" do
        response.status.should be(401)
      end

      it "Renders Error 401 page" do
        expect(response).to render_template("pages/error_401")
      end

    end

    context "With user logged in" do

      context "as a respondent" do 

        before :each do
          sign_in_as_a_valid_user(:respondent)
          post entry_sets_path, entrySet: @entry_set
        end

        it "Gives us the expected status code (UNAUTHORIZED)" do
          response.status.should be(401)
        end

        it "Renders Error 401 page" do
          expect(response).to render_template("pages/error_401")
        end

      end

      context "as a caretaker" do

        before :each do
          sign_in_as_a_valid_user(:caretaker)
          post entry_sets_path, entrySet: @entry_set, :format => :json          
        end

        it "Gives us the expected status code (Modified)" do
          response.status.should be(201)
        end

        it "saves the new contact in the database" do
          expect{ post entry_sets_path, entrySet: @entry_set}.to change(EntrySet, :count).by(1)
        end

      end

    end

  end

  describe "PUT entry_set_path" do

    before :each do
      #NOTE: Make the Entry_Set public to test only the authorization     
      @entry_set = FactoryGirl.create(:entry_set, :visibility => "1")
    end

    context "With user NOT logged in" do

      before :each do
        put entry_set_path(@entry_set.id), entry_set: FactoryGirl.attributes_for(:entry_set, :visibility => "1")
      end
      

      it "Gives us the expected status code (UNAUTHORIZED)" do
        response.status.should be(401)
      end

      it "Renders Error 401 page" do
        expect(response).to render_template("pages/error_401")
      end

    end

    context "With user logged in" do

      context "as a respondent" do 

        before :each do
          sign_in_as_a_valid_user(:respondent)
          put entry_set_path(@entry_set.id), entry_set: FactoryGirl.attributes_for(:entry_set, :visibility => "1")
        end

        it "Gives us the expected status code (UNAUTHORIZED)" do
          response.status.should be(401)
        end

        it "Renders Error 401 page" do
          expect(response).to render_template("pages/error_401")
        end

      end

      context "as a caretaker" do

        before :each do
          sign_in_as_a_valid_user(:caretaker)
          put entry_set_path(@entry_set.id), entry_set: FactoryGirl.attributes_for(:entry_set, :visibility => "1")         
        end

        it "Gives us the expected status code (OK)" do
          response.status.should be(200)
        end

        it "located the requested @entry_set" do
          expect(assigns(:entry_set)).to eq(@entry_set)
        end

        it "changes @contact's attributes" do
          put entry_set_path(@entry_set.id), entry_set: FactoryGirl.attributes_for(:entry_set, :name => "YourString", :visibility => "1")
          @entry_set.reload
          expect(@entry_set.name).to eq("YourString")
        end

      end

    end

  end

  describe "DELETE entry_set_path" do

    before :each do
      #NOTE: Make the Entry_Set public to test only the authorization     
      @entry_set = FactoryGirl.create(:entry_set, :visibility => "1")
    end

    context "With user NOT logged in" do

      before :each do
        delete entry_set_path(@entry_set.id)
      end
      

      it "Gives us the expected status code (UNAUTHORIZED)" do
        response.status.should be(401)
      end

      it "Renders Error 401 page" do
        expect(response).to render_template("pages/error_401")
      end

    end

    context "With user logged in" do

      context "as a respondent" do 

        before :each do
          sign_in_as_a_valid_user(:respondent)
          delete entry_set_path(@entry_set.id)
        end

        it "Gives us the expected status code (UNAUTHORIZED)" do
          response.status.should be(401)
        end

        it "Renders Error 401 page" do
          expect(response).to render_template("pages/error_401")
        end

      end

      context "as a caretaker" do

        before :each do
          sign_in_as_a_valid_user(:caretaker)
          
        end

        it "Gives us the expected status code (Not Content) when JSON response" do
          delete entry_set_path(@entry_set.id), :format => :json
          response.status.should be(204)
        end

        it "deletes the entry_set" do
          expect{ delete entry_set_path(@entry_set.id) }.to change(EntrySet,:count).by(-1)
        end

      end

    end

  end

end
