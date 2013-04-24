class NationalRegister < ActiveRecord::Base
  after_initialize :fixVars

  attr_accessible :bannmerki, :faedingarstadur, :fjolskyldunumer, :heimili, :hjuskaparstada, :kennitala, :ktmaka,
                  :kyn, :lastchanged, :latinn, :nafn, :postnumer, :rikisfang, :sveitarfelag, :firstname, :lastname, :town

  def lastname
    nafn.split.last
  end

  def firstname
    nafn.sub(lastname, '').strip
  end

  def town
    require 'csv'
    csv_filepath = 'app/assets/other/postnumer.txt'

    CSV.foreach( csv_filepath ) do |row|
      line = row[0].split(';')
      if postnumer.to_i == line[0].to_i
        return line[1]
      end
    end
  end

  def fixVars
    fixKyn
  end

  def fixKyn
    if kyn.eql?('1') or kyn.eql?('3')
      self.kyn = 'male'
    end
    if kyn.eql?('2') or kyn.eql?('4')
      self.kyn = 'female'
    end
  end
end
