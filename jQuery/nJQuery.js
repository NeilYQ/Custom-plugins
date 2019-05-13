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

	// 检测含有css样式名称字符串, 返回样式名数组
	function testPrap(prap){
		if(!prap) return [];
		var prapArr = prap.split(" ");
		var index = 0;
		var arr = search(prapArr[0], [document]);
		function search(str, parentArr){
			var arr=[];
			for(var i=0, len=parentArr.length; i<len; i++){
				arr = arr.concat( getElements(str, parentArr[i]) );
			}
			return index==prapArr.length-1 ? arr : search(prapArr[++index], arr);
		}
		function getElements(str, parent){
			var endArr = [];
			if( str[0]=="#" ){	// id
				endArr[0]=document.getElementById(str.replace("#", ""));
			}
			else if( str[0]=="." ){	// className
				if( parent.getElementBysClassName ){
					var a = parent.getElementBysClassName(str.replace("\.", ""));
					for(var i=0, len=a.length; i<len; i++){
						endArr[i] = a[i];
					}
				}else{
					var allE = parent.getElementsByTagName('*');
					var reg = new RegExp("(^|\\s)"+ str.replace("\.", "") +"(\\s|$)");
					for(var i=0, len=allE.length; i<len; i++){
						if( reg.test(allE[i].className) ){
							endArr.push( allE[i] );
						}
					}
				}
			}
			else{	// tagName
				var a = parent.getElementsByTagName(str);
				for(var i=0, len=a.length; i<len; i++){
					endArr[i] = a[i];
				}
			}
			return endArr;
		}
		return arr;
	}

	// JQ对象
	function Init(prap){
		this.length = this.init(prap);
	}
	Init.prototype = {
		init: function(prap){
			var arr=[];
			var typePrap = (typeof prap).toLowerCase();
			if( typePrap=="object" ){
				if( prap==window || prap.nodeType ){
					arr[0]=prap;
				}else if( !isNaN(prap.length) ){
					for(var i=0, len=prap.length; i<len; i++){
						arr[i] = prap[i];
					}
				}
			}
			else if( typePrap=="string" ){
				arr = testPrap(prap);
			}
			for(var i=0, len=arr.length; i<len; i++){
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
		// 检测是否有class名
		hasClass: function(classStr){
			var has = false;
			this.each(function(){
				var reg = new RegExp("(^|\\s)"+classStr+"(\\s|$)");
				if( reg.test(this.className) ) has=true;
			});
			return has;
		},
		// 检测父元素
		parent: function(){
			var arr = [];
			this.each(function(){
				arr.push( this.parentNode );
			});
			return new Init(arr);
		},
		/****************bug 还未做数组内的对象去重*********************/
		// 检测所有父元素
		parents: function(){
			var arr = [];
			var html = document.getElementsByTagName('html')[0];
			this.each(function(){
				var parent = this;
				while(parent!=html){
					parent = parent.parentNode;
					arr.push(parent);
				}
			});
			return new Init(arr);
		},
		// 检测子元素
		children: function(str){
			var arr = [];
			if(!str){
				this.each(function(){
					var child = this.children;
					for(var i=0, len=child.length; i<len; i++){
						arr.push( child[i] );
					}
				});
			}else{
				var fstr = str[0];
				var nType = (fstr=='#'&&"id") || (fstr=='.'&&"className") || "nodeName";
				str = str.replace(/[#\.]/g, "");
				this.each(function(){
					var child = this.children;
					var reg = new RegExp("(^|\\s)"+str+"(\\s|$)");
					for(var i=0, len=child.length; i<len; i++){
						if( nType=="className" && reg.test(child[i].className) ){
							arr.push( child[i] );
						}
						else if( child[i][nType].toLowerCase()==str ){
							arr.push( child[i] );
						}
					}
				});
			}
			return new Init(arr);
		},
		// 查找
		find: function(prap){
			return new Init(testPrap(prap));
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
		hover: function(){
			var args = arguments;
			if( args.length===1 ){
				this.each(function(){
					this.onmouseenter = args[0];
				});
			}else if( args.length===2 ){
				this.each(function(){
					this.onmouseenter = args[0];
					this.onmouseleave = args[1];
				});
			}
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
		offset: function(){
			var obj = {top:0, left:0};
			for(var This = this[0]; This!=document.body; This = This.offsetParent){
				obj.top += This.offsetTop;
				obj.left += This.offsetLeft;
			}
			return obj;
		},
		position: function(){
			return {
				top : this[0].offsetTop, 
				left: this[0].offsetLeft
			};
		},
		// 设置、获取滚动高度
		scrollTop: function(val){
			if(val){
				this.each(function(){
					if(this==document){
						document.documentElement.scrollTop = val;
						document.body.scrollTop = val;
					}else{
						this.scrollTop = val;
					}
				});
				return this;
			}else{
				if(this[0]==document){
					return document.documentElement.scrollTop || document.body.scrollTop;
				}else{
					return this[0].scrollTop;
				}
			}
		},
		// 设置、获取滚动宽度
		scrollLeft: function(val){
			if(val){
				this.each(function(){
					if(this == document){
						document.documentElement.scrollLeft = val;
						document.body.scrollLeft = val;
					}else{
						this.scrollLeft = val;
					}
				});
				return this;
			}else{
				if(this[0]==document){
					return document.documentElement.scrollLeft || document.body.scrollLeft;
				}else{
					return this[0].scrollLeft;
				}
			}
		},
		// 设置获取宽度
		width: function(val){
			if(val){
				this.css("width", val+( (parseInt(val)==val)&&"px") );
				return this;
			}else{
				return this.css("width");
			}
		},
		// 设置获取高度
		height: function(val){
			if(val){
				this.css("height", val+( (parseInt(val)==val)&&"px" ) );
				return this;
			}else{
				return this.css("height");
			}
		},
		// padding + 计算宽高
		innerWidth: function(){
			return this[0].clientWidth;
		},
		innerHeight: function(){
			return this[0].clientHeight;
		},
		// padding + border + 计算宽高
		outerWidth: function(){
			return this[0].offsetWidth;
		},
		outerHeight: function(){
			return this[0].offsetWidth;
		},
		// 设置、获取html内容
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
		// 设置、获取文本
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
		// 添加样式名
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
			return this;
		},
		// 淡入、淡出（实现）
		fade: function(state, args){
			var time=600, callback, easing;
			if((typeof state).toLowerCase()=="string" ){
				if(state.toLowerCase()=="in") state=1;
				if(state.toLowerCase()=="out") state=0;
			}
			for(var i=0, len=args.length; i<len; i++){
				var typeArgs = (typeof args[i]).toLowerCase();
				if(typeArgs=="number"){
					time = args[i]<0 ? 0 : args[i];
				}else if(typeArgs=="string"){
					switch(args[i]){
						case "slow"  : time=800; break;
						case "normal": time=600; break;
						case "fast"  : time=400; break;
						default: easing=args[i]; break;
					}
				}else if(typeArgs=="function"){
					callback = args[i];
				}
			}
			// 获取透明度
			function getAttr(obj, attr){
				return obj.currentStyle?obj.currentStyle[attr]:getComputedStyle(obj)[attr];
			}

			var endVal = state;
			this.each(function(){
				var startVal = parseInt(getAttr(this, "opacity"));
				if(startVal==undefined) startVal = parseInt(getAttr(this, "filter"));
				if( state && getAttr(this, "display")=="none" ){
					startVal = 0;
					this.style.opacity = 0;
					this.style.filter = "alpha(opacity=0)";
				}
				if(state) this.style.display = "block";
				var startTime = new Date();
				var This = this;
				var timer = setInterval(function(){
					var nowTime = new Date();
					var prop = (nowTime - startTime) / time;
					if(prop>=1){
						prop=1;
						clearInterval(timer);
						if(!state) This.style.display = "none";
						callback && callback.call(This);
					}
					var val = startVal + prop*(endVal - startVal);
					This.style.opacity = val;
					This.style.filter = "alpha(opacity="+100*val+")";
				}, 13);
			});
			return this;
		},
		// 淡入（接口）
		fadeIn: function(){
			var args = arguments;
			this.fade(1, args);
			return this;
		},
		// 淡出（接口）
		fadeOut: function(){
			var args = arguments;
			this.fade(0, args);
			return this;
		}
	};

	window.$ = $;
})();



















