class NationalRegistersController < ApplicationController
  respond_to :json

  load_and_authorize_resource

  def lookup
    @person = NationalRegister.find_by_kennitala(params[:kennitala])
  end
end
