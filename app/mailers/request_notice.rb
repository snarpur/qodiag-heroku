class RequestNotice < ActionMailer::Base
  default :from => "kobrasson@gmail.com"
  def request_survey(responder_item)
    @responder_item = responder_item
    mail(:to => "<#{responder_item.respondent.user.email}>", :subject => "Registered")
  end
end
