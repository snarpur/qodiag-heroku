class PeopleController < ApplicationController
  before_filter :get_user
  load_and_authorize_resource

  

end
