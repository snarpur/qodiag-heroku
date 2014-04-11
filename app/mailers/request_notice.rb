class RequestNotice < ActionMailer::Base
  default :from => "kobrasson@gmail.com"
  def request_survey(responder_item)
    @responder_item = responder_item
    mail(:to => "<#{responder_item.respondent.user.email}>", :subject => "Registered")
  end

  def request_invitation(respondent)
    @respondent = respondent
    mail(:to => "<#{respondent.user.email}>", :subject => "Registered")
  end

  def request_sign_up(email)
    mail(:to => "<#{email}>", :subject => "Sign up Qodiag!")
  end

end
