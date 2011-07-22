require "date"
starts = Date.parse("2011-04-01")
ends = Time.now
diff_years = ends.year - starts.year
start_month = starts.month
end_month = ends.month

if start_month > end_month
  month_diff = (diff_years - 1) * 12 + ((12 - start_month) + end_month)
else
  month_diff = diff_years * 12 + (end_month - start_month)
end
puts ends.day
puts month_diff