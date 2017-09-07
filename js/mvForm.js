/**
 * Created by Administrator on 2017/9/4.
 */



function FormMi(option) {
	this.__option = null; // 传入参数
	this.__$formDOM = null;  //表单元素
	this.__formDOM = null;  //表单元素
	this.__action = '';
	this.__formType = 'ajax'; // ajax => / form => 表单提交
	this.__method = 'post';
	this.__$submitDOM = null;
	this.__$formChildDOM = []; //表单的全部子input 元素
	this.__rules = null;
	this.__state = false; //表单状态
	this.__errorClass = 'errorClass';
	this.__successClass = 'successClass';
	this.__elementState = false; //状态
	this.__sendData = null; //外部添加数据
	this.__inputType = {
		text: 1,
		password: 1
	};
	this.__rulesList = {
		email: /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
		, mobile: /^(((13[0-9]{1})|(15[0-9]{1}))+\d{8})$/
	};
	return this.init(option);
}


FormMi.prototype = {
	constructor: FormMi,
	init: function (option) {
		if (!option && $.isEmptyObject(option)) {
			new Error('参入参数有误!');
			console.log(new Error('参入参数有误!'));
			return;
		}
		// console.log('option:', option);
		this.__option = $.extend({}, this.__option, option);
		this.__$formDOM = !!this.__option.form ? $(this.__option.form) : $(document);
		this.__$submitDOM = !!this.__option.submitBtn ? $(this.__option.submitBtn) : null;
		this.__formType = this.__option.formType === 'form' ? 'form' : 'ajax';
		// this.__rules = $.extend({}, this.__rules, this.__option.rules);
		this.__action = this.__option.action;
		this.__rules = this.__option.rules;
		this.__formDOM = this.__$formDOM[0];
		this.getChildDOM();
		this.bindEvent();
	}
	, checkMethodAndAction: function () {

	},
	getChildDOM: function () {
		this.__$formChildDOM = this.__$formDOM.find('input');
	},
	checkRules: function () {

	},
	bindRules: function (option) {
		var rules;
		// console.log('typeof option.rules:', typeof option.rules);
		//正则
		if (option.rules && typeof option.rules === 'string' && typeof this.__rulesList[option.rules] !== 'undefined') {
			rules = this.__rulesList[option.rules];
			// console.log('has:', rules);
		} else {
			//其他,字符串
			rules = option.rules === null ? '' : option.rules;
			// console.log('other:', rules);
		}
		return rules;
	},
	isInput: function (type) {
		// console.log('this.__inputType[type]:', this.__inputType[type]);
		return !!this.__inputType[type];
	},
	bindInput: function (FormMi, element, option) {
		var rules = FormMi.bindRules(option);
		//正则
		// if (option.rules && typeof option.rules === 'string' && typeof this.__rulesList[option.rules] !== 'undefined') {
		// 	rules = this.__rulesList[option.rules];
		// } else {
		// 	//其他,字符串
		// 	rules = option.rules === null ? '' : option.rules;
		// }
		console.log('rules:', rules);
		$(element).on(
			{
				blur: function (e) {
					// if (option.required && !option.state) {
					if (option.required) {//必填
						if (!option.change || !option.state) {
							if (rules) { //有验证表达式
								// this.value.match(rules) ? $(element).attr('data-state', FormMi.__successClass) : $(element).attr('data-state', FormMi.__errorClass);
								FormMi.setInputState(this.value.match(rules), option);
							} else {
								FormMi.setInputState($.trim(this.value), option);
								// !!$.trim(this.value) ? $(element).attr('data-state', FormMi.__successClass) : $(element).attr('data-state', FormMi.__errorClass);
							}
							FormMi.setTargetState(option);
							// option.state = $(element).attr('data-state') === FormMi.__successClass ? !!1 : !!0;
						}
					} else { //非必填

					}

					if (option.state && typeof option.success === 'function') {
						option.success(element)
					}

					if (!option.state && typeof option.fail === 'function') {
						option.fail(element)
					}

					if (typeof option.callback === 'function') {
						option.callback(element, option.state);
					}

					console.log('blur:', option.state, element.name);
				},
				focus: function (e) {
					if (option.focus) {

						if (!option.change || !option.state) {
							if (rules) { //有验证表达式
								// this.value.match(rules) ? $(element).attr('data-state', FormMi.__successClass) : $(element).attr('data-state', FormMi.__errorClass);
								FormMi.setInputState(this.value.match(rules), option);
							} else {
								FormMi.setInputState($.trim(this.value), option);
								// !!$.trim(this.value) ? $(element).attr('data-state', FormMi.__successClass) : $(element).attr('data-state', FormMi.__errorClass);
							}
							FormMi.setTargetState(option);
							// option.state = $(element).attr('data-state') === FormMi.__successClass ? !!1 : !!0;
						}

						if (option.state && typeof option.success === 'function') {
							option.success(element)
						}

						if (!option.state && typeof option.fail === 'function') {
							option.fail(element)
						}

						if (typeof option.callback === 'function') {
							option.callback(element, option.state);
						}

					} else {
						if (!option.state) {
							$(element).attr('data-state', '');
						}
					}
				},
				keyup: function (e) {
					if (option.change) {

						// if ($.trim(this.value)) {
						if (rules) { //有验证表达式
							FormMi.setInputState(this.value.match(rules), option);
						} else {
							FormMi.setInputState($.trim(this.value), option);
						}
						FormMi.setTargetState(option);
						// }

						if (option.state && typeof option.success === 'function') {
							option.success(element)
						}

						if (!option.state && typeof option.fail === 'function') {
							option.fail(element)
						}

						if (typeof option.callback === 'function') {
							option.callback(element, option.state);
						}
					} else {
						//$(element).attr('data-state','');
					}
					// console.log(this.value);
				}
			}
		)
	},
	bindEvent: function () {
		var FormMi = this;

		$.each(FormMi.__rules, function (key, value) {
			// console.log(value,'key:', key);
			// console.log(FormMi.__formDOM[value.name], !!FormMi.__formDOM[key]);
			if (!!FormMi.__formDOM[value.name]) {
				//并入dom元素
				value.element = FormMi.__formDOM[value.name];

				// 判断类型
				// console.log('type1', value.element.getAttribute('type'),value.element.name);
				// console.log('type2', value.element.type,value.element.name);
				// console.log('isInput', FormMi.isInput(value.element.type));
				if (FormMi.isInput(value.element.type)) {
					//写入lock值 => 主要是给验证成功后,锁死,则不需要变动?
					value.focus = !!0;
					//判断focus 值
					value.focus = !!value.focus;
					//绑定实时监测?
					// console.log('typeof value.change:', typeof value.change);
					value.change = typeof value.change !== 'undefined' ? value.change : !!1;

					FormMi.bindInput(FormMi, FormMi.__formDOM[key], value)
				}

				// console.log('isInput',!!FormMi.isInput(value.element.type));

			}
		});

		/*$.each(FormMi.__$formChildDOM, function (index, element) {
		 $(element).on({
		 blur: function (e) {
		 console.log('失去焦点', this.name);
		 },
		 focus: function (e) {
		 console.log('获得焦点', this.name);
		 }
		 })
		 });*/

		/*FormMi.__$submitDOM.on('click', function (e) {
		 console.log('********************');
		 });*/

		FormMi.__$formDOM.on('submit', function (e) {
			console.log("this.__formType", FormMi.__formType);

			// FormMi.__state = !errorLength.length;
			FormMi.__state = FormMi.checkInputState();

			if (FormMi.__formType === 'ajax') {
				e.preventDefault();
				//状态全部通过
				if (FormMi.__state) {
					//FormMi.submit();
					FormMi.sendData();
				}
			} else {
				return true;
			}
			return false;
		});

		//阻止表单回车提交
		FormMi.__$formDOM.keydown(function (e) {
			var e = window.event ? window.event : (e ? e : arguments[0]);
			var key = e.keyCode || e.which;
			if (key === 13) {
				console.log('text回车事件被触发!');
				//如果是使用form 表单提交方式并根据state,提交
				return FormMi.__state;
			}
		});

	},
	//解析规则,配置input元素
	parseRules: function () {

	},

	//合并发送数据
	setDate: function ( object ) {
		if(!$.isEmptyObject(object)){
			this.__sendData = object;
			// this.__sendData = $.extend({},this.__sendData,object)
		}
		console.log('this.__sendData:', this.__sendData);
	},
	//element,type 1/0
	setDomState: function (parameter) {
		var FormMi = this;
		$.each(FormMi.__rules, function (index, object) {
			console.log(object);
			if (object.name === parameter.name) {
				object.state = parameter.state;
				FormMi.setInputClass(object)
			}
		});
	},
	setTargetState: function (object) {
		object.state = object.element.getAttribute('data-state') === this.__successClass ? !!1 : !!0;
	},
	setInputState: function (boolean, object) {
		// boolean ? $(element).attr('data-state', this.__successClass) : $(element).attr('data-state', this.__errorClass)
		object.element.setAttribute('data-state', boolean ? this.__successClass : this.__errorClass);
	},
	setInputClass: function (object) {
		object.element.setAttribute('data-state', object.state ? this.__successClass : this.__errorClass);
	},
	getErrorInput: function () {
		var FormMi = this;
		var errorInput = [];

		$.each(FormMi.__rules, function (index, object) {
			console.log(object);
			if (object.required && !object.state) {
				errorInput.push(object);
				FormMi.setInputClass(object);
			} else if (!object.required && object.rules) { //不是必填,但写了正则,希望可以检验数据
				FormMi.setInputClass(object);
			}
		});

		// console.log('errorLength:', errorInput);
		return errorInput;
	},
	/*
	 * return {}
	 * */
	getInputValue: function () {
		var inputValue = {};
		$.each(this.__rules, function (index, object) {
			console.log(object.element.value);
			if (object.dataFieldName) {
				inputValue[object.dataFieldName] = object.element.value;
			} else {
				inputValue[object.name] = object.element.value;
			}

			// if($.trim(object.element.value)){
			// 	object.element.value
			// }
		});
		console.log('inputValue:', inputValue);
		return inputValue;
	},
	//检查input的状态值
	checkInputState: function () {
		return !this.getErrorInput().length;
	},
	//重置方法
	reset: function () {
		var FormMi = this;
		$.each(FormMi.__rules, function (index, object) {
			object.state = false;
			object.element.value = '';
			object.element.setAttribute('data-state','');
		});
		FormMi.__state = false;
	},
	sendData: function () {
		var data = this.getInputValue(); //获得验证成功后的数据
		this.__option.submit();
		if(this.__sendData){ //合并外部数据
			data = $.extend({},data,this.__sendData)
		}

		$.ajax({
			type: "POST",
			url: this.__action,
			data: data,
			cache: false,
			dataType: "json",
			beforeSend: function () {
			}
		}).done(function (data) {
			console.log('done:',data);
		}).fail(function (data) {
			console.log('fail:',data);
		});
	},
	submit: function (fn) {
		this.__state = this.checkInputState();
		if (typeof fn === 'function') {
			fn(this.__state);
		}
	}
};


// var v = new FormMi();

