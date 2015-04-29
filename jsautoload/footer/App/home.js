window.angular.module('llaapp.home', [	'llaapp.inlineservices'])
/*.directive('quotes', [ '$interval', function($interval){
	'use strict';
	

	function link(scope, element, attrs) {
	//	var i;
	}
	return {
		restrict: 'AC',
		link: link
	};
}])*/
.provider('homepagemodel', function(InitialModelProvider){
	'use strict';
	if(!this.hasOwnProperty('model')){
		var i =  InitialModelProvider.$get();
		this.model = i.InitialModel;
	}
	this.init = function(){
		this.initHome();
		this.initAbout();
		this.initCalender();
		this.initContact();
	};
	this.initHome = function(){
		var h = this.getSection('home');
		h.quote = false;
	};
	this.selectQuote = function(){
		var h = this.getSection('home'),
			quotes = h.content.Home.content.quotes,
			len = quotes.length - 1,
			ran = Math.floor((Math.random() * len) + 1); 
		h.quote = quotes[ran];

	};
	this.initAbout = function(){
		var a = this.getSection('about'),
				s = this.lla_search(a.content, 'main');
		if(s === false){
			a.content.main = {};
		}
		a.content.main.selectedbool = false;
	};
	this.initCalender = function(){
		var m = this.model.content.Calender,
			k = Object.keys(m.content.events)[0] ,
			i = m.content.events[k];
		m.fullbool = false;
		this.deselectAll(m.content.events);
		m.content.main = i;
		i.selectedbool = true;
	};
	this.initContact = function (){

	};
	this.getSection = function(section){
		var r;
		switch(section){
			case ('home'):
				r =  this.model;
				break;
			case ('about'):
				r = this.model.content.About;
				break;
			case ('calender'):
				r = this.model.content.Calender;
				break;
			case ('contact'):
				r = this.model.content.Contact;
				break;
		}
		return r;
	};
	this.lla_search = function(o, find){
		if(o.hasOwnProperty(find)){
			return o[find];	
		}else{
			return false;
		}
	};
	this.processState = function($stateParams){
		var s = this.lla_search($stateParams, 'section'),
			p = this.lla_search($stateParams, 'part'),
			f = this.lla_search($stateParams, 'extra');

		if( p === false){
			return null;
		}
		switch(s){
			case 'about':
				this.aboutState(this.getSection('about'), p, f);
				break;
			case 'calender':
				this.calenderState(this.getSection('calender'), p, f);
				break;
			default:
				return null;
		}
	};
	this.aboutState = function(a,p,f){
		var s;
		if( p === '~' ){
			this.initAbout();
		}else{
			s = this.lla_search(a.content.posts, p);
			if(s === false){
				return null;
			}
			a.content.main.selectedbool = false;
			this.deselectAll(a.content.posts);
			s.selectedbool = true;
			a.content.main = s;
			a.content.main.selectedbool = true;
		}
	};
	this.calenderState = function(c,p,f){
		var s;
		if( p === '~' ){
			this.initCalender();
		}else if(f === 'full'){
			c.fullbool = true;
		}else{
			c.fullbool = false;
			s = this.lla_search(c.content.events, p);
			if(s === false){
				return null;
			}
			c.content.main.selectedbool = false;
			this.deselectAll(c.content.events);
			s.selectedbool = true;
			c.content.main = s;
		}
	};
	this.deselectAll = function(ob){
		Object.keys(ob).forEach(function(key ) {
			this[key].selectedbool = false;
		}, ob);
	};
	this.$get = function (){
		var r = {
			model: this.model,
			getSection: this.getSection,
			state: this.processState,
			lla_search: this.lla_search,
			initHome: this.initHome,
			selectQuote: this.selectQuote,
			initAbout: this.initAbout,
			aboutState: this.aboutState,
			initCalender: this.initCalender,
			calenderState: this.calenderState,
				//Utils
			deselectAll: this.deselectAll,
		};
		return r;
	};
});
