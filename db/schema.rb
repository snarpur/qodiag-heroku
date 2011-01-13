# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20110112133307) do

  create_table "addresses", :force => true do |t|
    t.string   "street_1"
    t.string   "street_2"
    t.integer  "zip_code"
    t.string   "town"
    t.string   "country"
    t.string   "home_phone"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "phone"
  end

  create_table "people", :force => true do |t|
    t.string   "firstname"
    t.string   "lastname"
    t.string   "sex"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.boolean  "ispatient"
    t.date     "dateofbirth"
    t.integer  "cpr"
    t.string   "mobilephone"
    t.string   "workphone"
    t.string   "occupation"
    t.string   "workplace"
    t.integer  "address_id"
  end

  create_table "relationships", :force => true do |t|
    t.integer  "person_id"
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "relation_id"
    t.date     "start"
    t.date     "end"
  end

end
