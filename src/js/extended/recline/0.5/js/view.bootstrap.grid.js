this.recline = this.recline || {};
this.recline.View = this.recline.View || {};

(function($, my) {
	my.TwitterBootstrapGrid = Backbone.View.extend({
		tagName:  "div",
		
		initialize: function(modelEtc) {
			this.el = $(this.el);
			_.bindAll(this, 'render');
			this.model.currentRecords.bind('reset', this.render);
			this.model.bind('change', this.render);
			
			this.tempState = {};
			var state = _.extend({
				hiddenFields: []
			  }, modelEtc.state
			); 
			this.state = new recline.Model.ObjectState(state);
		},
		
		template: '\
			<table class="table"> \
				<thead> \
					<tr> \
						{{#fields}} \
							<th> \
								{{label}} \
							</th> \
						{{/fields}} \
					</tr> \
				</thead> \
				<tbody></tbody> \
			</table> \
		',
		
		toTemplateJSON: function() {
			var modelData = _.map(this.fields, function(field) {
			  return field.toJSON();
			});
			
			return { fields: modelData };
		},
		 
		render: function() {
			var self = this;
			
			this.fields = this.model.fields.filter(function(field) {
				return _.indexOf(self.state.get('hiddenFields'), field.id) == -1;
			});
			
			var htmls = Mustache.render(this.template, this.toTemplateJSON());
			this.el.html(htmls);
			
			this.model.currentRecords.forEach(function(doc) {
				var tr = $('<tr />');
				self.el.find('tbody').append(tr);
				var newView = new my.TwitterBootstrapGridRow({
					model: doc,
					el: tr,
					fields: self.fields
				});
				newView.render();
			});
			
			return this;
		}
	}),
	
	my.TwitterBootstrapGridRow = Backbone.View.extend({
		initialize: function(initData) {
			this.el = $(this.el);
			_.bindAll(this, 'render');
			
			this._fields = initData.fields;
		},
		
		template: ' \
			{{#cells}} \
				<td>{{{value}}}</div> \
			{{/cells}} \
		',
		
		toTemplateJSON: function() {
			var doc = this.model;
			var cellData = this._fields.map(function(field) {
				return {
					value: doc.getFieldValue(field)
				};
			});
			return { cells: cellData };
		},
		
		render: function() {
			var html = Mustache.render(this.template, this.toTemplateJSON());
			$(this.el).html(html);
			return this;
		},
	})
})(jQuery, recline.View);