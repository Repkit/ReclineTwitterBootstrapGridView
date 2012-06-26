this.recline = this.recline || {};
this.recline.View = this.recline.View || {};

(function($, my) {

my.TwitterBootstrapQueryEditor = Backbone.View.extend({
	template: ' \
		<form class="well form-search"> \
			<input type="text" class="input-medium search-query" placeholder="Search..." value="{{q}}"> \
			<span class="app-button-clear"><i class="icon-remove-sign"></i></span> \
		</form> \
	',
	
	events: {
		'keyup input.search-query': 'toggleIconClear',
		'keydown input.search-query': 'search',
		'click .app-button-clear': 'clearText'
	},
	
	initialize: function() {
		_.bindAll(this, 'render');
		this.el = $(this.el);
		this.model.bind('change', this.render);
		this.render();
	},
	
	search: function(e) {
		if(e.keyCode == 13) {
			e.preventDefault();
			var query = this.el.find('.search-query').val();
			this.model.set({
				q: query,
				from: 0
			});
		}
	},
	
	toggleIconClear: function(e) {
		if (this.el.find('.search-query').val().length > 0) {
			this.el.find('.app-button-clear').show();
		} else {
			this.el.find('.app-button-clear').hide();
		}
	},
	
	clearText: function(e) {
		this.el.find('.search-query').val('');
		this.el.find('.app-button-clear').hide();
	},
	
	render: function() {
		var tmplData = this.model.toJSON();
		var templated = Mustache.render(this.template, tmplData);
		this.el.html(templated);
	}
});
})(jQuery, recline.View);