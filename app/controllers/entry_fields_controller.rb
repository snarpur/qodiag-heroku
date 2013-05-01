class EntryFieldsController < ApplicationController
  respond_to :json

  def index
    @entry_fields = EntryField.all
  end

end

