require 'spec_helper'


describe UsersController do
  describe "POST create" do
    it "creates new user" do
      User.should_receive(:new).with("email" => "bill@bob.com")
      post :create, :user => {"email" => "bill@bob.com"}
    end
  end
end