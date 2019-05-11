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
		else if(typePrap=="string" || typePrap=="object") 
			return new Init(prap);
	}

	// JQ对象
	function Init(prap){
		this.length = this.init(prap);
	}
	Init.prototype = {
		init: function(prap){
			var arr=[];
			var typePrap = (typeof prap).toLowerCase();
			if(typePrap=="string"){
				if(prap[0]=="#"){
					arr[0] = document.getElementById(prap.replace(/#/, ''));
				}
				else if(prap[0]=="."){
					var className = prap.replace(/\./, '');
					if(document.getElementsByClassName){
						var a = document.getElementsByClassName(className);
						for(var i=0, len=a.length; i<len; i++){
							arr[i] = a[i];
						}
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
			}else if(typePrap=="object"){
				if(prap.nodeName){
					arr[0] = prap;
				}else{
					for(var i=0, len=prap.length; i<len; i++){
						arr[i] = prap[i];
					}
				}
			}

			for(var i in arr){
				this[i] = arr[i];
			}
			return arr.length;
		},
		// 遍历
		each: function(excel){
			for(var i=0, len=this.length; i<len; i++){
				excel.call(this[i], i)
			}
		},
		// 返回js对象
		get: function(jsObj){
			if(!isNaN(jsObj)) return this[jsObj];
		},
		// 返回JQ对象
		eq: function(jqObj){
			if(!isNaN(jqObj)) return new Init(this[jqObj]);
		},
		size: function(){
			return this.length;
		},
		// 序列号
		index: function(arg){
			var typeArg = (typeof arg).toLowerCase();
			if(typeArg=="undefined"){
				var childList = this[0].parentNode.children;
				for(var i=0, len=childList.length; i<len; i++){
					if( childList[i]==this[0] ) return i;
				}
			}
			else if(typeArg=="string"){
				var parent = this[0].parentNode;
				var allE = parent.getElementsByTagName(arg);
				for(var i=0, len=allE.length; i<len; i++){
					if( allE[i]==this[0] ) return i;
				}
				return -1;
			}
		},
		// 事件
		click: function( fun ){
			this.each(function(){
				this.onclick = fun;
			});
		},
		mousedown: function( fun ){
			this.each(function(){
				this.onmousedown = fun;
			});
		},
		// 设置、获取样式
		css: function(){
			var args = arguments;
			if(args.length===2){
				this.each(function(){
					this.style[args[0]]=args[1];
				});
			}
			else if( (typeof args[0]).toLowerCase()=="string" ){
				return this[0].currentStyle ? this[0].currentStyle[args[0]] : getComputedStyle(this[0])[args[0]];
			}
			else if( (typeof args[0]).toLowerCase()=="object" ){
				for(var attr in args[0]){
					this.each(function(){
						this.style[attr] = args[0][attr];
					});
				}
			}
			return this;
		},
		html: function(innerHTML){
			if(innerHTML!=undefined){
				this.each(function(){
					this.innerHTML = innerHTML;
				});
				return this;
			}else{
				return this[0].innerHTML;
			}
		},
		text: function(innerText){
			if(innerText!=undefined){
				this.each(function(){
					this.innerText = innerText;
				});
				return this;
			}else{
				return this[0].innerText;
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
			return this;
		},
		removeClass: function(classString){
			var classArr = classString.split(" ");
			for(var i=0, len=classArr.length; i<len; i++){
				this.each(function(){
					// this.className = this.className.replace(new RegExp("\\b"+classArr[i]+"\\b"), "").replace(/^\s+/, "").replace(/\s+$/, "").replace(/\s{2,}/g, " ");
					this.className = this.className.replace(new RegExp("\\b"+classArr[i]+"\\b"), "").replace(/\s{2,}/g, " ").trim();
				});
			}
			return this;
		},
		toggleClass: function(classString){
			var classArr = classString.split(" ");
			console.log(classArr);
			for(var i=0, len=classArr.length; i<len; i++){
				this.each(function(){
					var reg = new RegExp("\\b"+classArr[i]+"\\b");
					if( reg.test(this.className) ){
						// this.className = this.className.replace(reg, "").replace(/^\s+/, "").replace(/\s+$/, "").replace(/\s{2,}/g, " ");
						this.className = this.className.replace(reg, "").replace(/\s{2,}/g, " ").trim();
					}else{
						this.className += (this.className&&" ") + classArr[i];
					}
				});
			}
			return this;
		},
		attr: function(){
			var args = arguments;
			if(args.length===2){
				this.each(function(){
					this.setAttribute(args[0], args[1]);
				});
			}else if(args.length==1){
				var typeofArgs = (typeof args[0]).toLowerCase();
				if( typeofArgs=="object" ){
					for(var attr in args[0]){
						this.each(function(){
							this.setAttribute(attr, args[0][attr]);
						});
					}
				}else if( typeofArgs=="string" ){
					return this[0].getAttribute(args[0]);
				}
			}
			return this;
		},
		removeAttr: function(classString){
			this.each(function(){
				this.reomveAttribute(classString);
			});
			return this;
		},
		val: function(oval){
			if(oval!=undefined){
				this.each(function(){
					this.value = oval;
				});
				return this;
			}else
				return this[0].value;
		},
		show: function(){
			this.each(function(){
				this.style.display = "block";
			});
			return this;
		},
		hide: function(){		
			this.each(function(){
				this.style.display = 'none';
			});
			// var args = arguments;
			// for(var i=0, len=args.length; i<len; i++){
			// 	var typeofArgs = (typeof args[i]).toLowerCase();
			// 	switch(typeofArgs){
			// 		case "number": time = args[i]; break;
			// 	}
			// }

			return this;
		}
	};

	window.$ = $;
})();



















