/**
 * 
 * @authors ${ Neil-YQ } 
 * @email ${ 360842060@qq.com }
 * @date    2019-05-10 21:07:57
 * @version $Id$
 */

!(function(){
	// 接口函数
	function $(prap){
		var typePrap = (typeof prap).toLowerCase();
		// 若为函数
		if(typePrap=="function") 
			window.onload=prap;
		else if(typePrap=="string") 
			return new Init(prap);
	}

	// JQ对象
	function Init(prap){
		this.JSObj = this.init(prap);
	}
	Init.prototype = {
		init: function(prap){
			var arr=[];
			if(prap[0]=="#"){
				arr[0] = document.getElementById(prap.replace(/#/, ''));
			}else if(prap[0]=="."){
				var className = prap.replace(/\./, '');
				if(document.getElementsByClassName){
					arr = document.getElementsByClassName(className)
				}else {
					var allE = document.getElementsByTagName('*');
					var reg = new RegExp("\\b"+ className +"\\b");
					for(var i=0, len=allE.length; i<len; i++){
						if(reg.test(allE[i].className)){
							arr.push(allE[i]);
						}
					}
				}
			}
			return arr;
		},
		each: function(excel){
			for(var i=0, len=this.JSObj.length; i<len; i++){
				excel.call(this.JSObj[i], i)
			}
		},
		css: function(){
			var args = arguments;
			if(args.length===2){
				this.each(function(){
					this.style[args[0]]=args[1];
				});
			}
			else if( (typeof args[0]).toLowerCase()=="string" ){
				return this.JSObj[0].currentStyle ? this.JSObj[0].currentStyle[args[0]] : getComputedStyle(this.JSObj[0])[args[0]];
			}
			else if( (typeof args[0]).toLowerCase()=="object" ){
				for(var attr in args[0]){
					this.each(function(){
						this.style[attr] = args[0][attr];
					});
				}
			}
		},
		// 
		html: function(innerHTML){
			if(innerHTML){
				this.each(function(){
					this.innerHTML = innerHTML;
				});
			}else{
				return this.JSObj[0].innerHTML;
			}
		},
		text: function(innerText){
			if(innerText){
				this.each(function(){
					this.innerText = innerText;
				});
			}else{
				return this.JSObj[0].innerText;
			}
		},
		addClass: function(classString){
			var classArr = classString.split(" ");
			for(var i=0, len=classArr.length; i<len; i++){
				this.each(function(){
					var thisCName = this.className;
					var reg = new RegExp("\\b"+classArr[i]+"\\b");
					if(reg.test(thisCName)) 
						return;
					else 
						this.className += (this.className&&" ") + classArr[i];
				});
			}
		},
		removeClass: function(classString){
			var classArr = classString.split(" ");
			for(var i=0, len=classArr.length; i<len; i++){
				this.each(function(){
					var reg = new RegExp("\\b"+classArr[i]+"\\b");
					this.className = this.className.replace(reg, "");
				});
			}
		},
		toggleClass: function(){
			
		}
	};

	window.$ = $;
})();



















