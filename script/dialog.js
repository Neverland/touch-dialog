/**
 *@license
 * Copyright 2012 enix
 * enix@foxmail.com
 * Created on 14-5-26.
 * last Modified: 2014-06-01
 */
!function (window, doc, undefined) {

	function Dialog(O,cb){
		var cns = arguments.callee,
			fn = cns.prototype,
			that = this;

		this.O = O || {};


		fn.init || (fn.init = function (){

			this.prefix = this.O.prefix || 'dialog'
			this.createElement.call(this);
			this.frame = doc.createDocumentFragment();
			this.createDialog().setHtml(this.O).render().addEvent();

		});
		fn.defineElement = function (){
			return this.elements = [
				['div', 'id#'+this.prefix+'-dialog,class#dialog'],//0
				['h3', 'id#'+this.prefix+'-title,class#dialog-title'],//1
				['div', 'id#'+this.prefix+'-box,class#dialog-box'],//2
				['div', 'id#'+this.prefix+'-overlay,class#dialog-overlay'],//3
				['div', 'id#'+this.prefix+'-footer,class#dialog-footer'],//4
				['a', 'onclick#javascript:void(0),id#'+this.prefix+'-Btn']//5
			];
		};
		fn.getHtmlElement = getHtmlElement = function (O) {
			var that = this;

			that.element || (that.element = {});
			that.element[O] || (that.element[O] = doc.createElement(O));
			return that.element[O].cloneNode(true);
		};
		fn.createElement = createElement = function (){
			var that = this,
				attr,//节点的属性
				t;//生成的临时节点

			this.defineElement().forEach(function (a ,b){

				t = that.getHtmlElement(a[0]);
				a[1] && a[1].split(',').forEach(function (x ,y){
					attr = (attr = x.split('#'), attr[0] && t.setAttribute(attr[0], attr[1]));
				})
				that.elements.splice(b, 1, t);
				that.elements[b].lenght = 1;

			});

			return this;
		};

		fn.createDialog = function (){
			var frame = this.frame,
				elems = this.elements,
				t = elems[0];

			this.O.btn  && elems[4].appendChild(elems[5]);

			t.appendChild(elems[1]);
			t.appendChild(elems[2]);
			this.O.btn  && t.appendChild(elems[4]);

			frame.appendChild(t);
			frame.appendChild(elems[3]);

			return this;
		};
		fn.getScrollPosition = function (){
			return [window.pageXOffset ,window.pageYOffset]
		};
		fn.getPageSize = function (){
			var html = doc.documentElement;
			return [html.scrollWidth,html.scrollHeight];
		};
		fn.setHtml = function (opt){ //{title:[string]data,box:[string]data,btn:[string]}

			var t = this.elements;
			opt.title && (t[1].innerHTML = opt.title);
			opt.box && (t[2].innerHTML = opt.box);
			opt.btn && (t[5].innerHTML = opt.btn);
			return this;
		};
		fn.render = function (){

			typeof(fn)==='function' && fn.call(this);

			doc.body.appendChild(this.frame);

			return this.setPosition(), this;

		};
		fn.setPosition = function (){
			var nodes = this.elements,
				t = nodes[0],
				xy = this.getScrollPosition(),
				x = xy[0],
				y = xy[1],
				W = window.innerWidth,
				H = window.innerHeight,
				layer =  nodes[3];

			t.style.cssText = 'left:'+(( W - t.offsetWidth)/2)+'px;top:'+((H - t.offsetHeight)/2+y)+'px;';

			layer.style.cssText ='position:absolute;left:0;top:0px;width:'+W+'px;height:'+Math.max(doc.documentElement.scrollHeight,window.innerHeight)+'px;';

			return this;
		};
		fn.addEvent = function (){
			var that = this,
				event = window.onorientationchange ? 'onorientationchange' :'onresize';

			window[event] = function(){
				//alert(window.innerWidth)
				that.render();
			};

			this.elements[5].onclick = function(){
				typeof(that.O.onenter) =='function' && that.O.onenter.call(that);
			};

			this.elements[3].ontouchstart = function(){
				that.hide();
				return false;
			}

		};
		fn.hide = function (){
			var t = this.elements;
			t[0].style.display ='none';
			t[3].style.display ='none';
			return this;
		};
		fn.destroy = function (){

			this.hide().elements.forEach(function (a){
				try{
					a.parentNode.removeChild(a);
					a.innerHTML = '';
					this.elements = [];
				}catch(e){}

			}, this);

			return this;
		};
		return this.init(), typeof(cb) === 'function' && cb.call(this), this;
	}

	if (typeof define === 'function' && define.amd) {
		define('Dialog', [], function () {
			return Dialog;
		});
	} else {
		window.Dialog || (window.Dialog = Dialog)
	}

}(this, document)
