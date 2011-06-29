module ResponseCustomMethods

end

class Response < ActiveRecord::Base
  include Surveyor::Models::ResponseMethods
  include ResponseCustomMethods
end