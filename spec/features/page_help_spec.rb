require 'spec_helper'

describe "HelpPage" do

  describe "Have access?" do

    context "Not logged in" do
      
      before {visit pages_help_path}

      it "displays an error" do
        page.should have_content(I18n.t('devise.failure.unauthenticated'))
      end
      
      it "takes us to the login page" do
        current_path.should == new_user_session_path
      end

    end

    context "Logged in" do
      
      context "as a caretaker" do
        before :each do
          user_sign_in(:caretaker)
          visit pages_help_path
        end

        it "takes us to the help page" do
          current_path.should == pages_help_path
        end

      end

      context "as a respondent" do
        before :each do
          user_sign_in(:respondent)
          visit pages_help_path
        end

        it "displays an error" do
          page.should have_content(I18n.t('page_errors.error_401'))
        end
        
        it "takes us to the login page" do
          current_path.should == root_path
        end

      end

    end

  end

end