require "spec_helper"

describe EntrySetsController do
  describe "routing" do

    it "routes to #index" do
      get("/entry_sets").should route_to("entry_sets#index")
    end

    it "routes to #new" do
      get("/entry_sets/new").should route_to("entry_sets#new")
    end

    it "routes to #show" do
      get("/entry_sets/1").should route_to("entry_sets#show", :id => "1")
    end

    it "routes to #edit" do
      get("/entry_sets/1/edit").should route_to("entry_sets#edit", :id => "1")
    end

    it "routes to #create" do
      post("/entry_sets").should route_to("entry_sets#create")
    end

    it "routes to #update" do
      put("/entry_sets/1").should route_to("entry_sets#update", :id => "1")
    end

    it "routes to #destroy" do
      delete("/entry_sets/1").should route_to("entry_sets#destroy", :id => "1")
    end

  end
end
