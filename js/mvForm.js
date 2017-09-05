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
		console.log('this.__inputType[type]:', this.__inputType[type]);
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
					if (option.required && !option.state) {
						if (rules) {
							this.value.match(rules) ? $(element).attr('data-state', FormMi.__successClass) : $(element).attr('data-state', FormMi.__errorClass);
							option.state = $(element).attr('data-state') === 'successClass' ? !!1 : !!0;
							// return rules.search(this.value) ? $(element).attr('data-state',FormMi.__successClass) : $(element).attr('data-state',FormMi.__errorClass);
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

					console.log('blur:', option.state, element.name);
				},
				focus: function (e) {
					if (option.focus) {
						if (option.required && !option.state) {
							if (rules) {
								this.value.match(rules) ? $(element).attr('data-state', FormMi.__successClass) : $(element).attr('data-state', FormMi.__errorClass);
								option.state = $(element).attr('data-state') === 'successClass' ? !!1 : !!0;
								// return rules.search(this.value) ? $(element).attr('data-state',FormMi.__successClass) : $(element).attr('data-state',FormMi.__errorClass);
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

						console.log('focus:option.state:', option.state, element.name);
					} else {
						if (!option.state) {
							$(element).attr('data-state', '');
						}
					}
				},
				keyup: function (e) {
					if (option.change) {
						if (option.required && !option.state) {
							if (rules) {
								this.value.match(rules) ? $(element).attr('data-state', FormMi.__successClass) : $(element).attr('data-state', FormMi.__errorClass);
								option.state = $(element).attr('data-state') === 'successClass' ? !!1 : !!0;
								// return rules.search(this.value) ? $(element).attr('data-state',FormMi.__successClass) : $(element).attr('data-state',FormMi.__errorClass);
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
						//$(element).attr('data-state','');
					}
					console.log(this.value);
				}
			}
		)
	},
	bindEvent: function () {
		var FormMi = this;

		$.each(FormMi.__rules, function (key, value) {
			// console.log(value,'key:', key);
			// console.log(FormMi.__formDOM[key], !!FormMi.__formDOM[key]);
			if (!!FormMi.__formDOM[key]) {
				//并入dom元素
				value.element = FormMi.__formDOM[key];

				// 判断类型
				console.log('type', value.element.type);
				console.log('isInput', FormMi.isInput(value.element.type));
				if (FormMi.isInput(value.element.type)) {
					//写入lock值 => 主要是给验证成功后,锁死,则不需要变动?
					value.focus = !!0;
					//判断focus 值
					value.focus = !!value.focus;
					//绑定实时监测?
					console.log('typeof value.change:', typeof value.change);
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
					// FormMi.submit()
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
	setInputState: function (object) {
		object.element.setAttribute('data-state', object.state ? 'successClass' : 'errorClass');
	},
	getErrorInput: function () {
		var FormMi = this;
		var errorInput = [];
		for (var i = 0, l = FormMi.__rules.length; i < l; i++) {
			if (!FormMi.__rules[i].state) {
				errorInput.push(FormMi.__rules[i]);
				FormMi.setInputState(FormMi.__rules[i]);
			}
		}
		console.log('errorLength:', errorInput);
		return errorInput;
	},
	//检查input的状态值
	checkInputState: function () {
		return !this.getErrorInput().length;
	},
	//重置方法
	reset: function () {

	},
	submit: function (fn) {
		if (typeof fn === 'function') {
			fn(this.__state);
		}
	}
};


// var v = new FormMi();

var v = new FormMi({
	form: '#form_forget',
	formType: '', //提交类型,默认是异步,阻止表单提交的
	action: '', //发送地址 默认空
	method: 'post', //发送类型,默认post
	submitBtn: '.button--submit',
	errorClass: '', //默认 errorClass
	successClass: '', //默认 successClass
	rules: [
		{
			name: 'name',
			required: true,
			rules: 'name',
			focus: false,//获得焦点验证=>默认值
			change: false, //实时验证
			success: function (ele) {

			},
			fail: function (ele) {

			},
			callback: function (state) {
				// console.log(state);
			}
		},
		{
			name: 'form__mobile',
			required: true,
			rules: 'mobile',
			// focus: true,
			callback: function (state) {
				// console.log(state);
			}
		},
		{
			name: 'form__code',
			required: true,
			rules: /^(\d{6})$/,
			callback: function (state) {
				// console.log(state);
			}
		}
	],
	submit: function (state) {
		//验证全部表单,
	}
});

v.submit(function (state) {
	console.log('/*表单验证*/', state);
});

console.log('xxxxx', v);