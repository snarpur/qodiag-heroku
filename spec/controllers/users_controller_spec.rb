require 'spec_helper'


describe UsersController do
  describe "POST create" do
    login_admin
    
    it "creates new user" do
      puts "admin #{@admin}"
    end
  end
end