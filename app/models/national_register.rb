class NationalRegister < ActiveRecord::Base
  after_initialize :fixVars

  attr_accessible :bannmerki, :faedingarstadur, :fjolskyldunumer, :heimili, :hjuskaparstada, :kennitala, :ktmaka,
                  :kyn, :lastchanged, :latinn, :nafn, :postnumer, :rikisfang, :sveitarfelag, :firstname, :lastname

  def lastname
    nafn.split.last
  end

  def firstname
    nafn.sub(lastname, '').strip
  end

  def fixVars
    fixKyn
  end

  def fixKyn
    if kyn.eql?('1')
      self.kyn = 'male'
    end
    if kyn.eql?('2')
      self.kyn = 'female'
    end
  end
end
