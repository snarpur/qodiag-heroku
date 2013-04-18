class NationalRegisterController < ApplicationController
  respond_to :json

  def show
    @person = NationalRegister.find_by_kennitala(params[:id])
  end
end
