/**
 *
 * Created on 14-1-20.
 */
!function (window, doc, undefined) {

	Dialog = function (O,cb){
			var cns = arguments.callee,
				fn = cns.prototype,
				that = this,
				O = O || {};


			fn.init || (fn.init = function (){

				this.prefix = O.prefix || 'dialog'
				this.createElement.call(this);
				this.frame = doc.createDocumentFragment();
				this.createDialog().setHtml(O).render().addEvent();

			});
			fn.defineElement = function (){
				return this.elements = [
					['div', 'id#'+this.prefix+'-dialog'],//0
					['h3', 'id#'+this.prefix+'-title'],//1
					['div', 'id#'+this.prefix+'-box'],//2
					['div', 'id#'+this.prefix+'-overlay'],//3
					['div', 'id#'+this.prefix+'-footer'],//4
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

				O.btn  && elems[4].appendChild(elems[5]);

				t.appendChild(elems[1]);
				t.appendChild(elems[2]);
				t.appendChild(elems[4]);

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

				var nodes = this.elements,
						t = nodes[0],
						xy = this.getScrollPosition(),
						x = xy[0],
						y = xy[1],
						W = window.innerWidth,
						H = window.innerHeight,
						layer =  nodes[3];

				typeof(fn)==='function' && fn.call(this);

				doc.body.appendChild(this.frame);

				t.style.cssText = 'left:'+(( W - t.offsetWidth)/2)+'px;top:'+((H - t.offsetHeight)/2+y)+'px;';

				layer.style.cssText ='position:absolute;left:0;top:0px;width:'+W+'px;height:'+Math.max(doc.documentElement.scrollHeight,window.innerHeight)+'px;';

				return this;
			};
			fn.addEvent = function (){
				var that = this,
					event = window.onorientationchange ? 'onorientationchange' :'onresize';

				window[event] = function(){
					that.render();
				}

				that.elements[5].onclick = function(){
					typeof(O.onenter) =='function' && O.onenter.call(that);
				}

				that.elements[3].onclick = function(){
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
			return this.init(), typeof(cb) === 'function' && cb.call(this), this;
		}

}(this, document)
