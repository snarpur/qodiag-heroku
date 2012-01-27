class App.Models.SurveyMenuItem extends Backbone.Model

  subjectId:=>
    @.get('timeline').get('subject_id')

  showLine:(line)=>
    @.set({visibility: 'visible', line: line})
    line.set({menuItem: @})
  
  hideLine:=>
    @.set({visibility: "hidden"})
    @.get('line').set({menuItem: null})
    @.unset('line')
  
  addLine:=>
    @.get('lines').addLine({survey_id: @.get("id"), name: @.get("access_code"), timeline: @.get('timeline')})

class App.Collections.SurveyMenuItemCollection extends Backbone.Collection
  model: App.Models.SurveyMenuItem