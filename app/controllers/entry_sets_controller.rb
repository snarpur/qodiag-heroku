class EntrySetsController < ApplicationController
  # GET /entry_sets
  # GET /entry_sets.json
  def index
    @entry_sets = EntrySet.all

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @entry_sets }
    end
  end

  # GET /entry_sets/1
  # GET /entry_sets/1.json
  def show
    @entry_set = EntrySet.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @entry_set }
    end
  end

  # GET /entry_sets/new
  # GET /entry_sets/new.json
  def new
    @entry_set = EntrySet.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @entry_set }
    end
  end

  # GET /entry_sets/1/edit
  def edit
    @entry_set = EntrySet.find(params[:id])
  end

  # POST /entry_sets
  # POST /entry_sets.json
  def create
    @entry_set = EntrySet.new(params[:entry_set])

    respond_to do |format|
      if @entry_set.save
        format.html { redirect_to @entry_set, notice: 'Entry set was successfully created.' }
        format.json { render json: @entry_set, status: :created, location: @entry_set }
      else
        format.html { render action: "new" }
        format.json { render json: @entry_set.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /entry_sets/1
  # PUT /entry_sets/1.json
  def update
    @entry_set = EntrySet.find(params[:id])

    respond_to do |format|
      if @entry_set.update_attributes(params[:entry_set])
        format.html { redirect_to @entry_set, notice: 'Entry set was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: "edit" }
        format.json { render json: @entry_set.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /entry_sets/1
  # DELETE /entry_sets/1.json
  def destroy
    @entry_set = EntrySet.find(params[:id])
    @entry_set.destroy

    respond_to do |format|
      format.html { redirect_to entry_sets_url }
      format.json { head :no_content }
    end
  end
end
