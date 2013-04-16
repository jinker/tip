/**
 * Date: 13-1-22
 * Time: 下午4:49
 * 提示层
 * @author jinker
 */
(function ($, window) {
	var Tip = Class.extend({
		/**
		 * @constructs
		 */
		init: function (targetEl) {
			this._borderWidth = 3;
			this._$target = $(targetEl);
			this._$target.data(Tip.PROCESS_ALONE, true);
			this._binding();
		},
		/**
		 * @protected
		 */
		_onShow: function () {
			Tip._show(this._$target);
		},
		/**
		 * @protected
		 */
		_onHide: function () {
			Tip._hide(this._$target);
		},
		/**
		 * @protected
		 */
		_binding: function () {
			var self = this;
			this._onMouseEnterHandler = function () {
				self._onShow();
			};
			this._onMouseLeaveHandler = function () {
				self._onHide();
			};
			this._$target
				.on("mouseenter", this._onMouseEnterHandler)
				.on("mouseleave", this._onMouseLeaveHandler);
		},
		/**
		 * @protected
		 */
		_unbinding: function () {
			this._$target
				.off("mouseenter", this._onMouseEnterHandler)
				.off("mouseleave", this._onMouseLeaveHandler);
		},
		/**
		 * 销毁
		 */
		destroy: function () {
			this._unbinding();
			this._$target.removeData(Tip.PROCESS_ALONE);
			this._$target = null;
		},
		/**
		 *
		 * @return {number}
		 */
		getBorderWidth: function () {
			return this._borderWidth;
		}
	});

	/**
	 * 单独处理，避免与全局处理交叉
	 * @type {string}
	 */
	Tip.PROCESS_ALONE = "tip-process-alone";

	/**
	 * @type {string}
	 */
	Tip.dataMouseEnterKey = "mouseenter";

	/**
	 * 显示位置，t：上，r：右，b：下，l：左
	 * @type {string}
	 */
	Tip.KEY_POSITION = "data-tip-position";

	/**
	 * 对齐设置，如“l-t”，表示左与上对齐
	 * @type {string}
	 */
	Tip.KEY_ALIGN = "data-tip-align";

	//保存正在显示tip的目标
	var showingTargets = [];
	var showingTargetsMap = {};

	//提示层显示位置
	var POSITION = {
		TOP: "t",
		RIGHT: "r",
		BOTTOM: "b",
		LEFT: "l"
	};
	//垂直对齐
	var V_ALIGN = {
		TOP: "t",
		MIDDLE: "m",
		BOTTOM: "b"
	};
	//水平对齐
	var H_ALIGN = {
		LEFT: "l",
		CENTER: "c",
		RIGHT: "r"
	};

	var dataMouseEnterKey = Tip.dataMouseEnterKey;

	var PositionHandler =
	/** @lends Tip.PositionHandler# */
	{
		/**
		 * @class 位置计算
		 * @augments Class
		 *
		 * @constructs
		 */
		init: function () {
			//计算后left和top
			this._resultLeft = 0;
			this._resultTop = 0;
		},
		/**
		 * 判断是否可用
		 * @param {Number} scrollLeft 滚动left
		 * @param {Number} scrollTop 滚动top
		 * @param {Number} viewPortWidth 视界宽度
		 * @param {Number} viewPortHeight 视界高度
		 * @param {Number} targetLeft 目标left
		 * @param {Number} targetTop 目标top
		 * @param {Number} targetWidth 目标width
		 * @param {Number} targetHeight 目标height
		 * @param {Number} tipWidth 提示层width
		 * @param {Number} tipHeight 提示层height
		 * @param {String} vAlign 垂直对齐
		 * @param {String} hAlign 水平对齐
		 * @param {Element} tipEl 提示层
		 * @param {Tip} tip
		 * @return {Boolean}
		 */
		canHandler: function (scrollLeft, scrollTop, viewPortWidth, viewPortHeight, targetLeft, targetTop, targetWidth, targetHeight, tipWidth, tipHeight, vAlign, hAlign, tipEl, tip) {
			this._scrollLeft = scrollLeft;
			this._scrollTop = scrollTop;
			this._viewPortWidth = viewPortWidth;
			this._viewPortHeight = viewPortHeight;
			this._targetLeft = targetLeft;
			this._targetTop = targetTop;
			this._targetWidth = targetWidth;
			this._targetHeight = targetHeight;
			this._tipWidth = tipWidth;
			this._tipHeight = tipHeight;
			this._vAlign = vAlign;
			this._hAlign = hAlign;
			this._tipEl = tipEl;
			this._tip = tip;
			return false;
		},
		/**
		 * 获取位置
		 * @return {Object}
		 *          {
		 *              left:0,
		 *              top:0
		 *          }
		 */
		getPosition: function () {
			var self = this;
			return {
				left: self._resultLeft,
				top: self._resultTop
			};
		}
	};
	PositionHandler = Tip.PositionHandler = Class.extend(PositionHandler);

	var PositionHandlerTop =
	/** @lends Tip.PositionHandlerTop# */
	{
		/**
		 * @class top位置计算
		 * @augments PositionHandler
		 *
		 * @constructs
		 */
		init: function () {
			this._super.apply(this, Array.prototype.slice.call(arguments, 0));
		},
		/**
		 * @override
		 * @return {Boolean}
		 */
		canHandler: function () {
			this._super.apply(this, Array.prototype.slice.call(arguments, 0));

			var canHandle = true;
			var left = 0,
				top = 0;

			if (this._tipWidth <= this._viewPortWidth) {
				top = this._targetTop - this._tipHeight;

				//首先判断上边有无超出视界
				if (top < this._scrollTop) {
					canHandle = false;
				}

				//如能放下，继续计算left
				if (canHandle) {
					switch (this._hAlign) {
						case H_ALIGN.LEFT:
							left = this._targetLeft;
							break;
						case H_ALIGN.CENTER:
							left = this._targetLeft + this._targetWidth / 2 - this._tipWidth / 2;
							break;
						case H_ALIGN.RIGHT:
							left = this._targetLeft + this._targetWidth - this._tipWidth;
							break;
						default:
							left = this._targetLeft + this._targetWidth / 2 - this._tipWidth / 2;
							break;
					}
					//检查是否在超出左边界限
					if (left < this._scrollLeft) {
						left = this._scrollLeft;
					}
					//检查是否超出右边界限
					if (left + this._tipWidth > this._scrollLeft + this._viewPortWidth) {
						left = this._scrollLeft + this._viewPortWidth - this._tipWidth;
					}
				}
			} else {
				canHandle = false;
			}

			this._resultLeft = left;
			this._resultTop = top;

			return canHandle;
		}
	};
	PositionHandlerTop = Tip.PositionHandlerTop = PositionHandler.extend(PositionHandlerTop);

	var PositionHandlerRight =
	/** @lends Tip.PositionHandlerRight# */
	{
		/**
		 * @class 右边位置计算
		 * @augments PositionHandler
		 *
		 * @constructs
		 */
		init: function () {
			this._super.apply(this, Array.prototype.slice.call(arguments, 0));
		},
		/**
		 * @override
		 * @return {Boolean}
		 */
		canHandler: function () {
			this._super.apply(this, Array.prototype.slice.call(arguments, 0));

			var canHandle = true;
			var left = 0,
				top = 0;

			if (this._tipHeight <= this._viewPortHeight) {
				left = this._targetLeft + this._targetWidth;

				//首先判断右边有无超出视界
				if (left + this._tipWidth > this._scrollLeft + this._viewPortWidth) {
					canHandle = false;
				}

				//如能放下，继续计算top
				if (canHandle) {
					switch (this._vAlign) {
						case V_ALIGN.TOP:
							top = this._targetTop;
							break;
						case V_ALIGN.MIDDLE:
							top = this._targetTop + this._targetHeight / 2 - this._tipHeight / 2;
							break;
						case V_ALIGN.BOTTOM:
							top = this._targetTop + this._targetHeight - this._tipHeight;
							break;
						default:
							top = this._targetTop + this._targetHeight / 2 - this._tipHeight / 2;
					}
					//检查是否在超出上边界限
					if (top < this._scrollTop) {
						top = this._scrollTop;
					}
					//检查是否超出下边界限
					if (top + this._tipHeight > this._scrollTop + this._viewPortHeight) {
						top = this._scrollTop + this._viewPortHeight - this._tipHeight;
					}
				}
			} else {
				canHandle = false;
			}

			this._resultLeft = left;
			this._resultTop = top;

			return canHandle;
		}
	};
	PositionHandlerRight = Tip.PositionHandlerRight = PositionHandler.extend(PositionHandlerRight);

	var PositionHandlerBottom =
	/** @lends Tip.PositionHandlerBottom# */
	{
		/**
		 * @class 底部位置计算
		 * @augments PositionHandler
		 *
		 * @constructs
		 */
		init: function () {
			this._super.apply(this, Array.prototype.slice.call(arguments, 0));
		},
		/**
		 * @override
		 * @return {Boolean}
		 */
		canHandler: function () {
			this._super.apply(this, Array.prototype.slice.call(arguments, 0));

			var canHandle = true;
			var left = 0,
				top = 0;

			if (this._tipWidth <= this._viewPortWidth) {
				top = this._targetTop + this._targetHeight;

				//首先判断下边有无超出视界
				if (top + this._tipHeight > this._scrollTop + this._viewPortHeight) {
					canHandle = false;
				}

				//如能放下，继续计算left
				if (canHandle) {
					switch (this._hAlign) {
						case H_ALIGN.LEFT:
							left = this._targetLeft;
							break;
						case H_ALIGN.CENTER:
							left = this._targetLeft + this._targetWidth / 2 - this._tipWidth / 2;
							break;
						case H_ALIGN.RIGHT:
							left = this._targetLeft + this._targetWidth - this._tipWidth;
							break;
						default:
							left = this._targetLeft + this._targetWidth / 2 - this._tipWidth / 2;
							break;
					}
					//检查是否在超出左边界限
					if (left < this._scrollLeft) {
						left = this._scrollLeft;
					}
					//检查是否超出右边界限
					if (left + this._tipWidth > this._scrollLeft + this._viewPortWidth) {
						left = this._scrollLeft + this._viewPortWidth - this._tipWidth;
					}
				}
			} else {
				canHandle = false;
			}

			this._resultLeft = left;
			this._resultTop = top;

			return canHandle;
		}
	};
	PositionHandlerBottom = Tip.PositionHandlerBottom = PositionHandler.extend(PositionHandlerBottom);

	var PositionHandlerLeft =
	/** @lends Tip.PositionHandlerLeft# */
	{
		/**
		 * @class 左边位置计算
		 * @augments PositionHandler
		 *
		 * @constructs
		 */
		init: function () {
			this._super.apply(this, Array.prototype.slice.call(arguments, 0));
		},
		/**
		 * @override
		 * @return {Boolean}
		 */
		canHandler: function () {
			this._super.apply(this, Array.prototype.slice.call(arguments, 0));

			var canHandle = true;
			var left = 0,
				top = 0;

			if (this._tipHeight <= this._viewPortHeight) {
				left = this._targetLeft - this._tipWidth;

				//首先判断左边有无超出视界
				if (left < this._scrollLeft) {
					canHandle = false;
				}

				//如能放下，继续计算top
				if (canHandle) {
					switch (this._vAlign) {
						case V_ALIGN.TOP:
							top = this._targetTop;
							break;
						case V_ALIGN.MIDDLE:
							top = this._targetTop + this._targetHeight / 2 - this._tipHeight / 2;
							break;
						case V_ALIGN.BOTTOM:
							top = this._targetTop + this._targetHeight - this._tipHeight;
							break;
						default:
							top = this._targetTop + this._targetHeight / 2 - this._tipHeight / 2;
							break;
					}
					//检查是否在超出上边界限
					if (top < this._scrollTop) {
						top = this._scrollTop;
					}
					//检查是否超出下边界限
					if (top + this._tipHeight > this._scrollTop + this._viewPortHeight) {
						top = this._scrollTop + this._viewPortHeight - this._tipHeight;
					}
				}
			} else {
				canHandle = false;
			}

			this._resultLeft = left;
			this._resultTop = top;

			return canHandle;
		}
	};
	PositionHandlerLeft = Tip.PositionHandlerLeft = PositionHandler.extend(PositionHandlerLeft);

	var positionHandlerTop = new PositionHandlerTop();
	var positionHandlerRight = new PositionHandlerRight();
	var positionHandlerBottom = new PositionHandlerBottom();
	var positionHandlerLeft = new PositionHandlerLeft();

	/**
	 * 默认上方显示
	 * @type {Array}
	 */
	var positionHandlersTop = [positionHandlerTop, positionHandlerRight, positionHandlerBottom, positionHandlerLeft];
	/**
	 * 默认右方显示
	 * @type {Array}
	 */
	var positionHandlersRight = [positionHandlerRight, positionHandlerBottom, positionHandlerLeft, positionHandlerTop];
	/**
	 * 默认下方显示
	 * @type {Array}
	 */
	var positionHandlersBottom = [positionHandlerBottom, positionHandlerLeft, positionHandlerTop, positionHandlerRight];
	/**
	 * 默认左方显示
	 * @type {Array}
	 */
	var positionHandlersLeft = [positionHandlerLeft, positionHandlerTop, positionHandlerRight, positionHandlerBottom];

	/**
	 * 从缓存中移除正在显示
	 * @param target
	 */
	var removeTip = function (target) {
		target = $(target);
		var $tip = target.data("tip");

		if ($tip) {
			$tip.remove();
		}

		var index = indexOf(target[0], showingTargets);
		if (index > -1) {
			showingTargets.splice(index, 1);
		}
		target.removeData("tip");
	};

	var indexOf = function (item, array) {
		if (array.indexOf) {
			return array.indexOf(item);
		} else {
			for (var i = 0, l = array.length; i < l; i++) {
				if (item === array[i]) {
					return i;
				}
			}
			return -1;
		}
	};

	/**
	 * 保存至缓存
	 * @param target
	 * @param $tip
	 */
	var addTip = function (target, $tip) {
		target = $(target);
		target.data("tip", $tip);
		showingTargets.push(target[0]);
	};
	/**
	 * 鼠标进入目标
	 * @param {$} $target
	 * @param {Array.<Tip.PositionHandler>=} $target
	 */
	var onMouseEnter = Tip._show = function ($target, positionHandlers) {
		var temp;
		var $tipMsgEl = $target.find(".js-tip-msg").eq(0);
		if ($tipMsgEl.length == 0) {
			$tipMsgEl = $target.next();
		}
		$tipMsgEl.css({
			visibility: "hidden"
		});
		$tipMsgEl = $tipMsgEl.clone(true);
		$tipMsgEl.show().css({
			visibility: "visible"
		});

		$target.data(dataMouseEnterKey, true);

		var $tip = $target.data("tip");
		if (!$tip) {
			$tip = $("<div class='js-tip-msg-wrapper' style='z-index:10000001;position:absolute;visibility:hidden;'></div>");
		}
		$tip.empty();
		$tip.append($tipMsgEl);
		//首先加入dom中，使其能获取事件以及开始渲染，为之后获取其尺寸做准备
		$("body").append($tip);
		$tip
			.one("mouseenter", function () {
				$tip.data(dataMouseEnterKey, true);
			})
			.one("mouseleave", function () {
				$tip.data(dataMouseEnterKey, false);
				//跳出单线程
				setTimeout(function () {
					if (!$target.data(dataMouseEnterKey)) {
						removeTip($target);
					}
				}, 200);
			});

		var viewPortWidth = $(window).width();
		var viewPortHeight = $(window).height();
		var scrollLeft = $(document).scrollLeft();
		var scrollTop = $(document).scrollTop();

		temp = $target.offset();
		var targetLeft = temp.left;
		var targetTop = temp.top;
		var targetWidth = $target.outerWidth();
		var targetHeight = $target.outerHeight();
		temp = $tip.children().eq(0);
		var tipWidth = temp.outerWidth();
		var tipHeight = temp.outerHeight();

		var alignStr = $target.attr(Tip.KEY_ALIGN) || (H_ALIGN.RIGHT + "-" + V_ALIGN.TOP);
		temp = alignStr.split("-");
		var hAlign = temp[0] || H_ALIGN.CENTER; //水平对齐方向，l：左，c：中，r：右
		var vAlign = temp[1] || V_ALIGN.MIDDLE; //垂直对齐方向，t：上，m：中，b：下

		var pHandlers;
		if (positionHandlers) {
			pHandlers = positionHandlers;
		} else {
			var position = $target.attr(Tip.KEY_POSITION) || POSITION.RIGHT;
			switch (position) {
				case "t":
					pHandlers = positionHandlersTop;
					break;
				case "r":
					pHandlers = positionHandlersRight;
					break;
				case "b":
					pHandlers = positionHandlersBottom;
					break;
				case "l":
					pHandlers = positionHandlersLeft;
					break;
				default:
					pHandlers = positionHandlersRight;
					break;
			}
		}

		var positionHandler;
		for (var i = 0, l = pHandlers.length; i < l; i++) {
			positionHandler = pHandlers[i];
			if (positionHandler.canHandler(
				scrollLeft,
				scrollTop,
				viewPortWidth,
				viewPortHeight,
				targetLeft,
				targetTop,
				targetWidth,
				targetHeight,
				tipWidth,
				tipHeight,
				vAlign,
				hAlign,
				$tip[0])
				) {
				var p = positionHandler.getPosition();
				$tip.css({
					visibility: "",
					left: p.left,
					top: p.top,
					width: tipWidth,
					height: tipHeight
				});
				$tip.show();
				break;
			}
		}

		//保存至缓存
		addTip($target, $tip);
	};

	/**
	 * 鼠标离开目标
	 * @param {$} $target
	 */
	var onMouseLeave = Tip._hide = function ($target) {
		$target.data(dataMouseEnterKey, false);

		//跳出js单线程，使得其他事件首先发生
		setTimeout(function () {
			var $tip = $target.data("tip");
			if ($tip) {
				if (!$tip.data(dataMouseEnterKey)) {
					removeTip($target);
				}
			}
		}, 100);
	};

	/**
	 * 使得全局tip生效
	 * @deprecated
	 */
	Tip.init = function () {
		$(document)
			.on("click", function () {
				var target;
				for (var i = 0; target = showingTargets[i]; i++) {
					if (!$(target).data(Tip.PROCESS_ALONE)) {
						Tip.hide(target);
					}
				}
			});
		Tip.bind(document);
	};

	/**
	 * 绑定el元素内部具有tip效果
	 * @param {Element} el
	 */
	Tip.bind = function (el) {
		var targetSelector = ".js-tip";
		$(el)
			.on("mouseenter", targetSelector, function () {
				var $this = $(this);
				if (!$this.data(Tip.PROCESS_ALONE)) {
					onMouseEnter($this);
				}
			})
			.on("mouseleave", targetSelector, function () {
				var $this = $(this);
				if (!$this.data(Tip.PROCESS_ALONE)) {
					onMouseLeave($this);
				}
			});
	};

	/**
	 *
	 * @param {Element} el
	 */
	Tip.unbind = function (el) {
//TODO
	};

	/**
	 * 显示tip
	 * @param {String|Jquery} target 目标
	 */
	Tip.show = function (target) {
		$(target).each(function (index, el) {
			onMouseEnter($(el));
		});
	};
	/**
	 * 隐藏tip
	 * @param {String|Jquery} target 目标
	 */
	Tip.hide = function (target) {
		$(target).each(function (index, el) {
			onMouseLeave($(el));
		});
	};

	window['Tip'] = Tip;
})($, this);