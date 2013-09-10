Paperclip.interpolates :sex do |attachment, style|
  if (attachment.instance.sex?)
    "male" 
  else 
    attachment.instance.sex
  end
end