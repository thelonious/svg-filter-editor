/*****
*
*   Interval.js
*
*   copyright 2002, Kevin Lindsey
*
*****/

/*****
*
*   class variables
*
*****/
Interval.VERSION = 1.0;


/*****
*
*   constructor
*
*****/
function Interval(lo, hi) {
    if ( arguments.length > 0 ) this.init(lo, hi);
}


/*****
*
*   init
*
*****/
Interval.prototype.init = function(lo, hi) {
    this.lo = Math.min(lo, hi);
    this.hi = Math.max(lo, hi);
};


/*****
*
*   contains
*
*****/
Interval.prototype.contains = function(value) {
    return this.lo <= value && value <= this.hi;
}


/*****
*
*   isOverlapping
*
*****/
Interval.prototype.isOverlapping = function(that) {
    return (
        this.contains(that.lo) ||
        this.contains(that.hi) ||
        that.contains(this.lo) ||
        that.contains(this.hi)
    );
}
