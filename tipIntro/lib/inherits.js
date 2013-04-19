/**
 * Created with IntelliJ IDEA.
 * User: hp
 * Date: 13-4-19
 * Time: ÏÂÎç11:59
 * To change this template use File | Settings | File Templates.
 */

/**
 * Inherit the prototype methods from one constructor into another.
 *
 * Usage:
 * <pre>
 * function ParentClass(a, b) { }
 * ParentClass.prototype.foo = function(a) { }
 *
 * function ChildClass(a, b, c) {
 *   goog.base(this, a, b);
 * }
 * goog.inherits(ChildClass, ParentClass);
 *
 * var child = new ChildClass('a', 'b', 'see');
 * child.foo(); // works
 * </pre>
 *
 * In addition, a superclass' implementation of a method can be invoked
 * as follows:
 *
 * <pre>
 * ChildClass.prototype.foo = function(a) {
 *   ChildClass.superClass_.foo.call(this, a);
 *   // other code
 * };
 * </pre>
 *
 * @param {Function} childCtor Child class.
 * @param {Function} parentCtor Parent class.
 */
var inherits = function (childCtor, parentCtor) {
	/** @constructor */
	function tempCtor() {
	};
	tempCtor.prototype = parentCtor.prototype;
	childCtor.superClass_ = parentCtor.prototype;
	childCtor.prototype = new tempCtor();
	/** @override */
	childCtor.prototype.constructor = childCtor;
};