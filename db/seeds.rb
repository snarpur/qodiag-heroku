#encoding: UTF-8
users = ["super_admin", "caretaker", "respondent"]

users.each do |u|
  user = User.create(:email => "#{u}@orrigautur.com", :password => "asdfkj", :password_confirmation => "asdfkj")
  user.save
  user.roles.create(:name => u)
  user.create_person(:firstname => "Per #{u}", :lastname => "Mc#{u.capitalize}")
end



seed_question  = [
"Hver var síðasta manneskja sem þú texted?",
"Þegar er afmæli?",
"Hver viltu vera með núna?",
"Hvað íþróttir spilar þú?",
"Hver er fyrsti einstaklingurinn í símaskránni?",
"Hvað er uppáhalds lagið þitt og með þeirri stundu?",
"Ef þú værir strandaði á eyju, ekki hver þú vilt vera með?",
"Hvað finnst þér núna?",
"Hvað súkkulaði er uppáhalds þinn?",
"Hversu margir kærasta / kærustur hefur þú fengið?",
"Af hverju varstu að búa til Tumblr reikning?",
"Hver er uppáhalds blogger þinn?",
"Hvar viltu vera núna?",
"Hvað viltu vera í framtíðinni?",
"Hvenær var the síðastur tími þú grátið? Hvers vegna?",
"Ertu hamingjusöm?",
"Hver missir þú?",
"Ef þú varst beðinn, viltu hafa mismunandi líf?",
"Hvað var það besta sem þú varst að gefa?",
"Hver var síðasta manneskja sem kallaði þig?",
"Hver er uppáhalds fat þinn?",
"Hver er besti vinur þinn?",
"Hvað er stærsta eftirsjá þinn?",
"Hefur þú svikari alltaf á maka þínum?",
"Hver eyðir þú brjálaður augnablik með?",
"Nafn einhver falleg.",
"Hver var síðasta manneskja sem þú faðmaði?",
"Hvers konar tónlist heldur þú að hlusta?",
"Ertu yfir fortíðina?",
"Hver er síðasta manneskja í símaskránni?",
"hvers konar manneskja þú vilt til þessa?",
"Ekki hefur þú ama sofa á nóttunni?",
"Af hverjum var síðasta texti skilaboð sem þú fékkst?",
"Hvað sem þú kýst, gallabuxur eða pils?",
"Hvernig er hjarta þitt?",
"Vissir þú alltaf kærustu / kærasta hét byrjar með 'J'?",
"Finnst þér einhver og með þeirri stundu?",
"Hvað myndir þú vilt segja í nýjustu ex-boyfriend/ex-girlfriend þinn?",
"Ekki hefur þú einhverjar phobias?",
"Vissir þú að reyna að breyta fyrir mann?",
"Hvað er ágætur hlutur hefur þú gefið einhverjum?",
"Vilt þú fara aftur til fyrri samskiptum þínum?",
"Ertu í góðu eða vondu skapi?",
"Nafn einhver sem þú getur ekki lifað án.",
"Lýstu draumur á dagsetningunni.",
"Lýstu draumur þinn gifting.",
"Hversu margir rósir fékkstu síðasta er Valentine?",
"Hefur þú einhvern tíma verið kysst?",
"Hversu lengi er lengsta sambandið þitt?",
"Ekki sjá eftir þér fortíðina?",
"Getur þú gert eitthvað heimskulegt fyrir einhvern annan?",
"Hefur þú grét alltaf yfir einhvern?",
"Ekki hefur þú langrækinn einhver?",
"Ertu crybaby?",
"Ekki fólk lofa þig fyrir útlit þitt?",
"Vissir þú fellur fyrir einhverjum sem þú ættir ekki?",
"Hefur þú einhvern tíma gert eitthvað slæmt en þú iðrast ekki?",
"Ert þú eins og að fá meiða?",
"Hefur einhver hati þig?",
"Vissir þú smellu einhver hét byrjar með 'R'?",
"Hvaða háralit gera þú vilja?",
"Ef þú getur breytt neitt um þig, hvað er það?",
"Ert þú elskar einhvern sem á í augnablikinu?",
"Hefur þú alltaf hugsun að drepa þig?",
"Ekki hefur þú mál við einhvern í skólanum þínum?",
"Getur þú lifað án netið?",
"Hvað er lagið sem minnir þig á sérstaka einhver þinn?",
"Ertu góður í að halda aftur af tárum þínum?",
"Ertu crybaby?",
"Hefur þú upplifað alltaf að vera hysterical?",
"Ertu KPOP aðdáandi?",
"Ekki nema þú erfitt?",
"Hefur þú fórnað alltaf eitthvað mikilvægt fyrir þig fyrir einhvern sem þú elskar?",
"Vissir þú alltaf had a koss undir tunglsljósi?",
"Hefur þú riðið alltaf bát?",
"Lentir þú í slysi á síðasta ári?",
"hvers konar manneskja ert þú?",
"Hefur þú einhvern tíma spáð í að drepa einhvern?",
"Hefur þú einhvern tíma verið afbrýðisamur?",
"Hvernig er hægt að sanna ást þína til einhvers?",
"Hvað ertu að hugsa núna?",
"Hver er 6. maður í símaskránni?",
"Ekki hefur þú einhverjar minningar sem þú vilt eyða?",
"Hefur þú verið sárt svo slæmt að þú getur ekki fundið orð til að útskýra hvernig þér líður?",
"Vissir þú alltaf badmouth einhvern?",
"Hefur þú lent í rifrildi við einhvern?",
"Áttu traust málefni?",
"Ertu brotinn-hjarta?",
"Hver er sá sem fyrstur kemur upp í hugann þegar einhver minnist á 'ást'?",
"Finnst þér öll verk er þess virði?",
"Trúir þú á setningu 'Ef það er ætlað að vera, það verður'?",
"Hver viltu giftast?",
"Trúir þú á örlög?",
"Hefur þú alltaf hugsun 'Ég fann þegar soulmate minn'?",
"Hvernig sem þú lítur núna?",
"Trúir þú því að fyrsta sanna ást aldrei deyr?",
"Hefur þú fundið sanna ást þína?",
"Hvað ættir þú að gera núna?",
"Nafn eitt ex-boyfriends/ex-girlfriends þínum.",
"Vissir þú alltaf finnst eins og þú ert ekki nógu góður?",
"Hefur þú stundum löngun til setjast að í Sasskatsjavan",
"Vaknarður stundum í Asíu og mannst ekki hvernig þú komst þangað ?"
]
entry_set_names = ["Spurningar um hitt of þetta", "Allskonar spurningar", "Líðan og heilsa"]
section_names = [["Hvernig er..","Hver er...","Upplýsingar um.."],["Saga", "Heimili","Skóli"],["Í gær","Í dag","Á morgun"]]
question_seed_count = 1

3.times do |i|
  
  entry_set = EntrySet.create(:name => entry_set_names[i])
  
  3.times do |s|
    
    section = Section.create(:name => section_names[i][s])
    entry_set.entry_sets_sections.create(:display_order => s+1,:section_id => section.id)
    
    4.times do |f|
      
      entry_field = EntryField.create(:title => seed_question[question_seed_count],:field_type => :text, :help_text => seed_question[(rand(10)*rand(10))])
      section.sections_entry_fields.create(:display_order => f+1, :entry_field_id => entry_field.id)
      question_seed_count += 1
    
    end

  end
  
end