class AddressController < ApplicationController
  respond_to :json
  def index
    @address = Person.find(params[:person_id]).address
  end
end