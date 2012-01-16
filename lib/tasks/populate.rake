# encoding: utf-8
namespace :db do
  desc "Erase and fill database"
  task :populate => :environment do
    require 'faker'
    require "#{Rails.root}/lib/util/populate_util.rb"
    
    pop = PopulateUtil.new

    pop.reset_db(:reset_db)#:reset_db
    pop.generate_surveys()        

    ["jon"].each do |u|
      caretaker = pop.create_caretaker(u)
      25.times do |p|
          patient = pop.create_patient(caretaker[:person])
          parent = pop.create_parent(patient)
          people = {:caretaker => caretaker, :patient => patient, :parent => parent}
        2.times do |t|
          pop.create_requests({:people => people, :number => 5, :survey_id => t+1})
        end
      end

     
    end
  end
end