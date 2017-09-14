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
	//提示错误信息对象
	this.__message = {
		required: '__必填选项'
		, rules: ''
		, class: 'label'
		, element: 'span'
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
		var passElement = null;
		var passElementConfirm = null;
		// console.log('rules:', rules,element);
		if (option.equalTo) {
			passElement = FormMi.__formDOM[option.equalTo];
			// console.log('passElement:', passElement);
			$(element).on(
				{
					blur: function (e) {
						// if (!option.change || !option.state) {
						FormMi.setInputState(passElement.getAttribute('data-state') === FormMi.__successClass && element.value === passElement.value, option);
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

						console.log('blur:', option.state, element.name);
					},
					focus: function (e) {
						if (option.focus) {

							// if (!option.change || !option.state) {
							FormMi.setInputState(passElement.getAttribute('data-state') === FormMi.__successClass && element.value === passElement.value, option);
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
							if (!option.state) {
								$(element).attr('data-state', '');
							}
						}
					},
					keyup: function (e) {
						if (option.change) {
							console.log(passElement.getAttribute('data-state') === FormMi.__successClass, element.value === passElement.value);
							FormMi.setInputState(passElement.getAttribute('data-state') === FormMi.__successClass && element.value === passElement.value, option);
							FormMi.setTargetState(option);

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
		} else {
			$(element).on(
				{
					blur: function (e) {
						// if (option.required && !option.state) {
						if (option.required) {//必填
							if (!option.change || !option.state) {

								if (this.value && this.value) { //有验证表达式
									FormMi.setInputState(this.value.match(rules), option);
									FormMi.setMessageStateForRules(this.value.match(rules), option);
									console.log('rules');
								} else {
									console.log('vvv');
									FormMi.setInputState($.trim(this.value), option);
									FormMi.setMessageStateForRequired(this.value.match(rules), option)
								}

								FormMi.setTargetState(option);
								// option.state = $(element).attr('data-state') === FormMi.__successClass ? !!1 : !!0;
							}

							if (element.type === 'password' && $.trim(option.confirmObject.element.value)) {
								FormMi.setInputState(element.value === option.confirmObject.element.value, option.confirmObject);
								FormMi.setTargetState(option.confirmObject);
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
							if (option.required) {//必填
								if (!option.change || !option.state) {
									if (this.value && rules) { //有验证表达式
										FormMi.setInputState(this.value.match(rules), option);
										FormMi.setMessageStateForRules(this.value.match(rules), option);
									} else {
										FormMi.setInputState($.trim(this.value), option);
										FormMi.setMessageStateForRequired(this.value.match(rules), option)
									}
									FormMi.setTargetState(option);
								}

								if (element.type === 'password' && $.trim(option.confirmObject.element.value)) {
									FormMi.setInputState(element.value === option.confirmObject.element.value, option.confirmObject);
									FormMi.setTargetState(option.confirmObject);
								}

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
						if (option.change && option.required) {

							// if ($.trim(this.value)) {
							if (this.value && rules) { //有验证表达式
								FormMi.setInputState(this.value.match(rules), option);
								FormMi.setMessageStateForRules(this.value.match(rules), option);
							} else {
								FormMi.setInputState($.trim(this.value), option);
								FormMi.setMessageStateForRequired(this.value.match(rules), option)
							}
							FormMi.setTargetState(option);
							// }

							if (element.type === 'password' && $.trim(option.confirmObject.element.value)) {
								FormMi.setInputState(element.value === option.confirmObject.element.value, option.confirmObject);
								FormMi.setTargetState(option.confirmObject);
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
							//$(element).attr('data-state','');
						}
						// console.log(this.value);
					}
				}
			)
		}

	},
	bindEvent: function () {
		var FormMi = this;
		var temp_password_input = null;
		var interElement = null;
		$.each(FormMi.__rules, function (key, object) {
			// console.log(object,'key:', key);
			// console.log(FormMi.__formDOM[object.name], !!FormMi.__formDOM[key]);
			if (!!FormMi.__formDOM[object.name]) {


				//并入dom元素
				object.element = FormMi.__formDOM[object.name];
				console.warn('object.element:', object.element, !!object.element.length)
				//默认未验证状态
				object.state = false;

				//记录类型 && 判断长度,用于后面判断是单个或是多个 checkbox/radio/select 类型
				if (object.element.nodeName === 'SELECT') {
					object.type = 'select';
					object.length = 1;
				} else {
					object.type = object.element.length ? object.element[0].type : object.element.type;
					object.length = object.element.length ? object.element.length : 1;
				}
				console.warn('object.length:', object.length)
				// 记录父元素
				if (object.element.length && object.element.nodeName !== 'SELECT') {
					// console.warn(object.element[0].name, object.element[0].parentNode, object.element[0].parentNode.nodeType);
					object.parentNode = FormMi.isNode(object.element[0].parentNode);
				} else {
					// console.warn(object.element.name, object.element.parentNode, object.element.parentNode.nodeType);
					object.parentNode = FormMi.isNode(object.element.parentNode);
				}

				// console.error('object-rules:',object.rules);
				// 判断类型
				// console.log('type1', object.element.getAttribute('type'),object.element.name);
				// console.log('type2', object.element.type,object.element.name);
				// console.log('isInput', FormMi.isInput(object.element.type));
				if (FormMi.isInput(object.element.type)) {
					//写入lock值 => 主要是给验证成功后,锁死,则不需要变动?
					object.focus = !!0;
					//判断focus 值
					object.focus = !!object.focus;
					//绑定实时监测?
					// console.log('typeof object.change:', typeof object.change);
					object.change = typeof object.change !== 'undefined' ? object.change : !!1;

					//checkbox 元素 有效
					if (object.type === 'checkbox') {
						object.send = typeof object.send !== 'undefined' ? object.send : !!1;
					}


					//缓存password 引用
					if (object.element.type === 'password' && !object.equalTo) {
						temp_password_input = object;
						// console.log('temp_password_input:', temp_password_input);
					}

					//重复密码验证
					if (object.equalTo) {
						object.required = true;
						object.focus = true;
						//password 对象获得确认密码input
						temp_password_input.confirm = object.name;
						temp_password_input.confirmObject = object;
						if (!!FormMi.__formDOM[object.equalTo]) {
							object.rules = FormMi.__formDOM[object.equalTo].rules;
						} else {
							console.warn(new Error(object.equalTo + 'input表单不存在!'))
						}
					}
					FormMi.bindInput(FormMi, FormMi.__formDOM[object.name], object)
				} else {
					//这里处理 checkbox/radio/select 类型
					//单个多选
					object.element = FormMi.__formDOM[object.name];
					// console.log('object.element:', object.element);
					if (object.type === 'checkbox' || object.type === 'radio') {
						$(object.element).on('click', function (e) {
							object.state = this.checked;
							// console.log(object.state);
							// console.log(this.object);
							this.checked ? FormMi.hideElement(object.messageElement) : FormMi.showElement(object.messageElement);
						});
					} else if (object.type === 'select') {
						$(object.element).on('change', function (e) {
							console.log(this.value);
							if (this.value !== null && typeof this.value !== 'undefined') {
								FormMi.hideElement(object.messageElement)
							} else {
								FormMi.showElement(object.messageElement);
							}
						})
					}
				}

				//判断是否为 required 必填,默认是的话,默认创建 创建 message
				if (object.required) {
					object.message = object.message ? object.message : $.extend({}, object.message, FormMi.__message);
					//插入元素
					// if (object.message) {
					interElement = FormMi.createElement(object.message);
					FormMi.interElement(object.parentNode, interElement);
					object.messageElement = interElement;
					interElement = null;
					// }
				}


				// console.log('isInput',!!FormMi.isInput(object.element.type));

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
	interElement: function (parentElement, newElement, referenceElement) {
		parentElement.insertBefore(newElement, referenceElement || null);
	},
	createElement: function (messageObject) {
		var element = document.createElement(messageObject.element.toLowerCase());
		element.className = messageObject.class;
		element.style.display = 'none';
		element.innerHTML = messageObject.required ? messageObject.required : this.__message.required;
		return element;
	},
	setMessageStateForRules: function (boolean, object) {
		return boolean ? this.hideElement(object.messageElement) : this.showElement(object.messageElement, object.message.rules);
	},
	setMessageStateForRequired: function (boolean, object) {
		boolean ? this.hideElement(object.messageElement) : this.showElement(object.messageElement, object.message.required);
	},
	showElement: function (element, message) {
		element.style.display = 'block';
		if (message) {
			element.innerHTML = message;
		}
	},
	hideElement: function (element, message) {
		element.style.display = 'none';
		if (message) {
			element.innerHTML = message;
		}
	},
	isNode: function (node) {
		if (node !== null && node.nodeType === 1) {
			return node;
		}
		return null;
	},
	//合并发送数据
	setDate: function (object) {
		if (!$.isEmptyObject(object)) {
			this.__sendData = object;
		}
		console.log('this.__sendData:', this.__sendData);
	},
	//外部改变样式函数
	setDomState: function (parameter) {
		var FormMi = this;
		$.each(FormMi.__rules, function (index, object) {
			if (object.name === parameter.name) {
				object.state = parameter.state;
				if (!FormMi.isCheckBoxOrRadio(object)) {
					FormMi.setInputClass(object)
				}
			}
		});
	},
	setTargetState: function (object) {
		object.state = object.element.getAttribute('data-state') === this.__successClass ? !!1 : !!0;
	},
	setInputState: function (boolean, object) {
		object.element.setAttribute('data-state', boolean ? this.__successClass : this.__errorClass);
	},
	setInputClass: function (object) {
		object.element.setAttribute('data-state', object.state ? this.__successClass : this.__errorClass);
	},
	setInputSuccessClass: function (element) {
		element.setAttribute('data-state', this.__successClass);
	},
	setInputErrorClass: function (element) {
		element.setAttribute('data-state', this.__errorClass);
	},

	/*
	* check checkbox|radio
	* */
	isCheckBoxOrRadio:function (element) {
		return ( /radio|checkbox/i ).test( element.type );
	},
	getErrorInput: function () {
		var FormMi = this;
		var errorInput = [];

		$.each(FormMi.__rules, function (index, object) {
			if (object.required && !object.state) {
				errorInput.push(object);
				// if (object.type !== 'checkbox' && object.type !== 'radio') {
				// 	FormMi.setInputClass(object);
				// 	FormMi.showElement(object.messageElement);
				// }
				if (object.type === 'select') {
					if (object.element.value) {
						FormMi.hideElement(object.messageElement)
					} else {
						FormMi.showElement(object.messageElement);
					}
				} else {
					if (!FormMi.isCheckBoxOrRadio(object)) {
						FormMi.setInputClass(object);
					}
					FormMi.showElement(object.messageElement);
				}
				// if (object.messageElement) {
				// 	FormMi.showElement(object.messageElement);
				// }
			} else if (!object.required && object.rules) { //不是必填,但写了正则,希望可以检验数据
				// if (object.type !== 'checkbox' && object.type !== 'radio') {
				if (!FormMi.isCheckBoxOrRadio(object)) {
					FormMi.setInputClass(object);
				}
			}
		});

		return errorInput;
	},

	getCheckboxValue: function (checkbox_object) {
		var value = [];
		console.log('1=>checkbox_object:', checkbox_object);
		console.log('checkbox_object.length:', checkbox_object.element.length);
		if (checkbox_object.element.length) {
			$.each(checkbox_object.element, function (index, element) {
				console.log('checkbox_object:', index, element);
				if (element.checked) {
					value.push(element.value)
				}
			});
		} else {
			if (checkbox_object.element.checked) {
				value.push(checkbox_object.element.value)
			}
		}

		return value;
	},
	getRadioValue: function (radio_object) {
		var value;
		console.log('1=>checkbox_object:', radio_object);
		console.log('checkbox_object.length:', radio_object.element.length);
		if (radio_object.element.length) {
			$.each(radio_object.element, function (index, element) {
				console.log('checkbox_object:', index, element);
				if (element.checked) {
					value = element.value
				}
			});
		} else {
			if (radio_object.element.checked) {
				value = radio_object.element.value
			}
		}

		return value;

	},
	getSelectValue: function (element) {
		var value;
		value = element.value;
		console.log(value);
		return value;
	},
	/*
	 * return {}
	 * */
	getInputValue: function () {
		var inputValue = {};
		var FormMi = this;

		$.each(FormMi.__rules, function (index, object) {
			// console.log(' object.send :',object.type,object.send,object.type === 'checkbox' && object.send);
			if (object.type === 'checkbox') {
				if (object.send) {
					if (object.dataFieldName) {
						inputValue[object.dataFieldName] = FormMi.getCheckboxValue(object);
					} else {
						inputValue[object.name] = FormMi.getCheckboxValue(object);
					}
				}

			} else if (object.type === 'radio') {
				if (object.dataFieldName) {
					inputValue[object.dataFieldName] = FormMi.getRadioValue(object);
				} else {
					inputValue[object.name] = FormMi.getRadioValue(object);
				}
			} else {

				if (object.dataFieldName) {
					inputValue[object.dataFieldName] = object.element.value;
				} else {
					inputValue[object.name] = object.element.value;
				}
			}

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
			object.element.setAttribute('data-state', '');
		});
		FormMi.__state = false;
	},
	sendData: function () {
		var data = this.getInputValue(); //获得验证成功后的数据
		this.__option.submit();
		if (this.__sendData) { //合并外部数据
			data = $.extend({}, data, this.__sendData)
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
			console.log('done:', data);
		}).fail(function (data) {
			console.log('fail:', data);
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

