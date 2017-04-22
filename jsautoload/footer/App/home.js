window.angular.module('llaapp.home', [	'llaapp.inlineservices'])
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
	this.toggleQuote = function(){
		var h = this.getSection('home');
		if( h.quote === false ){
			this.selectQuote();
		} else {
			this.initHome();	
		}
	}
	this.initAbout = function(){
		var a = this.getSection('about'),
            s = this.lla_search(a.content, 'main');
		if(s === false){
			a.content.main = {};
		}
		a.content.main.selectedbool = false;
	};
	this.initCalender = function(){
		var a = this.getSection('calender'),
            s = this.lla_search(a.content, 'main');
		if(s === false){
			a.content.main = {};
		}
		a.content.main.selectedbool = false;
	};
	this.initContact = function (){
		var a = this.getSection('contact');
        a.content.showcontact = false;
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
			case 'contact':
				this.contactState(this.getSection('contact'), p, f);
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
			a.content.main.animate = 'in';
			a.content.main.selectedbool = true;
		}
	};
	this.calenderState = function(c,p,f){
		var s;
		if( p === '~' ){
			this.initCalender();
		}else if(f === 'full'){
			c.content.main.selectedbool = false;
			c.animate = 'in';
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
			c.content.main.animate = 'in';
			c.content.main.selectedbool = true;
		}
	};
    this.contactState = function(c,p,f){
        console.log( c );
        console.log( p );
		if( p === '~' ){
			this.initContact();
		}else{
			if( p === 'mail' ){
                c.content.showcontact = true;
                c.content.contactanimate= 'in';
            }
		}
	};
	this.deselectAll = function(ob){
		Object.keys(ob).forEach(function(key ) {
			this[key].selectedbool = false;
			this[key].animate = 'out';
		}, ob);
	};
	this.$get = function (){
		var r = {
			model: this.model,
			getSection: this.getSection,
			state: this.processState,
			lla_search: this.lla_search,
			initHome: this.initHome,
			initAbout: this.initAbout,
			initContact: this.initContact,
			aboutState: this.aboutState,
			initCalender: this.initCalender,
			calenderState: this.calenderState,
			contactState: this.contactState,
				//Quotes
			selectQuote: this.selectQuote,
			toggleQuote: this.toggleQuote,
				//Utils
			deselectAll: this.deselectAll,

		};
		return r;
	};
});
