class Timeline
  attr_accessor :dimensions, :timespan, :surveys, :subject, :responder_items

  DIMENSIONS = {
    :month_width => 70,
    :line_height => 80,
    :item_size => 15,
    :line_height_expanded => 400
  }

  TIME = {
    :back => 20, 
    :forward => 3
  }
  
  def initialize(person)
    @person = person
  end

  def get(value)
    DIMENSIONS[value]
  end
  
  def header_height
    DIMENSIONS[:month_width] / 2
  end
  
  def canvas_width
    (DIMENSIONS[:month_width] * 12) + gutter_width
  end

  def history_view_width
    DIMENSIONS[:month_width] * 12
  end

  def gutter_width
    DIMENSIONS[:month_width] * 2
  end

  def history_width
    (timespan[:ends] - timespan[:starts] + 1) * (DIMENSIONS[:month_width] * 12)
  end
  
  def dimensions
    values = {}
    %w{history_width gutter_width header_height canvas_width history_view_width}.
    each{|i| values[i.to_sym] = self.send(i)}
    values.merge!(DIMENSIONS)
    values
  end

  def timespan
    {
    :starts => (Time.zone.now - TIME[:back].years).beginning_of_year.year,  
    :ends => (Time.zone.now + TIME[:forward].years).end_of_year.year
    }
  end

  def surveys
    Survey.all
  end

  def subject
    @person
  end

  def responder_items
    @person.responder_items.surveys
  end

  def settings
    d = dimensions
    d.merge!(timespan)
    d.merge!(:subject_id => @person.id)
    d.merge!(:surveys => Survey.select([:id,:access_code]).to_a)
  end

end