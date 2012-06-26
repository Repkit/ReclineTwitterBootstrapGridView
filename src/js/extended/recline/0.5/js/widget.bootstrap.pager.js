this.recline = this.recline || {};
this.recline.View = this.recline.View || {};

(function($, my) {

my.TwitterBootstrapPager = Backbone.View.extend({
	template: ' \
		<div class="pagination"> \
			<ul> \
				<li {{previousOrFirstEnabled}}><a href="#"><<</a></li> \
				<li {{previousOrFirstEnabled}}><a href="#"><</a></li> \
				{{#pages}} \
					<li {{active}}><a href="#">{{page}}</a></li> \
				{{/pages}} \
				<li {{nextOrLastEnabled}}><a href="#">></a></li> \
				<li {{nextOrLastEnabled}}><a href="#">>></a></li> \
			</ul> \
		</div> \
	',

	events: {
		'click .pagination li[class!="disabled"]': 'onPaginationUpdate'
	},

	initialize: function() {
		this.pageSize = this.model.queryState.get('size');
	
		_.bindAll(this, 'render');
		this.el = $(this.el);
		this.model.queryState.bind('change', this.render);
		this.render();
	},
	
	onPaginationUpdate: function(e) {
		var $el = $(e.target);
		var newFrom = 0;
		var currentPage = this._getCurrentPage($el);
		var totalPages = this._getTotalPages();
		
		//Previous page
		if($el.text() === '<') {
			if(currentPage > 1) {
				newFrom = (currentPage - 2) * this.pageSize;
			}
		} else if ($el.text() === '<<') { //First page
			newFrom = 0;
		} else if ($el.text() === '>') { //Next page
			if(currentPage < totalPages) {
				newFrom = currentPage * this.pageSize;
			} else {
				newFrom = (totalPages - 1) * this.pageSize;
			}
		} else if ($el.text() === '>>') { //Last page
			newFrom = (totalPages - 1) * this.pageSize;
		} else {
			newFrom = (parseInt($el.text()) - 1) * this.pageSize;
		}
		
		this.model.queryState.set({ from: newFrom });
	},
  
	toTemplateJSON: function() {
		var pagesData = [];
		var currentPage = this._getCurrentPage();
		var totalPages = this._getTotalPages();
		
		for(var i = 1; i <= totalPages; i++) {
			pagesData[i] = { 
					page: i,
					active: i == currentPage ? 'class=active' : '',
				};
		}
		
		return { 
			pages: pagesData,
			previousOrFirstEnabled: currentPage > 1 ? '' : 'class=disabled',
			nextOrLastEnabled: currentPage < totalPages ? '' : 'class=disabled'
		};
	},
  
	render: function() {
		var html = Mustache.render(this.template, this.toTemplateJSON());
		$(this.el).html(html);
		
		return this;
	},
	
	_getCurrentPage: function($el) {
		if($el) {
			return parseInt($el.parent().siblings('.active').text());
		}
		
		var pageOffset = this.model.queryState.get('from');
	
		return Math.floor(pageOffset / this.pageSize) + (pageOffset === 0 ? 1 : (pageOffset % this.pageSize === 0 ? 1 : 0));
	},
	
	_getTotalPages: function() {
		return Math.floor(this.model.docCount / this.pageSize) + (this.model.docCount % this.pageSize > 0 ? 1 : 0);
	}
});

})(jQuery, recline.View);