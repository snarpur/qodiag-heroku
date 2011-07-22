(function($) {
    var ListView = Backbone.View.extend({
        el: $('#wrapper'),
        // el attaches to existing element


        events: {
            'click button#add': 'addItem'
        },
        initialize: function() {
            _.bindAll(this, 'render', 'addItem');
            // every function that uses 'this' as the current object should be in here
            this.counter = 0;
            // total number of items added thus far
            console.log("hooo")
            this.render();
        },


        render: function() {
            console.log($(this.el).length)
            $(this.el).append("<button id='add'>Add list item</button>");
            $(this.el).append("<ul></ul>");
        },



        addItem: function() {
            alert("hey")
            this.counter++;
            $('ul', this.el).append("<li>hello world" + this.counter + "</li>");
        }
    });

    var listView = new ListView();
})(jQuery);