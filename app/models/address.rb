class Address < ActiveRecord::Base
  has_many :people

  accepts_nested_attributes_for :people

  attr_accessible :id,:street_1, :street_2, :zip_code, :town, :country, :home_phone, :phone
end
