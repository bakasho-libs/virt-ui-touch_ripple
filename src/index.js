var virt = require("virt"),
    css = require("css"),
    indexOf = require("index_of"),
    extend = require("extend"),
    arrayMap = require("array-map"),
    propTypes = require("prop_types"),
    CircleRipple = require("virt-ui-circle_ripple");


var TouchRipplePrototype;


module.exports = TouchRipple;


function TouchRipple(props, children, context) {
    var _this = this;

    virt.Component.call(this, props, children, context);

    this.state = {
        key: 0,
        ripples: []
    };

    this.onMouseDown = function(e) {
        return _this.__onMouseDown(e);
    };
    this.onTouchTap = function(e) {
        return _this.__onTouchTap(e);
    };
}
virt.Component.extend(TouchRipple, "virt-ui-TouchRipple");

TouchRipple.propTypes = {
    abortOnScroll: propTypes.bool,
    centerRipple: propTypes.bool,
    contentStyle: propTypes.object,
    color: propTypes.string,
    opacity: propTypes.number,
    style: propTypes.object
};

TouchRipple.defaultProps = {
    abortOnScroll: true,
    opacity: 0.1,
    color: "#000",
    centerRipple: false
};

TouchRipplePrototype = TouchRipple.prototype;

TouchRipplePrototype.__onMouseDown = function(e) {
    if (e.button === 0) {
        this.start(e);
    }
};

TouchRipplePrototype.__onTouchTap = function(e) {
    this.start(e);
};

TouchRipplePrototype.start = function(e) {
    var _this = this;

    function onGetData(error, data) {
        var props, state, ripples;

        if (!error) {
            props = _this.props;
            state = _this.state;

            data.key = state.key;
            data.color = props.color;
            data.opacity = props.opacity;

            ripples = state.ripples;
            ripples[ripples.length] = data;

            _this.setState({
                key: state.key + 1,
                ripples: ripples
            });
        }
    }

    if (!this.props.centerRipple) {
        TouchRipple_getData(this, e, onGetData);
    } else {
        TouchRipple_getDataCenter(this, e, onGetData);
    }
};

function TouchRipple_getData(_this, e, callback) {
    _this.emitMessage("virt.getViewDimensions", {
        id: _this.getInternalId()
    }, function onGetViewDimensions(error, dimensions) {
        var touch, pageX, pageY, pointerX, pointerY, rippleRadius;

        if (error) {
            callback(error);
        } else {
            touch = e.touches && e.touches.length ? e.touches[0] : null;
            pageX = touch ? touch.pageX : e.pageX;
            pageY = touch ? touch.pageY : e.pageY;
            pointerX = pageX - dimensions.left;
            pointerY = pageY - dimensions.top;
            rippleRadius = Math.max(
                hypot(pointerX, pointerY),
                hypot(dimensions.width - pointerX, pointerY),
                hypot(dimensions.width - pointerX, dimensions.height - pointerY),
                hypot(pointerX, dimensions.height - pointerY)
            );

            callback(undefined, new RippleData(rippleRadius * 2, pointerX - rippleRadius, pointerY - rippleRadius));
        }
    });
}

function TouchRipple_getDataCenter(_this, e, callback) {
    _this.emitMessage("virt.getViewDimensions", {
        id: _this.getInternalId()
    }, function onGetViewDimensions(error, dimensions) {
        var width, height, size;

        if (error) {
            callback(error);
        } else {
            width = dimensions.width,
                height = dimensions.height,
                size = Math.max(width, height);

            callback(undefined, new RippleData(size, (width - size) * 0.5, (height - size) * 0.5));
        }
    });
}

function TouchRipple_remove(_this, ripple) {
    var ripples = _this.state.ripples,
        index = indexOf(ripples, ripple);

    if (index !== -1 && _this.isMounted()) {
        ripples.splice(index, 1);
        _this.setState({
            ripples: ripples
        });
    }
}

function hypot(a, b) {
    return Math.sqrt((a * a) + (b * b));
}

function RippleData(size, left, top) {
    this.key = null;
    this.color = null;
    this.opacity = null;
    this.size = size;
    this.left = left;
    this.top = top;
}

TouchRipplePrototype.getStyles = function() {
    var styles = {
        root: {
            overflow: "hidden",
            position: "relative"
        },
        ripples: {
            position: "absolute",
            overflow: "hidden",
            top: "0px",
            left: "0px",
            width: "100%",
            height: "100%",
            zIndex: 0
        },
        content: {
            position: "relative",
            zIndex: 1
        }
    };

    css.userSelect(styles.content, "none");

    return styles;
};

TouchRipplePrototype.render = function() {
    var _this = this,
        props = this.props,
        styles = this.getStyles();

    return (
        virt.createView("div", {
                className: "virt-ui-TouchRipple",
                onMouseDown: this.onMouseDown,
                onTouchTap: this.onTouchTap,
                style: extend(styles.root, props.style)
            },
            virt.createView("div", {
                    className: "ripples",
                    style: extend(styles.ripples, props.ripplesStyle)
                },
                arrayMap(this.state.ripples, function(ripple) {
                    return (
                        virt.createView(CircleRipple, {
                            key: ripple.key,
                            color: ripple.color,
                            opacity: ripple.opacity,
                            top: ripple.top,
                            left: ripple.left,
                            size: ripple.size,
                            onDone: function onDone() {
                                TouchRipple_remove(_this, ripple);
                            }
                        })
                    );
                })
            ),
            virt.createView("div", {
                className: "content",
                style: extend(styles.content, props.contentStyle)
            }, this.children)
        )
    );
};
