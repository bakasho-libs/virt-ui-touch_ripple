(function(dependencies, chunks, undefined, global) {
    
    var cache = [];
    

    function Module() {
        this.id = null;
        this.filename = null;
        this.dirname = null;
        this.exports = {};
        this.loaded = false;
    }

    Module.prototype.require = require;

    function require(index) {
        var module = cache[index],
            callback, exports;

        if (module !== undefined) {
            return module.exports;
        } else {
            callback = dependencies[index];

            cache[index] = module = new Module();
            exports = module.exports;

            callback.call(exports, require, exports, module, undefined, global);
            module.loaded = true;

            return module.exports;
        }
    }

    require.resolve = function(path) {
        return path;
    };

    

    require.async = function async(index, callback) {
        callback(require(index));
    };

    

    if (typeof(define) === "function" && define.amd) {
        define([], function() {
            return require(0);
        });
    } else if (typeof(module) !== "undefined" && module.exports) {
        module.exports = require(0);
    } else {
        
        require(0);
        
    }
}([
function(require, exports, module, undefined, global) {
/* index.js */

var virt = require(1),
    virtDOM = require(2),
    TouchRipple = require(3);


var AppPrototype;


function App(props, children, context) {
    virt.Component.call(this, props, children, context);
}
virt.Component.extend(App, "App");
AppPrototype = App.prototype;

AppPrototype.getChildContext = function() {
    return {
        muiTheme: {
            styles: {}
        }
    };
};

AppPrototype.render = function() {
    return (
        virt.createView("div", {
                className: "App"
            },
            virt.createView("div", {
                    style: {
                        background: "#f00",
                        overflow: "hidden",
                        position: "relative",
                        width: "256px",
                        height: "128px"
                    }
                },
                virt.createView(TouchRipple, "Touch Me")
            ),
            virt.createView("div", {
                    style: {
                        background: "#f00",
                        overflow: "hidden",
                        position: "relative",
                        width: "128px",
                        height: "256px"
                    }
                },
                virt.createView(TouchRipple, "Touch Me")
            )
        )
    );
};

virtDOM.render(virt.createView(App), document.getElementById("app"));



},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt/src/index.js */

var View = require(4);


var virt = exports;


virt.Root = require(5);

virt.Component = require(6);

virt.View = View;
virt.cloneView = View.clone;
virt.createView = View.create;
virt.createFactory = View.createFactory;

virt.consts = require(7);

virt.getChildKey = require(8);
virt.getRootIdFromId = require(9);

virt.traverseAncestors = require(10);
virt.traverseDescendants = require(11);
virt.traverseTwoPhase = require(12);

virt.context = require(13);
virt.owner = require(14);


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt-dom/src/index.js */

var renderString = require(69),
    nativeDOMComponents = require(70),
    nativeDOMHandlers = require(71);


var virtDOM = exports;


virtDOM.virt = require(1);

virtDOM.addNativeComponent = function(type, constructor) {
    nativeDOMComponents[type] = constructor;
};
virtDOM.addNativeHandler = function(name, fn) {
    nativeDOMHandlers[name] = fn;
};

virtDOM.render = require(72);
virtDOM.unmount = require(73);

virtDOM.renderString = function(view, id) {
    return renderString(view, null, id || ".0");
};

virtDOM.findDOMNode = require(74);
virtDOM.findRoot = require(75);
virtDOM.findEventHandler = require(76);

virtDOM.createWorkerRender = require(77);
virtDOM.renderWorker = require(78);

virtDOM.createWebSocketRender = require(79);
virtDOM.renderWebSocket = require(80);


},
function(require, exports, module, undefined, global) {
/* ../../src/index.js */

var virt = require(1),
    css = require(192),
    indexOf = require(54),
    extend = require(24),
    arrayMap = require(23),
    propTypes = require(193),
    CircleRipple = require(194);


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

    if (!this.props.rippleCenter) {
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
        id: this.getInternalId()
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
        ripple: {
            overflow: "hidden",
            position: "relative",
            width: "100%",
            height: "100%"
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
                className: "virt-ui-Ripple",
                onMouseDown: this.onMouseDown,
                onTouchTap: this.onTouchTap,
                style: styles.ripple
            },
            virt.createView("div", {
                    className: "ripples",
                    style: extend(styles.ripples, props.style)
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
                style: extend(styles.content, props.content)
            }, this.children)
        )
    );
};


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt/src/View.js */

var isPrimitive = require(15),
    isFunction = require(16),
    isArray = require(17),
    isString = require(18),
    isObjectLike = require(19),
    isNullOrUndefined = require(20),
    isNumber = require(21),
    has = require(22),
    arrayMap = require(23),
    extend = require(24),
    propsToJSON = require(25),
    owner = require(14),
    context = require(13);


var ViewPrototype;


module.exports = View;


function View(type, key, ref, props, children, owner, context) {
    this.__owner = owner;
    this.__context = context;
    this.type = type;
    this.key = key;
    this.ref = ref;
    this.props = props;
    this.children = children;
}
ViewPrototype = View.prototype;

ViewPrototype.__View__ = true;

ViewPrototype.copy = function(view) {
    this.__owner = view.__owner;
    this.__context = view.__context;
    this.type = view.type;
    this.key = view.key;
    this.ref = view.ref;
    this.props = view.props;
    this.children = view.children;
    return this;
};

ViewPrototype.clone = function() {
    return new View(this.type, this.key, this.ref, this.props, this.children, this.__owner, this.__context);
};

ViewPrototype.toJSON = function() {
    return toJSON(this);
};

View.isView = isView;
View.isPrimitiveView = isPrimitiveView;
View.isViewComponent = isViewComponent;
View.isViewJSON = isViewJSON;
View.toJSON = toJSON;

View.clone = function(view, config, children) {
    var localHas = has,
        props = extend({}, view.props),
        key = view.key,
        ref = view.ref,
        viewOwner = view.__owner,
        childrenLength = arguments.length - 2,
        propName, childArray, i, il;

    if (config) {
        if (config.ref) {
            ref = config.ref;
            viewOwner = owner.current;
        }
        if (config.key) {
            key = config.key;
        }

        for (propName in config) {
            if (localHas(config, propName)) {
                if (!(propName === "key" || propName === "ref")) {
                    props[propName] = config[propName];
                }
            }
        }
    }

    if (childrenLength === 1 && !isArray(children)) {
        children = [children];
    } else if (childrenLength > 1) {
        childArray = new Array(childrenLength);
        i = -1;
        il = childrenLength - 1;
        while (i++ < il) {
            childArray[i] = arguments[i + 2];
        }
        children = childArray;
    } else {
        children = view.children;
    }

    return new View(view.type, key, ref, props, ensureValidChildren(children), viewOwner, context.current);
};

View.create = function(type, config, children) {
    var isConfigArray = isArray(config),
        argumentsLength = arguments.length;

    if (isChild(config) || isConfigArray) {
        if (isConfigArray) {
            children = config;
        } else if (argumentsLength > 1) {
            children = extractChildren(arguments, 1);
        }
        config = null;
    } else if (children) {
        if (isArray(children)) {
            children = children;
        } else if (argumentsLength > 2) {
            children = extractChildren(arguments, 2);
        }
    }

    return construct(type, config, children);
};

View.createFactory = function(type) {
    return function factory(config, children) {
        var isConfigArray = isArray(config),
            argumentsLength = arguments.length;

        if (isChild(config) || isConfigArray) {
            if (isConfigArray) {
                children = config;
            } else if (config && argumentsLength > 0) {
                children = extractChildren(arguments, 0);
            }
            config = null;
        } else if (children) {
            if (isArray(children)) {
                children = children;
            } else if (argumentsLength > 1) {
                children = extractChildren(arguments, 1);
            }
        }

        return construct(type, config, children);
    };
};

function construct(type, config, children) {
    var localHas = has,
        props = {},
        key = null,
        ref = null,
        propName, defaultProps;

    if (config) {
        key = config.key != null ? config.key : null;
        ref = config.ref != null ? config.ref : null;

        for (propName in config) {
            if (localHas(config, propName)) {
                if (!(propName === "key" || propName === "ref")) {
                    props[propName] = config[propName];
                }
            }
        }
    }

    if (type && type.defaultProps) {
        defaultProps = type.defaultProps;

        for (propName in defaultProps) {
            if (localHas(defaultProps, propName)) {
                if (isNullOrUndefined(props[propName])) {
                    props[propName] = defaultProps[propName];
                }
            }
        }
    }

    return new View(type, key, ref, props, ensureValidChildren(children), owner.current, context.current);
}

function toJSON(view) {
    if (isPrimitive(view)) {
        return view;
    } else {
        return {
            type: view.type,
            key: view.key,
            ref: view.ref,
            props: propsToJSON(view.props),
            children: arrayMap(view.children, toJSON)
        };
    }
}

function isView(obj) {
    return isObjectLike(obj) && obj.__View__ === true;
}

function isViewComponent(obj) {
    return isView(obj) && isFunction(obj.type);
}

function isViewJSON(obj) {
    return (
        isObjectLike(obj) &&
        isString(obj.type) &&
        isObjectLike(obj.props) &&
        isArray(obj.children)
    );
}

function isPrimitiveView(object) {
    return isString(object) || isNumber(object);
}

function isChild(object) {
    return isView(object) || isPrimitiveView(object);
}

function extractChildren(args, offset) {
    var children = [],
        i = offset - 1,
        il = args.length - 1,
        j = 0,
        arg;

    while (i++ < il) {
        arg = args[i];
        if (!isNullOrUndefined(arg) && arg !== "" && !isArray(arg)) {
            children[j++] = arg;
        }
    }

    return children;
}

function ensureValidChildren(children) {
    var i, il;

    if (isArray(children)) {
        i = -1;
        il = children.length - 1;

        while (i++ < il) {
            if (!isChild(children[i])) {
                throw new TypeError("child of a View must be a String, Number or a View");
            }
        }
    } else {
        children = [];
    }

    return children;
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt/src/Root.js */

var isFunction = require(16),
    isNull = require(26),
    isUndefined = require(27),
    emptyFunction = require(35),
    Transaction = require(36),
    diffProps = require(37),
    shouldUpdate = require(38),
    EventManager = require(39),
    Node = require(40);


var RootPrototype,
    ROOT_ID = 0;


module.exports = Root;


function Root() {

    this.id = "." + (ROOT_ID++).toString(36);
    this.childHash = {};

    this.eventManager = new EventManager();

    this.nativeComponents = {};
    this.diffProps = diffProps;
    this.adapter = null;

    this.__transactions = [];
    this.__transactionCallbacks = [];
    this.__currentTransaction = null;
}
RootPrototype = Root.prototype;

RootPrototype.registerNativeComponent = function(type, constructor) {
    this.nativeComponents[type] = constructor;
};

RootPrototype.appendNode = function(node) {
    var id = node.id,
        childHash = this.childHash;

    if (isUndefined(childHash[id])) {
        node.root = this;
        childHash[id] = node;
    } else {
        throw new Error("Root appendNode(node) trying to override node at " + id);
    }
};

RootPrototype.removeNode = function(node) {
    var id = node.id,
        childHash = this.childHash;

    if (!isUndefined(childHash[id])) {
        node.root = null;
        delete childHash[id];
    } else {
        throw new Error("Root removeNode(node) trying to remove node that does not exists with id " + id);
    }
};

RootPrototype.__processTransaction = function() {
    var _this = this,
        transactions = this.__transactions,
        transactionCallbacks = this.__transactionCallbacks,
        transaction, callback;

    if (isNull(this.__currentTransaction) && transactions.length !== 0) {
        this.__currentTransaction = transaction = transactions[0];
        callback = transactionCallbacks[0];

        this.adapter.messenger.emit("virt.handleTransaction", transaction, function onHandleTransaction() {
            transactions.splice(0, 1);
            transactionCallbacks.splice(0, 1);

            transaction.queue.notifyAll();
            transaction.destroy();

            _this.__currentTransaction = null;

            callback();

            if (transactions.length !== 0) {
                _this.__processTransaction();
            }
        });
    }
};

RootPrototype.__enqueueTransaction = function(transaction, callback) {
    var transactions = this.__transactions,
        index = transactions.length;

    transactions[index] = transaction;
    this.__transactionCallbacks[index] = isFunction(callback) ? callback : emptyFunction;
    this.__processTransaction();
};

RootPrototype.unmount = function(callback) {
    var node = this.childHash[this.id],
        transaction;

    if (node) {
        transaction = Transaction.create();

        transaction.unmount(this.id);
        node.__unmount(transaction);

        this.__enqueueTransaction(transaction, callback);
    }
};

RootPrototype.update = function(node, callback) {
    var transaction = Transaction.create();

    node.update(node.currentView, transaction);

    this.__enqueueTransaction(transaction, callback);
};

RootPrototype.render = function(nextView, id, callback) {
    var transaction = Transaction.create(),
        node;

    if (isFunction(id)) {
        callback = id;
        id = null;
    }

    id = id || this.id;
    node = this.childHash[id];

    if (node) {
        if (shouldUpdate(node.currentView, nextView)) {

            node.update(nextView, transaction);
            this.__enqueueTransaction(transaction, callback);

            return this;
        } else {
            if (this.id === id) {
                node.__unmount(transaction);
                transaction.unmount(id);
            } else {
                node.unmount(transaction);
            }
        }
    }

    node = new Node(this.id, id, nextView);
    this.appendNode(node);
    node.mount(transaction);

    this.__enqueueTransaction(transaction, callback);

    return this;
};


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt/src/Component.js */

var inherits = require(62),
    extend = require(24),
    componentState = require(57);


var ComponentPrototype;


module.exports = Component;


function Component(props, children, context) {
    this.__node = null;
    this.__mountState = componentState.UNMOUNTED;
    this.__nextState = null;
    this.props = props;
    this.children = children;
    this.context = context;
    this.state = null;
    this.refs = {};
}

ComponentPrototype = Component.prototype;

Component.extend = function(child, displayName) {
    inherits(child, this);
    child.displayName = child.prototype.displayName = displayName || ComponentPrototype.displayName;
    return child;
};

ComponentPrototype.displayName = "Component";

ComponentPrototype.render = function() {
    throw new Error("render() render must be defined on Components");
};

ComponentPrototype.setState = function(state, callback) {
    var node = this.__node;

    this.__nextState = extend({}, this.state, state);

    if (this.__mountState === componentState.MOUNTED) {
        node.root.update(node, callback);
    }
};

ComponentPrototype.forceUpdate = function(callback) {
    var node = this.__node;

    if (this.__mountState === componentState.MOUNTED) {
        node.root.update(node, callback);
    }
};

ComponentPrototype.isMounted = function() {
    return this.__mountState === componentState.MOUNTED;
};

ComponentPrototype.getInternalId = function() {
    return this.__node.id;
};

ComponentPrototype.emitMessage = function(name, data, callback) {
    this.__node.root.adapter.messenger.emit(name, data, callback);
};

ComponentPrototype.sendMessage = ComponentPrototype.emitMessage;

ComponentPrototype.onMessage = function(name, callback) {
    this.__node.root.adapter.messenger.on(name, callback);
};

ComponentPrototype.offMessage = function(name, callback) {
    this.__node.root.adapter.messenger.off(name, callback);
};

ComponentPrototype.onGlobalEvent = function(name, listener, callback) {
    var root = this.__node.root,
        eventManager = root.eventManager,
        topLevelType = eventManager.propNameToTopLevel[name];

    eventManager.globalOn(topLevelType, listener);
    this.emitMessage("virt.onGlobalEvent", topLevelType, callback);
};

ComponentPrototype.offGlobalEvent = function(name, listener, callback) {
    var root = this.__node.root,
        eventManager = root.eventManager,
        topLevelType = eventManager.propNameToTopLevel[name];

    eventManager.globalOff(topLevelType, callback);
    this.emitMessage("virt.offGlobalEvent", topLevelType, callback);
};

ComponentPrototype.getChildContext = function() {};

ComponentPrototype.componentDidMount = function() {};

ComponentPrototype.componentDidUpdate = function( /* previousProps, previousChildren, previousState, previousContext */ ) {};

ComponentPrototype.componentWillMount = function() {};

ComponentPrototype.componentWillUnmount = function() {};

ComponentPrototype.componentWillReceiveProps = function( /* nextProps, nextChildren, nextContext */ ) {};

ComponentPrototype.componentWillUpdate = function( /* nextProps, nextChildren, nextState, nextContext */ ) {};

ComponentPrototype.shouldComponentUpdate = function( /* nextProps, nextChildren, nextState, nextContext */ ) {
    return true;
};


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt/src/Transaction/consts.js */

var keyMirror = require(52);


module.exports = keyMirror([
    "TEXT",
    "REPLACE",
    "PROPS",
    "ORDER",
    "INSERT",
    "REMOVE",
    "MOUNT",
    "UNMOUNT"
]);


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt/src/utils/getChildKey.js */

var getViewKey = require(65);


module.exports = getChildKey;


function getChildKey(parentId, child, index) {
    return parentId + "." + getViewKey(child, index);
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt/src/utils/getRootIdFromId.js */

module.exports = getRootIdFromId;


function getRootIdFromId(id) {
    var index;

    if (id && id.charAt(0) === "." && id.length > 1) {
        index = id.indexOf(".", 1);
        return index > -1 ? id.substr(0, index) : id;
    } else {
        return null;
    }
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt/src/utils/traverseAncestors.js */

var traversePath = require(66);


module.exports = traverseAncestors;


function traverseAncestors(id, callback) {
    traversePath("", id, callback, true, false);
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt/src/utils/traverseDescendants.js */

var traversePath = require(66);


module.exports = traverseDescendant;


function traverseDescendant(id, callback) {
    traversePath(id, "", callback, false, true);
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt/src/utils/traverseTwoPhase.js */

var traversePath = require(66);


module.exports = traverseTwoPhase;


function traverseTwoPhase(id, callback) {
    if (id) {
        traversePath("", id, callback, true, false);
        traversePath(id, "", callback, false, true);
    }
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt/src/context.js */

var context = exports;


context.current = null;


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt/src/owner.js */

var owner = exports;


owner.current = null;


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt/node_modules/is_primitive/src/index.js */

var isNullOrUndefined = require(20);


module.exports = isPrimitive;


function isPrimitive(obj) {
    var typeStr;
    return isNullOrUndefined(obj) || ((typeStr = typeof(obj)) !== "object" && typeStr !== "function") || false;
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt/node_modules/is_function/src/index.js */

var objectToString = Object.prototype.toString,
    isFunction;


if (objectToString.call(function() {}) === "[object Object]") {
    isFunction = function isFunction(value) {
        return value instanceof Function;
    };
} else if (typeof(/./) === "function" || (typeof(Uint8Array) !== "undefined" && typeof(Uint8Array) !== "function")) {
    isFunction = function isFunction(value) {
        return objectToString.call(value) === "[object Function]";
    };
} else {
    isFunction = function isFunction(value) {
        return typeof(value) === "function" || false;
    };
}


module.exports = isFunction;


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt/node_modules/is_array/src/index.js */

var isNative = require(28),
    isLength = require(29),
    isObject = require(30);


var objectToString = Object.prototype.toString,
    nativeIsArray = Array.isArray,
    isArray;


if (isNative(nativeIsArray)) {
    isArray = nativeIsArray;
} else {
    isArray = function isArray(value) {
        return (
            isObject(value) &&
            isLength(value.length) &&
            objectToString.call(value) === "[object Array]"
        ) || false;
    };
}


module.exports = isArray;


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt/node_modules/is_string/src/index.js */

module.exports = isString;


function isString(value) {
    return typeof(value) === "string" || false;
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt/node_modules/is_object_like/src/index.js */

var isNullOrUndefined = require(20);


module.exports = isObjectLike;


function isObjectLike(value) {
    return (!isNullOrUndefined(value) && typeof(value) === "object") || false;
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt/node_modules/is_null_or_undefined/src/index.js */

var isNull = require(26),
    isUndefined = require(27);


module.exports = isNullOrUndefined;

/**
  isNullOrUndefined accepts any value and returns true
  if the value is null or undefined. For all other values
  false is returned.
  
  @param {Any}        any value to test
  @returns {Boolean}  the boolean result of testing value

  @example
    isNullOrUndefined(null);   // returns true
    isNullOrUndefined(undefined);   // returns true
    isNullOrUndefined("string");    // returns false
**/
function isNullOrUndefined(value) {
    return isNull(value) || isUndefined(value);
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt/node_modules/is_number/src/index.js */

module.exports = isNumber;


function isNumber(value) {
    return typeof(value) === "number" || false;
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt/node_modules/has/src/index.js */

var isNative = require(28),
    getPrototypeOf = require(33),
    isNullOrUndefined = require(20);


var nativeHasOwnProp = Object.prototype.hasOwnProperty,
    baseHas;


module.exports = has;


function has(object, key) {
    if (isNullOrUndefined(object)) {
        return false;
    } else {
        return baseHas(object, key);
    }
}

if (isNative(nativeHasOwnProp)) {
    baseHas = function baseHas(object, key) {
        return nativeHasOwnProp.call(object, key);
    };
} else {
    baseHas = function baseHas(object, key) {
        var proto = getPrototypeOf(object);

        if (isNullOrUndefined(proto)) {
            return key in object;
        } else {
            return (key in object) && (!(key in proto) || proto[key] !== object[key]);
        }
    };
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt/node_modules/array-map/src/index.js */

module.exports = arrayMap;


function arrayMap(array, callback) {
    var length = array.length,
        i = -1,
        il = length - 1,
        results = new Array(length);

    while (i++ < il) {
        results[i] = callback(array[i], i, array);
    }

    return results;
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt/node_modules/extend/src/index.js */

var keys = require(34);


module.exports = extend;


function extend(out) {
    var i = 0,
        il = arguments.length - 1;

    while (i++ < il) {
        baseExtend(out, arguments[i]);
    }

    return out;
}

function baseExtend(a, b) {
    var objectKeys = keys(b),
        i = -1,
        il = objectKeys.length - 1,
        key;

    while (i++ < il) {
        key = objectKeys[i];
        a[key] = b[key];
    }
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt/src/utils/propsToJSON.js */

var has = require(22),
    isNull = require(26),
    isPrimitive = require(15);


module.exports = propsToJSON;


function propsToJSON(props) {
    return toJSON(props, {});
}

function toJSON(props, json) {
    var localHas = has,
        key, value;

    for (key in props) {
        if (localHas(props, key)) {
            value = props[key];

            if (isPrimitive(value)) {
                json = isNull(json) ? {} : json;
                json[key] = value;
            } else {
                value = toJSON(value, null);
                if (!isNull(value)) {
                    json = isNull(json) ? {} : json;
                    json[key] = value;
                }
            }
        }
    }

    return json;
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt/node_modules/is_null/src/index.js */

module.exports = isNull;


function isNull(value) {
    return value === null;
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt/node_modules/is_undefined/src/index.js */

module.exports = isUndefined;


function isUndefined(value) {
    return value === void(0);
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt/node_modules/is_native/src/index.js */

var isFunction = require(16),
    isNullOrUndefined = require(20),
    escapeRegExp = require(31);


var reHostCtor = /^\[object .+?Constructor\]$/,

    functionToString = Function.prototype.toString,

    reNative = RegExp("^" +
        escapeRegExp(Object.prototype.toString)
        .replace(/toString|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
    ),

    isHostObject;


module.exports = isNative;


function isNative(value) {
    return !isNullOrUndefined(value) && (
        isFunction(value) ?
        reNative.test(functionToString.call(value)) : (
            typeof(value) === "object" && (
                (isHostObject(value) ? reNative : reHostCtor).test(value) || false
            )
        )
    ) || false;
}

try {
    String({
        "toString": 0
    } + "");
} catch (e) {
    isHostObject = function isHostObject() {
        return false;
    };
}

isHostObject = function isHostObject(value) {
    return !isFunction(value.toString) && typeof(value + "") === "string";
};


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt/node_modules/is_length/src/index.js */

var isNumber = require(21);


var MAX_SAFE_INTEGER = Math.pow(2, 53) - 1;


module.exports = isLength;


function isLength(value) {
    return isNumber(value) && value > -1 && value % 1 === 0 && value <= MAX_SAFE_INTEGER;
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt/node_modules/is_object/src/index.js */

var isNull = require(26);


module.exports = isObject;


function isObject(value) {
    var type = typeof(value);
    return type === "function" || (!isNull(value) && type === "object") || false;
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt/node_modules/escape_regexp/src/index.js */

var toString = require(32);


var reRegExpChars = /[.*+?\^${}()|\[\]\/\\]/g,
    reHasRegExpChars = new RegExp(reRegExpChars.source);


module.exports = escapeRegExp;


function escapeRegExp(string) {
    string = toString(string);
    return (
        (string && reHasRegExpChars.test(string)) ?
        string.replace(reRegExpChars, "\\$&") :
        string
    );
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt/node_modules/to_string/src/index.js */

var isString = require(18),
    isNullOrUndefined = require(20);


module.exports = toString;


function toString(value) {
    if (isString(value)) {
        return value;
    } else if (isNullOrUndefined(value)) {
        return "";
    } else {
        return value + "";
    }
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt/node_modules/get_prototype_of/src/index.js */

var isObject = require(30),
    isNative = require(28),
    isNullOrUndefined = require(20);


var nativeGetPrototypeOf = Object.getPrototypeOf,
    baseGetPrototypeOf;


module.exports = getPrototypeOf;


function getPrototypeOf(value) {
    if (isNullOrUndefined(value)) {
        return null;
    } else {
        return baseGetPrototypeOf(value);
    }
}

if (isNative(nativeGetPrototypeOf)) {
    baseGetPrototypeOf = function baseGetPrototypeOf(value) {
        return nativeGetPrototypeOf(isObject(value) ? value : Object(value)) || null;
    };
} else {
    if ("".__proto__ === String.prototype) {
        baseGetPrototypeOf = function baseGetPrototypeOf(value) {
            return value.__proto__ || null;
        };
    } else {
        baseGetPrototypeOf = function baseGetPrototypeOf(value) {
            return value.constructor ? value.constructor.prototype : null;
        };
    }
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt/node_modules/keys/src/index.js */

var has = require(22),
    isNative = require(28),
    isNullOrUndefined = require(20),
    isObject = require(30);


var nativeKeys = Object.keys;


module.exports = keys;


function keys(value) {
    if (isNullOrUndefined(value)) {
        return [];
    } else {
        return nativeKeys(isObject(value) ? value : Object(value));
    }
}

if (!isNative(nativeKeys)) {
    nativeKeys = function(value) {
        var localHas = has,
            out = [],
            i = 0,
            key;

        for (key in value) {
            if (localHas(value, key)) {
                out[i++] = key;
            }
        }

        return out;
    };
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt/node_modules/empty_function/src/index.js */

module.exports = emptyFunction;


function emptyFunction() {}

function makeEmptyFunction(value) {
    return function() {
        return value;
    };
}

emptyFunction.thatReturns = makeEmptyFunction;
emptyFunction.thatReturnsFalse = makeEmptyFunction(false);
emptyFunction.thatReturnsTrue = makeEmptyFunction(true);
emptyFunction.thatReturnsNull = makeEmptyFunction(null);
emptyFunction.thatReturnsThis = function() {
    return this;
};
emptyFunction.thatReturnsArgument = function(argument) {
    return argument;
};


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt/src/Transaction/index.js */

var createPool = require(41),
    Queue = require(42),
    has = require(22),
    consts = require(7),
    InsertPatch = require(43),
    MountPatch = require(44),
    UnmountPatch = require(45),
    OrderPatch = require(46),
    PropsPatch = require(47),
    RemovePatch = require(48),
    ReplacePatch = require(49),
    TextPatch = require(50);


var TransactionPrototype;


module.exports = Transaction;


function Transaction() {

    this.queue = Queue.getPooled();

    this.removes = {};
    this.patches = {};

    this.events = {};
    this.eventsRemove = {};
}
createPool(Transaction);
Transaction.consts = consts;
TransactionPrototype = Transaction.prototype;

Transaction.create = function() {
    return Transaction.getPooled();
};

TransactionPrototype.destroy = function() {
    Transaction.release(this);
};

function clearPatches(hash) {
    var localHas = has,
        id, array, j, jl;

    for (id in hash) {
        if (localHas(hash, id)) {
            array = hash[id];
            j = -1;
            jl = array.length - 1;

            while (j++ < jl) {
                array[j].destroy();
            }

            delete hash[id];
        }
    }
}

function clearHash(hash) {
    var localHas = has,
        id;

    for (id in hash) {
        if (localHas(hash, id)) {
            delete hash[id];
        }
    }
}

TransactionPrototype.destructor = function() {
    clearPatches(this.patches);
    clearPatches(this.removes);
    clearHash(this.events);
    clearHash(this.eventsRemove);
    return this;
};

TransactionPrototype.mount = function(id, next) {
    this.append(MountPatch.create(id, next));
};

TransactionPrototype.unmount = function(id) {
    this.append(UnmountPatch.create(id));
};

TransactionPrototype.insert = function(id, childId, index, next) {
    this.append(InsertPatch.create(id, childId, index, next));
};

TransactionPrototype.order = function(id, order) {
    this.append(OrderPatch.create(id, order));
};

TransactionPrototype.props = function(id, previous, props) {
    this.append(PropsPatch.create(id, previous, props));
};

TransactionPrototype.replace = function(id, childId, index, next) {
    this.append(ReplacePatch.create(id, childId, index, next));
};

TransactionPrototype.text = function(id, index, next, props) {
    this.append(TextPatch.create(id, index, next, props));
};

TransactionPrototype.remove = function(id, childId, index) {
    this.appendRemove(RemovePatch.create(id, childId, index));
};

TransactionPrototype.event = function(id, type) {
    var events = this.events,
        eventArray = events[id] || (events[id] = []);

    eventArray[eventArray.length] = type;
};

TransactionPrototype.removeEvent = function(id, type) {
    var eventsRemove = this.eventsRemove,
        eventArray = eventsRemove[id] || (eventsRemove[id] = []);

    eventArray[eventArray.length] = type;
};

function append(hash, value) {
    var id = value.id,
        patchArray = hash[id] || (hash[id] = []);

    patchArray[patchArray.length] = value;
}

TransactionPrototype.append = function(value) {
    append(this.patches, value);
};

TransactionPrototype.appendRemove = function(value) {
    append(this.removes, value);
};

TransactionPrototype.toJSON = function() {
    return {
        removes: this.removes,
        patches: this.patches,

        events: this.events,
        eventsRemove: this.eventsRemove
    };
};


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt/src/utils/diffProps.js */

var has = require(22),
    isObject = require(30),
    getPrototypeOf = require(33),
    isNull = require(26),
    isNullOrUndefined = require(20);


module.exports = diffProps;


function diffProps(id, eventManager, transaction, previous, next) {
    var result = null,
        localHas = has,
        propNameToTopLevel = eventManager.propNameToTopLevel,
        key, previousValue, nextValue, propsDiff;

    for (key in previous) {
        nextValue = next[key];

        if (isNullOrUndefined(nextValue)) {
            result = result || {};
            result[key] = undefined;

            if (localHas(propNameToTopLevel, key)) {
                eventManager.off(id, propNameToTopLevel[key], transaction);
            }
        } else {
            previousValue = previous[key];

            if (previousValue === nextValue) {
                continue;
            } else if (isObject(previousValue) && isObject(nextValue)) {
                if (getPrototypeOf(previousValue) !== getPrototypeOf(nextValue)) {
                    result = result || {};
                    result[key] = nextValue;
                } else {
                    propsDiff = diffProps(id, eventManager, transaction, previousValue, nextValue);
                    if (!isNull(propsDiff)) {
                        result = result || {};
                        result[key] = propsDiff;
                    }
                }
            } else {
                result = result || {};
                result[key] = nextValue;
            }
        }
    }

    for (key in next) {
        if (isNullOrUndefined(previous[key])) {
            nextValue = next[key];

            result = result || {};
            result[key] = nextValue;

            if (localHas(propNameToTopLevel, key)) {
                eventManager.on(id, propNameToTopLevel[key], nextValue, transaction);
            }
        }
    }

    return result;
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt/src/utils/shouldUpdate.js */

var isString = require(18),
    isNumber = require(21),
    isNullOrUndefined = require(20);


module.exports = shouldUpdate;


function shouldUpdate(previous, next) {
    if (isNullOrUndefined(previous) || isNullOrUndefined(next)) {
        return false;
    } else {
        if (isString(previous) || isNumber(previous)) {
            return isString(next) || isNumber(next);
        } else {
            return (
                previous.type === next.type &&
                previous.key === next.key
            );
        }
    }
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt/src/EventManager.js */

var indexOf = require(54),
    isUndefined = require(27);


var EventManagerPrototype;


module.exports = EventManager;


function EventManager() {
    this.propNameToTopLevel = {};
    this.events = {};
}
EventManagerPrototype = EventManager.prototype;

EventManagerPrototype.on = function(id, topLevelType, listener, transaction) {
    var events = this.events,
        event = events[topLevelType] || (events[topLevelType] = {});

    event[id] = listener;
    transaction.event(id, topLevelType);
};
EventManagerPrototype.off = function(id, topLevelType, transaction) {
    var events = this.events,
        event = events[topLevelType];

    if (!isUndefined(event[id])) {
        delete event[id];
        transaction.removeEvent(id, topLevelType);
    }
};
EventManagerPrototype.allOff = function(id, transaction) {
    var events = this.events,
        event, topLevelType;

    for (topLevelType in events) {
        if (!isUndefined((event = events[topLevelType])[id])) {
            delete event[id];
            transaction.removeEvent(id, topLevelType);
        }
    }
};

EventManagerPrototype.globalOn = function(topLevelType, listener) {
    var events = this.events,
        event = events[topLevelType] || (events[topLevelType] = {}),
        global = event.global || (event.global = []),
        index = indexOf(global, listener);

    if (index === -1) {
        global[global.length] = listener;
    }
};
EventManagerPrototype.globalOff = function(topLevelType, listener) {
    var events = this.events,
        event = events[topLevelType] || (events[topLevelType] = {}),
        global = event.global || (event.global = []),
        index = indexOf(global, listener);

    if (index !== -1) {
        global.splice(index, 1);
    }
};
EventManagerPrototype.globalAllOff = function() {
    var events = this.events,
        event = events[topLevelType] || (events[topLevelType] = {}),
        global = event.global;

    if (global) {
        global.length = 0;
    }
};


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt/src/Node.js */

var process = require(56);
var has = require(22),
    arrayMap = require(23),
    indexOf = require(54),
    isNull = require(26),
    isString = require(18),
    isArray = require(17),
    isFunction = require(16),
    extend = require(24),
    owner = require(14),
    context = require(13),
    shouldUpdate = require(38),
    componentState = require(57),
    getComponentClassForType = require(58),
    View = require(4),
    getChildKey = require(8),
    emptyObject = require(59),
    diffChildren;


var NodePrototype,
    isPrimitiveView = View.isPrimitiveView;


module.exports = Node;


diffChildren = require(60);


function Node(parentId, id, currentView) {

    this.parent = null;
    this.parentId = parentId;
    this.id = id;

    this.context = null;

    this.root = null;

    this.ComponentClass = null;
    this.component = null;

    this.isBottomLevel = true;
    this.isTopLevel = false;

    this.renderedNode = null;
    this.renderedChildren = null;

    this.currentView = currentView;
}

NodePrototype = Node.prototype;

NodePrototype.appendNode = function(node) {
    var renderedChildren = this.renderedChildren;

    this.root.appendNode(node);
    node.parent = this;

    renderedChildren[renderedChildren.length] = node;
};

NodePrototype.removeNode = function(node) {
    var renderedChildren = this.renderedChildren,
        index;

    node.parent = null;

    index = indexOf(renderedChildren, node);
    if (index !== -1) {
        renderedChildren.splice(index, 1);
    }
};

NodePrototype.mountComponent = function() {
    var currentView = this.currentView,
        ComponentClass, component, props, children, context;

    if (isFunction(currentView.type)) {
        this.ComponentClass = ComponentClass = currentView.type;
    } else {
        this.ComponentClass = ComponentClass = getComponentClassForType(currentView.type, this.root.nativeComponents);
        this.isTopLevel = true;
    }

    props = this.__processProps(currentView.props);
    children = currentView.children;
    context = this.__processContext(currentView.__context);

    component = new ComponentClass(props, children, context);

    this.component = component;

    component.__node = this;
    component.props = component.props || props;
    component.children = component.children || children;
    component.context = component.context || context;
};

NodePrototype.mount = function(transaction) {
    transaction.mount(this.id, this.__mount(transaction));
};

NodePrototype.__mount = function(transaction) {
    var component, renderedView, renderedNode;

    this.context = context.current;
    this.mountComponent();

    renderedView = this.renderView();

    if (this.isTopLevel !== true) {
        renderedNode = this.renderedNode = new Node(this.parentId, this.id, renderedView);
        renderedNode.root = this.root;
        renderedNode.isBottomLevel = false;
        renderedView = renderedNode.__mount(transaction);
    } else {
        mountEvents(this.id, renderedView.props, this.root.eventManager, transaction);
        this.__mountChildren(renderedView, transaction);
    }

    component = this.component;
    component.__mountState = componentState.MOUNTING;
    component.componentWillMount();

    transaction.queue.enqueue(function onMount() {
        component.__mountState = componentState.MOUNTED;
        if (component.componentDidMount) {
            component.componentDidMount();
        }
    });

    this.__attachRefs();

    return renderedView;
};

NodePrototype.__mountChildren = function(renderedView, transaction) {
    var _this = this,
        parentId = this.id,
        renderedChildren = [];

    this.renderedChildren = renderedChildren;

    renderedView.children = arrayMap(renderedView.children, function(child, index) {
        var node, id;

        if (isPrimitiveView(child)) {
            return child;
        } else {
            id = getChildKey(parentId, child, index);
            node = new Node(parentId, id, child);
            _this.appendNode(node);
            return node.__mount(transaction);
        }
    });
};

NodePrototype.unmount = function(transaction) {
    this.__unmount(transaction);
    transaction.remove(this.parentId, this.id, 0);
};

NodePrototype.__unmount = function(transaction) {
    var component = this.component;

    if (this.isTopLevel !== true) {
        this.renderedNode.__unmount(transaction);
        this.renderedNode = null;
    } else {
        this.__unmountChildren(transaction);
        this.root.eventManager.allOff(this.id, transaction);
        this.renderedChildren = null;
    }

    component.__mountState = componentState.UNMOUNTING;

    if (component.componentWillUnmount) {
        component.componentWillUnmount();
    }

    if (this.isBottomLevel !== false) {
        this.root.removeNode(this);
    }

    this.__detachRefs();

    this.context = null;
    this.component = null;
    this.currentView = null;

    transaction.queue.enqueue(function onUnmount() {
        component.__mountState = componentState.UNMOUNTED;
    });
};

NodePrototype.__unmountChildren = function(transaction) {
    var renderedChildren = this.renderedChildren,
        i = -1,
        il = renderedChildren.length - 1;

    while (i++ < il) {
        renderedChildren[i].__unmount(transaction);
    }
};

NodePrototype.update = function(nextView, transaction) {
    this.receiveView(nextView, nextView.__context, transaction);
};

NodePrototype.receiveView = function(nextView, nextContext, transaction) {
    var prevView = this.currentView,
        prevContext = this.context;

    this.updateComponent(
        prevView,
        nextView,
        prevContext,
        nextContext,
        transaction
    );
};

NodePrototype.updateComponent = function(
    prevParentView, nextParentView, prevUnmaskedContext, nextUnmaskedContext, transaction
) {
    var component = this.component,

        nextProps = component.props,
        nextChildren = component.children,
        nextContext = component.context,

        nextState;

    component.__mountState = componentState.UPDATING;

    if (prevParentView !== nextParentView) {
        nextProps = this.__processProps(nextParentView.props);
        nextChildren = nextParentView.children;
        nextContext = this.__processContext(nextParentView.__context);

        if (component.componentWillReceiveProps) {
            component.componentWillReceiveProps(nextProps, nextChildren, nextContext);
        }
    }

    nextState = component.__nextState || component.state;

    if (component.shouldComponentUpdate ? component.shouldComponentUpdate(nextProps, nextChildren, nextState, nextContext) : true) {
        this.__updateComponent(
            nextParentView, nextProps, nextChildren, nextState, nextContext, nextUnmaskedContext, transaction
        );
    } else {
        this.currentView = nextParentView;
        this.context = nextUnmaskedContext;

        component.props = nextProps;
        component.children = nextChildren;
        component.state = nextState;
        component.context = nextContext;

        component.__mountState = componentState.MOUNTED;
    }
};

NodePrototype.__updateComponent = function(
    nextParentView, nextProps, nextChildren, nextState, nextContext, unmaskedContext, transaction
) {
    var component = this.component,

        prevProps = component.props,
        prevChildren = component.children,
        prevState = component.__previousState,
        prevContext = component.context,

        prevParentView;

    if (component.componentWillUpdate) {
        component.componentWillUpdate(nextProps, nextChildren, nextState, nextContext);
    }

    component.props = nextProps;
    component.children = nextChildren;
    component.state = nextState;
    component.context = nextContext;

    this.context = unmaskedContext;

    if (this.isTopLevel !== true) {
        this.currentView = nextParentView;
        this.__updateRenderedNode(unmaskedContext, transaction);
    } else {
        prevParentView = this.currentView;
        this.currentView = nextParentView;
        this.__updateRenderedView(prevParentView, unmaskedContext, transaction);
    }

    transaction.queue.enqueue(function onUpdate() {
        component.__mountState = componentState.UPDATED;
        if (component.componentDidUpdate) {
            component.componentDidUpdate(prevProps, prevChildren, prevState, prevContext);
        }
        component.__mountState = componentState.MOUNTED;
    });
};

NodePrototype.__updateRenderedNode = function(context, transaction) {
    var prevNode = this.renderedNode,
        prevRenderedView = prevNode.currentView,
        nextRenderedView = this.renderView(),
        renderedNode;

    if (shouldUpdate(prevRenderedView, nextRenderedView)) {
        prevNode.receiveView(nextRenderedView, this.__processChildContext(context), transaction);
    } else {
        prevNode.__unmount(transaction);

        renderedNode = this.renderedNode = new Node(this.parentId, this.id, nextRenderedView);
        renderedNode.root = this.root;
        renderedNode.isBottomLevel = false;

        transaction.replace(this.parentId, this.id, 0, renderedNode.__mount(transaction));
    }

    this.__attachRefs();
};

NodePrototype.__updateRenderedView = function(prevRenderedView, context, transaction) {
    var id = this.id,
        root = this.root,
        nextRenderedView = this.renderView(),
        propsDiff = root.diffProps(id, root.eventManager, transaction, prevRenderedView.props, nextRenderedView.props);

    if (!isNull(propsDiff)) {
        transaction.props(id, prevRenderedView.props, propsDiff);
    }

    diffChildren(this, prevRenderedView, nextRenderedView, transaction);
};

NodePrototype.renderView = function() {
    var currentView = this.currentView,
        previousContext = context.current,
        renderedView;

    context.current = this.__processChildContext(currentView.__context);
    owner.current = this.component;

    renderedView = this.component.render();

    renderedView.ref = currentView.ref;
    renderedView.key = currentView.key;

    context.current = previousContext;
    owner.current = null;

    return renderedView;
};

function warnError(error) {
    var i, il;

    if (isArray(error)) {
        i = -1;
        il = error.length - 1;
        while (i++ < il) {
            warnError(error[i]);
        }
    } else {
        console.warn(error);
    }
}

NodePrototype.__checkTypes = function(propTypes, props) {
    var localHas = has,
        displayName = this.__getName(),
        propName, error;

    if (propTypes) {
        for (propName in propTypes) {
            if (localHas(propTypes, propName)) {
                error = propTypes[propName](props, propName, displayName);
                if (error) {
                    warnError(error);
                }
            }
        }
    }
};

NodePrototype.__processProps = function(props) {
    var ComponentClass = this.ComponentClass,
        propTypes;

    if (process.env.NODE_ENV !== "production") {
        propTypes = ComponentClass.propTypes;

        if (propTypes) {
            this.__checkTypes(propTypes, props);
        }
    }

    return props;
};

NodePrototype.__maskContext = function(context) {
    var maskedContext = null,
        contextTypes, contextName, localHas;

    if (isString(this.ComponentClass)) {
        return emptyObject;
    } else {
        contextTypes = this.ComponentClass.contextTypes;

        if (contextTypes) {
            maskedContext = {};
            localHas = has;

            for (contextName in contextTypes) {
                if (localHas(contextTypes, contextName)) {
                    maskedContext[contextName] = context[contextName];
                }
            }
        }

        return maskedContext;
    }
};

NodePrototype.__processContext = function(context) {
    var maskedContext = this.__maskContext(context),
        contextTypes;

    if (process.env.NODE_ENV !== "production") {
        contextTypes = this.ComponentClass.contextTypes;

        if (contextTypes) {
            this.__checkTypes(contextTypes, maskedContext);
        }
    }

    return maskedContext;
};

NodePrototype.__processChildContext = function(currentContext) {
    var component = this.component,
        childContext = isFunction(component.getChildContext) ? component.getChildContext() : null,
        childContextTypes, localHas, contextName, displayName;

    if (childContext) {
        childContextTypes = this.ComponentClass.childContextTypes;

        if (process.env.NODE_ENV !== "production") {
            if (childContextTypes) {
                this.__checkTypes(childContextTypes, childContext);
            }
        }

        if (childContextTypes) {
            localHas = has;
            displayName = this.__getName();

            for (contextName in childContext) {
                if (!localHas(childContextTypes, contextName)) {
                    console.warn(new Error(
                        displayName + " getChildContext(): key " + contextName + " is not defined in childContextTypes"
                    ));
                }
            }
        }

        return extend({}, currentContext, childContext);
    } else {
        return currentContext;
    }
};

NodePrototype.__attachRefs = function() {
    var view = this.currentView,
        ref = view.ref;

    if (isString(ref)) {
        attachRef(this.component, ref, view.__owner);
    }
};

NodePrototype.__detachRefs = function() {
    var view = this.currentView,
        ref = view.ref;

    if (isString(ref)) {
        detachRef(ref, view.__owner);
    }
};

NodePrototype.__getName = function() {
    var type = this.currentView.type,
        constructor;

    if (isString(type)) {
        return type;
    } else {
        constructor = this.component && this.component.constructor;
        return type.displayName || (constructor && constructor.displayName) || null;
    }
};

function attachRef(component, ref, owner) {
    if (isString(ref)) {
        if (owner) {
            owner.refs[ref] = component;
        } else {
            throw new Error("cannot add ref to view without owner");
        }

    }
}

function detachRef(ref, owner) {
    var refs = owner.refs;
    delete refs[ref];
}

function mountEvents(id, props, eventManager, transaction) {
    var propNameToTopLevel = eventManager.propNameToTopLevel,
        localHas = has,
        key;

    for (key in props) {
        if (localHas(propNameToTopLevel, key)) {
            eventManager.on(id, propNameToTopLevel[key], props[key], transaction);
        }
    }
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt/node_modules/create_pool/src/index.js */

var isFunction = require(16),
    isNumber = require(21),
    defineProperty = require(51);


var descriptor = {
    configurable: false,
    enumerable: false,
    writable: false,
    value: null
};


module.exports = createPool;


function createPool(Constructor, poolSize) {

    addProperty(Constructor, "instancePool", []);
    addProperty(Constructor, "getPooled", createPooler(Constructor));
    addProperty(Constructor, "release", createReleaser(Constructor));

    poolSize = poolSize || Constructor.poolSize;
    Constructor.poolSize = isNumber(poolSize) ? (poolSize < -1 ? -1 : poolSize) : -1;

    return Constructor;
}

function addProperty(object, name, value) {
    descriptor.value = value;
    defineProperty(object, name, descriptor);
    descriptor.value = null;
}

function createPooler(Constructor) {
    switch (Constructor.length) {
        case 0:
            return createNoArgumentPooler(Constructor);
        case 1:
            return createOneArgumentPooler(Constructor);
        case 2:
            return createTwoArgumentsPooler(Constructor);
        case 3:
            return createThreeArgumentsPooler(Constructor);
        case 4:
            return createFourArgumentsPooler(Constructor);
        case 5:
            return createFiveArgumentsPooler(Constructor);
        default:
            return createApplyPooler(Constructor);
    }
}

function createNoArgumentPooler(Constructor) {
    return function pooler() {
        var instancePool = Constructor.instancePool,
            instance;

        if (instancePool.length) {
            instance = instancePool.pop();
            return instance;
        } else {
            return new Constructor();
        }
    };
}

function createOneArgumentPooler(Constructor) {
    return function pooler(a0) {
        var instancePool = Constructor.instancePool,
            instance;

        if (instancePool.length) {
            instance = instancePool.pop();
            Constructor.call(instance, a0);
            return instance;
        } else {
            return new Constructor(a0);
        }
    };
}

function createTwoArgumentsPooler(Constructor) {
    return function pooler(a0, a1) {
        var instancePool = Constructor.instancePool,
            instance;

        if (instancePool.length) {
            instance = instancePool.pop();
            Constructor.call(instance, a0, a1);
            return instance;
        } else {
            return new Constructor(a0, a1);
        }
    };
}

function createThreeArgumentsPooler(Constructor) {
    return function pooler(a0, a1, a2) {
        var instancePool = Constructor.instancePool,
            instance;

        if (instancePool.length) {
            instance = instancePool.pop();
            Constructor.call(instance, a0, a1, a2);
            return instance;
        } else {
            return new Constructor(a0, a1, a2);
        }
    };
}

function createFourArgumentsPooler(Constructor) {
    return function pooler(a0, a1, a2, a3) {
        var instancePool = Constructor.instancePool,
            instance;

        if (instancePool.length) {
            instance = instancePool.pop();
            Constructor.call(instance, a0, a1, a2, a3);
            return instance;
        } else {
            return new Constructor(a0, a1, a2, a3);
        }
    };
}

function createFiveArgumentsPooler(Constructor) {
    return function pooler(a0, a1, a2, a3, a4) {
        var instancePool = Constructor.instancePool,
            instance;

        if (instancePool.length) {
            instance = instancePool.pop();
            Constructor.call(instance, a0, a1, a2, a3, a4);
            return instance;
        } else {
            return new Constructor(a0, a1, a2, a3, a4);
        }
    };
}

function createApplyConstructor(Constructor) {
    function F(args) {
        return Constructor.apply(this, args);
    }
    F.prototype = Constructor.prototype;

    return function applyConstructor(args) {
        return new F(args);
    };
}

function createApplyPooler(Constructor) {
    var applyConstructor = createApplyConstructor(Constructor);

    return function pooler() {
        var instancePool = Constructor.instancePool,
            instance;

        if (instancePool.length) {
            instance = instancePool.pop();
            Constructor.apply(instance, arguments);
            return instance;
        } else {
            return applyConstructor(arguments);
        }
    };
}

function createReleaser(Constructor) {
    return function releaser(instance) {
        var instancePool = Constructor.instancePool;

        if (isFunction(instance.destructor)) {
            instance.destructor();
        }
        if (Constructor.poolSize === -1 || instancePool.length < Constructor.poolSize) {
            instancePool[instancePool.length] = instance;
        }
    };
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt/node_modules/queue/src/index.js */

var createPool = require(41);


module.exports = Queue;


function Queue() {
    this.__callbacks = [];
}

createPool(Queue);

Queue.prototype.enqueue = function(callback) {
    var callbacks = this.__callbacks;
    callbacks[callbacks.length] = callback;
    return this;
};

Queue.prototype.notifyAll = function() {
    var callbacks = this.__callbacks,
        i = -1,
        il = callbacks.length - 1;

    while (i++ < il) {
        callbacks[i]();
    }
    callbacks.length = 0;

    return this;
};

Queue.prototype.destructor = function() {
    this.__callbacks.length = 0;
    return this;
};

Queue.prototype.reset = Queue.prototype.destructor;


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt/src/Transaction/InsertPatch.js */

var createPool = require(41),
    consts = require(7);


var InsertPatchPrototype;


module.exports = InsertPatch;


function InsertPatch() {
    this.type = consts.INSERT;
    this.id = null;
    this.childId = null;
    this.index = null;
    this.next = null;
}
createPool(InsertPatch);
InsertPatchPrototype = InsertPatch.prototype;

InsertPatch.create = function(id, childId, index, next) {
    var patch = InsertPatch.getPooled();
    patch.id = id;
    patch.childId = childId;
    patch.index = index;
    patch.next = next;
    return patch;
};

InsertPatchPrototype.destructor = function() {
    this.id = null;
    this.childId = null;
    this.index = null;
    this.next = null;
    return this;
};

InsertPatchPrototype.destroy = function() {
    return InsertPatch.release(this);
};


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt/src/Transaction/MountPatch.js */

var createPool = require(41),
    consts = require(7);


var MountPatchPrototype;


module.exports = MountPatch;


function MountPatch() {
    this.type = consts.MOUNT;
    this.id = null;
    this.next = null;
}
createPool(MountPatch);
MountPatchPrototype = MountPatch.prototype;

MountPatch.create = function(id, next) {
    var patch = MountPatch.getPooled();
    patch.id = id;
    patch.next = next;
    return patch;
};

MountPatchPrototype.destructor = function() {
    this.id = null;
    this.next = null;
    return this;
};

MountPatchPrototype.destroy = function() {
    return MountPatch.release(this);
};


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt/src/Transaction/UnmountPatch.js */

var createPool = require(41),
    consts = require(7);


var UnmountPatchPrototype;


module.exports = UnmountPatch;


function UnmountPatch() {
    this.type = consts.UNMOUNT;
    this.id = null;
}
createPool(UnmountPatch);
UnmountPatchPrototype = UnmountPatch.prototype;

UnmountPatch.create = function(id) {
    var patch = UnmountPatch.getPooled();
    patch.id = id;
    return patch;
};

UnmountPatchPrototype.destructor = function() {
    this.id = null;
    return this;
};

UnmountPatchPrototype.destroy = function() {
    return UnmountPatch.release(this);
};


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt/src/Transaction/OrderPatch.js */

var createPool = require(41),
    consts = require(7);


var OrderPatchPrototype;


module.exports = OrderPatch;


function OrderPatch() {
    this.type = consts.ORDER;
    this.id = null;
    this.order = null;
}
createPool(OrderPatch);
OrderPatchPrototype = OrderPatch.prototype;

OrderPatch.create = function(id, order) {
    var patch = OrderPatch.getPooled();
    patch.id = id;
    patch.order = order;
    return patch;
};

OrderPatchPrototype.destructor = function() {
    this.id = null;
    this.order = null;
    return this;
};

OrderPatchPrototype.destroy = function() {
    return OrderPatch.release(this);
};


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt/src/Transaction/PropsPatch.js */

var createPool = require(41),
    consts = require(7);


var PropsPatchPrototype;


module.exports = PropsPatch;


function PropsPatch() {
    this.type = consts.PROPS;
    this.id = null;
    this.previous = null;
    this.next = null;
}
createPool(PropsPatch);
PropsPatchPrototype = PropsPatch.prototype;

PropsPatch.create = function(id, previous, next) {
    var patch = PropsPatch.getPooled();
    patch.id = id;
    patch.previous = previous;
    patch.next = next;
    return patch;
};

PropsPatchPrototype.destructor = function() {
    this.id = null;
    this.previous = null;
    this.next = null;
    return this;
};

PropsPatchPrototype.destroy = function() {
    return PropsPatch.release(this);
};


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt/src/Transaction/RemovePatch.js */

var createPool = require(41),
    consts = require(7);


var RemovePatchPrototype;


module.exports = RemovePatch;


function RemovePatch() {
    this.type = consts.REMOVE;
    this.id = null;
    this.childId = null;
    this.index = null;
}
createPool(RemovePatch);
RemovePatchPrototype = RemovePatch.prototype;

RemovePatch.create = function(id, childId, index) {
    var patch = RemovePatch.getPooled();
    patch.id = id;
    patch.childId = childId;
    patch.index = index;
    return patch;
};

RemovePatchPrototype.destructor = function() {
    this.id = null;
    this.childId = null;
    this.index = null;
    return this;
};

RemovePatchPrototype.destroy = function() {
    return RemovePatch.release(this);
};


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt/src/Transaction/ReplacePatch.js */

var createPool = require(41),
    consts = require(7);


var ReplacePatchPrototype;


module.exports = ReplacePatch;


function ReplacePatch() {
    this.type = consts.REPLACE;
    this.id = null;
    this.childId = null;
    this.index = null;
    this.next = null;
}
createPool(ReplacePatch);
ReplacePatchPrototype = ReplacePatch.prototype;

ReplacePatch.create = function(id, childId, index, next) {
    var patch = ReplacePatch.getPooled();
    patch.id = id;
    patch.childId = childId;
    patch.index = index;
    patch.next = next;
    return patch;
};

ReplacePatchPrototype.destructor = function() {
    this.id = null;
    this.childId = null;
    this.index = null;
    this.next = null;
    return this;
};

ReplacePatchPrototype.destroy = function() {
    return ReplacePatch.release(this);
};


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt/src/Transaction/TextPatch.js */

var createPool = require(41),
    propsToJSON = require(25),
    consts = require(7);


var TextPatchPrototype;


module.exports = TextPatch;


function TextPatch() {
    this.type = consts.TEXT;
    this.id = null;
    this.index = null;
    this.next = null;
    this.props = null;
}
createPool(TextPatch);
TextPatchPrototype = TextPatch.prototype;

TextPatch.create = function(id, index, next, props) {
    var patch = TextPatch.getPooled();
    patch.id = id;
    patch.index = index;
    patch.next = next;
    patch.props = props;
    return patch;
};

TextPatchPrototype.destructor = function() {
    this.id = null;
    this.index = null;
    this.next = null;
    this.props = null;
    return this;
};

TextPatchPrototype.destroy = function() {
    return TextPatch.release(this);
};

TextPatchPrototype.toJSON = function() {
    return {
        type: this.type,
        id: this.id,
        index: this.index,
        next: this.next,
        props: propsToJSON(this.props)
    };
};


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt/node_modules/define_property/src/index.js */

var isObject = require(30),
    isFunction = require(16),
    isPrimitive = require(15),
    isNative = require(28),
    has = require(22);


var nativeDefineProperty = Object.defineProperty;


module.exports = defineProperty;


function defineProperty(object, name, descriptor) {
    if (isPrimitive(descriptor) || isFunction(descriptor)) {
        descriptor = {
            value: descriptor
        };
    }
    return nativeDefineProperty(object, name, descriptor);
}

defineProperty.hasGettersSetters = true;

if (!isNative(nativeDefineProperty) || !(function() {
        var object = {},
            value = {};

        try {
            nativeDefineProperty(object, "key", {
                value: value
            });
            if (has(object, "key") && object.key === value) {
                return true;
            } else {
                return false;
            }
        } catch (e) {}

        return false;
    }())) {

    defineProperty.hasGettersSetters = false;

    nativeDefineProperty = function defineProperty(object, name, descriptor) {
        if (!isObject(object)) {
            throw new TypeError("defineProperty(object, name, descriptor) called on non-object");
        }
        if (has(descriptor, "get") || has(descriptor, "set")) {
            throw new TypeError("defineProperty(object, name, descriptor) this environment does not support getters or setters");
        }
        object[name] = descriptor.value;
    };
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt/node_modules/key_mirror/src/index.js */

var keys = require(34),
    isArrayLike = require(53);


module.exports = keyMirror;


function keyMirror(object) {
    return isArrayLike(object) ? keyMirrorArray(object) : keyMirrorObject(Object(object));
}

function keyMirrorArray(array) {
    var i = array.length,
        results = {},
        key;

    while (i--) {
        key = array[i];
        results[key] = array[i];
    }

    return results;
}

function keyMirrorObject(object) {
    var objectKeys = keys(object),
        i = -1,
        il = objectKeys.length - 1,
        results = {},
        key;

    while (i++ < il) {
        key = objectKeys[i];
        results[key] = key;
    }

    return results;
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt/node_modules/is_array_like/src/index.js */

var isLength = require(29),
    isFunction = require(16),
    isObject = require(30);


module.exports = isArrayLike;


function isArrayLike(value) {
    return !isFunction(value) && isObject(value) && isLength(value.length);
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt/node_modules/index_of/src/index.js */

var isEqual = require(55);


module.exports = indexOf;


function indexOf(array, value, fromIndex) {
    var i = (fromIndex || 0) - 1,
        il = array.length - 1;

    while (i++ < il) {
        if (isEqual(array[i], value)) {
            return i;
        }
    }

    return -1;
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt/node_modules/is_equal/src/index.js */

module.exports = isEqual;


function isEqual(a, b) {
    return !(a !== b && !(a !== a && b !== b));
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt/node_modules/process/browser.js */

// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = setTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    clearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        setTimeout(drainQueue, 0);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt/src/utils/componentState.js */

var keyMirror = require(52);


module.exports = keyMirror([
    "MOUNTING",
    "MOUNTED",
    "UPDATING",
    "UPDATED",
    "UNMOUNTING",
    "UNMOUNTED"
]);


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt/src/utils/getComponentClassForType.js */

var createNativeComponentForType = require(61);


module.exports = getComponentClassForType;


function getComponentClassForType(type, rootNativeComponents) {
    var Class = rootNativeComponents[type];

    if (Class) {
        return Class;
    } else {
        Class = createNativeComponentForType(type);
        rootNativeComponents[type] = Class;
        return Class;
    }
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt/src/utils/emptyObject.js */




},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt/src/utils/diffChildren.js */

var isNull = require(26),
    isUndefined = require(27),
    isNullOrUndefined = require(20),
    getChildKey = require(8),
    shouldUpdate = require(38),
    View = require(4),
    Node;


var isPrimitiveView = View.isPrimitiveView;


module.exports = diffChildren;


Node = require(40);


function diffChildren(node, previous, next, transaction) {
    var root = node.root,
        previousChildren = previous.children,
        nextChildren = reorder(previousChildren, next.children),
        previousLength = previousChildren.length,
        nextLength = nextChildren.length,
        parentId = node.id,
        i = -1,
        il = (previousLength > nextLength ? previousLength : nextLength) - 1;

    while (i++ < il) {
        diffChild(root, node, previous, next, previousChildren[i], nextChildren[i], parentId, i, transaction);
    }

    if (nextChildren.moves) {
        transaction.order(parentId, nextChildren.moves);
    }
}

function diffChild(root, parentNode, previous, next, previousChild, nextChild, parentId, index, transaction) {
    var node, id;

    if (previousChild !== nextChild) {
        if (isNullOrUndefined(previousChild)) {
            if (isPrimitiveView(nextChild)) {
                transaction.insert(parentId, null, index, nextChild);
            } else {
                id = getChildKey(parentId, nextChild, index);
                node = new Node(parentId, id, nextChild);
                parentNode.appendNode(node);
                transaction.insert(parentId, id, index, node.__mount(transaction));
            }
        } else if (isPrimitiveView(previousChild)) {
            if (isNullOrUndefined(nextChild)) {
                transaction.remove(parentId, null, index);
            } else if (isPrimitiveView(nextChild)) {
                transaction.text(parentId, index, nextChild, next.props);
            } else {
                id = getChildKey(parentId, nextChild, index);
                node = new Node(parentId, id, nextChild);
                parentNode.appendNode(node);
                transaction.replace(parentId, id, index, node.__mount(transaction));
            }
        } else {
            if (isNullOrUndefined(nextChild)) {
                id = getChildKey(parentId, previousChild, index);
                node = root.childHash[id];
                if (node) {
                    node.unmount(transaction);
                    parentNode.removeNode(node);
                }
            } else if (isPrimitiveView(nextChild)) {
                transaction.replace(parentId, null, index, nextChild);
            } else {
                id = getChildKey(parentId, previousChild, index);
                node = root.childHash[id];

                if (node) {
                    if (shouldUpdate(previousChild, nextChild)) {
                        node.update(nextChild, transaction);
                    } else {
                        node.__unmount(transaction);
                        parentNode.removeNode(node);

                        id = getChildKey(parentId, nextChild, index);
                        node = new Node(parentId, id, nextChild);
                        parentNode.appendNode(node);
                        transaction.replace(parentId, id, index, node.__mount(transaction));
                    }
                } else {
                    id = getChildKey(parentId, nextChild, index);
                    node = new Node(parentId, id, nextChild);
                    parentNode.appendNode(node);
                    transaction.insert(parentId, id, index, node.__mount(transaction));
                }
            }
        }
    }
}

function reorder(previousChildren, nextChildren) {
    var previousKeys, nextKeys, previousMatch, nextMatch, key, previousLength, nextLength,
        length, shuffle, freeIndex, i, moveIndex, moves, removes, reverse, hasMoves, move, freeChild;

    nextKeys = keyIndex(nextChildren);
    if (isNull(nextKeys)) {
        return nextChildren;
    }

    previousKeys = keyIndex(previousChildren);
    if (isNull(previousKeys)) {
        return nextChildren;
    }

    nextMatch = {};
    previousMatch = {};

    for (key in nextKeys) {
        nextMatch[nextKeys[key]] = previousKeys[key];
    }

    for (key in previousKeys) {
        previousMatch[previousKeys[key]] = nextKeys[key];
    }

    previousLength = previousChildren.length;
    nextLength = nextChildren.length;
    length = previousLength > nextLength ? previousLength : nextLength;
    shuffle = [];
    freeIndex = 0;
    i = 0;
    moveIndex = 0;
    moves = {};
    removes = moves.removes = {};
    reverse = moves.reverse = {};
    hasMoves = false;

    while (freeIndex < length) {
        move = previousMatch[i];

        if (!isUndefined(move)) {
            shuffle[i] = nextChildren[move];

            if (move !== moveIndex) {
                moves[move] = moveIndex;
                reverse[moveIndex] = move;
                hasMoves = true;
            }

            moveIndex++;
        } else if (i in previousMatch) {
            shuffle[i] = void(0);
            removes[i] = moveIndex++;
            hasMoves = true;
        } else {
            while (!isUndefined(nextMatch[freeIndex])) {
                freeIndex++;
            }

            if (freeIndex < length) {
                freeChild = nextChildren[freeIndex];

                if (freeChild) {
                    shuffle[i] = freeChild;
                    if (freeIndex !== moveIndex) {
                        hasMoves = true;
                        moves[freeIndex] = moveIndex;
                        reverse[moveIndex] = freeIndex;
                    }
                    moveIndex++;
                }
                freeIndex++;
            }
        }
        i++;
    }

    if (hasMoves) {
        shuffle.moves = moves;
    }

    return shuffle;
}

function keyIndex(children) {
    var i = -1,
        il = children.length - 1,
        keys = null,
        child;

    while (i++ < il) {
        child = children[i];

        if (!isNullOrUndefined(child.key)) {
            keys = keys || {};
            keys[child.key] = i;
        }
    }

    return keys;
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt/src/utils/createNativeComponentForType.js */

var View = require(4),
    Component = require(6);


module.exports = createNativeComponentForType;


function createNativeComponentForType(type) {

    function NativeComponent(props, children) {
        Component.call(this, props, children);
    }
    Component.extend(NativeComponent, type);

    NativeComponent.prototype.render = function() {
        return new View(type, null, null, this.props, this.children, null, null);
    };

    return NativeComponent;
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt/node_modules/inherits/src/index.js */

var create = require(63),
    extend = require(24),
    mixin = require(64),
    defineProperty = require(51);


var descriptor = {
    configurable: true,
    enumerable: false,
    writable: true,
    value: null
};


module.exports = inherits;


function inherits(child, parent) {

    mixin(child, parent);

    if (child.__super) {
        child.prototype = extend(create(parent.prototype), child.__super, child.prototype);
    } else {
        child.prototype = extend(create(parent.prototype), child.prototype);
    }

    defineNonEnumerableProperty(child, "__super", parent.prototype);
    defineNonEnumerableProperty(child.prototype, "constructor", child);

    child.defineStatic = defineStatic;
    child.super_ = parent;

    return child;
}
inherits.defineProperty = defineNonEnumerableProperty;

function defineNonEnumerableProperty(object, name, value) {
    descriptor.value = value;
    defineProperty(object, name, descriptor);
    descriptor.value = null;
}

function defineStatic(name, value) {
    defineNonEnumerableProperty(this, name, value);
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt/node_modules/create/src/index.js */

var isNull = require(26),
    isNative = require(28),
    isPrimitive = require(15);


var nativeCreate = Object.create;


module.exports = create;


function create(object) {
    return nativeCreate(isPrimitive(object) ? null : object);
}

if (!isNative(nativeCreate)) {
    nativeCreate = function nativeCreate(object) {
        var newObject;

        function F() {
            this.constructor = F;
        }

        if (isNull(object)) {
            newObject = new F();
            newObject.constructor = newObject.__proto__ = null;
            delete newObject.__proto__;
            return newObject;
        } else {
            F.prototype = object;
            return new F();
        }
    };
}


module.exports = create;


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt/node_modules/mixin/src/index.js */

var keys = require(34),
    isNullOrUndefined = require(20);


module.exports = mixin;


function mixin(out) {
    var i = 0,
        il = arguments.length - 1;

    while (i++ < il) {
        baseMixin(out, arguments[i]);
    }

    return out;
}

function baseMixin(a, b) {
    var objectKeys = keys(b),
        i = -1,
        il = objectKeys.length - 1,
        key, value;

    while (i++ < il) {
        key = objectKeys[i];

        if (isNullOrUndefined(a[key]) && !isNullOrUndefined((value = b[key]))) {
            a[key] = value;
        }
    }
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt/src/utils/getViewKey.js */

var isNullOrUndefined = require(20);


var reEscape = /[=.:]/g;


module.exports = getViewKey;


function getViewKey(view, index) {
    var key = view.key;

    if (isNullOrUndefined(key)) {
        return index.toString(36);
    } else {
        return "$" + escapeKey(key);
    }
}

function escapeKey(key) {
    return (key + "").replace(reEscape, "$");
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt/src/utils/traversePath.js */

var isBoundary = require(67),
    isAncestorIdOf = require(68);


module.exports = traversePath;


function traversePath(start, stop, callback, skipFirst, skipLast) {
    var traverseUp = isAncestorIdOf(stop, start),
        traverse = traverseUp ? getParentID : getNextDescendantID,
        id = start,
        ret;

    while (true) {
        if ((!skipFirst || id !== start) && (!skipLast || id !== stop)) {
            ret = callback(id, traverseUp);
        }
        if (ret === false || id === stop) {
            break;
        }

        id = traverse(id, stop);
    }
}

function getNextDescendantID(ancestorID, destinationID) {
    var start, i, il;

    if (ancestorID === destinationID) {
        return ancestorID;
    } else {
        start = ancestorID.length + 1;
        i = start - 1;
        il = destinationID.length - 1;

        while (i++ < il) {
            if (isBoundary(destinationID, i)) {
                break;
            }
        }

        return destinationID.substr(0, i);
    }
}

function getParentID(id) {
    return id ? id.substr(0, id.lastIndexOf(".")) : "";
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt/src/utils/isBoundary.js */

module.exports = isBoundary;


function isBoundary(id, index) {
    return id.charAt(index) === "." || index === id.length;
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt/src/utils/isAncestorIdOf.js */

var isBoundary = require(67);


module.exports = isAncestorIdOf;


function isAncestorIdOf(ancestorID, descendantID) {
    return (
        descendantID.indexOf(ancestorID) === 0 &&
        isBoundary(descendantID, ancestorID.length)
    );
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt-dom/src/utils/renderString.js */

var virt = require(1),

    isFunction = require(16),
    isString = require(18),
    isObject = require(30),
    isNullOrUndefined = require(20),

    hyphenateStyleName = require(81),
    renderMarkup = require(82),
    DOM_ID_NAME = require(83);


var View = virt.View,

    isView = View.isView,
    isPrimitiveView = View.isPrimitiveView,

    closedTags = {
        area: true,
        base: true,
        br: true,
        col: true,
        command: true,
        embed: true,
        hr: true,
        img: true,
        input: true,
        keygen: true,
        link: true,
        meta: true,
        param: true,
        source: true,
        track: true,
        wbr: true
    };


module.exports = render;


var renderChildrenString = require(84);


function render(view, parentProps, id) {
    var type, props;

    if (isPrimitiveView(view)) {
        return isString(view) ? renderMarkup(view, parentProps) : view + "";
    } else {
        type = view.type;
        props = view.props;

        return (
            closedTags[type] !== true ?
            contentTag(type, renderChildrenString(view.children, props, id), id, props) :
            closedTag(type, id, view.props)
        );
    }
}

function styleTag(props) {
    var attributes = "",
        key;

    for (key in props) {
        attributes += hyphenateStyleName(key) + ':' + props[key] + ';';
    }

    return attributes;
}

function baseTagOptions(props) {
    var attributes = "",
        key, value;

    for (key in props) {
        if (key !== "dangerouslySetInnerHTML") {
            value = props[key];

            if (!isNullOrUndefined(value) && !isFunction(value) && !isView(value)) {
                if (key === "className") {
                    key = "class";
                }

                if (key === "style") {
                    attributes += 'style="' + styleTag(value) + '"';
                } else {
                    if (isObject(value)) {
                        attributes += baseTagOptions(value);
                    } else {
                        attributes += key + '="' + value + '" ';
                    }
                }
            }
        }
    }

    return attributes;
}

function tagOptions(id, props) {
    var attributes = baseTagOptions(props);
    return attributes !== "" ? " " + attributes : attributes;
}

function dataId(id) {
    return ' ' + DOM_ID_NAME + '="' + id + '"';
}

function closedTag(type, id, props) {
    return "<" + type + (isObject(props) ? tagOptions(id, props) : "") + dataId(id) + "/>";
}

function contentTag(type, content, id, props) {
    return (
        "<" + type + (isObject(props) ? tagOptions(id, props) : "") + dataId(id) + ">" +
        (isString(content) ? content : "") +
        "</" + type + ">"
    );
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt-dom/src/nativeDOM/components.js */

var components = exports;


components.button = require(86);
components.img = require(87);
components.input = require(88);
components.textarea = require(89);


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt-dom/src/nativeDOM/handlers.js */

var extend = require(24);


extend(
    exports,
    require(90),
    require(91),
    require(92),
    require(93),
    require(94)
);


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt-dom/src/render.js */

var virt = require(1),
    isNull = require(26),
    isUndefined = require(27),
    Adapter = require(123),
    rootsById = require(124),
    getRootNodeId = require(125);


var Root = virt.Root;


module.exports = render;


function render(nextView, containerDOMNode, callback) {
    var id = getRootNodeId(containerDOMNode),
        root;

    if (isNull(id) || isUndefined(rootsById[id])) {
        root = new Root();
        root.adapter = new Adapter(root, containerDOMNode);
        id = root.id;
        rootsById[id] = root;
    } else {
        root = rootsById[id];
    }

    root.render(nextView, id, callback);

    return root;
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt-dom/src/unmount.js */

var rootsById = require(124),
    getRootNodeInContainer = require(187),
    getNodeId = require(186);


module.exports = unmount;


function unmount(containerDOMNode) {
    var rootDOMNode = getRootNodeInContainer(containerDOMNode),
        id = getNodeId(rootDOMNode),
        root = rootsById[id];

    if (root !== undefined) {
        root.unmount();
        delete rootsById[id];
    }
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt-dom/src/utils/findDOMNode.js */

var isString = require(18),
    getNodeById = require(104);


module.exports = findDOMNode;


function findDOMNode(value) {
    if (isString(value)) {
        return getNodeById(value);
    } else if (value && value.__node) {
        return getNodeById(value.__node.id);
    } else if (value && value.id) {
        return getNodeById(value.id);
    } else {
        return null;
    }
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt-dom/src/utils/findRoot.js */

var virt = require(1),
    isString = require(18),
    rootsById = require(124);


var getRootIdFromId = virt.getRootIdFromId;


module.exports = findRoot;


function findRoot(value) {
    if (isString(value)) {
        return rootsById[getRootIdFromId(value)];
    } else {
        return null;
    }
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt-dom/src/utils/findEventHandler.js */

var virt = require(1),
    isString = require(18),
    eventHandlersById = require(122);


var getRootIdFromId = virt.getRootIdFromId;


module.exports = findDOMNode;


function findDOMNode(value) {
    if (isString(value)) {
        return eventHandlersById[getRootIdFromId(value)];
    } else {
        return null;
    }
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt-dom/src/worker/createWorkerRender.js */

var Messenger = require(126),
    isNull = require(26),
    MessengerWorkerAdapter = require(188),
    eventHandlersById = require(122),
    nativeDOMHandlers = require(71),
    eventHandlersById = require(122),
    getRootNodeId = require(125),
    registerNativeComponentHandlers = require(130),
    getWindow = require(128),
    EventHandler = require(131),
    applyEvents = require(134),
    applyPatches = require(135);


module.exports = createWorkerRender;


function createWorkerRender(url, containerDOMNode) {
    var document = containerDOMNode.ownerDocument,
        window = getWindow(document),

        messenger = new Messenger(new MessengerWorkerAdapter(url)),

        eventHandler = new EventHandler(messenger, document, window, false),

        rootId = null;

    messenger.on("virt.handleTransaction", function handleTransaction(transaction, callback) {

        applyPatches(transaction.patches, containerDOMNode, document);
        applyEvents(transaction.events, eventHandler);
        applyPatches(transaction.removes, containerDOMNode, document);

        if (isNull(rootId)) {
            rootId = getRootNodeId(containerDOMNode);
            eventHandlersById[rootId] = eventHandler;
        }

        callback();
    });

    messenger.on("virt.getDeviceDimensions", function getDeviceDimensions(data, callback) {
        callback(undefined, eventHandler.getDimensions());
    });

    messenger.on("virt.onGlobalEvent", function onHandle(topLevelType, callback) {
        eventHandler.listenTo("global", topLevelType);
        callback();
    });
    messenger.on("virt.offGlobalEvent", function onHandle(topLevelType, callback) {
        callback();
    });

    registerNativeComponentHandlers(messenger, nativeDOMHandlers);

    return messenger;
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt-dom/src/worker/renderWorker.js */

var virt = require(1),
    isNull = require(26),
    rootsById = require(124),
    WorkerAdapter = require(189);


var root = null;


module.exports = render;


function render(nextView, callback) {
    if (isNull(root)) {
        root = new virt.Root();
        root.adapter = new WorkerAdapter(root);
        rootsById[root.id] = root;
    }

    root.render(nextView, callback);
}

render.unmount = function() {
    if (!isNull(root)) {
        delete rootsById[root.id];
        root.unmount();
        root = null;
    }
};


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt-dom/src/websocket/createWebSocketRender.js */

var Messenger = require(126),
    isNull = require(26),
    MessengerWebSocketAdapter = require(190),
    eventHandlersById = require(122),
    getRootNodeId = require(125),
    nativeDOMHandlers = require(71),
    registerNativeComponentHandlers = require(130),
    getWindow = require(128),
    EventHandler = require(131),
    applyEvents = require(134),
    applyPatches = require(135);


module.exports = createWebSocketRender;


function createWebSocketRender(containerDOMNode, socket, attachMessage, sendMessage) {
    var document = containerDOMNode.ownerDocument,
        window = getWindow(document),

        messenger = new Messenger(new MessengerWebSocketAdapter(socket, attachMessage, sendMessage)),

        eventHandler = new EventHandler(messenger, document, window, false),

        rootId = null;

    messenger.on("virt.handleTransaction", function handleTransaction(transaction, callback) {

        applyPatches(transaction.patches, containerDOMNode, document);
        applyEvents(transaction.events, eventHandler);
        applyPatches(transaction.removes, containerDOMNode, document);

        if (isNull(rootId)) {
            rootId = getRootNodeId(containerDOMNode);
            eventHandlersById[rootId] = eventHandler;
        }

        callback();
    });

    messenger.on("virt.getDeviceDimensions", function getDeviceDimensions(data, callback) {
        callback(undefined, eventHandler.getDimensions());
    });

    messenger.on("virt.onGlobalEvent", function onHandle(topLevelType, callback) {
        eventHandler.listenTo("global", topLevelType);
        callback();
    });
    messenger.on("virt.offGlobalEvent", function onHandle(topLevelType, callback) {
        callback();
    });

    registerNativeComponentHandlers(messenger, nativeDOMHandlers);

    return messenger;
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt-dom/src/websocket/renderWebSocket.js */

var virt = require(1),
    rootsById = require(124),
    WebSocketAdapter = require(191);


module.exports = render;


function render(nextView, socket, attachMessage, sendMessage, callback) {
    var root = new virt.Root();
    root.adapter = new WebSocketAdapter(root, socket, attachMessage, sendMessage);
    rootsById[root.id] = root;
    root.render(nextView, callback);
    return root;
}

render.unmount = function(root) {
    if (root && rootsById[root.id]) {
        delete rootsById[root.id];
        root.unmount();
        root = null;
    }
};


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt-dom/src/utils/hyphenateStyleName.js */

var reUppercasePattern = /([A-Z])/g,
    reMS = /^ms-/;


module.exports = hyphenateStyleName;


function hyphenateStyleName(str) {
    return str.replace(reUppercasePattern, "-$1").toLowerCase().replace(reMS, "-ms-");
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt-dom/src/utils/renderMarkup.js */

var escapeTextContent = require(85);


module.exports = renderMarkup;


function renderMarkup(markup, props) {
    if (props && props.dangerouslySetInnerHTML !== true) {
        return escapeTextContent(markup);
    } else {
        return markup;
    }
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt-dom/src/DOM_ID_NAME.js */

module.exports = "data-virtid";


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt-dom/src/utils/renderChildrenString.js */

var virt = require(1);


var getChildKey = virt.getChildKey;


module.exports = renderChildrenString;


var renderString = require(69);


function renderChildrenString(children, parentProps, id) {
    var out = "",
        i = -1,
        il = children.length - 1,
        child;

    while (i++ < il) {
        child = children[i];
        out += renderString(child, parentProps, getChildKey(id, child, i));
    }

    return out;
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt-dom/node_modules/escape_text_content/src/index.js */

var reEscape = /[&><"']/g;


module.exports = escapeTextContent;


function escapeTextContent(text) {
    return (text + "").replace(reEscape, escaper);
}

function escaper(match) {
    switch (match) {
        case "&":
            return "&amp;";
        case ">":
            return "&gt;";
        case "<":
            return "&lt;";
        case "\"":
            return "&quot;";
        case "'":
            return "&#x27;";
        default:
            return match;
    }
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt-dom/src/nativeDOM/Button.js */

var virt = require(1),
    indexOf = require(54),
    has = require(22);


var View = virt.View,
    Component = virt.Component,

    mouseListenerNames = [
        "onClick",
        "onDoubleClick",
        "onMouseDown",
        "onMouseMove",
        "onMouseUp"
    ],

    ButtonPrototype;


module.exports = Button;


function Button(props, children, context) {
    var _this = this;

    Component.call(this, props, children, context);

    this.focus = function(e) {
        return _this.__focus(e);
    };
    this.blur = function(e) {
        return _this.__blur(e);
    };
}
Component.extend(Button, "button");
ButtonPrototype = Button.prototype;

ButtonPrototype.componentDidMount = function() {
    if (this.props.autoFocus) {
        this.__focus();
    }
};

ButtonPrototype.__focus = function(callback) {
    this.emitMessage("virt.dom.Button.focus", {
        id: this.getInternalId()
    }, callback);
};

ButtonPrototype.__blur = function(callback) {
    this.emitMessage("virt.dom.Button.blur", {
        id: this.getInternalId()
    }, callback);
};

ButtonPrototype.__getRenderProps = function() {
    var props = this.props,
        localHas = has,
        renderProps = {},
        key;

    if (props.disabled) {
        for (key in props) {
            if (localHas(props, key) && indexOf(mouseListenerNames, key) === -1) {
                renderProps[key] = props[key];
            }
        }

        renderProps.disabled = true;
    } else {
        for (key in props) {
            if (localHas(props, key) && key !== "disabled") {
                renderProps[key] = props[key];
            }
        }
    }

    return renderProps;
};

ButtonPrototype.render = function() {
    return new View("button", null, null, this.__getRenderProps(), this.children, null, null);
};


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt-dom/src/nativeDOM/Image.js */

var process = require(56);
var virt = require(1),
    has = require(22),
    emptyFunction = require(35);


var View = virt.View,
    Component = virt.Component,
    ImagePrototype;


module.exports = Image;


function Image(props, children, context) {
    if (process.env.NODE_ENV !== "production") {
        if (children.length > 0) {
            throw new Error("Image: img can not have children");
        }
    }

    Component.call(this, getProps(props), children, context);

    this.__originalProps = props;
    this.__hasEvents = !!(props.onLoad || props.onError);
}
Component.extend(Image, "img");
ImagePrototype = Image.prototype;

ImagePrototype.componentDidMount = function() {
    this.emitMessage("virt.dom.Image.mount", {
        id: this.getInternalId(),
        src: this.__originalProps.src
    });
};

ImagePrototype.componentWillReceiveProps = function(nextProps) {
    Image_onProps(this, nextProps);
};

ImagePrototype.componentDidUpdate = function() {

    Image_onProps(this, this.__originalProps);

    this.emitMessage("virt.dom.Image.setSrc", {
        id: this.getInternalId(),
        src: this.__originalProps.src
    });
};

ImagePrototype.render = function() {
    return new View("img", null, null, this.props, this.children, null, null);
};

function Image_onProps(_this, props) {
    _this.props = getProps(props);
    _this.__originalProps = props;
    _this.__hasEvents = !!(props.onLoad || props.onError);
}

function getProps(props) {
    var localHas = has,
        renderProps = {
            onLoad: emptyFunction,
            onError: emptyFunction
        },
        key;

    for (key in props) {
        if (localHas(props, key) && key !== "src") {
            renderProps[key] = props[key];
        }
    }

    return renderProps;
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt-dom/src/nativeDOM/Input.js */

var process = require(56);
var virt = require(1),
    has = require(22),
    isFunction = require(16),
    isNullOrUndefined = require(20);


var View = virt.View,
    Component = virt.Component,
    InputPrototype;


module.exports = Input;


function Input(props, children, context) {
    var _this = this;

    if (process.env.NODE_ENV !== "production") {
        if (children.length > 0) {
            throw new Error("Input: input can't have children");
        }
    }

    Component.call(this, props, children, context);

    this.onInput = function(e) {
        return _this.__onInput(e);
    };
    this.onChange = function(e) {
        return _this.__onChange(e, false);
    };
    this.setChecked = function(checked, callback) {
        return _this.__setChecked(checked, callback);
    };
    this.getValue = function(callback) {
        return _this.__getValue(callback);
    };
    this.setValue = function(value, callback) {
        return _this.__setValue(value, callback);
    };
    this.getSelection = function(callback) {
        return _this.__getSelection(callback);
    };
    this.setSelection = function(start, end, callback) {
        return _this.__setSelection(start, end, callback);
    };
    this.focus = function(callback) {
        return _this.__focus(callback);
    };
    this.blur = function(callback) {
        return _this.__blur(callback);
    };

}
Component.extend(Input, "input");
InputPrototype = Input.prototype;

Input.getDefaultProps = function() {
    return {
        type: "text"
    };
};

InputPrototype.componentDidMount = function() {
    var props = this.props;

    if (props.autoFocus) {
        this.__focus();
    }
    if (props.type === "radio" && props.checked) {
        Input_uncheckSiblings(this, this.__node.parent.renderedChildren);
    }
};

InputPrototype.componentDidUpdate = function(previousProps) {
    var value = this.props.value,
        previousValue = previousProps.value;

    if (!isNullOrUndefined(value) && value === previousValue) {
        this.__setValue(value);
    }
};

InputPrototype.__onInput = function(e) {
    this.__onChange(e, true);
};

InputPrototype.__onChange = function(e, fromInput) {
    var props = this.props,
        type = props.type,
        isRadio = type === "radio";

    if (isRadio || type === "checkbox") {
        e.preventDefault();
        props.checked = !props.checked;
        this.__setChecked(props.checked);

        if (isRadio) {
            Input_uncheckSiblings(this, this.__node.parent.renderedChildren);
        }
    }

    if (fromInput && props.onInput) {
        props.onInput(e);
    }
    if (props.onChange) {
        props.onChange(e);
    }

    this.forceUpdate();
};

function Input_uncheckSiblings(input, siblings) {
    var i = -1,
        il = siblings.length - 1,
        sibling, props;

    while (i++ < il) {
        sibling = siblings[i].component;

        if (
            input !== sibling &&
            sibling.constructor === Input &&
            (props = sibling.props) &&
            props.type === "radio"
        ) {
            props.checked = !props.checked;
            sibling.__setChecked(props.checked);
        }
    }
}

InputPrototype.__setChecked = function(checked, callback) {
    this.emitMessage("virt.dom.Input.setChecked", {
        id: this.getInternalId(),
        checked: !!checked
    }, callback);
};

InputPrototype.__getValue = function(callback) {
    this.emitMessage("virt.dom.Input.getValue", {
        id: this.getInternalId()
    }, callback);
};

InputPrototype.__setValue = function(value, callback) {
    this.emitMessage("virt.dom.Input.setValue", {
        id: this.getInternalId(),
        value: value
    }, callback);
};

InputPrototype.__getSelection = function(callback) {
    this.emitMessage("virt.dom.Input.getSelection", {
        id: this.getInternalId()
    }, callback);
};

InputPrototype.__setSelection = function(start, end, callback) {
    if (isFunction(end)) {
        callback = end;
        end = start;
    }
    this.emitMessage("virt.dom.Input.setSelection", {
        id: this.getInternalId(),
        start: start,
        end: end
    }, callback);
};

InputPrototype.__focus = function(callback) {
    this.emitMessage("virt.dom.Input.focus", {
        id: this.getInternalId()
    }, callback);
};

InputPrototype.__blur = function(callback) {
    this.emitMessage("virt.dom.Input.blur", {
        id: this.getInternalId()
    }, callback);
};

InputPrototype.__getRenderProps = function() {
    var props = this.props,

        value = props.value,
        checked = props.checked,

        defaultValue = props.defaultValue,

        initialValue = defaultValue != null ? defaultValue : null,
        initialChecked = props.defaultChecked || false,

        renderProps = {},

        key;

    for (key in props) {
        if (has(props, key) && key !== "checked") {
            renderProps[key] = props[key];
        }
    }

    if (checked != null ? checked : initialChecked) {
        renderProps.checked = true;
    }

    renderProps.defaultChecked = undefined;
    renderProps.defaultValue = undefined;
    renderProps.value = value != null ? value : initialValue;

    renderProps.onInput = this.onInput;
    renderProps.onChange = this.onChange;

    return renderProps;
};

InputPrototype.render = function() {
    return new View("input", null, null, this.__getRenderProps(), this.children, null, null);
};


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt-dom/src/nativeDOM/TextArea.js */

var process = require(56);
var virt = require(1),
    has = require(22),
    isFunction = require(16);


var View = virt.View,
    Component = virt.Component,
    TextAreaPrototype;


module.exports = TextArea;


function TextArea(props, children, context) {
    var _this = this;

    if (process.env.NODE_ENV !== "production") {
        if (children.length > 0) {
            throw new Error("TextArea: textarea can't have children, set prop.value instead");
        }
    }

    Component.call(this, props, children, context);

    this.onInput = function(e) {
        return _this.__onInput(e);
    };
    this.onChange = function(e) {
        return _this.__onChange(e);
    };
    this.getValue = function(callback) {
        return _this.__getValue(callback);
    };
    this.setValue = function(value, callback) {
        return _this.__setValue(value, callback);
    };
    this.getSelection = function(callback) {
        return _this.__getSelection(callback);
    };
    this.setSelection = function(start, end, callback) {
        return _this.__setSelection(start, end, callback);
    };
    this.focus = function(callback) {
        return _this.__focus(callback);
    };
    this.blur = function(callback) {
        return _this.__blur(callback);
    };
}
Component.extend(TextArea, "textarea");
TextAreaPrototype = TextArea.prototype;

TextAreaPrototype.componentDidMount = function() {
    if (this.props.autoFocus) {
        this.__focus();
    }
};

TextAreaPrototype.componentDidUpdate = function(previousProps) {
    var value = this.props.value,
        previousValue = previousProps.value;

    if (value != null && value === previousValue) {
        this.__setValue(value);
    }
};

TextAreaPrototype.__onInput = function(e) {
    this.__onChange(e, true);
};

TextAreaPrototype.__onChange = function(e, fromInput) {
    var props = this.props;

    if (fromInput && props.onInput) {
        props.onInput(e);
    }
    if (props.onChange) {
        props.onChange(e);
    }

    this.forceUpdate();
};

TextAreaPrototype.__getValue = function(callback) {
    this.emitMessage("virt.dom.TextArea.getValue", {
        id: this.getInternalId()
    }, callback);
};

TextAreaPrototype.__setValue = function(value, callback) {
    this.emitMessage("virt.dom.TextArea.setValue", {
        id: this.getInternalId(),
        value: value
    }, callback);
};

TextAreaPrototype.__getSelection = function(callback) {
    this.emitMessage("virt.dom.TextArea.getSelection", {
        id: this.getInternalId()
    }, callback);
};

TextAreaPrototype.__setSelection = function(start, end, callback) {
    if (isFunction(end)) {
        callback = end;
        end = start;
    }
    this.emitMessage("virt.dom.TextArea.setSelection", {
        id: this.getInternalId(),
        start: start,
        end: end
    }, callback);
};

TextAreaPrototype.__focus = function(callback) {
    this.emitMessage("virt.dom.TextArea.focus", {
        id: this.getInternalId()
    }, callback);
};

TextAreaPrototype.__blur = function(callback) {
    this.emitMessage("virt.dom.TextArea.blur", {
        id: this.getInternalId()
    }, callback);
};

TextAreaPrototype.__getRenderProps = function() {
    var props = this.props,

        value = props.value,
        defaultValue = props.defaultValue,
        initialValue = defaultValue != null ? defaultValue : null,

        renderProps = {},
        key;

    for (key in props) {
        if (has(props, key)) {
            renderProps[key] = props[key];
        }
    }

    renderProps.defaultValue = undefined;
    renderProps.value = value != null ? value : initialValue;

    renderProps.onChange = this.onChange;
    renderProps.onInput = this.onInput;

    return renderProps;
};

TextAreaPrototype.render = function() {
    return new View("textarea", null, null, this.__getRenderProps(), this.children, null, null);
};


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt-dom/src/nativeDOM/nodeHandlers.js */

var domDimensions = require(95),
    findDOMNode = require(74);


var nodeHandlers = exports;


nodeHandlers["virt.getViewTop"] = function getWidth(data, callback) {
    var node = findDOMNode(data.id);

    if (node) {
        callback(undefined, domDimensions.top(node));
    } else {
        callback(new Error("getViewTop: No DOM node found with id " + data.id));
    }
};
nodeHandlers["virt.getViewRight"] = function getWidth(data, callback) {
    var node = findDOMNode(data.id);

    if (node) {
        callback(undefined, domDimensions.right(node));
    } else {
        callback(new Error("getViewRight: No DOM node found with id " + data.id));
    }
};
nodeHandlers["virt.getViewBottom"] = function getWidth(data, callback) {
    var node = findDOMNode(data.id);

    if (node) {
        callback(undefined, domDimensions.bottom(node));
    } else {
        callback(new Error("getViewBottom: No DOM node found with id " + data.id));
    }
};
nodeHandlers["virt.getViewLeft"] = function getWidth(data, callback) {
    var node = findDOMNode(data.id);

    if (node) {
        callback(undefined, domDimensions.left(node));
    } else {
        callback(new Error("getViewLeft: No DOM node found with id " + data.id));
    }
};

nodeHandlers["virt.getViewWidth"] = function getWidth(data, callback) {
    var node = findDOMNode(data.id);

    if (node) {
        callback(undefined, domDimensions.width(node));
    } else {
        callback(new Error("getViewWidth: No DOM node found with id " + data.id));
    }
};
nodeHandlers["virt.getViewHeight"] = function getWidth(data, callback) {
    var node = findDOMNode(data.id);

    if (node) {
        callback(undefined, domDimensions.height(node));
    } else {
        callback(new Error("getViewHeight: No DOM node found with id " + data.id));
    }
};

nodeHandlers["virt.getViewDimensions"] = function getWidth(data, callback) {
    var node = findDOMNode(data.id);

    if (node) {
        callback(undefined, domDimensions(node));
    } else {
        callback(new Error("getViewDimensions: No DOM node found with id " + data.id));
    }
};


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt-dom/src/nativeDOM/buttonHandlers.js */

var sharedHandlers = require(106);


var buttonHandlers = exports;


buttonHandlers["virt.dom.Button.focus"] = sharedHandlers.focus;
buttonHandlers["virt.dom.Button.blur"] = sharedHandlers.blur;


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt-dom/src/nativeDOM/imageHandlers.js */

var consts = require(113),
    findEventHandler = require(76),
    findDOMNode = require(74);


var topLevelTypes = consts.topLevelTypes,
    topLevelToEvent = consts.topLevelToEvent,
    GLOBAL_IMAGE = typeof(Image) !== "undefined" ? new Image() : {},
    imageHandlers = exports;


imageHandlers["virt.dom.Image.mount"] = function(data, callback) {
    var id = data.id,
        eventHandler = findEventHandler(id),
        node = findDOMNode(id);

    if (eventHandler && node) {
        eventHandler.addBubbledEvent(topLevelTypes.topLoad, topLevelToEvent.topLoad, node);
        eventHandler.addBubbledEvent(topLevelTypes.topError, topLevelToEvent.topError, node);

        node.src = data.src;
        callback();
    } else {
        callback(new Error("mount: No DOM node found with id " + data.id));
    }
};

imageHandlers["virt.dom.Image.setSrc"] = function(data, callback) {
    var id = data.id,
        node = findDOMNode(id),
        localImage = GLOBAL_IMAGE,
        src;

    if (node) {
        src = data.src;
        localImage.src = src;
        originalSrc = localImage.src;

        if (src !== originalSrc) {
            node.src = src;
        }

        callback();
    } else {
        callback(new Error("setSrc: No DOM node found with id " + data.id));
    }
};


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt-dom/src/nativeDOM/inputHandlers.js */

var findDOMNode = require(74),
    sharedHandlers = require(106);


var inputHandlers = exports;


inputHandlers["virt.dom.Input.getValue"] = sharedHandlers.getValue;
inputHandlers["virt.dom.Input.setValue"] = sharedHandlers.setValue;
inputHandlers["virt.dom.Input.getSelection"] = sharedHandlers.getSelection;
inputHandlers["virt.dom.Input.setSelection"] = sharedHandlers.setSelection;
inputHandlers["virt.dom.Input.focus"] = sharedHandlers.focus;
inputHandlers["virt.dom.Input.blur"] = sharedHandlers.blur;


inputHandlers["virt.dom.Input.setChecked"] = function(data, callback) {
    var node = findDOMNode(data.id);

    if (node) {
        if (data.checked) {
            node.setAttribute("checked", true);
        } else {
            node.removeAttribute("checked");
        }
        callback();
    } else {
        callback(new Error("setChecked: No DOM node found with id " + data.id));
    }
};


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt-dom/src/nativeDOM/textareaHandlers.js */

var sharedHandlers = require(106);


var textareaHandlers = exports;


textareaHandlers["virt.dom.TextArea.getValue"] = sharedHandlers.getValue;
textareaHandlers["virt.dom.TextArea.setValue"] = sharedHandlers.setValue;
textareaHandlers["virt.dom.TextArea.getSelection"] = sharedHandlers.getSelection;
textareaHandlers["virt.dom.TextArea.setSelection"] = sharedHandlers.setSelection;
textareaHandlers["virt.dom.TextArea.focus"] = sharedHandlers.focus;
textareaHandlers["virt.dom.TextArea.blur"] = sharedHandlers.blur;


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt-dom/node_modules/dom_dimensions/src/index.js */

var getCurrentStyle = require(96),
    isElement = require(97);


module.exports = domDimensions;


function domDimensions(node) {
    var dimensions = new Dimensions(),
        clientRect;

    if (isElement(node)) {
        clientRect = node.getBoundingClientRect();

        dimensions.top = clientRect.top;
        dimensions.right = clientRect.left + node.offsetWidth;
        dimensions.bottom = clientRect.top + node.offsetHeight;
        dimensions.left = clientRect.left;
        dimensions.width = dimensions.right - dimensions.left;
        dimensions.height = dimensions.bottom - dimensions.top;

        return dimensions;
    } else {
        return dimensions;
    }
}

function Dimensions() {
    this.top = 0;
    this.right = 0;
    this.bottom = 0;
    this.left = 0;
    this.width = 0;
    this.height = 0;
}

domDimensions.top = function(node) {
    if (isElement(node)) {
        return node.getBoundingClientRect().top;
    } else {
        return 0;
    }
};

domDimensions.right = function(node) {
    if (isElement(node)) {
        return domDimensions.left(node) + node.offsetWidth;
    } else {
        return 0;
    }
};

domDimensions.bottom = function(node) {
    if (isElement(node)) {
        return domDimensions.top(node) + node.offsetHeight;
    } else {
        return 0;
    }
};

domDimensions.left = function(node) {
    if (isElement(node)) {
        return node.getBoundingClientRect().left;
    } else {
        return 0;
    }
};

domDimensions.width = function(node) {
    if (isElement(node)) {
        return domDimensions.right(node) - domDimensions.left(node);
    } else {
        return 0;
    }
};

domDimensions.height = function(node) {
    if (isElement(node)) {
        return domDimensions.bottom(node) - domDimensions.top(node);
    } else {
        return 0;
    }
};

domDimensions.marginTop = function(node) {
    if (isElement(node)) {
        return parseInt(getCurrentStyle(node, "marginTop"), 10);
    } else {
        return 0;
    }
};

domDimensions.marginRight = function(node) {
    if (isElement(node)) {
        return parseInt(getCurrentStyle(node, "marginRight"), 10);
    } else {
        return 0;
    }
};

domDimensions.marginBottom = function(node) {
    if (isElement(node)) {
        return parseInt(getCurrentStyle(node, "marginRight"), 10);
    } else {
        return 0;
    }
};

domDimensions.marginLeft = function(node) {
    if (isElement(node)) {
        return parseInt(getCurrentStyle(node, "marginLeft"), 10);
    } else {
        return 0;
    }
};

domDimensions.outerWidth = function(node) {
    if (isElement(node)) {
        return domDimensions.width(node) + domDimensions.marginLeft(node) + domDimensions.marginRight(node);
    } else {
        return 0;
    }
};

domDimensions.outerHeight = function(node) {
    if (isElement(node)) {
        return domDimensions.height(node) + domDimensions.marginTop(node) + domDimensions.marginBottom(node);
    } else {
        return 0;
    }
};


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt-dom/node_modules/get_current_style/src/index.js */

var supports = require(98),
    environment = require(99),
    isElement = require(97),
    isString = require(18),
    camelize = require(100);


var baseGetCurrentStyles;


module.exports = getCurrentStyle;


function getCurrentStyle(node, style) {
    if (isElement(node)) {
        if (isString(style)) {
            return baseGetCurrentStyles(node)[camelize(style)] || "";
        } else {
            return baseGetCurrentStyles(node);
        }
    } else {
        if (isString(style)) {
            return "";
        } else {
            return null;
        }
    }
}

if (supports.dom && environment.document.defaultView) {
    baseGetCurrentStyles = function(node) {
        return node.ownerDocument.defaultView.getComputedStyle(node, "");
    };
} else {
    baseGetCurrentStyles = function(node) {
        if (node.currentStyle) {
            return node.currentStyle;
        } else {
            return node.style;
        }
    };
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt-dom/node_modules/is_element/src/index.js */

var isNode = require(101);


module.exports = isElement;


function isElement(value) {
    return isNode(value) && value.nodeType === 1;
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt-dom/node_modules/supports/src/index.js */

var environment = require(99);


var supports = module.exports;


supports.dom = !!(typeof(window) !== "undefined" && window.document && window.document.createElement);
supports.workers = typeof(Worker) !== "undefined";

supports.eventListeners = supports.dom && !!environment.window.addEventListener;
supports.attachEvents = supports.dom && !!environment.window.attachEvent;

supports.viewport = supports.dom && !!environment.window.screen;
supports.touch = supports.dom && "ontouchstart" in environment.window;


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt-dom/node_modules/environment/src/index.js */

var environment = exports,

    hasWindow = typeof(window) !== "undefined",
    userAgent = hasWindow ? window.navigator.userAgent : "";


environment.worker = typeof(importScripts) !== "undefined";

environment.browser = environment.worker || !!(
    hasWindow &&
    typeof(navigator) !== "undefined" &&
    window.document
);

environment.node = !environment.worker && !environment.browser;

environment.mobile = environment.browser && /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());

environment.window = (
    hasWindow ? window :
    typeof(global) !== "undefined" ? global :
    typeof(self) !== "undefined" ? self : {}
);

environment.pixelRatio = environment.window.devicePixelRatio || 1;

environment.document = typeof(document) !== "undefined" ? document : {};


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt-dom/node_modules/camelize/src/index.js */

var reInflect = require(102),
    capitalizeString = require(103);


module.exports = camelize;


function camelize(string, lowFirstLetter) {
    var parts, part, i, il;

    lowFirstLetter = lowFirstLetter !== false;
    parts = string.match(reInflect);
    i = lowFirstLetter ? 0 : -1;
    il = parts.length - 1;

    while (i++ < il) {
        parts[i] = capitalizeString(parts[i]);
    }

    if (lowFirstLetter && (part = parts[0])) {
        parts[0] = part.charAt(0).toLowerCase() + part.slice(1);
    }

    return parts.join("");
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt-dom/node_modules/is_node/src/index.js */

var isString = require(18),
    isNullOrUndefined = require(20),
    isNumber = require(21),
    isFunction = require(16);


var isNode;


if (typeof(Node) !== "undefined" && isFunction(Node)) {
    isNode = function isNode(value) {
        return value instanceof Node;
    };
} else {
    isNode = function isNode(value) {
        return (!isNullOrUndefined(value) &&
            isNumber(value.nodeType) &&
            isString(value.nodeName)
        );
    };
}


module.exports = isNode;


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt-dom/node_modules/re_inflect/src/index.js */

module.exports = /[^A-Z-_ ]+|[A-Z][^A-Z-_ ]+|[^a-z-_ ]+/g;


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt-dom/node_modules/capitalize_string/src/index.js */

module.exports = capitalizeString;


function capitalizeString(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt-dom/src/utils/getNodeById.js */

var nodeCache = require(105);


module.exports = getNodeById;


function getNodeById(id) {
    return nodeCache[id];
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt-dom/src/utils/nodeCache.js */




},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt-dom/src/nativeDOM/sharedHandlers.js */

var domCaret = require(107),
    blurNode = require(108),
    focusNode = require(109),
    findDOMNode = require(74);


var sharedInputHandlers = exports;


sharedInputHandlers.getValue = function(data, callback) {
    var node = findDOMNode(data.id);

    if (node) {
        callback(undefined, node.value);
    } else {
        callback(new Error("getValue: No DOM node found with id " + data.id));
    }
};

sharedInputHandlers.setValue = function(data, callback) {
    var node = findDOMNode(data.id),
        caret, value;

    if (node) {
        value = data.value || "";
        if (value !== node.value) {
            caret = domCaret.get(node);
            node.value = value;
            domCaret.set(node, caret.start, caret.end);
        }
        callback();
    } else {
        callback(new Error("setValue: No DOM node found with id " + data.id));
    }
};

sharedInputHandlers.getSelection = function(data, callback) {
    var node = findDOMNode(data.id);

    if (node) {
        callback(undefined, domCaret.get(node));
    } else {
        callback(new Error("getSelection: No DOM node found with id " + data.id));
    }
};

sharedInputHandlers.setSelection = function(data, callback) {
    var node = findDOMNode(data.id);

    if (node) {
        domCaret.set(node, data.start, data.end);
        callback();
    } else {
        callback(new Error("setSelection: No DOM node found with id " + data.id));
    }
};

sharedInputHandlers.focus = function(data, callback) {
    var node = findDOMNode(data.id);

    if (node) {
        focusNode(node);
        callback();
    } else {
        callback(new Error("focus: No DOM node found with id " + data.id));
    }
};

sharedInputHandlers.blur = function(data, callback) {
    var node = findDOMNode(data.id);

    if (node) {
        blurNode(node);
        callback();
    } else {
        callback(new Error("blur: No DOM node found with id " + data.id));
    }
};


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt-dom/node_modules/dom_caret/src/index.js */

var environment = require(99),
    focusNode = require(109),
    blurNode = require(108),
    getActiveElement = require(110),
    isTextInputElement = require(111);


var domCaret = exports,

    window = environment.window,
    document = environment.document,

    getNodeCaretPosition, setNodeCaretPosition;



domCaret.get = function(node) {
    var activeElement = getActiveElement(),
        isFocused = activeElement === node,
        selection;

    if (isTextInputElement(node)) {
        if (!isFocused) {
            focusNode(node);
        }
        selection = getNodeCaretPosition(node);
        if (!isFocused) {
            blurNode(node);
            focusNode(activeElement);
        }
        return selection;
    } else {
        return {
            start: 0,
            end: 0
        };
    }
};

domCaret.set = function(node, start, end) {
    if (isTextInputElement(node)) {
        if (getActiveElement() !== node) {
            focusNode(node);
        }
        setNodeCaretPosition(node, start, end === undefined ? start : end);
    }
};

if (!!window.getSelection) {
    getNodeCaretPosition = function getNodeCaretPosition(node) {
        return {
            start: node.selectionStart,
            end: node.selectionEnd
        };
    };
    setNodeCaretPosition = function setNodeCaretPosition(node, start, end) {
        node.setSelectionRange(start, end);
    };
} else if (document.selection && document.selection.createRange) {
    getNodeCaretPosition = function getNodeCaretPosition(node) {
        var range = document.selection.createRange();
        range.moveStart("character", -node.value.length);
        return range.text.length;
    };
    setNodeCaretPosition = function setNodeCaretPosition(node, start, end) {
        var range = ctrl.createTextRange();
        range.collapse(true);
        range.moveStart("character", start);
        range.moveEnd("character", end);
        range.select();
    };
} else {
    getNodeCaretPosition = function getNodeCaretPosition() {
        return {
            start: 0,
            end: 0
        };
    };
    setNodeCaretPosition = function setNodeCaretPosition() {};
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt-dom/node_modules/blur_node/src/index.js */

var isNode = require(101);


module.exports = blurNode;


function blurNode(node) {
    if (isNode(node) && node.blur) {
        try {
            node.blur();
        } catch (e) {}
    }
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt-dom/node_modules/focus_node/src/index.js */

var isNode = require(101);


module.exports = focusNode;


function focusNode(node) {
    if (isNode(node) && node.focus) {
        try {
            node.focus();
        } catch (e) {}
    }
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt-dom/node_modules/get_active_element/src/index.js */

var isDocument = require(112),
    environment = require(99);


var document = environment.document;


module.exports = getActiveElement;


function getActiveElement(ownerDocument) {
    ownerDocument = isDocument(ownerDocument) ? ownerDocument : document;

    try {
        return ownerDocument.activeElement || ownerDocument.body;
    } catch (e) {
        return ownerDocument.body;
    }
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt-dom/node_modules/is_text_input_element/src/index.js */

var isNullOrUndefined = require(20);


var reIsSupportedInputType = new RegExp("^\\b(" + [
    "color", "date", "datetime", "datetime-local", "email", "month", "number",
    "password", "range", "search", "tel", "text", "time", "url", "week"
].join("|") + ")\\b$");


module.exports = isTextInputElement;


function isTextInputElement(value) {
    return !isNullOrUndefined(value) && (
        (value.nodeName === "INPUT" && reIsSupportedInputType.test(value.type)) ||
        value.nodeName === "TEXTAREA"
    );
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt-dom/node_modules/is_document/src/index.js */

var isNode = require(101);


module.exports = isDocument;


function isDocument(value) {
    return isNode(value) && value.nodeType === 9;
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt-dom/src/events/consts.js */

var map = require(114),
    forEach = require(115),
    keyMirror = require(52),
    removeTop = require(116),
    replaceTopWithOn = require(117);


var consts = exports,

    topLevelToEvent = consts.topLevelToEvent = {},
    propNameToTopLevel = consts.propNameToTopLevel = {},

    eventTypes = [
        "topAbort",
        "topAnimationEnd",
        "topAnimationIteration",
        "topAnimationStart",
        "topBlur",
        "topCanPlay",
        "topCanPlayThrough",
        "topChange",
        "topClick",
        "topCompositionEnd",
        "topCompositionStart",
        "topCompositionUpdate",
        "topContextMenu",
        "topCopy",
        "topCut",
        "topDoubleClick",
        "topDrag",
        "topDragEnd",
        "topDragEnter",
        "topDragExit",
        "topDragLeave",
        "topDragOver",
        "topDragStart",
        "topDrop",
        "topDurationChange",
        "topEmptied",
        "topEncrypted",
        "topEnded",
        "topError",
        "topFocus",
        "topInput",
        "topKeyDown",
        "topKeyPress",
        "topKeyUp",
        "topLoad",
        "topLoadStart",
        "topLoadedData",
        "topLoadedMetadata",
        "topMouseDown",
        "topMouseEnter",
        "topMouseMove",
        "topMouseOut",
        "topMouseOver",
        "topMouseUp",
        "topOrientationChange",
        "topPaste",
        "topPause",
        "topPlay",
        "topPlaying",
        "topProgress",
        "topRateChange",
        "topRateChange",
        "topReset",
        "topResize",
        "topScroll",
        "topSeeked",
        "topSeeking",
        "topSelectionChange",
        "topStalled",
        "topSubmit",
        "topSuspend",
        "topTextInput",
        "topTimeUpdate",
        "topTouchCancel",
        "topTouchEnd",
        "topTouchMove",
        "topTouchStart",
        "topTouchTap",
        "topTransitionEnd",
        "topVolumeChange",
        "topWaiting",
        "topWheel"
    ];

consts.phases = keyMirror([
    "bubbled",
    "captured"
]);

consts.topLevelTypes = keyMirror(eventTypes);

consts.propNames = map(eventTypes, replaceTopWithOn);

forEach(eventTypes, function(string) {
    propNameToTopLevel[replaceTopWithOn(string)] = string;
});

forEach(eventTypes, function(string) {
    topLevelToEvent[string] = removeTop(string).toLowerCase();
});


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt-dom/node_modules/map/src/index.js */

var isArrayLike = require(53),
    isNullOrUndefined = require(20),
    fastBindThis = require(118),
    arrayMap = require(23),
    objectMap = require(119);


module.exports = map;


function map(value, callback, thisArg) {
    callback = isNullOrUndefined(thisArg) ? callback : fastBindThis(callback, thisArg, 3);
    return isArrayLike(value) ?
        arrayMap(value, callback) :
        objectMap(value, callback);
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt-dom/node_modules/for_each/src/index.js */

var isArrayLike = require(53),
    isNullOrUndefined = require(20),
    fastBindThis = require(118),
    arrayForEach = require(120),
    objectForEach = require(121);


module.exports = forEach;


function forEach(value, callback, thisArg) {
    callback = isNullOrUndefined(thisArg) ? callback : fastBindThis(callback, thisArg, 3);
    return isArrayLike(value) ?
        arrayForEach(value, callback) :
        objectForEach(value, callback);
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt-dom/src/events/removeTop.js */

module.exports = removeTop;


function removeTop(str) {
    return str.replace(/^top/, "");
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt-dom/src/events/replaceTopWithOn.js */

module.exports = replaceTopWithOn;


function replaceTopWithOn(string) {
    return string.replace(/^top/, "on");
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt-dom/node_modules/fast_bind_this/src/index.js */

var isNumber = require(21);


module.exports = fastBindThis;


function fastBindThis(callback, thisArg, length) {
    switch (isNumber(length) ? length : (callback.length || -1)) {
        case 0:
            return function bound() {
                return callback.call(thisArg);
            };
        case 1:
            return function bound(a1) {
                return callback.call(thisArg, a1);
            };
        case 2:
            return function bound(a1, a2) {
                return callback.call(thisArg, a1, a2);
            };
        case 3:
            return function bound(a1, a2, a3) {
                return callback.call(thisArg, a1, a2, a3);
            };
        case 4:
            return function bound(a1, a2, a3, a4) {
                return callback.call(thisArg, a1, a2, a3, a4);
            };
        default:
            return function bound() {
                return callback.apply(thisArg, arguments);
            };
    }
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt-dom/node_modules/object-map/src/index.js */

var keys = require(34);


module.exports = objectMap;


function objectMap(object, callback) {
    var objectKeys = keys(object),
        length = objectKeys.length,
        i = -1,
        il = length - 1,
        results = {},
        key;

    while (i++ < il) {
        key = objectKeys[i];
        results[key] = callback(object[key], key, object);
    }

    return results;
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt-dom/node_modules/array-for_each/src/index.js */

module.exports = arrayForEach;


function arrayForEach(array, callback) {
    var i = -1,
        il = array.length - 1;

    while (i++ < il) {
        if (callback(array[i], i, array) === false) {
            break;
        }
    }

    return array;
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt-dom/node_modules/object-for_each/src/index.js */

var keys = require(34);


module.exports = objectForEach;


function objectForEach(object, callback) {
    var objectKeys = keys(object),
        i = -1,
        il = objectKeys.length - 1,
        key;

    while (i++ < il) {
        key = objectKeys[i];

        if (callback(object[key], key, object) === false) {
            break;
        }
    }

    return object;
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt-dom/src/eventHandlersById.js */




},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt-dom/src/Adapter.js */

var extend = require(24),
    Messenger = require(126),
    createMessengerAdapter = require(127),
    eventHandlersById = require(122),
    getWindow = require(128),
    nativeDOMComponents = require(70),
    nativeDOMHandlers = require(71),
    registerNativeComponents = require(129),
    registerNativeComponentHandlers = require(130),
    consts = require(113),
    EventHandler = require(131),
    eventClassMap = require(132),
    handleEventDispatch = require(133),
    applyEvents = require(134),
    applyPatches = require(135);


module.exports = Adapter;


function Adapter(root, containerDOMNode) {
    var socket = createMessengerAdapter(),

        messengerClient = new Messenger(socket.client),
        messengerServer = new Messenger(socket.server),

        propNameToTopLevel = consts.propNameToTopLevel,

        document = containerDOMNode.ownerDocument,
        window = getWindow(document),
        eventManager = root.eventManager,
        events = eventManager.events,

        eventHandler = new EventHandler(messengerClient, document, window, true);

    eventHandlersById[root.id] = eventHandler;

    this.messenger = messengerServer;
    this.messengerClient = messengerClient;

    this.root = root;
    this.containerDOMNode = containerDOMNode;

    this.document = document;
    this.window = getWindow(document);

    this.eventHandler = eventHandler;

    messengerClient.on("virt.handleTransaction", function onHandleTransaction(transaction, callback) {
        applyPatches(transaction.patches, containerDOMNode, document);
        applyEvents(transaction.events, eventHandler);
        applyPatches(transaction.removes, containerDOMNode, document);
        callback();
    });

    extend(eventManager.propNameToTopLevel, propNameToTopLevel);

    messengerServer.on("virt.dom.handleEventDispatch", function onHandleEventDispatch(data, callback) {
        var topLevelType = data.topLevelType;

        handleEventDispatch(
            root.childHash,
            events,
            topLevelType,
            data.targetId,
            eventClassMap[topLevelType].getPooled(data.nativeEvent, eventHandler)
        );

        callback();
    });

    messengerClient.on("virt.onGlobalEvent", function onHandle(topLevelType, callback) {
        eventHandler.listenTo("global", topLevelType);
        callback();
    });
    messengerClient.on("virt.offGlobalEvent", function onHandle(topLevelType, callback) {
        callback();
    });

    messengerClient.on("virt.getDeviceDimensions", function getDeviceDimensions(data, callback) {
        callback(undefined, eventHandler.getDimensions());
    });

    registerNativeComponents(root, nativeDOMComponents);
    registerNativeComponentHandlers(messengerClient, nativeDOMHandlers);
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt-dom/src/rootsById.js */




},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt-dom/src/utils/getRootNodeId.js */

var getRootNodeInContainer = require(187),
    getNodeId = require(186);


module.exports = getRootNodeId;


function getRootNodeId(containerDOMNode) {
    return getNodeId(getRootNodeInContainer(containerDOMNode));
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt-dom/node_modules/messenger/src/index.js */

var MESSENGER_ID = 0,
    MessengerPrototype;


module.exports = Messenger;


function Messenger(adapter) {
    var _this = this;

    this.__id = (MESSENGER_ID++).toString(36);
    this.__messageId = 0;
    this.__callbacks = {};
    this.__listeners = {};

    this.__adapter = adapter;

    adapter.addMessageListener(function onMessage(data) {
        _this.onMessage(data);
    });
}
MessengerPrototype = Messenger.prototype;

MessengerPrototype.onMessage = function(message) {
    var id = message.id,
        name = message.name,
        callbacks = this.__callbacks,
        callback = callbacks[id],
        listeners, adapter;

    if (name) {
        listeners = this.__listeners;
        adapter = this.__adapter;

        if (listeners[name]) {
            Messenger_emit(this, listeners[name], message.data, function emitCallback(error, data) {
                adapter.postMessage({
                    id: id,
                    error: error || undefined,
                    data: data
                });
            });
        }
    } else {
        if (callback && isMatch(id, this.__id)) {
            callback(message.error, message.data, this);
            delete callbacks[id];
        }
    }
};

MessengerPrototype.emit = function(name, data, callback) {
    var id = this.__id + "-" + (this.__messageId++).toString(36);

    if (callback) {
        this.__callbacks[id] = callback;
    }

    this.__adapter.postMessage({
        id: id,
        name: name,
        data: data
    });
};

MessengerPrototype.send = MessengerPrototype.emit;

MessengerPrototype.on = function(name, callback) {
    var listeners = this.__listeners,
        listener = listeners[name] || (listeners[name] = []);

    listener[listener.length] = callback;
};

MessengerPrototype.off = function(name, callback) {
    var listeners = this.__listeners,
        listener = listeners[name],
        i;

    if (listener) {
        i = listener.length;

        while (i--) {
            if (listener[i] === callback) {
                listener.splice(i, 1);
            }
        }

        if (listener.length === 0) {
            delete listeners[name];
        }
    }
};

function Messenger_emit(_this, listeners, data, callback) {
    var index = 0,
        length = listeners.length,
        called = false;

    function done(error, data) {
        if (called === false) {
            called = true;
            callback(error, data);
        }
    }

    function next(error, data) {
        if (error || index === length) {
            done(error, data);
        } else {
            listeners[index++](data, next, _this);
        }
    }

    next(undefined, data);
}

function isMatch(messageId, id) {
    return messageId.split("-")[0] === id;
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt-dom/node_modules/messenger_adapter/src/index.js */

var MessengerAdapterPrototype;


module.exports = createMessengerAdapter;


function createMessengerAdapter() {
    var client = new MessengerAdapter(),
        server = new MessengerAdapter();

    client.socket = server;
    server.socket = client;

    return {
        client: client,
        server: server
    };
}

function MessengerAdapter() {
    this.socket = null;
    this.__listeners = [];
}
MessengerAdapterPrototype = MessengerAdapter.prototype;

MessengerAdapterPrototype.addMessageListener = function(callback) {
    var listeners = this.__listeners;
    listeners[listeners.length] = callback;
};

MessengerAdapterPrototype.onMessage = function(data) {
    var listeners = this.__listeners,
        i = -1,
        il = listeners.length - 1;

    while (i++ < il) {
        listeners[i](data);
    }
};

MessengerAdapterPrototype.postMessage = function(data) {
    this.socket.onMessage(data);
};


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt-dom/src/utils/getWindow.js */

module.exports = getWindow;


function getWindow(document) {
    var scriptElement, parentElement;

    if (document.parentWindow) {
        return document.parentWindow;
    } else {
        if (!document.defaultView) {
            scriptElement = document.createElement("script");
            scriptElement.innerHTML = "document.parentWindow=window;";

            parentElement = document.documentElement;
            parentElement.appendChild(scriptElement);
            parentElement.removeChild(scriptElement);

            return document.parentWindow;
        } else {
            return document.defaultView;
        }
    }
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt-dom/src/utils/registerNativeComponents.js */

var has = require(22);


module.exports = registerNativeComponents;


function registerNativeComponents(root, nativeDOMComponents) {
    var localHas = has,
        name;

    for (name in nativeDOMComponents) {
        if (localHas(nativeDOMComponents, name)) {
            root.registerNativeComponent(name, nativeDOMComponents[name]);
        }
    }
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt-dom/src/utils/registerNativeComponentHandlers.js */

var has = require(22);


module.exports = registerNativeComponentHandlers;


function registerNativeComponentHandlers(messenger, nativeDOMHandlers) {
    var localHas = has,
        key;

    for (key in nativeDOMHandlers) {
        if (localHas(nativeDOMHandlers, key)) {
            messenger.on(key, nativeDOMHandlers[key]);
        }
    }
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt-dom/src/events/EventHandler.js */

var has = require(22),
    eventListener = require(136),
    consts = require(113),
    getWindowWidth = require(137),
    getWindowHeight = require(138),
    getEventTarget = require(139),
    getNodeAttributeId = require(140),
    nativeEventToJSON = require(141),
    isEventSupported = require(142),
    TapPlugin = require(143);


var topLevelTypes = consts.topLevelTypes,
    topLevelToEvent = consts.topLevelToEvent,
    EventHandlerPrototype;


module.exports = EventHandler;


function EventHandler(messenger, document, window, isClient) {
    var _this = this,
        documentElement = document.documentElement ? document.documentElement : document.body,
        viewport = {
            currentScrollLeft: 0,
            currentScrollTop: 0
        };

    this.document = document;
    this.documentElement = documentElement;
    this.window = window;
    this.viewport = viewport;
    this.messenger = messenger;
    this.isClient = !!isClient;

    this.__pluginListening = {};
    this.__pluginHash = {};
    this.__plugins = [];
    this.__isListening = {};
    this.__listening = {};

    function onViewport() {
        viewport.currentScrollLeft = window.pageXOffset || documentElement.scrollLeft;
        viewport.currentScrollTop = window.pageYOffset || documentElement.scrollTop;
    }
    this.__onViewport = onViewport;
    eventListener.on(window, "scroll resize orientationchange", onViewport);

    function onResize() {
        messenger.emit("virt.resize", _this.getDimensions());
    }
    this.__onResize = onResize;
    eventListener.on(window, "resize orientationchange", onResize);

    this.addPlugin(new TapPlugin(this));
}
EventHandlerPrototype = EventHandler.prototype;

EventHandlerPrototype.getDimensions = function() {
    var viewport = this.viewport,
        window = this.window,
        documentElement = this.documentElement,
        document = this.document;

    return {
        scrollLeft: viewport.currentScrollLeft,
        scrollTop: viewport.currentScrollTop,
        width: getWindowWidth(window, documentElement, document),
        height: getWindowHeight(window, documentElement, document)
    };
};

EventHandlerPrototype.addPlugin = function(plugin) {
    var plugins = this.__plugins,
        pluginHash = this.__pluginHash,
        events = plugin.events,
        i = -1,
        il = events.length - 1;

    while (i++ < il) {
        pluginHash[events[i]] = plugin;
    }

    plugins[plugins.length] = plugin;
};

EventHandlerPrototype.pluginListenTo = function(topLevelType) {
    var plugin = this.__pluginHash[topLevelType],
        pluginListening = this.__pluginListening,
        dependencies, events, i, il;

    if (plugin && !pluginListening[topLevelType]) {
        dependencies = plugin.dependencies;
        i = -1;
        il = dependencies.length - 1;

        while (i++ < il) {
            this.nativeListenTo(dependencies[i]);
        }

        events = plugin.events;
        i = -1;
        il = events.length - 1;

        while (i++ < il) {
            pluginListening[events[i]] = plugin;
        }

        return true;
    } else {
        return false;
    }
};

EventHandlerPrototype.clear = function() {
    var window = this.window,
        listening = this.__listening,
        isListening = this.__isListening,
        localHas = has,
        topLevelType;

    for (topLevelType in listening) {
        if (localHas(listening, topLevelType)) {
            listening[topLevelType]();
            delete listening[topLevelType];
            delete isListening[topLevelType];
        }
    }

    eventListener.off(window, "scroll resize orientationchange", this.__onViewport);
    eventListener.off(window, "resize orientationchange", this.__onResize);
};

EventHandlerPrototype.listenTo = function(id, topLevelType) {
    if (!this.pluginListenTo(topLevelType)) {
        this.nativeListenTo(topLevelType);
    }
};

EventHandlerPrototype.nativeListenTo = function(topLevelType) {
    var document = this.document,
        window = this.window,
        isListening = this.__isListening;

    if (!isListening[topLevelType]) {
        if (topLevelType === topLevelTypes.topWheel) {
            if (isEventSupported("wheel")) {
                this.trapBubbledEvent(topLevelTypes.topWheel, "wheel", document);
            } else if (isEventSupported("mousewheel")) {
                this.trapBubbledEvent(topLevelTypes.topWheel, "mousewheel", document);
            } else {
                this.trapBubbledEvent(topLevelTypes.topWheel, "DOMMouseScroll", document);
            }
        } else if (topLevelType === topLevelTypes.topScroll) {
            if (isEventSupported("scroll", true)) {
                this.trapCapturedEvent(topLevelTypes.topScroll, "scroll", document);
            } else {
                this.trapBubbledEvent(topLevelTypes.topScroll, "scroll", window);
            }
        } else if (
            topLevelType === topLevelTypes.topFocus ||
            topLevelType === topLevelTypes.topBlur
        ) {
            if (isEventSupported("focus", true)) {
                this.trapCapturedEvent(topLevelTypes.topFocus, "focus", document);
                this.trapCapturedEvent(topLevelTypes.topBlur, "blur", document);
            } else if (isEventSupported("focusin")) {
                this.trapBubbledEvent(topLevelTypes.topFocus, "focusin", document);
                this.trapBubbledEvent(topLevelTypes.topBlur, "focusout", document);
            }

            isListening[topLevelTypes.topFocus] = true;
            isListening[topLevelTypes.topBlur] = true;
        } else {
            this.trapBubbledEvent(topLevelType, topLevelToEvent[topLevelType], document);
        }

        isListening[topLevelType] = true;
    }
};

EventHandlerPrototype.addBubbledEvent = function(topLevelType, type, element) {
    var _this = this;

    function handler(nativeEvent) {
        _this.dispatchEvent(topLevelType, nativeEvent);
    }

    eventListener.on(element, type, handler);

    function removeBubbledEvent() {
        eventListener.off(element, type, handler);
    }

    return removeBubbledEvent;
};

EventHandlerPrototype.addCapturedEvent = function(topLevelType, type, element) {
    var _this = this;

    function handler(nativeEvent) {
        _this.dispatchEvent(topLevelType, nativeEvent);
    }

    eventListener.capture(element, type, handler);

    function removeCapturedEvent() {
        eventListener.off(element, type, handler);
    }

    return removeCapturedEvent;
};

EventHandlerPrototype.trapBubbledEvent = function(topLevelType, type, element) {
    var removeBubbledEvent = this.addBubbledEvent(topLevelType, type, element);
    this.__listening[topLevelType] = removeBubbledEvent;
    return removeBubbledEvent;
};

EventHandlerPrototype.trapCapturedEvent = function(topLevelType, type, element) {
    var removeCapturedEvent = this.addCapturedEvent(topLevelType, type, element);
    this.__listening[topLevelType] = removeCapturedEvent;
    return removeCapturedEvent;
};

EventHandlerPrototype.dispatchEvent = function(topLevelType, nativeEvent) {
    var isClient = this.isClient,
        targetId = getNodeAttributeId(getEventTarget(nativeEvent, this.window)),
        plugins = this.__plugins,
        i = -1,
        il = plugins.length - 1;

    if (!isClient && targetId) {
        nativeEvent.preventDefault();
    }

    while (i++ < il) {
        plugins[i].handle(topLevelType, nativeEvent, targetId, this.viewport);
    }

    this.messenger.emit("virt.dom.handleEventDispatch", {
        viewport: this.viewport,
        topLevelType: topLevelType,
        nativeEvent: isClient ? nativeEvent : nativeEventToJSON(nativeEvent),
        targetId: targetId
    });
};


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt-dom/src/events/eventClassMap.js */

var SyntheticAnimationEvent = require(151),
    SyntheticTransitionEvent = require(152),
    SyntheticClipboardEvent = require(153),
    SyntheticCompositionEvent = require(154),
    SyntheticDragEvent = require(155),
    SyntheticEvent = require(149),
    SyntheticFocusEvent = require(156),
    SyntheticInputEvent = require(157),
    SyntheticKeyboardEvent = require(158),
    SyntheticMouseEvent = require(159),
    SyntheticTouchEvent = require(160),
    SyntheticUIEvent = require(147),
    SyntheticWheelEvent = require(161);


module.exports = {
    topAbort: SyntheticEvent,

    topAnimationEnd: SyntheticAnimationEvent,
    topAnimationIteration: SyntheticAnimationEvent,
    topAnimationStart: SyntheticAnimationEvent,

    topBlur: SyntheticFocusEvent,

    topCanPlay: SyntheticEvent,
    topCanPlayThrough: SyntheticEvent,

    topChange: SyntheticInputEvent,
    topClick: SyntheticMouseEvent,

    topCompositionEnd: SyntheticCompositionEvent,
    topCompositionStart: SyntheticCompositionEvent,
    topCompositionUpdate: SyntheticCompositionEvent,

    topContextMenu: SyntheticMouseEvent,

    topCopy: SyntheticClipboardEvent,
    topCut: SyntheticClipboardEvent,

    topDoubleClick: SyntheticMouseEvent,

    topDrag: SyntheticDragEvent,
    topDragEnd: SyntheticDragEvent,
    topDragEnter: SyntheticDragEvent,
    topDragExit: SyntheticDragEvent,
    topDragLeave: SyntheticDragEvent,
    topDragOver: SyntheticDragEvent,
    topDragStart: SyntheticDragEvent,
    topDrop: SyntheticDragEvent,

    topDurationChange: SyntheticEvent,
    topEmptied: SyntheticEvent,
    topEncrypted: SyntheticEvent,
    topError: SyntheticEvent,
    topFocus: SyntheticFocusEvent,
    topInput: SyntheticInputEvent,
    topInvalid: SyntheticEvent,

    topKeyDown: SyntheticKeyboardEvent,
    topKeyPress: SyntheticKeyboardEvent,

    topKeyUp: SyntheticKeyboardEvent,

    topLoad: SyntheticUIEvent,
    topLoadStart: SyntheticEvent,
    topLoadedData: SyntheticEvent,
    topLoadedMetadata: SyntheticEvent,

    topMouseDown: SyntheticMouseEvent,
    topMouseEnter: SyntheticMouseEvent,
    topMouseMove: SyntheticMouseEvent,
    topMouseOut: SyntheticMouseEvent,
    topMouseOver: SyntheticMouseEvent,
    topMouseUp: SyntheticMouseEvent,

    topOrientationChange: SyntheticEvent,

    topPaste: SyntheticClipboardEvent,

    topPause: SyntheticEvent,
    topPlay: SyntheticEvent,
    topPlaying: SyntheticEvent,
    topProgress: SyntheticEvent,

    topRateChange: SyntheticEvent,
    topReset: SyntheticEvent,
    topResize: SyntheticUIEvent,

    topScroll: SyntheticUIEvent,

    topSeeked: SyntheticEvent,
    topSeeking: SyntheticEvent,

    topSelectionChange: SyntheticEvent,

    topStalled: SyntheticEvent,

    topSubmit: SyntheticEvent,
    topSuspend: SyntheticEvent,

    topTextInput: SyntheticInputEvent,

    topTimeUpdate: SyntheticEvent,

    topTouchCancel: SyntheticTouchEvent,
    topTouchEnd: SyntheticTouchEvent,
    topTouchMove: SyntheticTouchEvent,
    topTouchStart: SyntheticTouchEvent,
    topTouchTap: SyntheticUIEvent,

    topTransitionEnd: SyntheticTransitionEvent,

    topVolumeChange: SyntheticEvent,
    topWaiting: SyntheticEvent,

    topWheel: SyntheticWheelEvent
};


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt-dom/src/events/handleEventDispatch.js */

var virt = require(1),
    getNodeById = require(104);


var traverseAncestors = virt.traverseAncestors;


module.exports = handleEventDispatch;


function handleEventDispatch(childHash, events, topLevelType, targetId, event) {
    var target = childHash[targetId],
        eventType = events[topLevelType],
        global, i, il;

    if (eventType) {
        global = eventType.global;

        if (target) {
            target = target.component;
        } else {
            target = null;
        }
        if (global) {
            i = -1;
            il = global.length - 1;
            event.currentTarget = event.componentTarget = event.currentComponentTarget = target;
            while (i++ < il) {
                global[i](event);
            }
        }

        traverseAncestors(targetId, function traverseAncestor(currentTargetId) {
            if (eventType[currentTargetId]) {
                event.currentTarget = getNodeById(currentTargetId);
                event.componentTarget = target;
                event.currentComponentTarget = childHash[currentTargetId].component;
                eventType[currentTargetId](event);
                return event.returnValue;
            } else {
                return true;
            }
        });

        if (event && event.isPersistent !== true) {
            event.destroy();
        }
    }
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt-dom/src/applyEvents.js */

var has = require(22);


module.exports = applyEvents;


function applyEvents(events, eventHandler) {
    var localHas = has,
        id, eventArray, i, il;

    for (id in events) {
        if (localHas(events, id)) {
            eventArray = events[id];
            i = -1;
            il = eventArray.length - 1;

            while (i++ < il) {
                eventHandler.listenTo(id, eventArray[i]);
            }
        }
    }
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt-dom/src/applyPatches.js */

var getNodeById = require(104),
    applyPatch = require(180);


module.exports = applyPatches;


function applyPatches(hash, rootDOMNode, document) {
    var id;

    for (id in hash) {
        if (hash[id] !== undefined) {
            applyPatchIndices(getNodeById(id), hash[id], id, document, rootDOMNode);
        }
    }
}

function applyPatchIndices(DOMNode, patchArray, id, document, rootDOMNode) {
    var i = -1,
        length = patchArray.length - 1;

    while (i++ < length) {
        applyPatch(patchArray[i], DOMNode, id, document, rootDOMNode);
    }
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt-dom/node_modules/event_listener/src/index.js */

var process = require(56);
var isObject = require(30),
    isFunction = require(16),
    environment = require(99),
    eventTable = require(144);


var eventListener = module.exports,

    reSpliter = /[\s]+/,

    window = environment.window,
    document = environment.document,

    listenToEvent, captureEvent, removeEvent, dispatchEvent;


window.Event = window.Event || function EmptyEvent() {};


eventListener.on = function(target, eventType, callback) {
    var eventTypes = eventType.split(reSpliter),
        i = eventTypes.length;

    while (i--) {
        listenToEvent(target, eventTypes[i], callback);
    }
};

eventListener.capture = function(target, eventType, callback) {
    var eventTypes = eventType.split(reSpliter),
        i = eventTypes.length;

    while (i--) {
        captureEvent(target, eventTypes[i], callback);
    }
};

eventListener.off = function(target, eventType, callback) {
    var eventTypes = eventType.split(reSpliter),
        i = eventTypes.length;

    while (i--) {
        removeEvent(target, eventTypes[i], callback);
    }
};

eventListener.emit = function(target, eventType, event) {

    return dispatchEvent(target, eventType, isObject(event) ? event : {});
};

eventListener.getEventConstructor = function(target, eventType) {
    var getter = eventTable[eventType];
    return isFunction(getter) ? getter(target) : window.Event;
};


if (isFunction(document.addEventListener)) {

    listenToEvent = function(target, eventType, callback) {

        target.addEventListener(eventType, callback, false);
    };

    captureEvent = function(target, eventType, callback) {

        target.addEventListener(eventType, callback, true);
    };

    removeEvent = function(target, eventType, callback) {

        target.removeEventListener(eventType, callback, false);
    };

    dispatchEvent = function(target, eventType, event) {
        var getter = eventTable[eventType],
            EventType = isFunction(getter) ? getter(target) : window.Event;

        return !!target.dispatchEvent(new EventType(eventType, event));
    };
} else if (isFunction(document.attachEvent)) {

    listenToEvent = function(target, eventType, callback) {

        target.attachEvent("on" + eventType, callback);
    };

    captureEvent = function() {
        if (process.env.NODE_ENV === "development") {
            throw new Error(
                "Attempted to listen to events during the capture phase on a " +
                "browser that does not support the capture phase. Your application " +
                "will not receive some events."
            );
        }
    };

    removeEvent = function(target, eventType, callback) {

        target.detachEvent("on" + eventType, callback);
    };

    dispatchEvent = function(target, eventType, event) {
        var doc = target.ownerDocument || document;

        return !!target.fireEvent("on" + eventType, doc.createEventObject(event));
    };
} else {

    listenToEvent = function(target, eventType, callback) {

        target["on" + eventType] = callback;
        return target;
    };

    captureEvent = function() {
        if (process.env.NODE_ENV === "development") {
            throw new Error(
                "Attempted to listen to events during the capture phase on a " +
                "browser that does not support the capture phase. Your application " +
                "will not receive some events."
            );
        }
    };

    removeEvent = function(target, eventType) {

        target["on" + eventType] = null;
        return true;
    };

    dispatchEvent = function(target, eventType, event) {
        var onType = "on" + eventType;

        if (isFunction(target[onType])) {
            event.type = eventType;
            return !!target[onType](event);
        }

        return false;
    };
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt-dom/src/events/getters/getWindowWidth.js */

module.exports = getWindowWidth;


function getWindowWidth(window, document, documentElement) {
    return window.innerWidth || document.clientWidth || documentElement.clientWidth;
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt-dom/src/events/getters/getWindowHeight.js */

module.exports = getWindowHeight;


function getWindowHeight(window, document, documentElement) {
    return window.innerHeight || document.clientHeight || documentElement.clientHeight;
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt-dom/src/events/getters/getEventTarget.js */

module.exports = getEventTarget;


function getEventTarget(nativeEvent, window) {
    var target = nativeEvent.target || nativeEvent.srcElement || window;
    return target.nodeType === 3 ? target.parentNode : target;
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt-dom/src/utils/getNodeAttributeId.js */

var DOM_ID_NAME = require(83);


module.exports = getNodeAttributeId;


function getNodeAttributeId(node) {
    return node && node.getAttribute && node.getAttribute(DOM_ID_NAME) || "";
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt-dom/src/utils/nativeEventToJSON.js */

var indexOf = require(54),
    isNode = require(101),
    isFunction = require(16),
    ignoreNativeEventProp = require(145);


module.exports = nativeEventToJSON;


function nativeEventToJSON(nativeEvent) {
    var json = {},
        key, value;

    for (key in nativeEvent) {
        value = nativeEvent[key];

        if (!(isFunction(value) || isNode(value) || indexOf(ignoreNativeEventProp, key) !== -1)) {
            json[key] = value;
        }
    }

    return json;
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt-dom/src/events/isEventSupported.js */

var isFunction = require(16),
    isNullOrUndefined = require(20),
    has = require(22),
    supports = require(98),
    environment = require(99);


var document = environment.document,

    useHasFeature = (
        document.implementation &&
        document.implementation.hasFeature &&
        document.implementation.hasFeature("", "") !== true
    );


module.exports = isEventSupported;


function isEventSupported(eventNameSuffix, capture) {
    var isSupported, eventName, element;

    if (!supports.dom || capture && isNullOrUndefined(document.addEventListener)) {
        return false;
    } else {
        eventName = "on" + eventNameSuffix;
        isSupported = has(document, eventName);

        if (!isSupported) {
            element = document.createElement("div");
            element.setAttribute(eventName, "return;");
            isSupported = isFunction(element[eventName]);
        }

        if (!isSupported && useHasFeature && eventNameSuffix === "wheel") {
            isSupported = document.implementation.hasFeature("Events.wheel", "3.0");
        }

        return isSupported;
    }
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt-dom/src/events/plugins/TapPlugin.js */

var now = require(146),
    indexOf = require(54),
    SyntheticUIEvent = require(147),
    consts = require(113);


var topLevelTypes = consts.topLevelTypes,

    xaxis = {
        page: "pageX",
        client: "clientX",
        envScroll: "currentPageScrollLeft"
    },
    yaxis = {
        page: "pageY",
        client: "clientY",
        envScroll: "currentPageScrollTop"
    },

    touchEvents = [
        topLevelTypes.topTouchStart,
        topLevelTypes.topTouchCancel,
        topLevelTypes.topTouchEnd,
        topLevelTypes.topTouchMove
    ],

    TapPluginPrototype;


module.exports = TapPlugin;


function TapPlugin(eventHandler) {

    this.eventHandler = eventHandler;

    this.usedTouch = false;
    this.usedTouchTime = 0;

    this.tapMoveThreshold = 10;
    this.TOUCH_DELAY = 1000;

    this.startCoords = {
        x: null,
        y: null
    };
}
TapPluginPrototype = TapPlugin.prototype;

TapPluginPrototype.events = [
    topLevelTypes.topTouchTap
];

TapPluginPrototype.dependencies = [
    topLevelTypes.topMouseDown,
    topLevelTypes.topMouseMove,
    topLevelTypes.topMouseUp
].concat(touchEvents);

TapPluginPrototype.handle = function(topLevelType, nativeEvent, targetId) {
    var startCoords, eventHandler, viewport, event;

    if (!isStartish(topLevelType) && !isEndish(topLevelType)) {
        return null;
    } else {
        if (indexOf(touchEvents, topLevelType) !== -1) {
            this.usedTouch = true;
            this.usedTouchTime = now();
        } else {
            if (this.usedTouch && (now() - this.usedTouchTime < this.TOUCH_DELAY)) {
                return null;
            }
        }

        startCoords = this.startCoords;
        eventHandler = this.eventHandler;
        viewport = eventHandler.viewport;

        if (
            isEndish(topLevelType) &&
            getDistance(startCoords, nativeEvent, viewport) < this.tapMoveThreshold
        ) {
            event = SyntheticUIEvent.getPooled(nativeEvent, eventHandler);
        }

        if (isStartish(topLevelType)) {
            startCoords.x = getAxisCoordOfEvent(xaxis, nativeEvent, viewport);
            startCoords.y = getAxisCoordOfEvent(yaxis, nativeEvent, viewport);
        } else if (isEndish(topLevelType)) {
            startCoords.x = 0;
            startCoords.y = 0;
        }

        if (event) {
            eventHandler.messenger.emit("virt.dom.handleEventDispatch", {
                viewport: viewport,
                topLevelType: topLevelTypes.topTouchTap,
                nativeEvent: event,
                targetId: targetId
            });
        }
    }
};

function getAxisCoordOfEvent(axis, nativeEvent, viewport) {
    var singleTouch = extractSingleTouch(nativeEvent);

    if (singleTouch) {
        return singleTouch[axis.page];
    } else {
        return (
            axis.page in nativeEvent ?
            nativeEvent[axis.page] :
            nativeEvent[axis.client] + viewport[axis.envScroll]
        );
    }
}

function getDistance(coords, nativeEvent, viewport) {
    var pageX = getAxisCoordOfEvent(xaxis, nativeEvent, viewport),
        pageY = getAxisCoordOfEvent(yaxis, nativeEvent, viewport);

    return Math.pow(
        Math.pow(pageX - coords.x, 2) + Math.pow(pageY - coords.y, 2),
        0.5
    );
}

function extractSingleTouch(nativeEvent) {
    var touches = nativeEvent.touches,
        changedTouches = nativeEvent.changedTouches,
        hasTouches = touches && touches.length > 0,
        hasChangedTouches = changedTouches && changedTouches.length > 0;

    return (!hasTouches && hasChangedTouches ? changedTouches[0] :
        hasTouches ? touches[0] :
        nativeEvent
    );
}

function isStartish(topLevelType) {
    return (
        topLevelType === topLevelTypes.topMouseDown ||
        topLevelType === topLevelTypes.topTouchStart
    );
}

function isEndish(topLevelType) {
    return (
        topLevelType === topLevelTypes.topMouseUp ||
        topLevelType === topLevelTypes.topTouchEnd ||
        topLevelType === topLevelTypes.topTouchCancel
    );
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt-dom/node_modules/event_listener/src/event_table.js */

var isNode = require(101),
    environment = require(99);


var window = environment.window,

    XMLHttpRequest = window.XMLHttpRequest,
    OfflineAudioContext = window.OfflineAudioContext;


function returnEvent() {
    return window.Event;
}


module.exports = {
    abort: function(target) {
        if (XMLHttpRequest && target instanceof XMLHttpRequest) {
            return window.ProgressEvent || window.Event;
        } else {
            return window.UIEvent || window.Event;
        }
    },

    afterprint: returnEvent,

    animationend: function() {
        return window.AnimationEvent || window.Event;
    },
    animationiteration: function() {
        return window.AnimationEvent || window.Event;
    },
    animationstart: function() {
        return window.AnimationEvent || window.Event;
    },

    audioprocess: function() {
        return window.AudioProcessingEvent || window.Event;
    },

    beforeprint: returnEvent,
    beforeunload: function() {
        return window.BeforeUnloadEvent || window.Event;
    },
    beginevent: function() {
        return window.TimeEvent || window.Event;
    },

    blocked: returnEvent,
    blur: function() {
        return window.FocusEvent || window.Event;
    },

    cached: returnEvent,
    canplay: returnEvent,
    canplaythrough: returnEvent,
    chargingchange: returnEvent,
    chargingtimechange: returnEvent,
    checking: returnEvent,

    click: function() {
        return window.MouseEvent || window.Event;
    },

    close: returnEvent,
    compassneedscalibration: function() {
        return window.SensorEvent || window.Event;
    },
    complete: function(target) {
        if (OfflineAudioContext && target instanceof OfflineAudioContext) {
            return window.OfflineAudioCompletionEvent || window.Event;
        } else {
            return window.Event;
        }
    },

    compositionend: function() {
        return window.CompositionEvent || window.Event;
    },
    compositionstart: function() {
        return window.CompositionEvent || window.Event;
    },
    compositionupdate: function() {
        return window.CompositionEvent || window.Event;
    },

    contextmenu: function() {
        return window.MouseEvent || window.Event;
    },
    copy: function() {
        return window.ClipboardEvent || window.Event;
    },
    cut: function() {
        return window.ClipboardEvent || window.Event;
    },

    dblclick: function() {
        return window.MouseEvent || window.Event;
    },
    devicelight: function() {
        return window.DeviceLightEvent || window.Event;
    },
    devicemotion: function() {
        return window.DeviceMotionEvent || window.Event;
    },
    deviceorientation: function() {
        return window.DeviceOrientationEvent || window.Event;
    },
    deviceproximity: function() {
        return window.DeviceProximityEvent || window.Event;
    },

    dischargingtimechange: returnEvent,

    DOMActivate: function() {
        return window.UIEvent || window.Event;
    },
    DOMAttributeNameChanged: function() {
        return window.MutationNameEvent || window.Event;
    },
    DOMAttrModified: function() {
        return window.MutationEvent || window.Event;
    },
    DOMCharacterDataModified: function() {
        return window.MutationEvent || window.Event;
    },
    DOMContentLoaded: returnEvent,
    DOMElementNameChanged: function() {
        return window.MutationNameEvent || window.Event;
    },
    DOMFocusIn: function() {
        return window.FocusEvent || window.Event;
    },
    DOMFocusOut: function() {
        return window.FocusEvent || window.Event;
    },
    DOMNodeInserted: function() {
        return window.MutationEvent || window.Event;
    },
    DOMNodeInsertedIntoDocument: function() {
        return window.MutationEvent || window.Event;
    },
    DOMNodeRemoved: function() {
        return window.MutationEvent || window.Event;
    },
    DOMNodeRemovedFromDocument: function() {
        return window.MutationEvent || window.Event;
    },
    DOMSubtreeModified: function() {
        return window.FocusEvent || window.Event;
    },
    downloading: returnEvent,

    drag: function() {
        return window.DragEvent || window.Event;
    },
    dragend: function() {
        return window.DragEvent || window.Event;
    },
    dragenter: function() {
        return window.DragEvent || window.Event;
    },
    dragleave: function() {
        return window.DragEvent || window.Event;
    },
    dragover: function() {
        return window.DragEvent || window.Event;
    },
    dragstart: function() {
        return window.DragEvent || window.Event;
    },
    drop: function() {
        return window.DragEvent || window.Event;
    },

    durationchange: returnEvent,
    ended: returnEvent,

    endEvent: function() {
        return window.TimeEvent || window.Event;
    },
    error: function(target) {
        if (XMLHttpRequest && target instanceof XMLHttpRequest) {
            return window.ProgressEvent || window.Event;
        } else if (isNode(target)) {
            return window.UIEvent || window.Event;
        } else {
            return window.Event;
        }
    },
    focus: function() {
        return window.FocusEvent || window.Event;
    },
    focusin: function() {
        return window.FocusEvent || window.Event;
    },
    focusout: function() {
        return window.FocusEvent || window.Event;
    },

    fullscreenchange: returnEvent,
    fullscreenerror: returnEvent,

    gamepadconnected: function() {
        return window.GamepadEvent || window.Event;
    },
    gamepaddisconnected: function() {
        return window.GamepadEvent || window.Event;
    },

    hashchange: function() {
        return window.HashChangeEvent || window.Event;
    },

    input: returnEvent,
    invalid: returnEvent,

    keydown: function() {
        return window.KeyboardEvent || window.Event;
    },
    keyup: function() {
        return window.KeyboardEvent || window.Event;
    },
    keypress: function() {
        return window.KeyboardEvent || window.Event;
    },

    languagechange: returnEvent,
    levelchange: returnEvent,

    load: function(target) {
        if (XMLHttpRequest && target instanceof XMLHttpRequest) {
            return window.ProgressEvent || window.Event;
        } else {
            return window.UIEvent || window.Event;
        }
    },

    loadeddata: returnEvent,
    loadedmetadata: returnEvent,

    loadend: function() {
        return window.ProgressEvent || window.Event;
    },
    loadstart: function() {
        return window.ProgressEvent || window.Event;
    },

    message: function() {
        return window.MessageEvent || window.Event;
    },

    mousedown: function() {
        return window.MouseEvent || window.Event;
    },
    mouseenter: function() {
        return window.MouseEvent || window.Event;
    },
    mouseleave: function() {
        return window.MouseEvent || window.Event;
    },
    mousemove: function() {
        return window.MouseEvent || window.Event;
    },
    mouseout: function() {
        return window.MouseEvent || window.Event;
    },
    mouseover: function() {
        return window.MouseEvent || window.Event;
    },
    mouseup: function() {
        return window.MouseEvent || window.Event;
    },

    noupdate: returnEvent,
    obsolete: returnEvent,
    offline: returnEvent,
    online: returnEvent,
    open: returnEvent,
    orientationchange: returnEvent,

    pagehide: function() {
        return window.PageTransitionEvent || window.Event;
    },
    pageshow: function() {
        return window.PageTransitionEvent || window.Event;
    },

    paste: function() {
        return window.ClipboardEvent || window.Event;
    },
    pause: returnEvent,
    pointerlockchange: returnEvent,
    pointerlockerror: returnEvent,
    play: returnEvent,
    playing: returnEvent,

    popstate: function() {
        return window.PopStateEvent || window.Event;
    },
    progress: function() {
        return window.ProgressEvent || window.Event;
    },

    ratechange: returnEvent,
    readystatechange: returnEvent,

    repeatevent: function() {
        return window.TimeEvent || window.Event;
    },

    reset: returnEvent,

    resize: function() {
        return window.UIEvent || window.Event;
    },
    scroll: function() {
        return window.UIEvent || window.Event;
    },

    seeked: returnEvent,
    seeking: returnEvent,

    select: function() {
        return window.UIEvent || window.Event;
    },
    show: function() {
        return window.MouseEvent || window.Event;
    },
    stalled: returnEvent,
    storage: function() {
        return window.StorageEvent || window.Event;
    },
    submit: returnEvent,
    success: returnEvent,
    suspend: returnEvent,

    SVGAbort: function() {
        return window.SVGEvent || window.Event;
    },
    SVGError: function() {
        return window.SVGEvent || window.Event;
    },
    SVGLoad: function() {
        return window.SVGEvent || window.Event;
    },
    SVGResize: function() {
        return window.SVGEvent || window.Event;
    },
    SVGScroll: function() {
        return window.SVGEvent || window.Event;
    },
    SVGUnload: function() {
        return window.SVGEvent || window.Event;
    },
    SVGZoom: function() {
        return window.SVGEvent || window.Event;
    },
    timeout: function() {
        return window.ProgressEvent || window.Event;
    },

    timeupdate: returnEvent,

    touchcancel: function() {
        return window.TouchEvent || window.Event;
    },
    touchend: function() {
        return window.TouchEvent || window.Event;
    },
    touchenter: function() {
        return window.TouchEvent || window.Event;
    },
    touchleave: function() {
        return window.TouchEvent || window.Event;
    },
    touchmove: function() {
        return window.TouchEvent || window.Event;
    },
    touchstart: function() {
        return window.TouchEvent || window.Event;
    },

    transitionend: function() {
        return window.TransitionEvent || window.Event;
    },
    unload: function() {
        return window.UIEvent || window.Event;
    },

    updateready: returnEvent,
    upgradeneeded: returnEvent,

    userproximity: function() {
        return window.SensorEvent || window.Event;
    },

    visibilitychange: returnEvent,
    volumechange: returnEvent,
    waiting: returnEvent,

    wheel: function() {
        return window.WheelEvent || window.Event;
    }
};


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt-dom/src/utils/ignoreNativeEventProp.js */

module.exports = [
    "view", "target", "currentTarget", "path", "srcElement",
    "cancelBubble", "stopPropagation", "stopImmediatePropagation", "preventDefault", "initEvent",
    "NONE", "CAPTURING_PHASE", "AT_TARGET", "BUBBLING_PHASE", "MOUSEDOWN", "MOUSEUP",
    "MOUSEOVER", "MOUSEOUT", "MOUSEMOVE", "MOUSEDRAG", "CLICK", "DBLCLICK", "KEYDOWN",
    "KEYUP", "KEYPRESS", "DRAGDROP", "FOCUS", "BLUR", "SELECT", "CHANGE"
];


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt-dom/node_modules/now/src/browser.js */

var Date_now = Date.now || function Date_now() {
        return (new Date()).getTime();
    },
    START_TIME = Date_now(),
    performance = global.performance || {};


function now() {
    return performance.now();
}

performance.now = (
    performance.now ||
    performance.webkitNow ||
    performance.mozNow ||
    performance.msNow ||
    performance.oNow ||
    function now() {
        return Date_now() - START_TIME;
    }
);

now.getStartTime = function getStartTime() {
    return START_TIME;
};


START_TIME -= now();


module.exports = now;


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt-dom/src/events/syntheticEvents/SyntheticUIEvent.js */

var getUIEvent = require(148),
    SyntheticEvent = require(149);


var SyntheticEventPrototype = SyntheticEvent.prototype,
    SyntheticUIEventPrototype;


module.exports = SyntheticUIEvent;


function SyntheticUIEvent(nativeEvent, eventHandler) {

    SyntheticEvent.call(this, nativeEvent, eventHandler);

    getUIEvent(this, nativeEvent, eventHandler);
}
SyntheticEvent.extend(SyntheticUIEvent);
SyntheticUIEventPrototype = SyntheticUIEvent.prototype;

SyntheticUIEventPrototype.destructor = function() {

    SyntheticEventPrototype.destructor.call(this);

    this.view = null;
    this.detail = null;
};

SyntheticUIEventPrototype.toJSON = function(json) {

    json = SyntheticEventPrototype.toJSON.call(this, json);

    json.view = null;
    json.detail = this.detail;

    return json;
};


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt-dom/src/events/getters/getUIEvent.js */

var getWindow = require(128),
    getEventTarget = require(139);


module.exports = getUIEvent;


function getUIEvent(obj, nativeEvent, eventHandler) {
    obj.view = getView(nativeEvent, eventHandler);
    obj.detail = nativeEvent.detail || 0;
}

function getView(nativeEvent, eventHandler) {
    var target, document;

    if (nativeEvent.view) {
        return nativeEvent.view;
    } else {
        target = getEventTarget(nativeEvent, eventHandler.window);

        if (target != null && target.window === target) {
            return target;
        } else {
            document = target.ownerDocument;

            if (document) {
                return getWindow(document);
            } else {
                return eventHandler.window;
            }
        }
    }
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt-dom/src/events/syntheticEvents/SyntheticEvent.js */

var inherits = require(62),
    createPool = require(41),
    nativeEventToJSON = require(141),
    getEvent = require(150);


var SyntheticEventPrototype;


module.exports = SyntheticEvent;


function SyntheticEvent(nativeEvent, eventHandler) {
    getEvent(this, nativeEvent, eventHandler);
}
createPool(SyntheticEvent);
SyntheticEventPrototype = SyntheticEvent.prototype;

SyntheticEvent.extend = function(child) {
    inherits(child, this);
    createPool(child);
    return child;
};

SyntheticEvent.create = function create(nativeTouch, eventHandler) {
    return this.getPooled(nativeTouch, eventHandler);
};

SyntheticEventPrototype.destructor = function() {
    this.nativeEvent = null;
    this.type = null;
    this.target = null;
    this.currentTarget = null;
    this.componentTarget = null;
    this.currentComponentTarget = null;
    this.eventPhase = null;
    this.bubbles = null;
    this.cancelable = null;
    this.timeStamp = null;
    this.defaultPrevented = null;
    this.propagationStopped = null;
    this.isTrusted = null;
};

SyntheticEventPrototype.destroy = function() {
    this.constructor.release(this);
};

SyntheticEventPrototype.preventDefault = function() {
    var event = this.nativeEvent;

    if (event.preventDefault) {
        event.preventDefault();
    } else {
        event.returnValue = false;
    }

    this.defaultPrevented = true;
};

SyntheticEventPrototype.stopPropagation = function() {
    var event = this.nativeEvent;

    if (event.stopPropagation) {
        event.stopPropagation();
    } else {
        event.cancelBubble = false;
    }

    this.propagationStopped = true;
};

SyntheticEventPrototype.persist = function() {
    this.isPersistent = true;
};

SyntheticEventPrototype.stopImmediatePropagation = SyntheticEventPrototype.stopPropagation;

SyntheticEventPrototype.toJSON = function(json) {
    json = json || {};

    json.nativeEvent = nativeEventToJSON(this.nativeEvent);
    json.type = this.type;
    json.target = null;
    json.currentTarget = this.currentTarget;
    json.eventPhase = this.eventPhase;
    json.bubbles = this.bubbles;
    json.cancelable = this.cancelable;
    json.timeStamp = this.timeStamp;
    json.defaultPrevented = this.defaultPrevented;
    json.propagationStopped = this.propagationStopped;
    json.isTrusted = this.isTrusted;

    return json;
};


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt-dom/src/events/getters/getEvent.js */

var getEventTarget = require(139);


module.exports = getEvent;


function getEvent(obj, nativeEvent, eventHandler) {
    obj.nativeEvent = nativeEvent;
    obj.type = nativeEvent.type;
    obj.target = getEventTarget(nativeEvent, eventHandler.window);
    obj.currentTarget = nativeEvent.currentTarget;
    obj.eventPhase = nativeEvent.eventPhase;
    obj.bubbles = nativeEvent.bubbles;
    obj.cancelable = nativeEvent.cancelable;
    obj.timeStamp = nativeEvent.timeStamp;
    obj.defaultPrevented = (
        nativeEvent.defaultPrevented != null ? nativeEvent.defaultPrevented : nativeEvent.returnValue === false
    );
    obj.propagationStopped = false;
    obj.isTrusted = nativeEvent.isTrusted;
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt-dom/src/events/syntheticEvents/SyntheticAnimationEvent.js */

var getAnimationEvent = require(162),
    SyntheticEvent = require(149);


var SyntheticEventPrototype = SyntheticEvent.prototype,
    SyntheticAnimationEventPrototype;


module.exports = SyntheticAnimationEvent;


function SyntheticAnimationEvent(nativeEvent, eventHandler) {

    SyntheticEvent.call(this, nativeEvent, eventHandler);

    getAnimationEvent(this, nativeEvent);
}
SyntheticEvent.extend(SyntheticAnimationEvent);
SyntheticAnimationEventPrototype = SyntheticAnimationEvent.prototype;

SyntheticAnimationEventPrototype.destructor = function() {

    SyntheticEventPrototype.destructor.call(this);

    this.animationName = null;
    this.elapsedTime = null;
    this.pseudoElement = null;
};

SyntheticAnimationEventPrototype.toJSON = function(json) {
    json = SyntheticEventPrototype.toJSON.call(this, json);

    json.animationName = this.animationName;
    json.elapsedTime = this.elapsedTime;
    json.pseudoElement = this.pseudoElement;

    return json;
};


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt-dom/src/events/syntheticEvents/SyntheticTransitionEvent.js */

var getTransitionEvent = require(163),
    SyntheticEvent = require(149);


var SyntheticEventPrototype = SyntheticEvent.prototype,
    SyntheticTransitionEventPrototype;


module.exports = SyntheticTransitionEvent;


function SyntheticTransitionEvent(nativeEvent, eventHandler) {

    SyntheticEvent.call(this, nativeEvent, eventHandler);

    getTransitionEvent(this, nativeEvent);
}
SyntheticEvent.extend(SyntheticTransitionEvent);
SyntheticTransitionEventPrototype = SyntheticTransitionEvent.prototype;

SyntheticTransitionEventPrototype.destructor = function() {

    SyntheticEventPrototype.destructor.call(this);

    this.propertyName = null;
    this.elapsedTime = null;
    this.pseudoElement = null;
};

SyntheticTransitionEventPrototype.toJSON = function(json) {
    json = SyntheticEventPrototype.toJSON.call(this, json);

    json.propertyName = this.propertyName;
    json.elapsedTime = this.elapsedTime;
    json.pseudoElement = this.pseudoElement;

    return json;
};


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt-dom/src/events/syntheticEvents/SyntheticClipboardEvent.js */

var getClipboardEvent = require(164),
    SyntheticEvent = require(149);


var SyntheticEventPrototype = SyntheticEvent.prototype,
    SyntheticClipboardEventPrototype;


module.exports = SyntheticClipboardEvent;


function SyntheticClipboardEvent(nativeEvent, eventHandler) {

    SyntheticEvent.call(this, nativeEvent, eventHandler);

    getClipboardEvent(this, nativeEvent, eventHandler);
}
SyntheticEvent.extend(SyntheticClipboardEvent);
SyntheticClipboardEventPrototype = SyntheticClipboardEvent.prototype;

SyntheticClipboardEventPrototype.destructor = function() {

    SyntheticEventPrototype.destructor.call(this);

    this.clipboardData = null;
};

SyntheticClipboardEventPrototype.toJSON = function(json) {

    json = SyntheticEventPrototype.toJSON.call(this, json);

    json.clipboardData = this.clipboardData;

    return json;
};


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt-dom/src/events/syntheticEvents/SyntheticCompositionEvent.js */

var getCompositionEvent = require(165),
    SyntheticEvent = require(149);


var SyntheticEventPrototype = SyntheticEvent.prototype,
    SyntheticCompositionEventPrototype;


module.exports = SyntheticCompositionEvent;


function SyntheticCompositionEvent(nativeEvent, eventHandler) {

    SyntheticEvent.call(this, nativeEvent, eventHandler);

    getCompositionEvent(this, nativeEvent, eventHandler);
}
SyntheticEvent.extend(SyntheticCompositionEvent);
SyntheticCompositionEventPrototype = SyntheticCompositionEvent.prototype;

SyntheticCompositionEventPrototype.destructor = function() {

    SyntheticEventPrototype.destructor.call(this);

    this.data = null;
};

SyntheticCompositionEventPrototype.toJSON = function(json) {

    json = SyntheticEventPrototype.toJSON.call(this, json);

    json.data = this.data;

    return json;
};


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt-dom/src/events/syntheticEvents/SyntheticDragEvent.js */

var getDragEvent = require(166),
    SyntheticMouseEvent = require(159);


var SyntheticMouseEventPrototype = SyntheticMouseEvent.prototype,
    SyntheticDragEventPrototype;


module.exports = SyntheticDragEvent;


function SyntheticDragEvent(nativeEvent, eventHandler) {

    SyntheticMouseEvent.call(this, nativeEvent, eventHandler);

    getDragEvent(this, nativeEvent, eventHandler);
}
SyntheticMouseEvent.extend(SyntheticDragEvent);
SyntheticDragEventPrototype = SyntheticDragEvent.prototype;

SyntheticDragEventPrototype.destructor = function() {

    SyntheticMouseEventPrototype.destructor.call(this);

    this.dataTransfer = null;
};

SyntheticDragEventPrototype.toJSON = function(json) {

    json = SyntheticMouseEventPrototype.toJSON.call(this, json);

    json.dataTransfer = this.dataTransfer;

    return json;
};


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt-dom/src/events/syntheticEvents/SyntheticFocusEvent.js */

var getFocusEvent = require(171),
    SyntheticUIEvent = require(147);


var SyntheticUIEventPrototype = SyntheticUIEvent.prototype,
    SyntheticFocusEventPrototype;


module.exports = SyntheticFocusEvent;


function SyntheticFocusEvent(nativeEvent, eventHandler) {

    SyntheticUIEvent.call(this, nativeEvent, eventHandler);

    getFocusEvent(this, nativeEvent, eventHandler);
}
SyntheticUIEvent.extend(SyntheticFocusEvent);
SyntheticFocusEventPrototype = SyntheticFocusEvent.prototype;

SyntheticFocusEventPrototype.destructor = function() {

    SyntheticUIEventPrototype.destructor.call(this);

    this.relatedTarget = null;
};

SyntheticFocusEventPrototype.toJSON = function(json) {

    json = SyntheticUIEventPrototype.toJSON.call(this, json);

    json.relatedTarget = this.relatedTarget;

    return json;
};


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt-dom/src/events/syntheticEvents/SyntheticInputEvent.js */

var getInputEvent = require(172),
    SyntheticEvent = require(149);


var SyntheticEventPrototype = SyntheticEvent.prototype,
    SyntheticInputEventPrototype;


module.exports = SyntheticInputEvent;


function SyntheticInputEvent(nativeEvent, eventHandler) {

    SyntheticEvent.call(this, nativeEvent, eventHandler);

    getInputEvent(this, nativeEvent, eventHandler);
}
SyntheticEvent.extend(SyntheticInputEvent);
SyntheticInputEventPrototype = SyntheticInputEvent.prototype;

SyntheticInputEventPrototype.destructor = function() {

    SyntheticEventPrototype.destructor.call(this);

    this.data = null;
};

SyntheticInputEventPrototype.toJSON = function(json) {

    json = SyntheticEventPrototype.toJSON.call(this, json);

    json.data = this.data;

    return json;
};


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt-dom/src/events/syntheticEvents/SyntheticKeyboardEvent.js */

var getKeyboardEvent = require(173),
    SyntheticUIEvent = require(147);


var SyntheticUIEventPrototype = SyntheticUIEvent.prototype,
    SynthetiKeyboardEventPrototype;


module.exports = SynthetiKeyboardEvent;


function SynthetiKeyboardEvent(nativeEvent, eventHandler) {

    SyntheticUIEvent.call(this, nativeEvent, eventHandler);

    getKeyboardEvent(this, nativeEvent, eventHandler);
}
SyntheticUIEvent.extend(SynthetiKeyboardEvent);
SynthetiKeyboardEventPrototype = SynthetiKeyboardEvent.prototype;

SynthetiKeyboardEventPrototype.getModifierState = require(168);

SynthetiKeyboardEventPrototype.destructor = function() {

    SyntheticUIEventPrototype.destructor.call(this);

    this.key = null;
    this.location = null;
    this.ctrlKey = null;
    this.shiftKey = null;
    this.altKey = null;
    this.metaKey = null;
    this.repeat = null;
    this.locale = null;
    this.charCode = null;
    this.keyCode = null;
    this.which = null;
};

SynthetiKeyboardEventPrototype.toJSON = function(json) {

    json = SyntheticUIEventPrototype.toJSON.call(this, json);

    json.key = this.key;
    json.location = this.location;
    json.ctrlKey = this.ctrlKey;
    json.shiftKey = this.shiftKey;
    json.altKey = this.altKey;
    json.metaKey = this.metaKey;
    json.repeat = this.repeat;
    json.locale = this.locale;
    json.charCode = this.charCode;
    json.keyCode = this.keyCode;
    json.which = this.which;

    return json;
};


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt-dom/src/events/syntheticEvents/SyntheticMouseEvent.js */

var getMouseEvent = require(167),
    SyntheticUIEvent = require(147);


var SyntheticUIEventPrototype = SyntheticUIEvent.prototype,
    SyntheticMouseEventPrototype;


module.exports = SyntheticMouseEvent;


function SyntheticMouseEvent(nativeEvent, eventHandler) {

    SyntheticUIEvent.call(this, nativeEvent, eventHandler);

    getMouseEvent(this, nativeEvent, eventHandler);
}
SyntheticUIEvent.extend(SyntheticMouseEvent);
SyntheticMouseEventPrototype = SyntheticMouseEvent.prototype;

SyntheticMouseEventPrototype.getModifierState = require(168);

SyntheticMouseEventPrototype.destructor = function() {

    SyntheticUIEventPrototype.destructor.call(this);

    this.screenX = null;
    this.screenY = null;
    this.clientX = null;
    this.clientY = null;
    this.ctrlKey = null;
    this.shiftKey = null;
    this.altKey = null;
    this.metaKey = null;
    this.button = null;
    this.buttons = null;
    this.relatedTarget = null;
    this.pageX = null;
    this.pageY = null;
};

SyntheticMouseEventPrototype.toJSON = function(json) {

    json = SyntheticUIEventPrototype.toJSON.call(this, json);

    json.screenX = this.screenX;
    json.screenY = this.screenY;
    json.clientX = this.clientX;
    json.clientY = this.clientY;
    json.ctrlKey = this.ctrlKey;
    json.shiftKey = this.shiftKey;
    json.altKey = this.altKey;
    json.metaKey = this.metaKey;
    json.button = this.button;
    json.buttons = this.buttons;
    json.relatedTarget = this.relatedTarget;
    json.pageX = this.pageX;
    json.pageY = this.pageY;

    return json;
};


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt-dom/src/events/syntheticEvents/SyntheticTouchEvent.js */

var getTouchEvent = require(176),
    SyntheticUIEvent = require(147),
    SyntheticTouch = require(177);


var SyntheticUIEventPrototype = SyntheticUIEvent.prototype,
    SyntheticTouchEventPrototype;


module.exports = SyntheticTouchEvent;


function SyntheticTouchEvent(nativeEvent, eventHandler) {

    SyntheticUIEvent.call(this, nativeEvent, eventHandler);

    this.touches = createTouches(this.touches || [], nativeEvent.touches, eventHandler);
    this.targetTouches = createTouches(this.targetTouches || [], nativeEvent.targetTouches, eventHandler);
    this.changedTouches = createTouches(this.changedTouches || [], nativeEvent.changedTouches, eventHandler);

    getTouchEvent(this, nativeEvent, eventHandler);
}
SyntheticUIEvent.extend(SyntheticTouchEvent);
SyntheticTouchEventPrototype = SyntheticTouchEvent.prototype;

SyntheticTouchEventPrototype.getModifierState = require(168);

SyntheticTouchEventPrototype.destructor = function() {

    SyntheticUIEventPrototype.destructor.call(this);

    destroyTouches(this.touches);
    destroyTouches(this.targetTouches);
    destroyTouches(this.changedTouches);

    this.altKey = null;
    this.metaKey = null;
    this.ctrlKey = null;
    this.shiftKey = null;
};

SyntheticTouchEventPrototype.toJSON = function(json) {

    json = SyntheticUIEventPrototype.toJSON.call(this, json);

    json.touches = this.touches || [];
    json.targetTouches = this.targetTouches || [];
    json.changedTouches = this.changedTouches || [];
    json.ctrlKey = this.ctrlKey;
    json.shiftKey = this.shiftKey;
    json.altKey = this.altKey;
    json.metaKey = this.metaKey;

    return json;
};

function createTouches(touches, nativeTouches, eventHandler) {
    var i = -1,
        il = nativeTouches.length - 1;

    while (i++ < il) {
        touches[i] = SyntheticTouch.create(nativeTouches[i], eventHandler);
    }

    return touches;
}

function destroyTouches(touches) {
    var i;

    while (i--) {
        touches[i].destroy();
    }
    touches.length = 0;

    return touches;
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt-dom/src/events/syntheticEvents/SyntheticWheelEvent.js */

var getWheelEvent = require(179),
    SyntheticMouseEvent = require(159);


var SyntheticMouseEventPrototype = SyntheticMouseEvent.prototype,
    SyntheticWheelEventPrototype;


module.exports = SyntheticWheelEvent;


function SyntheticWheelEvent(nativeEvent, eventHandler) {

    SyntheticMouseEvent.call(this, nativeEvent, eventHandler);

    getWheelEvent(this, nativeEvent, eventHandler);
}
SyntheticMouseEvent.extend(SyntheticWheelEvent);
SyntheticWheelEventPrototype = SyntheticWheelEvent.prototype;

SyntheticWheelEventPrototype.destructor = function() {

    SyntheticMouseEventPrototype.destructor.call(this);

    this.deltaX = null;
    this.deltaY = null;
    this.deltaZ = null;
    this.deltaMode = null;
};

SyntheticWheelEventPrototype.toJSON = function(json) {

    json = SyntheticMouseEventPrototype.toJSON.call(this, json);

    json.deltaX = this.deltaX;
    json.deltaY = this.deltaY;
    json.deltaZ = this.deltaZ;
    json.deltaMode = this.deltaMode;

    return json;
};


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt-dom/src/events/getters/getAnimationEvent.js */

module.exports = getAnimationEvent;


function getAnimationEvent(obj, nativeEvent) {
    obj.animationName = nativeEvent.animationName;
    obj.elapsedTime = nativeEvent.elapsedTime;
    obj.pseudoElement = nativeEvent.pseudoElement;
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt-dom/src/events/getters/getTransitionEvent.js */

module.exports = getTransitionEvent;


function getTransitionEvent(obj, nativeEvent) {
    obj.propertyName = nativeEvent.propertyName;
    obj.elapsedTime = nativeEvent.elapsedTime;
    obj.pseudoElement = nativeEvent.pseudoElement;
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt-dom/src/events/getters/getClipboardEvent.js */

module.exports = getClipboardEvent;


function getClipboardEvent(obj, nativeEvent, eventHandler) {
    obj.clipboardData = getClipboardData(nativeEvent, eventHandler.window);
}

function getClipboardData(nativeEvent, window) {
    return nativeEvent.clipboardData != null ? nativeEvent.clipboardData : window.clipboardData;
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt-dom/src/events/getters/getCompositionEvent.js */

module.exports = getCompositionEvent;


function getCompositionEvent(obj, nativeEvent) {
    obj.data = nativeEvent.data;
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt-dom/src/events/getters/getDragEvent.js */

module.exports = getDragEvent;


function getDragEvent(obj, nativeEvent) {
    obj.dataTransfer = nativeEvent.dataTransfer;
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt-dom/src/events/getters/getMouseEvent.js */

var getPageX = require(169),
    getPageY = require(170);


module.exports = getMouseEvent;


function getMouseEvent(obj, nativeEvent, eventHandler) {
    obj.screenX = nativeEvent.screenX;
    obj.screenY = nativeEvent.screenY;
    obj.clientX = nativeEvent.clientX;
    obj.clientY = nativeEvent.clientY;
    obj.ctrlKey = nativeEvent.ctrlKey;
    obj.shiftKey = nativeEvent.shiftKey;
    obj.altKey = nativeEvent.altKey;
    obj.metaKey = nativeEvent.metaKey;
    obj.button = getButton(nativeEvent);
    obj.buttons = nativeEvent.buttons;
    obj.relatedTarget = getRelatedTarget(nativeEvent);
    obj.pageX = getPageX(nativeEvent, eventHandler.viewport);
    obj.pageY = getPageY(nativeEvent, eventHandler.viewport);
}

function getRelatedTarget(nativeEvent) {
    return nativeEvent.relatedTarget || (
        nativeEvent.fromElement === nativeEvent.srcElement ? nativeEvent.toElement : nativeEvent.fromElement
    );
}

function getButton(nativeEvent) {
    var button = nativeEvent.button;

    return (
        nativeEvent.which != null ? button : (
            button === 2 ? 2 : button === 4 ? 1 : 0
        )
    );
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt-dom/src/events/getters/getEventModifierState.js */

var modifierKeyToProp = {
    Alt: "altKey",
    Control: "ctrlKey",
    Meta: "metaKey",
    Shift: "shiftKey"
};


module.exports = getEventModifierState;


function getEventModifierState(keyArg) {
    var nativeEvent = this.nativeEvent,
        keyProp;

    if (nativeEvent.getModifierState != null) {
        return nativeEvent.getModifierState(keyArg);
    } else {
        keyProp = modifierKeyToProp[keyArg];
        return keyProp ? !!nativeEvent[keyProp] : false;
    }
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt-dom/src/events/getters/getPageX.js */

module.exports = getPageX;


function getPageX(nativeEvent, viewport) {
    return nativeEvent.pageX != null ? nativeEvent.pageX : nativeEvent.clientX + viewport.currentScrollLeft;
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt-dom/src/events/getters/getPageY.js */

module.exports = getPageY;


function getPageY(nativeEvent, viewport) {
    return nativeEvent.pageY != null ? nativeEvent.pageY : nativeEvent.clientY + viewport.currentScrollTop;
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt-dom/src/events/getters/getFocusEvent.js */

module.exports = getFocusEvent;


function getFocusEvent(obj, nativeEvent) {
    obj.relatedTarget = nativeEvent.relatedTarget;
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt-dom/src/events/getters/getInputEvent.js */

module.exports = getInputEvent;


function getInputEvent(obj, nativeEvent) {
    obj.data = nativeEvent.data;
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt-dom/src/events/getters/getKeyboardEvent.js */

var getEventKey = require(174),
    getEventCharCode = require(175);


module.exports = getKeyboardEvent;


function getKeyboardEvent(obj, nativeEvent) {
    obj.key = getEventKey(nativeEvent);
    obj.location = nativeEvent.location;
    obj.ctrlKey = nativeEvent.ctrlKey;
    obj.shiftKey = nativeEvent.shiftKey;
    obj.altKey = nativeEvent.altKey;
    obj.metaKey = nativeEvent.metaKey;
    obj.repeat = nativeEvent.repeat;
    obj.locale = nativeEvent.locale;
    obj.charCode = getCharCode(nativeEvent);
    obj.keyCode = getKeyCode(nativeEvent);
    obj.which = getWhich(nativeEvent);
}

function getCharCode(nativeEvent) {
    return nativeEvent.type === "keypress" ? getEventCharCode(nativeEvent) : 0;
}

function getKeyCode(nativeEvent) {
    var type = nativeEvent.type;

    return type === "keydown" || type === "keyup" ? nativeEvent.keyCode : 0;
}

function getWhich(nativeEvent) {
    var type = nativeEvent.type;

    return type === "keypress" ? getEventCharCode(event) : (
        type === "keydown" || type === "keyup" ? nativeEvent.keyCode : 0
    );
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt-dom/src/events/getters/getEventKey.js */

var getEventCharCode = require(175);


var normalizeKey, translateToKey;


module.exports = getEventKey;


normalizeKey = {
    "Esc": "Escape",
    "Spacebar": " ",
    "Left": "ArrowLeft",
    "Up": "ArrowUp",
    "Right": "ArrowRight",
    "Down": "ArrowDown",
    "Del": "Delete",
    "Win": "OS",
    "Menu": "ContextMenu",
    "Apps": "ContextMenu",
    "Scroll": "ScrollLock",
    "MozPrintableKey": "Unidentified"
};

translateToKey = {
    8: "Backspace",
    9: "Tab",
    12: "Clear",
    13: "Enter",
    16: "Shift",
    17: "Control",
    18: "Alt",
    19: "Pause",
    20: "CapsLock",
    27: "Escape",
    32: " ",
    33: "PageUp",
    34: "PageDown",
    35: "End",
    36: "Home",
    37: "ArrowLeft",
    38: "ArrowUp",
    39: "ArrowRight",
    40: "ArrowDown",
    45: "Insert",
    46: "Delete",
    112: "F1",
    113: "F2",
    114: "F3",
    115: "F4",
    116: "F5",
    117: "F6",
    118: "F7",
    119: "F8",
    120: "F9",
    121: "F10",
    122: "F11",
    123: "F12",
    144: "NumLock",
    145: "ScrollLock",
    224: "Meta"
};


function getEventKey(nativeEvent) {
    var key, charCode;

    if (nativeEvent.key) {
        key = normalizeKey[nativeEvent.key] || nativeEvent.key;

        if (key !== "Unidentified") {
            return key;
        }
    }

    if (nativeEvent.type === "keypress") {
        charCode = getEventCharCode(nativeEvent);

        return charCode === 13 ? "Enter" : String.fromCharCode(charCode);
    }
    if (nativeEvent.type === "keydown" || nativeEvent.type === "keyup") {
        return translateToKey[nativeEvent.keyCode] || "Unidentified";
    }

    return "";
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt-dom/src/events/getters/getEventCharCode.js */

module.exports = getEventCharCode;


function getEventCharCode(nativeEvent) {
    var keyCode = nativeEvent.keyCode,
        charCode;

    if (nativeEvent.charCode != null) {
        charCode = nativeEvent.charCode;

        if (charCode === 0 && keyCode === 13) {
            charCode = 13;
        }
    } else {
        charCode = keyCode;
    }

    if (charCode >= 32 || charCode === 13) {
        return charCode;
    } else {
        return 0;
    }
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt-dom/src/events/getters/getTouchEvent.js */

module.exports = getTouchEvent;


function getTouchEvent(obj, nativeEvent) {
    obj.altKey = nativeEvent.altKey;
    obj.metaKey = nativeEvent.metaKey;
    obj.ctrlKey = nativeEvent.ctrlKey;
    obj.shiftKey = nativeEvent.shiftKey;
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt-dom/src/events/syntheticEvents/SyntheticTouch.js */

var getTouch = require(178),
    nativeEventToJSON = require(141),
    createPool = require(41);


var SyntheticTouchPrototype;


module.exports = SyntheticTouch;


function SyntheticTouch(nativeTouch, eventHandler) {
    getTouch(this, nativeTouch, eventHandler);
}
createPool(SyntheticTouch);
SyntheticTouchPrototype = SyntheticTouch.prototype;

SyntheticTouch.create = function(nativeTouch, eventHandler) {
    return this.getPooled(nativeTouch, eventHandler);
};

SyntheticTouchPrototype.destroy = function(instance) {
    SyntheticTouch.release(instance);
};

SyntheticTouchPrototype.destructor = function() {
    this.nativeTouch = null;
    this.identifier = null;
    this.screenX = null;
    this.screenY = null;
    this.clientX = null;
    this.clientY = null;
    this.pageX = null;
    this.pageY = null;
    this.radiusX = null;
    this.radiusY = null;
    this.rotationAngle = null;
    this.force = null;
    this.target = null;
};

SyntheticTouchPrototype.toJSON = function(json) {
    json = json || {};

    json.nativeTouch = nativeEventToJSON(this.nativeTouch);
    json.identifier = this.identifier;
    json.screenX = this.screenX;
    json.screenY = this.screenY;
    json.clientX = this.clientX;
    json.clientY = this.clientY;
    json.pageX = this.pageX;
    json.pageY = this.pageY;
    json.radiusX = this.radiusX;
    json.radiusY = this.radiusY;
    json.rotationAngle = this.rotationAngle;
    json.force = this.force;
    json.target = null;

    return json;
};


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt-dom/src/events/getters/getTouch.js */

module.exports = getTouch;


function getTouch(obj, nativeTouch, eventHandler) {
    obj.nativeTouch = nativeTouch;
    obj.identifier = nativeTouch.identifier;
    obj.screenX = nativeTouch.screenX;
    obj.screenY = nativeTouch.screenY;
    obj.clientX = nativeTouch.clientX;
    obj.clientY = nativeTouch.clientY;
    obj.pageX = getPageX(nativeTouch, eventHandler.viewport);
    obj.pageY = getPageY(nativeTouch, eventHandler.viewport);
    obj.radiusX = getRadiusX(nativeTouch);
    obj.radiusY = getRadiusY(nativeTouch);
    obj.rotationAngle = getRotationAngle(nativeTouch);
    obj.force = getForce(nativeTouch);
    obj.target = nativeTouch.target;
}

function getPageX(nativeTouch, viewport) {
    return nativeTouch.pageX != null ? nativeTouch.pageX : nativeTouch.clientX + viewport.currentScrollLeft;
}

function getPageY(nativeTouch, viewport) {
    return nativeTouch.pageX != null ? nativeTouch.pageY : nativeTouch.clientY + viewport.currentScrollTop;
}

function getRadiusX(nativeTouch) {
    return (
        nativeTouch.radiusX != null ? nativeTouch.radiusX :
        nativeTouch.webkitRadiusX != null ? nativeTouch.webkitRadiusX :
        nativeTouch.mozRadiusX != null ? nativeTouch.mozRadiusX :
        nativeTouch.msRadiusX != null ? nativeTouch.msRadiusX :
        nativeTouch.oRadiusX != null ? nativeTouch.oRadiusX :
        0
    );
}

function getRadiusY(nativeTouch) {
    return (
        nativeTouch.radiusY != null ? nativeTouch.radiusY :
        nativeTouch.webkitRadiusY != null ? nativeTouch.webkitRadiusY :
        nativeTouch.mozRadiusY != null ? nativeTouch.mozRadiusY :
        nativeTouch.msRadiusY != null ? nativeTouch.msRadiusY :
        nativeTouch.oRadiusY != null ? nativeTouch.oRadiusY :
        0
    );
}

function getRotationAngle(nativeTouch) {
    return (
        nativeTouch.rotationAngle != null ? nativeTouch.rotationAngle :
        nativeTouch.webkitRotationAngle != null ? nativeTouch.webkitRotationAngle :
        nativeTouch.mozRotationAngle != null ? nativeTouch.mozRotationAngle :
        nativeTouch.msRotationAngle != null ? nativeTouch.msRotationAngle :
        nativeTouch.oRotationAngle != null ? nativeTouch.oRotationAngle :
        0
    );
}

function getForce(nativeTouch) {
    return (
        nativeTouch.force != null ? nativeTouch.force :
        nativeTouch.webkitForce != null ? nativeTouch.webkitForce :
        nativeTouch.mozForce != null ? nativeTouch.mozForce :
        nativeTouch.msForce != null ? nativeTouch.msForce :
        nativeTouch.oForce != null ? nativeTouch.oForce :
        1
    );
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt-dom/src/events/getters/getWheelEvent.js */

module.exports = getWheelEvent;


function getWheelEvent(obj, nativeEvent) {
    obj.deltaX = getDeltaX(nativeEvent);
    obj.deltaY = getDeltaY(nativeEvent);
    obj.deltaZ = nativeEvent.deltaZ;
    obj.deltaMode = nativeEvent.deltaMode;
}

function getDeltaX(nativeEvent) {
    return nativeEvent.deltaX != null ? nativeEvent.deltaX : (
        nativeEvent.wheelDeltaX != null ? -nativeEvent.wheelDeltaX : 0
    );
}

function getDeltaY(nativeEvent) {
    return nativeEvent.deltaY != null ? nativeEvent.deltaY : (
        nativeEvent.wheelDeltaY != null ? -nativeEvent.wheelDeltaY : (
            nativeEvent.wheelDelta != null ? -nativeEvent.wheelDelta : 0
        )
    );
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt-dom/src/applyPatch.js */

var virt = require(1),
    isNull = require(26),
    isUndefined = require(27),
    isNullOrUndefined = require(20),
    createDOMElement = require(181),
    renderMarkup = require(82),
    renderString = require(69),
    renderChildrenString = require(84),
    addDOMNodes = require(182),
    removeDOMNode = require(183),
    removeDOMNodes = require(184),
    getNodeById = require(104),
    applyProperties = require(185);


var consts = virt.consts;


module.exports = applyPatch;


function applyPatch(patch, DOMNode, id, document, rootDOMNode) {
    switch (patch.type) {
        case consts.MOUNT:
            mount(rootDOMNode, patch.next, id);
            break;
        case consts.UNMOUNT:
            unmount(rootDOMNode);
            break;
        case consts.INSERT:
            insert(DOMNode, patch.childId, patch.index, patch.next, document);
            break;
        case consts.REMOVE:
            remove(DOMNode, patch.childId, patch.index);
            break;
        case consts.REPLACE:
            replace(DOMNode, patch.childId, patch.index, patch.next, document);
            break;
        case consts.TEXT:
            text(DOMNode, patch.index, patch.next, patch.props);
            break;
        case consts.ORDER:
            order(DOMNode, patch.order);
            break;
        case consts.PROPS:
            applyProperties(DOMNode, patch.id, patch.next, patch.previous);
            break;
    }
}

function remove(parentNode, id, index) {
    var node;

    if (isNull(id)) {
        node = parentNode.childNodes[index];
    } else {
        node = getNodeById(id);
        removeDOMNode(node);
    }

    parentNode.removeChild(node);
}

function mount(rootDOMNode, view, id) {
    rootDOMNode.innerHTML = renderString(view, null, id);
    addDOMNodes(rootDOMNode.childNodes);
}

function unmount(rootDOMNode) {
    removeDOMNodes(rootDOMNode.childNodes);
    rootDOMNode.innerHTML = "";
}

function insert(parentNode, id, index, view, document) {
    var node = createDOMElement(view, id, document);

    if (view.children) {
        node.innerHTML = renderChildrenString(view.children, view.props, id);
        addDOMNodes(node.childNodes);
    }

    parentNode.appendChild(node);
}

function text(parentNode, index, value, props) {
    var textNode = parentNode.childNodes[index];

    if (textNode) {
        if (textNode.nodeType === 3) {
            textNode.nodeValue = value;
        } else {
            textNode.innerHTML = renderMarkup(value, props);
        }
    }
}

function replace(parentNode, id, index, view, document) {
    var node = createDOMElement(view, id, document);

    if (view.children) {
        node.innerHTML = renderChildrenString(view.children, view.props, id);
        addDOMNodes(node.childNodes);
    }

    parentNode.replaceChild(node, parentNode.childNodes[index]);
}

var order_children = [];

function order(parentNode, orderIndex) {
    var children = order_children,
        childNodes = parentNode.childNodes,
        reverseIndex = orderIndex.reverse,
        removes = orderIndex.removes,
        insertOffset = 0,
        i = -1,
        length = childNodes.length - 1,
        move, node, insertNode;

    children.length = length;
    while (i++ < length) {
        children[i] = childNodes[i];
    }

    i = -1;
    while (i++ < length) {
        move = orderIndex[i];

        if (!isUndefined(move) && move !== i) {
            if (reverseIndex[i] > i) {
                insertOffset++;
            }

            node = children[move];
            insertNode = childNodes[i + insertOffset] || null;

            if (node !== insertNode) {
                parentNode.insertBefore(node, insertNode);
            }

            if (move < i) {
                insertOffset--;
            }
        }

        if (!isNullOrUndefined(removes[i])) {
            insertOffset++;
        }
    }
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt-dom/src/utils/createDOMElement.js */

var virt = require(1),
    isString = require(18),

    DOM_ID_NAME = require(83),
    nodeCache = require(105),

    applyProperties = require(185);


var View = virt.View,
    isPrimitiveView = View.isPrimitiveView;


module.exports = createDOMElement;


function createDOMElement(view, id, document) {
    var node;

    if (isPrimitiveView(view)) {
        return document.createTextNode(view);
    } else if (isString(view.type)) {
        node = document.createElement(view.type);

        applyProperties(node, id, view.props, undefined);

        node.setAttribute(DOM_ID_NAME, id);
        nodeCache[id] = node;

        return node;
    } else {
        throw new TypeError("Arguments is not a valid view");
    }
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt-dom/src/utils/addDOMNodes.js */

var isElement = require(97),
    getNodeId = require(186);


module.exports = addDOMNodes;


function addDOMNodes(nodes) {
    var i = -1,
        il = nodes.length - 1;

    while (i++ < il) {
        addDOMNode(nodes[i]);
    }
}

function addDOMNode(node) {
    if (isElement(node)) {
        getNodeId(node);
        addDOMNodes(node.childNodes);
    }
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt-dom/src/utils/removeDOMNode.js */

var isElement = require(97),
    nodeCache = require(105),
    getNodeAttributeId = require(140);


module.exports = removeDOMNode;


var removeDOMNodes = require(184);


function removeDOMNode(node) {
    if (isElement(node)) {
        delete nodeCache[getNodeAttributeId(node)];
        removeDOMNodes(node.childNodes);
    }
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt-dom/src/utils/removeDOMNodes.js */

module.exports = removeDOMNodes;


var removeDOMNode = require(183);


function removeDOMNodes(nodes) {
    var i = -1,
        il = nodes.length - 1;

    while (i++ < il) {
        removeDOMNode(nodes[i]);
    }
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt-dom/src/applyProperties.js */

var isString = require(18),
    isObject = require(30),
    isFunction = require(16),
    isUndefined = require(27),
    isNullOrUndefined = require(20),
    getPrototypeOf = require(33);


module.exports = applyProperties;


function applyProperties(node, id, props, previous) {
    var propKey, propValue;

    for (propKey in props) {
        propValue = props[propKey];

        if (propKey !== "dangerouslySetInnerHTML" && !isFunction(propValue)) {
            if (isNullOrUndefined(propValue) && !isNullOrUndefined(previous)) {
                removeProperty(node, id, previous, propKey);
            } else if (isObject(propValue)) {
                applyObject(node, previous, propKey, propValue);
            } else if (!isNullOrUndefined(propValue) && (!previous || previous[propKey] !== propValue)) {
                applyProperty(node, id, propKey, propValue);
            }
        }
    }
}

function applyProperty(node, id, propKey, propValue) {
    if (propKey !== "className" && node.setAttribute) {
        node.setAttribute(propKey, propValue);
    } else {
        node[propKey] = propValue;
    }
}

function removeProperty(node, id, previous, propKey) {
    var canRemoveAttribute = !!node.removeAttribute,
        previousValue = previous[propKey],
        keyName, style;

    if (propKey === "attributes") {
        for (keyName in previousValue) {
            if (canRemoveAttribute) {
                node.removeAttribute(keyName);
            } else {
                node[keyName] = isString(previousValue[keyName]) ? "" : null;
            }
        }
    } else if (propKey === "style") {
        style = node.style;

        for (keyName in previousValue) {
            style[keyName] = "";
        }
    } else {
        if (propKey !== "className" && canRemoveAttribute) {
            node.removeAttribute(propKey);
        } else {
            node[propKey] = isString(previousValue) ? "" : null;
        }
    }
}

function applyObject(node, previous, propKey, propValues) {
    var previousValue, key, value, nodeProps, replacer;

    if (propKey === "attributes") {
        for (key in propValues) {
            value = propValues[key];

            if (isUndefined(value)) {
                node.removeAttribute(key);
            } else {
                node.setAttribute(key, value);
            }
        }

        return;
    }

    previousValue = previous ? previous[propKey] : void(0);

    if (!isNullOrUndefined(previousValue) &&
        isObject(previousValue) &&
        getPrototypeOf(previousValue) !== getPrototypeOf(propValues)
    ) {
        node[propKey] = propValues;
        return;
    }

    nodeProps = node[propKey];

    if (!isObject(nodeProps)) {
        nodeProps = node[propKey] = {};
    }

    replacer = propKey === "style" ? "" : void(0);

    for (key in propValues) {
        value = propValues[key];
        nodeProps[key] = isUndefined(value) ? replacer : value;
    }
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt-dom/src/utils/getNodeId.js */

var has = require(22),
    nodeCache = require(105),
    getNodeAttributeId = require(140);


module.exports = getNodeId;


function getNodeId(node) {
    return node && getId(node);
}

function getId(node) {
    var id = getNodeAttributeId(node),
        localNodeCache, cached;

    if (id) {
        localNodeCache = nodeCache;

        if (has(localNodeCache, id)) {
            cached = localNodeCache[id];

            if (cached !== node) {
                localNodeCache[id] = node;
            }
        } else {
            localNodeCache[id] = node;
        }
    }

    return id;
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt-dom/src/utils/getRootNodeInContainer.js */

module.exports = getRootNodeInContainer;


function getRootNodeInContainer(containerNode) {
    if (!containerNode) {
        return null;
    } else {
        if (containerNode.nodeType === 9) {
            return containerNode.documentElement;
        } else {
            return containerNode.firstChild;
        }
    }
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt-dom/node_modules/messenger_worker_adapter/src/index.js */

var isString = require(18),
    environment = require(99);


var MessengerWorkerAdapterPrototype,
    globalWorker;


if (environment.worker) {
    globalWorker = self;
}


module.exports = MessengerWorkerAdapter;


function MessengerWorkerAdapter(url) {
    this.__worker = environment.worker ? globalWorker : (isString(url) ? new Worker(url) : url);
}
MessengerWorkerAdapterPrototype = MessengerWorkerAdapter.prototype;

MessengerWorkerAdapterPrototype.addMessageListener = function(callback) {
    this.__worker.addEventListener("message", function onMessage(e) {
        callback(JSON.parse(e.data));
    });
};

MessengerWorkerAdapterPrototype.postMessage = function(data) {
    this.__worker.postMessage(JSON.stringify(data));
};


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt-dom/src/worker/WorkerAdapter.js */

var extend = require(24),
    Messenger = require(126),
    MessengerWorkerAdapter = require(188),
    handleEventDispatch = require(133),
    nativeDOMComponents = require(70),
    registerNativeComponents = require(129),
    consts = require(113),
    eventClassMap = require(132);


module.exports = WorkerAdapter;


function WorkerAdapter(root) {
    var messenger = new Messenger(new MessengerWorkerAdapter()),
        eventManager = root.eventManager,
        viewport = {
            currentScrollLeft: 0,
            currentScrollTop: 0
        },
        eventHandler = {
            window: global,
            document: global,
            viewport: viewport
        },
        events = eventManager.events;

    this.root = root;
    this.messenger = messenger;

    extend(eventManager.propNameToTopLevel, consts.propNameToTopLevel);

    messenger.on("virt.dom.handleEventDispatch", function(data, callback) {
        var topLevelType = data.topLevelType,
            dataViewport = data.viewport;

        viewport.currentScrollLeft = dataViewport.currentScrollLeft;
        viewport.currentScrollTop = dataViewport.currentScrollTop;

        handleEventDispatch(
            root.childHash,
            events,
            topLevelType,
            data.targetId,
            eventClassMap[topLevelType].getPooled(data.nativeEvent, eventHandler)
        );

        callback();
    });

    registerNativeComponents(root, nativeDOMComponents);
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt-dom/node_modules/messenger_websocket_adapter/src/index.js */

var MessengerWebSocketAdapterPrototype;


module.exports = MessengerWebSocketAdapter;


function MessengerWebSocketAdapter(socket, attachMessage, sendMessage) {
    this.__socket = socket;

    this.__attachMessage = attachMessage || defaultAttachMessage;
    this.__sendMessage = sendMessage || defaultSendMessage;
}
MessengerWebSocketAdapterPrototype = MessengerWebSocketAdapter.prototype;

MessengerWebSocketAdapterPrototype.addMessageListener = function(callback) {
    this.__attachMessage(this.__socket, callback);
};

MessengerWebSocketAdapterPrototype.postMessage = function(data) {
    this.__sendMessage(this.__socket, data);
};

function defaultAttachMessage(socket, callback) {
    socket.onmessage = function onMessage(e) {
        callback(JSON.parse(e.data));
    };
}

function defaultSendMessage(socket, data) {
    socket.send(JSON.stringify(data));
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt-dom/src/websocket/WebSocketAdapter.js */

var extend = require(24),
    Messenger = require(126),
    MessengerWebSocketAdapter = require(190),
    handleEventDispatch = require(133),
    nativeDOMComponents = require(70),
    registerNativeComponents = require(129),
    consts = require(113),
    eventClassMap = require(132);


module.exports = WebSocketAdapter;


function WebSocketAdapter(root, socket, attachMessage, sendMessage) {
    var messenger = new Messenger(new MessengerWebSocketAdapter(socket, attachMessage, sendMessage)),

        eventManager = root.eventManager,

        viewport = {
            currentScrollLeft: 0,
            currentScrollTop: 0
        },
        eventHandler = {
            window: global,
            document: global,
            viewport: viewport
        },

        events = eventManager.events;

    this.root = root;
    this.messenger = messenger;

    extend(eventManager.propNameToTopLevel, consts.propNameToTopLevel);

    messenger.on("virt.dom.handleEventDispatch", function(data, callback) {
        var topLevelType = data.topLevelType,
            dataViewport = data.viewport;

        viewport.currentScrollLeft = dataViewport.currentScrollLeft;
        viewport.currentScrollTop = dataViewport.currentScrollTop;

        handleEventDispatch(
            root.childHash,
            events,
            topLevelType,
            data.targetId,
            eventClassMap[topLevelType].getPooled(data.nativeEvent, eventHandler)
        );

        callback();
    });

    registerNativeComponents(root, nativeDOMComponents);
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/css/src/index.js */

var arrayForEach = require(120),
    indexOf = require(54),
    fastSlice = require(195),
    prefix = require(196),
    properties = require(197),
    transition = require(198),
    textShadow = require(199),
    nonPrefixProperties = require(200);


var css = exports;


arrayForEach(properties, function(key) {
    if (indexOf(nonPrefixProperties, key) === -1) {
        css[key] = function(styles, value) {
            return prefix(styles, key, value, null, css.stopPrefix);
        };
    } else {
        css[key] = function(styles, value) {
            styles[key] = value;
            return styles;
        };
    }
});

css.opacity = require(201);

css.transition = function(styles) {
    return transition(styles, fastSlice(arguments, 1));
};
css.textShadow = function(styles) {
    return textShadow(styles, fastSlice(arguments, 1));
};

css.stopPrefix = false;
css.prefixes = require(202);
css.properties = properties;

css.easing = require(203);
css.colors = require(204);
css.Styles = require(205);

css.darken = require(206);
css.fade = require(207);
css.lighten = require(208);


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/prop_types/src/index.js */

var i18n = require(221),
    isArray = require(17),
    isRegExp = require(222),
    isNullOrUndefined = require(20),
    emptyFunction = require(35),
    isFunction = require(16),
    has = require(22),
    indexOf = require(54);


var propTypes = exports,
    defaultLocale = "en";


i18n = i18n.create(true, true);


if (!i18n.has("en", "prop_types.anonymous")) {
    i18n.add("en", require(223));
}


propTypes.createTypeChecker = createTypeChecker;

function createTypeChecker(validate) {

    function checkType(props, propName, callerName, locale) {
        if (isNullOrUndefined(props[propName])) {
            return null;
        } else {
            return validate(props, propName, callerName || ("<<" + i18n(locale || defaultLocale, "prop_types.anonymous") + ">>"), locale || defaultLocale);
        }
    }

    checkType.isRequired = function checkIsRequired(props, propName, callerName, locale) {
        callerName = callerName || ("<<" + i18n(locale || defaultLocale, "prop_types.anonymous") + ">>");

        if (isNullOrUndefined(props[propName])) {
            return new TypeError(i18n(locale || defaultLocale, "prop_types.is_required", propName, callerName));
        } else {
            return validate(props, propName, callerName, locale || defaultLocale);
        }
    };

    return checkType;
}

propTypes.array = createPrimitiveTypeChecker("array");
propTypes.bool = createPrimitiveTypeChecker("boolean");
propTypes["boolean"] = propTypes.bool;
propTypes.func = createPrimitiveTypeChecker("function");
propTypes["function"] = propTypes.func;
propTypes.number = createPrimitiveTypeChecker("number");
propTypes.object = createPrimitiveTypeChecker("object");
propTypes.string = createPrimitiveTypeChecker("string");

propTypes.regexp = createTypeChecker(function validateRegExp(props, propName, callerName, locale) {
    var propValue = props[propName];

    if (isRegExp(propValue)) {
        return null;
    } else {
        return new TypeError(i18n(locale || defaultLocale, "prop_types.regexp", propName, propValue, callerName));
    }
});

propTypes.instanceOf = function createInstanceOfCheck(expectedClass) {
    return createTypeChecker(function validateInstanceOf(props, propName, callerName, locale) {
        var propValue = props[propName],
            expectedClassName;

        if (propValue instanceof expectedClass) {
            return null;
        } else {
            expectedClassName = expectedClass.name || ("<<" + i18n(locale || defaultLocale, "prop_types.anonymous") + ">>");

            return new TypeError(
                i18n(locale || defaultLocale, "prop_types.instance_of", propName, getPreciseType(propValue), callerName, expectedClassName)
            );
        }
    });
};

propTypes.any = createTypeChecker(emptyFunction.thatReturnsNull);

propTypes.oneOf = function createOneOfCheck(expectedValues) {
    return createTypeChecker(function validateOneOf(props, propName, callerName, locale) {
        var propValue = props[propName];

        if (indexOf(expectedValues, propValue) !== -1) {
            return null;
        } else {
            return new TypeError(
                i18n(locale || defaultLocale, "prop_types.one_of", propName, propValue, callerName, JSON.stringify(expectedValues))
            );
        }
    });
};

propTypes.arrayOf = function createArrayOfCheck(checkType) {

    if (!isFunction(checkType)) {
        throw new TypeError(
            "Invalid Function Interface for arrayOf, checkType must be a function" +
            "Function(props: Object, propName: String, callerName: String, locale) return Error or null."
        );
    }

    return createTypeChecker(function validateArrayOf(props, propName, callerName, locale) {
        var error = propTypes.array(props, propName, callerName, locale),
            propValue, i, il;

        if (error) {
            return error;
        } else {
            propValue = props[propName];
            i = -1;
            il = propValue.length - 1;

            while (i++ < il) {
                error = checkType(propValue, i, callerName + "[" + i + "]", locale);
                if (error) {
                    return error;
                }
            }

            return null;
        }
    });
};

propTypes.implement = function createImplementCheck(expectedInterface) {
    var key;

    for (key in expectedInterface) {
        if (has(expectedInterface, key) && !isFunction(expectedInterface[key])) {
            throw new TypeError(
                "Invalid Function Interface for " + key + ", must be functions " +
                "Function(props: Object, propName: String, callerName: String, locale) return Error or null."
            );
        }
    }

    return createTypeChecker(function validateImplement(props, propName, callerName, locale) {
        var results = null,
            localHas = has,
            propInterface = props[propName],
            propKey, propValidate, result;

        for (propKey in expectedInterface) {
            if (localHas(expectedInterface, propKey)) {
                propValidate = expectedInterface[propKey];
                result = propValidate(propInterface, propKey, callerName + "." + propKey, locale || defaultLocale);

                if (result) {
                    results = results || [];
                    results[results.length] = result;
                }
            }
        }

        return results;
    });
};

function createPrimitiveTypeChecker(expectedType) {
    return createTypeChecker(function validatePrimitive(props, propName, callerName, locale) {
        var propValue = props[propName],
            type = getPropType(propValue);

        if (type !== expectedType) {
            callerName = callerName || ("<<" + i18n(locale || defaultLocale, "prop_types.anonymous") + ">>");

            return new TypeError(
                i18n(locale || defaultLocale, "prop_types.primitive", propName, getPreciseType(propValue), callerName, expectedType)
            );
        } else {
            return null;
        }
    });
}

function getPropType(value) {
    var propType = typeof(value);

    if (isArray(value)) {
        return "array";
    } else if (value instanceof RegExp) {
        return "object";
    } else {
        return propType;
    }
}

function getPreciseType(propValue) {
    var propType = getPropType(propValue);

    if (propType === "object") {
        if (propValue instanceof Date) {
            return "date";
        } else if (propValue instanceof RegExp) {
            return "regexp";
        } else {
            return propType;
        }
    } else {
        return propType;
    }
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/virt-ui-circle_ripple/src/index.js */

var virt = require(1),
    css = require(192),
    propTypes = require(193);


var CircleRipplePrototype;


module.exports = CircleRipple;


function CircleRipple(props, children, context) {

    virt.Component.call(this, props, children, context);

    this.state = {
        fading: false
    };
}
virt.Component.extend(CircleRipple, "virt-ui-CircleRipple");

CircleRipple.propTypes = {
    color: propTypes.string,
    opacity: propTypes.number,
    onDone: propTypes.func.isRequired,
    size: propTypes.number.isRequired,
    top: propTypes.number.isRequired,
    left: propTypes.number.isRequired
};

CircleRipple.defaultProps = {
    color: "#000",
    opacity: 0.1
};

CircleRipplePrototype = CircleRipple.prototype;

CircleRipplePrototype.componentDidMount = function() {
    var _this = this;

    setTimeout(function fade() {
        _this.setState({
            fading: true
        });

        setTimeout(_this.props.onDone, 2000);
    });
};

CircleRipplePrototype.getStyle = function() {
    var props = this.props,
        style = {
            backgroundColor: props.color,
            display: "block",
            position: "absolute",
            top: props.top + "px",
            left: props.left + "px",
            width: props.size + "px",
            height: props.size + "px"
        };

    css.borderRadius(style, "50%");
    css.transition(style, "opacity 2s cubic-bezier(0.23, 1, 0.32, 1)", "transform 1s cubic-bezier(0.23, 1, 0.32, 1)");

    if (this.state.fading) {
        css.opacity(style, 0);
        css.transform(style, "scale(1)");
    } else {
        css.opacity(style, props.opacity);
        css.transform(style, "scale(0)");
    }

    return style;
};

CircleRipplePrototype.render = function() {
    var style = this.getStyle();

    return (
        virt.createView("div", {
            className: "virt-ui-CircleRipple",
            style: style
        })
    );
};


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/fast_slice/src/index.js */

var clamp = require(209),
    isNumber = require(21);


module.exports = fastSlice;


function fastSlice(array, offset) {
    var length = array.length,
        newLength, i, il, result, j;

    offset = clamp(isNumber(offset) ? offset : 0, 0, length);
    i = offset - 1;
    il = length - 1;
    newLength = length - offset;
    result = new Array(newLength);
    j = 0;

    while (i++ < il) {
        result[j++] = array[i];
    }

    return result;
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/css/src/prefix.js */

var prefixes = require(202),
    capitalizeString = require(103);


module.exports = prefix;


function prefix(styles, key, value, prefixValue, stopPrefix) {
    var i, il, pre;

    if (stopPrefix !== true) {
        prefixValue = prefixValue === true;
        i = -1;
        il = prefixes.length - 1;

        while (i++ < il) {
            pre = prefixes[i];
            styles[pre.js + capitalizeString(key)] = prefixValue ? pre.css + value : value;
        }
    }

    styles[key] = value;

    return styles;
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/css/src/properties.js */

module.exports = [
    "parentRule",
    "length",
    "cssText",
    "alignContent",
    "alignItems",
    "alignSelf",
    "alignmentBaseline",
    "all",
    "animation",
    "animationDelay",
    "animationDirection",
    "animationDuration",
    "animationFillMode",
    "animationIterationCount",
    "animationName",
    "animationPlayState",
    "animationTimingFunction",
    "backfaceVisibility",
    "background",
    "backgroundAttachment",
    "backgroundBlendMode",
    "backgroundClip",
    "backgroundColor",
    "backgroundImage",
    "backgroundOrigin",
    "backgroundPosition",
    "backgroundPositionX",
    "backgroundPositionY",
    "backgroundRepeat",
    "backgroundRepeatX",
    "backgroundRepeatY",
    "backgroundSize",
    "baselineShift",
    "border",
    "borderBottom",
    "borderBottomColor",
    "borderBottomLeftRadius",
    "borderBottomRightRadius",
    "borderBottomStyle",
    "borderBottomWidth",
    "borderCollapse",
    "borderColor",
    "borderImage",
    "borderImageOutset",
    "borderImageRepeat",
    "borderImageSlice",
    "borderImageSource",
    "borderImageWidth",
    "borderLeft",
    "borderLeftColor",
    "borderLeftStyle",
    "borderLeftWidth",
    "borderRadius",
    "borderRight",
    "borderRightColor",
    "borderRightStyle",
    "borderRightWidth",
    "borderSpacing",
    "borderStyle",
    "borderTop",
    "borderTopColor",
    "borderTopLeftRadius",
    "borderTopRightRadius",
    "borderTopStyle",
    "borderTopWidth",
    "borderWidth",
    "bottom",
    "boxShadow",
    "boxSizing",
    "bufferedRendering",
    "captionSide",
    "clear",
    "clip",
    "clipPath",
    "clipRule",
    "color",
    "colorInterpolation",
    "colorInterpolationFilters",
    "colorRendering",
    "content",
    "counterIncrement",
    "counterReset",
    "cursor",
    "cx",
    "cy",
    "direction",
    "display",
    "dominantBaseline",
    "emptyCells",
    "enableBackground",
    "fill",
    "fillOpacity",
    "fillRule",
    "filter",
    "flex",
    "flexBasis",
    "flexDirection",
    "flexFlow",
    "flexGrow",
    "flexShrink",
    "flexWrap",
    "float",
    "floodColor",
    "floodOpacity",
    "font",
    "fontFamily",
    "fontKerning",
    "fontSize",
    "fontStretch",
    "fontStyle",
    "fontVariant",
    "fontVariantLigatures",
    "fontWeight",
    "glyphOrientationHorizontal",
    "glyphOrientationVertical",
    "height",
    "imageRendering",
    "isolation",
    "justifyContent",
    "left",
    "letterSpacing",
    "lightingColor",
    "lineHeight",
    "listStyle",
    "listStyleImage",
    "listStylePosition",
    "listStyleType",
    "margin",
    "marginBottom",
    "marginLeft",
    "marginRight",
    "marginTop",
    "marker",
    "markerEnd",
    "markerMid",
    "markerStart",
    "mask",
    "maskType",
    "maxHeight",
    "maxWidth",
    "maxZoom",
    "minHeight",
    "minWidth",
    "minZoom",
    "mixBlendMode",
    "objectFit",
    "objectPosition",
    "opacity",
    "order",
    "orientation",
    "orphans",
    "outline",
    "outlineColor",
    "outlineOffset",
    "outlineStyle",
    "outlineWidth",
    "overflow",
    "overflowWrap",
    "overflowX",
    "overflowY",
    "padding",
    "paddingBottom",
    "paddingLeft",
    "paddingRight",
    "paddingTop",
    "page",
    "pageBreakAfter",
    "pageBreakBefore",
    "pageBreakInside",
    "paintOrder",
    "perspective",
    "perspectiveOrigin",
    "pointerEvents",
    "position",
    "quotes",
    "r",
    "resize",
    "right",
    "rx",
    "ry",
    "shapeImageThreshold",
    "shapeMargin",
    "shapeOutside",
    "shapeRendering",
    "size",
    "speak",
    "src",
    "stopColor",
    "stopOpacity",
    "stroke",
    "strokeDasharray",
    "strokeDashoffset",
    "strokeLinecap",
    "strokeLinejoin",
    "strokeMiterlimit",
    "strokeOpacity",
    "strokeWidth",
    "tabSize",
    "tableLayout",
    "textAlign",
    "textAnchor",
    "textDecoration",
    "textIndent",
    "textOverflow",
    "textRendering",
    "textShadow",
    "textTransform",
    "top",
    "touchAction",
    "transform",
    "transformOrigin",
    "transformStyle",
    "transition",
    "transitionDelay",
    "transitionDuration",
    "transitionProperty",
    "transitionTimingFunction",
    "unicodeBidi",
    "unicodeRange",
    "userZoom",
    "userSelect",
    "vectorEffect",
    "verticalAlign",
    "visibility",
    "whiteSpace",
    "widows",
    "width",
    "willChange",
    "wordBreak",
    "wordSpacing",
    "wordWrap",
    "writingMode",
    "x",
    "y",
    "zIndex",
    "zoom"
];


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/css/src/transition.js */

var prefixes = require(202),
    prefixArray = require(213);


module.exports = transition;


var css = require(192);


function transition(styles, transitions) {
    var i, il, prefix;

    if (css.stopPrefix !== true) {
        i = -1;
        il = prefixes.length - 1;

        while (i++ < il) {
            prefix = prefixes[i];
            styles[prefix.js + "Transition"] = prefixArray(prefix.css, transitions).join(", ");
        }
    }

    styles.transition = transitions.join(", ");

    return styles;
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/css/src/textShadow.js */

var prefixes = require(202);


module.exports = textShadow;


var css = require(192);


function textShadow(styles, textShadows) {
    var i, il, prefix;

    if (css.stopPrefix !== true) {
        i = -1;
        il = prefixes.length - 1;

        while (i++ < il) {
            prefix = prefixes[i];
            styles[prefix.js + "TextShadow"] = textShadows.join(", ");
        }
    }

    styles.textShadow = textShadows.join(", ");

    return styles;
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/css/src/nonPrefixProperties.js */

module.exports = [
    "parentRule",
    "length",
    "cssText",
    "backfaceVisibility",
    "background",
    "backgroundAttachment",
    "backgroundBlendMode",
    "backgroundClip",
    "backgroundColor",
    "backgroundImage",
    "backgroundOrigin",
    "backgroundPosition",
    "backgroundPositionX",
    "backgroundPositionY",
    "backgroundRepeat",
    "backgroundRepeatX",
    "backgroundRepeatY",
    "baselineShift",
    "border",
    "borderBottom",
    "borderBottomColor",
    "borderBottomStyle",
    "borderBottomWidth",
    "borderCollapse",
    "borderColor",
    "borderImage",
    "borderImageOutset",
    "borderImageRepeat",
    "borderImageSlice",
    "borderImageSource",
    "borderImageWidth",
    "borderLeft",
    "borderLeftColor",
    "borderLeftStyle",
    "borderLeftWidth",
    "borderRight",
    "borderRightColor",
    "borderRightStyle",
    "borderRightWidth",
    "borderSpacing",
    "borderStyle",
    "borderTop",
    "borderTopColor",
    "borderTopStyle",
    "borderTopWidth",
    "borderWidth",
    "bottom",
    "bufferedRendering",
    "captionSide",
    "clear",
    "clip",
    "clipPath",
    "clipRule",
    "color",
    "colorInterpolation",
    "colorInterpolationFilters",
    "colorRendering",
    "content",
    "counterIncrement",
    "counterReset",
    "cursor",
    "cx",
    "cy",
    "direction",
    "display",
    "dominantBaseline",
    "emptyCells",
    "enableBackground",
    "fill",
    "fillOpacity",
    "fillRule",
    "filter",
    "float",
    "floodColor",
    "floodOpacity",
    "font",
    "fontFamily",
    "fontKerning",
    "fontSize",
    "fontStretch",
    "fontStyle",
    "fontVariant",
    "fontVariantLigatures",
    "fontWeight",
    "glyphOrientationHorizontal",
    "glyphOrientationVertical",
    "height",
    "imageRendering",
    "isolation",
    "justifyContent",
    "left",
    "letterSpacing",
    "lightingColor",
    "lineHeight",
    "listStyle",
    "listStyleImage",
    "listStylePosition",
    "listStyleType",
    "margin",
    "marginBottom",
    "marginLeft",
    "marginRight",
    "marginTop",
    "marker",
    "markerEnd",
    "markerMid",
    "markerStart",
    "mask",
    "maskType",
    "maxHeight",
    "maxWidth",
    "maxZoom",
    "minHeight",
    "minWidth",
    "minZoom",
    "mixBlendMode",
    "objectFit",
    "objectPosition",
    "opacity",
    "order",
    "orientation",
    "orphans",
    "outline",
    "outlineColor",
    "outlineOffset",
    "outlineStyle",
    "outlineWidth",
    "overflow",
    "overflowWrap",
    "overflowX",
    "overflowY",
    "padding",
    "paddingBottom",
    "paddingLeft",
    "paddingRight",
    "paddingTop",
    "page",
    "pageBreakAfter",
    "pageBreakBefore",
    "pageBreakInside",
    "paintOrder",
    "perspective",
    "perspectiveOrigin",
    "pointerEvents",
    "position",
    "quotes",
    "r",
    "resize",
    "right",
    "rx",
    "ry",
    "shapeImageThreshold",
    "shapeMargin",
    "shapeOutside",
    "shapeRendering",
    "size",
    "speak",
    "src",
    "stopColor",
    "stopOpacity",
    "stroke",
    "strokeDasharray",
    "strokeDashoffset",
    "strokeLinecap",
    "strokeLinejoin",
    "strokeMiterlimit",
    "strokeOpacity",
    "strokeWidth",
    "tabSize",
    "tableLayout",
    "textAlign",
    "textAnchor",
    "textDecoration",
    "textIndent",
    "textOverflow",
    "textRendering",
    "textShadow",
    "textTransform",
    "top",
    "touchAction",
    "unicodeBidi",
    "unicodeRange",
    "userZoom",
    "vectorEffect",
    "verticalAlign",
    "visibility",
    "whiteSpace",
    "widows",
    "width",
    "willChange",
    "wordBreak",
    "wordSpacing",
    "wordWrap",
    "writingMode",
    "x",
    "y",
    "zIndex",
    "zoom"
];


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/css/src/opacity.js */

var prefix = require(196);


module.exports = opacity;


var css = require(192);


function opacity(styles, value) {
    styles["-ms-filter"] = "progid:DXImageTransform.Microsoft.Alpha(opacity=" + value + ")";
    styles.filter = "alpha(opacity=" + value + ")";
    return prefix(styles, "opacity", value, null, css.stopPrefix);
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/css/src/prefixes/index.js */

var environment = require(99);


if (environment.browser) {
    module.exports = require(210);
} else {
    module.exports = require(211);
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/css/src/easing.js */

var easing = exports;


easing.linear = "linear";

easing.inSine = "cubic-bezier(0.47, 0, 0.745, 0.715)";
easing.outSine = "cubic-bezier(0.39, 0.575, 0.565, 1)";
easing.inOutSine = "cubic-bezier(0.445, 0.05, 0.55, 0.95)";

easing.inQuad = "cubic-bezier(0.55, 0.085, 0.68, 0.53)";
easing.outQuad = "cubic-bezier(0.25, 0.46, 0.45, 0.94)";
easing.inOutQuad = "cubic-bezier(0.455, 0.03, 0.515, 0.955)";

easing.inCubic = "cubic-bezier(0.55, 0.055, 0.675, 0.19)";
easing.outCubic = "cubic-bezier(0.215, 0.61, 0.355, 1)";
easing.inOutCubic = "cubic-bezier(0.645, 0.045, 0.355, 1)";

easing.inQuart = "cubic-bezier(0.895, 0.03, 0.685, 0.22)";
easing.outQuart = "cubic-bezier(0.165, 0.84, 0.44, 1)";
easing.inOutQuart = "cubic-bezier(0.77, 0, 0.175, 1)";

easing.inQuint = "cubic-bezier(0.755, 0.05, 0.855, 0.06)";
easing.outQuint = "cubic-bezier(0.23, 1, 0.32, 1)";
easing.inOutQuint = "cubic-bezier(0.86, 0, 0.07, 1)";

easing.inExpo = "cubic-bezier(0.95, 0.05, 0.795, 0.035)";
easing.outExpo = "cubic-bezier(0.19, 1, 0.22, 1)";
easing.inOutExpo = "cubic-bezier(1, 0, 0, 1)";

easing.inCirc = "cubic-bezier(0.6, 0.04, 0.98, 0.335)";
easing.outCirc = "cubic-bezier(0.075, 0.82, 0.165, 1)";
easing.inOutCirc = "cubic-bezier(0.785, 0.135, 0.15, 0.86)";

easing.inBack = "cubic-bezier(0.6, -0.28, 0.735, 0.045)";
easing.outBack = "cubic-bezier(0.175, 0.885, 0.32, 1.275)";
easing.inOutBack = "cubic-bezier(0.68, -0.55, 0.265, 1.55)";

easing["in"] = "cubic-bezier(0.755, 0.05, 0.855, 0.06)";
easing.out = "cubic-bezier(0.23, 1, 0.32, 1)";
easing.inOut = "cubic-bezier(0.445, 0.05, 0.55, 0.95)";


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/css/src/colors.js */

module.exports = {
    red50: "#ffebee",
    red100: "#ffcdd2",
    red200: "#ef9a9a",
    red300: "#e57373",
    red400: "#ef5350",
    red500: "#f44336",
    red600: "#e53935",
    red700: "#d32f2f",
    red800: "#c62828",
    red900: "#b71c1c",
    redA100: "#ff8a80",
    redA200: "#ff5252",
    redA400: "#ff1744",
    redA700: "#d50000",

    pink50: "#fce4ec",
    pink100: "#f8bbd0",
    pink200: "#f48fb1",
    pink300: "#f06292",
    pink400: "#ec407a",
    pink500: "#e91e63",
    pink600: "#d81b60",
    pink700: "#c2185b",
    pink800: "#ad1457",
    pink900: "#880e4f",
    pinkA100: "#ff80ab",
    pinkA200: "#ff4081",
    pinkA400: "#f50057",
    pinkA700: "#c51162",

    purple50: "#f3e5f5",
    purple100: "#e1bee7",
    purple200: "#ce93d8",
    purple300: "#ba68c8",
    purple400: "#ab47bc",
    purple500: "#9c27b0",
    purple600: "#8e24aa",
    purple700: "#7b1fa2",
    purple800: "#6a1b9a",
    purple900: "#4a148c",
    purpleA100: "#ea80fc",
    purpleA200: "#e040fb",
    purpleA400: "#d500f9",
    purpleA700: "#aa00ff",

    deepPurple50: "#ede7f6",
    deepPurple100: "#d1c4e9",
    deepPurple200: "#b39ddb",
    deepPurple300: "#9575cd",
    deepPurple400: "#7e57c2",
    deepPurple500: "#673ab7",
    deepPurple600: "#5e35b1",
    deepPurple700: "#512da8",
    deepPurple800: "#4527a0",
    deepPurple900: "#311b92",
    deepPurpleA100: "#b388ff",
    deepPurpleA200: "#7c4dff",
    deepPurpleA400: "#651fff",
    deepPurpleA700: "#6200ea",

    indigo50: "#e8eaf6",
    indigo100: "#c5cae9",
    indigo200: "#9fa8da",
    indigo300: "#7986cb",
    indigo400: "#5c6bc0",
    indigo500: "#3f51b5",
    indigo600: "#3949ab",
    indigo700: "#303f9f",
    indigo800: "#283593",
    indigo900: "#1a237e",
    indigoA100: "#8c9eff",
    indigoA200: "#536dfe",
    indigoA400: "#3d5afe",
    indigoA700: "#304ffe",

    blue50: "#e3f2fd",
    blue100: "#bbdefb",
    blue200: "#90caf9",
    blue300: "#64b5f6",
    blue400: "#42a5f5",
    blue500: "#2196f3",
    blue600: "#1e88e5",
    blue700: "#1976d2",
    blue800: "#1565c0",
    blue900: "#0d47a1",
    blueA100: "#82b1ff",
    blueA200: "#448aff",
    blueA400: "#2979ff",
    blueA700: "#2962ff",

    lightBlue50: "#e1f5fe",
    lightBlue100: "#b3e5fc",
    lightBlue200: "#81d4fa",
    lightBlue300: "#4fc3f7",
    lightBlue400: "#29b6f6",
    lightBlue500: "#03a9f4",
    lightBlue600: "#039be5",
    lightBlue700: "#0288d1",
    lightBlue800: "#0277bd",
    lightBlue900: "#01579b",
    lightBlueA100: "#80d8ff",
    lightBlueA200: "#40c4ff",
    lightBlueA400: "#00b0ff",
    lightBlueA700: "#0091ea",

    cyan50: "#e0f7fa",
    cyan100: "#b2ebf2",
    cyan200: "#80deea",
    cyan300: "#4dd0e1",
    cyan400: "#26c6da",
    cyan500: "#00bcd4",
    cyan600: "#00acc1",
    cyan700: "#0097a7",
    cyan800: "#00838f",
    cyan900: "#006064",
    cyanA100: "#84ffff",
    cyanA200: "#18ffff",
    cyanA400: "#00e5ff",
    cyanA700: "#00b8d4",

    teal50: "#e0f2f1",
    teal100: "#b2dfdb",
    teal200: "#80cbc4",
    teal300: "#4db6ac",
    teal400: "#26a69a",
    teal500: "#009688",
    teal600: "#00897b",
    teal700: "#00796b",
    teal800: "#00695c",
    teal900: "#004d40",
    tealA100: "#a7ffeb",
    tealA200: "#64ffda",
    tealA400: "#1de9b6",
    tealA700: "#00bfa5",

    green50: "#e8f5e9",
    green100: "#c8e6c9",
    green200: "#a5d6a7",
    green300: "#81c784",
    green400: "#66bb6a",
    green500: "#4caf50",
    green600: "#43a047",
    green700: "#388e3c",
    green800: "#2e7d32",
    green900: "#1b5e20",
    greenA100: "#b9f6ca",
    greenA200: "#69f0ae",
    greenA400: "#00e676",
    greenA700: "#00c853",

    lightGreen50: "#f1f8e9",
    lightGreen100: "#dcedc8",
    lightGreen200: "#c5e1a5",
    lightGreen300: "#aed581",
    lightGreen400: "#9ccc65",
    lightGreen500: "#8bc34a",
    lightGreen600: "#7cb342",
    lightGreen700: "#689f38",
    lightGreen800: "#558b2f",
    lightGreen900: "#33691e",
    lightGreenA100: "#ccff90",
    lightGreenA200: "#b2ff59",
    lightGreenA400: "#76ff03",
    lightGreenA700: "#64dd17",

    lime50: "#f9fbe7",
    lime100: "#f0f4c3",
    lime200: "#e6ee9c",
    lime300: "#dce775",
    lime400: "#d4e157",
    lime500: "#cddc39",
    lime600: "#c0ca33",
    lime700: "#afb42b",
    lime800: "#9e9d24",
    lime900: "#827717",
    limeA100: "#f4ff81",
    limeA200: "#eeff41",
    limeA400: "#c6ff00",
    limeA700: "#aeea00",

    yellow50: "#fffde7",
    yellow100: "#fff9c4",
    yellow200: "#fff59d",
    yellow300: "#fff176",
    yellow400: "#ffee58",
    yellow500: "#ffeb3b",
    yellow600: "#fdd835",
    yellow700: "#fbc02d",
    yellow800: "#f9a825",
    yellow900: "#f57f17",
    yellowA100: "#ffff8d",
    yellowA200: "#ffff00",
    yellowA400: "#ffea00",
    yellowA700: "#ffd600",

    amber50: "#fff8e1",
    amber100: "#ffecb3",
    amber200: "#ffe082",
    amber300: "#ffd54f",
    amber400: "#ffca28",
    amber500: "#ffc107",
    amber600: "#ffb300",
    amber700: "#ffa000",
    amber800: "#ff8f00",
    amber900: "#ff6f00",
    amberA100: "#ffe57f",
    amberA200: "#ffd740",
    amberA400: "#ffc400",
    amberA700: "#ffab00",

    orange50: "#fff3e0",
    orange100: "#ffe0b2",
    orange200: "#ffcc80",
    orange300: "#ffb74d",
    orange400: "#ffa726",
    orange500: "#ff9800",
    orange600: "#fb8c00",
    orange700: "#f57c00",
    orange800: "#ef6c00",
    orange900: "#e65100",
    orangeA100: "#ffd180",
    orangeA200: "#ffab40",
    orangeA400: "#ff9100",
    orangeA700: "#ff6d00",

    deepOrange50: "#fbe9e7",
    deepOrange100: "#ffccbc",
    deepOrange200: "#ffab91",
    deepOrange300: "#ff8a65",
    deepOrange400: "#ff7043",
    deepOrange500: "#ff5722",
    deepOrange600: "#f4511e",
    deepOrange700: "#e64a19",
    deepOrange800: "#d84315",
    deepOrange900: "#bf360c",
    deepOrangeA100: "#ff9e80",
    deepOrangeA200: "#ff6e40",
    deepOrangeA400: "#ff3d00",
    deepOrangeA700: "#dd2c00",

    brown50: "#efebe9",
    brown100: "#d7ccc8",
    brown200: "#bcaaa4",
    brown300: "#a1887f",
    brown400: "#8d6e63",
    brown500: "#795548",
    brown600: "#6d4c41",
    brown700: "#5d4037",
    brown800: "#4e342e",
    brown900: "#3e2723",

    blueGrey50: "#eceff1",
    blueGrey100: "#cfd8dc",
    blueGrey200: "#b0bec5",
    blueGrey300: "#90a4ae",
    blueGrey400: "#78909c",
    blueGrey500: "#607d8b",
    blueGrey600: "#546e7a",
    blueGrey700: "#455a64",
    blueGrey800: "#37474f",
    blueGrey900: "#263238",

    grey50: "#fafafa",
    grey100: "#f5f5f5",
    grey200: "#eeeeee",
    grey300: "#e0e0e0",
    grey400: "#bdbdbd",
    grey500: "#9e9e9e",
    grey600: "#757575",
    grey700: "#616161",
    grey800: "#424242",
    grey900: "#212121",

    black: "#000000",
    white: "#ffffff",

    transparent: "rgba(0, 0, 0, 0)",
    fullBlack: "rgba(0, 0, 0, 1)",
    darkBlack: "rgba(0, 0, 0, 0.87)",
    lightBlack: "rgba(0, 0, 0, 0.54)",
    minBlack: "rgba(0, 0, 0, 0.26)",
    faintBlack: "rgba(0, 0, 0, 0.12)",
    fullWhite: "rgba(255, 255, 255, 1)",
    darkWhite: "rgba(255, 255, 255, 0.87)",
    lightWhite: "rgba(255, 255, 255, 0.54)"

};


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/css/src/Styles.js */

var arrayForEach = require(120),
    indexOf = require(54),
    capitalizeString = require(103),
    transition = require(198),
    textShadow = require(199),
    properties = require(197),
    nonPrefixProperties = require(200),
    prefix = require(196);


var Array_slice = Array.prototype.slice,
    StylesPrototype;


module.exports = Styles;


var css = require(192);


function Styles() {}
StylesPrototype = Styles.prototype;

arrayForEach(properties, function(key) {
    if (indexOf(nonPrefixProperties, key) === -1) {
        StylesPrototype["set" + capitalizeString(key)] = function(value) {
            return prefix(this, key, value, null, css.stopPrefix);
        };
    } else {
        StylesPrototype["set" + capitalizeString(key)] = function(value) {
            this[key] = value;
            return this;
        };
    }
});

StylesPrototype.setTransition = function() {
    return transition(this, Array_slice.call(arguments));
};

StylesPrototype.setTextShadow = function() {
    return textShadow(this, Array_slice.call(arguments));
};


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/css/src/manipulators/darken.js */

var color = require(214),
    toStyle = require(215);


var darken_color = color.create();


module.exports = darken;


function darken(style, amount) {
    var value = darken_color,
        alpha;
    color.fromStyle(value, style);
    alpha = value[3];
    color.smul(value, value, 1 - amount);
    color.cnormalize(value, value);
    value[3] = alpha;
    return toStyle(value);
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/css/src/manipulators/fade.js */

var color = require(214),
    toStyle = require(215);


var fade_color = color.create();


module.exports = fade;


function fade(style, amount) {
    var value = fade_color;
    color.fromStyle(value, style);
    value[3] *= amount;
    return toStyle(value);
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/css/src/manipulators/lighten.js */

var color = require(214),
    toStyle = require(215);


var lighten_color = color.create();


module.exports = lighten;


function lighten(style, amount) {
    var value = lighten_color,
        alpha;
    color.fromStyle(value, style);
    alpha = value[3];
    color.smul(value, value, 1 + amount);
    color.cnormalize(value, value);
    value[3] = alpha;
    return toStyle(value);
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/clamp/src/index.js */

module.exports = clamp;


function clamp(x, min, max) {
    if (x < min) {
        return min;
    } else if (x > max) {
        return max;
    } else {
        return x;
    }
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/css/src/prefixes/browser.js */

var environment = require(99),
    getCurrentStyle = require(96),
    Prefix = require(212);


var document = environment.document,

    styles = getCurrentStyle(document.documentElement || document.body.parentNode),

    pre = (
        Array.prototype.slice.call(styles).join("").match(/-(moz|webkit|ms)-/) ||
        (styles.OLink === "" && ["", "0"])
    )[1],

    dom = ("WebKit|Moz|MS|O").match(new RegExp("(" + pre + ")", "i"))[1];


module.exports = [new Prefix(dom, pre)];


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/css/src/prefixes/node.js */

var Prefix = require(212);


module.exports = [
    new Prefix("WebKit", "webkit"),
    new Prefix("Moz", "moz"),
    new Prefix("MS", "ms"),
    new Prefix("O", "o")
];


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/css/src/prefixes/Prefix.js */

var capitalizeString = require(103);


module.exports = Prefix;


function Prefix(dom, pre) {
    this.dom = dom;
    this.lowercase = pre;
    this.css = "-" + pre + "-";
    this.js = capitalizeString(pre);
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/css/src/prefixArray.js */

module.exports = prefixArray;


function prefixArray(prefix, array) {
    var length = array.length,
        i = -1,
        il = length - 1,
        out = new Array(length);

    while (i++ < il) {
        out[i] = prefix + array[i];
    }

    return out;
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/color/src/index.js */

var mathf = require(216),
    vec3 = require(217),
    vec4 = require(218),
    isNumber = require(21),
    isString = require(18),
    colorNames = require(219);


var color = exports;


color.ArrayType = typeof(Float32Array) !== "undefined" ? Float32Array : mathf.ArrayType;


color.create = function(r, g, b, a) {
    var out = new color.ArrayType(4);

    out[0] = isNumber(r) ? r : 0;
    out[1] = isNumber(g) ? g : 0;
    out[2] = isNumber(b) ? b : 0;
    out[3] = isNumber(a) ? a : 1;

    return out;
};

color.copy = vec4.copy;

color.clone = function(a) {
    var out = new color.ArrayType(4);

    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];

    return out;
};

color.setRGB = vec3.set;
color.setRGBA = vec4.set;

color.add = vec4.add;
color.sub = vec4.sub;

color.mul = vec4.mul;
color.div = vec4.div;

color.sadd = vec4.sadd;
color.ssub = vec4.ssub;

color.smul = vec4.smul;
color.sdiv = vec4.sdiv;

color.lengthSqValues = vec4.lengthSqValues;
color.lengthValues = vec4.lengthValues;
color.invLengthValues = vec4.invLengthValues;

color.dot = vec4.dot;

color.lengthSq = vec4.lengthSq;

color.length = vec4.length;

color.invLength = vec4.invLength;

color.setLength = vec4.setLength;

color.normalize = vec4.normalize;

color.lerp = vec4.lerp;

color.min = vec4.min;

color.max = vec4.max;

color.clamp = vec4.clamp;

color.equal = vec4.equal;

color.notEqual = vec4.notEqual;


var cmin = color.create(0, 0, 0, 0),
    cmax = color.create(1, 1, 1, 1);

color.cnormalize = function(out, a) {
    return color.clamp(out, a, cmin, cmax);
};

color.str = function(out) {
    return "Color(" + out[0] + ", " + out[1] + ", " + out[2] + ", " + out[3] + ")";
};

color.string = color.toString = color.str;

color.set = function(out, r, g, b, a) {
    if (isNumber(r)) {
        out[0] = isNumber(r) ? r : 0;
        out[1] = isNumber(g) ? g : 0;
        out[2] = isNumber(b) ? b : 0;
        out[3] = isNumber(a) ? a : 1;
    } else if (isString(r)) {
        color.fromStyle(out, r);
    } else if (r && r.length === +r.length) {
        out[0] = r[0] || 0;
        out[1] = r[1] || 0;
        out[2] = r[2] || 0;
        out[3] = r[3] || 1;
    }

    return out;
};

function to256(value) {
    return (value * 255) | 0;
}

color.toRGB = function(out, alpha) {
    if (isNumber(alpha)) {
        return "rgba(" + to256(out[0]) + "," + to256(out[1]) + "," + to256(out[2]) + "," + (mathf.clamp01(alpha) || 0) + ")";
    } else {
        return "rgb(" + to256(out[0]) + "," + to256(out[1]) + "," + to256(out[2]) + ")";
    }
};

color.toRGBA = function(out) {
    return "rgba(" + to256(out[0]) + "," + to256(out[1]) + "," + to256(out[2]) + "," + (mathf.clamp01(out[3]) || 0) + ")";
};

function toHEX(value) {
    value = mathf.clamp(value * 255, 0, 255) | 0;

    if (value < 16) {
        return "0" + value.toString(16);
    } else if (value < 255) {
        return value.toString(16);
    } else {
        return "ff";
    }
}

color.toHEX = function(out) {
    return "#" + toHEX(out[0]) + toHEX(out[1]) + toHEX(out[2]);
};

var rgb255 = /^rgb\((\d+),(?:\s+)?(\d+),(?:\s+)?(\d+)\)$/i,
    inv255 = 1 / 255;

color.fromRGB = function(out, style) {
    var values = rgb255.exec(style);
    out[0] = mathf.min(255, Number(values[1])) * inv255;
    out[1] = mathf.min(255, Number(values[2])) * inv255;
    out[2] = mathf.min(255, Number(values[3])) * inv255;
    out[3] = 1;
    return out;
};

var rgba255 = /^rgba\((\d+),(?:\s+)?(\d+),(?:\s+)?(\d+),(?:\s+)?((?:\.)?\d+(?:\.\d+)?)\)$/i;

color.fromRGBA = function(out, style) {
    var values = rgba255.exec(style);
    out[0] = mathf.min(255, Number(values[1])) * inv255;
    out[1] = mathf.min(255, Number(values[2])) * inv255;
    out[2] = mathf.min(255, Number(values[3])) * inv255;
    out[3] = mathf.min(1, Number(values[4]));
    return out;
};

var rgb100 = /^rgb\((\d+)\%,(?:\s+)?(\d+)\%,(?:\s+)?(\d+)\%\)$/i,
    inv100 = 1 / 100;

color.fromRGB100 = function(out, style) {
    var values = rgb100.exec(style);
    out[0] = mathf.min(100, Number(values[1])) * inv100;
    out[1] = mathf.min(100, Number(values[2])) * inv100;
    out[2] = mathf.min(100, Number(values[3])) * inv100;
    out[3] = 1;
    return out;
};

color.fromHEX = function(out, style) {
    out[0] = parseInt(style.substr(1, 2), 16) * inv255;
    out[1] = parseInt(style.substr(3, 2), 16) * inv255;
    out[2] = parseInt(style.substr(5, 2), 16) * inv255;
    out[3] = 1;
    return out;
};

var hex3to6 = /#(.)(.)(.)/,
    hex3to6String = "#$1$1$2$2$3$3";

color.fromHEX3 = function(out, style) {
    style = style.replace(hex3to6, hex3to6String);
    out[0] = parseInt(style.substr(1, 2), 16) * inv255;
    out[1] = parseInt(style.substr(3, 2), 16) * inv255;
    out[2] = parseInt(style.substr(5, 2), 16) * inv255;
    out[3] = 1;
    return out;
};

color.fromColorName = function(out, style) {
    return color.fromHEX(out, colorNames[style.toLowerCase()]);
};

var hex6 = /^\#([0.0-9a-f]{6})$/i,
    hex3 = /^\#([0.0-9a-f])([0.0-9a-f])([0.0-9a-f])$/i,
    colorName = /^(\w+)$/i;

color.fromStyle = function(out, style) {
    if (rgb255.test(style)) {
        return color.fromRGB(out, style);
    } else if (rgba255.test(style)) {
        return color.fromRGBA(out, style);
    } else if (rgb100.test(style)) {
        return color.fromRGB100(out, style);
    } else if (hex6.test(style)) {
        return color.fromHEX(out, style);
    } else if (hex3.test(style)) {
        return color.fromHEX3(out, style);
    } else if (colorName.test(style)) {
        return color.fromColorName(out, style);
    } else {
        return out;
    }
};

color.colorNames = colorNames;


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/css/src/manipulators/toStyle.js */

var color = require(214);


module.exports = toStyle;


function toStyle(value) {
    if (value[3] === 1) {
        return color.toHEX(value);
    } else {
        return color.toRGBA(value);
    }
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/mathf/src/index.js */

var keys = require(34),
    clamp = require(209),
    isNaNPolyfill = require(220);


var mathf = exports,

    NativeMath = global.Math,

    hasFloat32Array = typeof(Float32Array) !== "undefined",
    NativeFloat32Array = hasFloat32Array ? Float32Array : Array;


mathf.ArrayType = NativeFloat32Array;

mathf.PI = NativeMath.PI;
mathf.TAU = mathf.PI * 2;
mathf.TWO_PI = mathf.TAU;
mathf.HALF_PI = mathf.PI * 0.5;
mathf.FOURTH_PI = mathf.PI * 0.25;

mathf.EPSILON = Number.EPSILON || NativeMath.pow(2, -52);

mathf.TO_RADS = mathf.PI / 180;
mathf.TO_DEGS = 180 / mathf.PI;

mathf.E = NativeMath.E;
mathf.LN2 = NativeMath.LN2;
mathf.LN10 = NativeMath.LN10;
mathf.LOG2E = NativeMath.LOG2E;
mathf.LOG10E = NativeMath.LOG10E;
mathf.SQRT1_2 = NativeMath.SQRT1_2;
mathf.SQRT2 = NativeMath.SQRT2;

mathf.abs = NativeMath.abs;

mathf.acos = NativeMath.acos;
mathf.acosh = NativeMath.acosh || function acosh(x) {
    return mathf.log(x + mathf.sqrt(x * x - 1));
};
mathf.asin = NativeMath.asin;
mathf.asinh = NativeMath.asinh || function asinh(x) {
    if (x === -Infinity) {
        return x;
    } else {
        return mathf.log(x + mathf.sqrt(x * x + 1));
    }
};
mathf.atan = NativeMath.atan;
mathf.atan2 = NativeMath.atan2;
mathf.atanh = NativeMath.atanh || function atanh(x) {
    return mathf.log((1 + x) / (1 - x)) / 2;
};

mathf.cbrt = NativeMath.cbrt || function cbrt(x) {
    var y = mathf.pow(mathf.abs(x), 1 / 3);
    return x < 0 ? -y : y;
};

mathf.ceil = NativeMath.ceil;

mathf.clz32 = NativeMath.clz32 || function clz32(value) {
    value = +value >>> 0;
    return value ? 32 - value.toString(2).length : 32;
};

mathf.cos = NativeMath.cos;
mathf.cosh = NativeMath.cosh || function cosh(x) {
    return (mathf.exp(x) + mathf.exp(-x)) / 2;
};

mathf.exp = NativeMath.exp;

mathf.expm1 = NativeMath.expm1 || function expm1(x) {
    return mathf.exp(x) - 1;
};

mathf.floor = NativeMath.floor;
mathf.fround = NativeMath.fround || (hasFloat32Array ?
    function fround(x) {
        return new NativeFloat32Array([x])[0];
    } :
    function fround(x) {
        return x;
    }
);

mathf.hypot = NativeMath.hypot || function hypot() {
    var y = 0,
        i = -1,
        il = arguments.length - 1,
        value;

    while (i++ < il) {
        value = arguments[i];

        if (value === Infinity || value === -Infinity) {
            return Infinity;
        } else {
            y += value * value;
        }
    }

    return mathf.sqrt(y);
};

mathf.imul = NativeMath.imul || function imul(a, b) {
    var ah = (a >>> 16) & 0xffff,
        al = a & 0xffff,
        bh = (b >>> 16) & 0xffff,
        bl = b & 0xffff;

    return ((al * bl) + (((ah * bl + al * bh) << 16) >>> 0) | 0);
};

mathf.log = NativeMath.log;

mathf.log1p = NativeMath.log1p || function log1p(x) {
    return mathf.log(1 + x);
};

mathf.log10 = NativeMath.log10 || function log10(x) {
    return mathf.log(x) / mathf.LN10;
};

mathf.log2 = NativeMath.log2 || function log2(x) {
    return mathf.log(x) / mathf.LN2;
};

mathf.max = NativeMath.max;
mathf.min = NativeMath.min;

mathf.pow = NativeMath.pow;

mathf.random = NativeMath.random;
mathf.round = NativeMath.round;

mathf.sign = NativeMath.sign || function sign(x) {
    x = +x;
    if (x === 0 || isNaNPolyfill(x)) {
        return x;
    } else {
        return x > 0 ? 1 : -1;
    }
};

mathf.sin = NativeMath.sin;
mathf.sinh = NativeMath.sinh || function sinh(x) {
    return (mathf.exp(x) - mathf.exp(-x)) / 2;
};

mathf.sqrt = NativeMath.sqrt;

mathf.tan = NativeMath.tan;
mathf.tanh = NativeMath.tanh || function tanh(x) {
    if (x === Infinity) {
        return 1;
    } else if (x === -Infinity) {
        return -1;
    } else {
        return (mathf.exp(x) - mathf.exp(-x)) / (mathf.exp(x) + mathf.exp(-x));
    }
};

mathf.trunc = NativeMath.trunc || function trunc(x) {
    return x < 0 ? mathf.ceil(x) : mathf.floor(x);
};

mathf.equals = function(a, b, e) {
    return mathf.abs(a - b) < (e !== void(0) ? e : mathf.EPSILON);
};

mathf.modulo = function(a, b) {
    var r = a % b;
    return (r * b < 0) ? r + b : r;
};

mathf.standardRadian = function(x) {
    return mathf.modulo(x, mathf.TWO_PI);
};

mathf.standardAngle = function(x) {
    return mathf.modulo(x, 360);
};

mathf.snap = function(x, y) {
    var m = x % y;
    return m < (y * 0.5) ? x - m : x + y - m;
};

mathf.clamp = clamp;

mathf.clampBottom = function(x, min) {
    return x < min ? min : x;
};

mathf.clampTop = function(x, max) {
    return x > max ? max : x;
};

mathf.clamp01 = function(x) {
    if (x < 0) {
        return 0;
    } else if (x > 1) {
        return 1;
    } else {
        return x;
    }
};

mathf.truncate = function(x, n) {
    var p = mathf.pow(10, n),
        num = x * p;

    return (num < 0 ? mathf.ceil(num) : mathf.floor(num)) / p;
};

mathf.lerp = function(a, b, x) {
    return a + (b - a) * x;
};

mathf.lerpRadian = function(a, b, x) {
    return mathf.standardRadian(a + (b - a) * x);
};

mathf.lerpAngle = function(a, b, x) {
    return mathf.standardAngle(a + (b - a) * x);
};

mathf.lerpCos = function(a, b, x) {
    var ft = x * mathf.PI,
        f = (1 - mathf.cos(ft)) * 0.5;

    return a * (1 - f) + b * f;
};

mathf.lerpCubic = function(v0, v1, v2, v3, x) {
    var P, Q, R, S, Px, Qx, Rx;

    v0 = v0 || v1;
    v3 = v3 || v2;

    P = (v3 - v2) - (v0 - v1);
    Q = (v0 - v1) - P;
    R = v2 - v0;
    S = v1;

    Px = P * x;
    Qx = Q * x;
    Rx = R * x;

    return (Px * Px * Px) + (Qx * Qx) + Rx + S;
};

mathf.smoothStep = function(x, min, max) {
    if (x <= min) {
        return 0;
    } else {
        if (x >= max) {
            return 1;
        } else {
            x = (x - min) / (max - min);
            return x * x * (3 - 2 * x);
        }
    }
};

mathf.smootherStep = function(x, min, max) {
    if (x <= min) {
        return 0;
    } else {
        if (x >= max) {
            return 1;
        } else {
            x = (x - min) / (max - min);
            return x * x * x * (x * (x * 6 - 15) + 10);
        }
    }
};

mathf.pingPong = function(x, length) {
    length = +length || 1;
    return length - mathf.abs(x % (2 * length) - length);
};

mathf.degsToRads = function(x) {
    return mathf.standardRadian(x * mathf.TO_RADS);
};

mathf.radsToDegs = function(x) {
    return mathf.standardAngle(x * mathf.TO_DEGS);
};

mathf.randInt = function(min, max) {
    return mathf.round(min + (mathf.random() * (max - min)));
};

mathf.randFloat = function(min, max) {
    return min + (mathf.random() * (max - min));
};

mathf.randSign = function() {
    return mathf.random() < 0.5 ? 1 : -1;
};

mathf.shuffle = function(array) {
    var i = array.length,
        j, x;

    while (i) {
        j = (mathf.random() * i--) | 0;
        x = array[i];
        array[i] = array[j];
        array[j] = x;
    }

    return array;
};

mathf.randArg = function() {
    return arguments[(mathf.random() * arguments.length) | 0];
};

mathf.randChoice = function(array) {
    return array[(mathf.random() * array.length) | 0];
};

mathf.randChoiceObject = function(object) {
    var objectKeys = keys(object);
    return object[objectKeys[(mathf.random() * objectKeys.length) | 0]];
};

mathf.isPowerOfTwo = function(x) {
    return (x & -x) === x;
};

mathf.floorPowerOfTwo = function(x) {
    var i = 2,
        prev;

    while (i < x) {
        prev = i;
        i *= 2;
    }

    return prev;
};

mathf.ceilPowerOfTwo = function(x) {
    var i = 2;

    while (i < x) {
        i *= 2;
    }

    return i;
};

var n225 = 0.39269908169872414,
    n675 = 1.1780972450961724,
    n1125 = 1.9634954084936207,
    n1575 = 2.748893571891069,
    n2025 = 3.5342917352885173,
    n2475 = 4.319689898685966,
    n2925 = 5.105088062083414,
    n3375 = 5.8904862254808625,

    RIGHT = "right",
    UP_RIGHT = "up_right",
    UP = "up",
    UP_LEFT = "up_left",
    LEFT = "left",
    DOWN_LEFT = "down_left",
    DOWN = "down",
    DOWN_RIGHT = "down_right";

mathf.directionAngle = function(a) {
    a = mathf.standardRadian(a);

    return (
        (a >= n225 && a < n675) ? UP_RIGHT :
        (a >= n675 && a < n1125) ? UP :
        (a >= n1125 && a < n1575) ? UP_LEFT :
        (a >= n1575 && a < n2025) ? LEFT :
        (a >= n2025 && a < n2475) ? DOWN_LEFT :
        (a >= n2475 && a < n2925) ? DOWN :
        (a >= n2925 && a < n3375) ? DOWN_RIGHT :
        RIGHT
    );
};

mathf.direction = function(x, y) {
    var a = mathf.standardRadian(mathf.atan2(y, x));

    return (
        (a >= n225 && a < n675) ? UP_RIGHT :
        (a >= n675 && a < n1125) ? UP :
        (a >= n1125 && a < n1575) ? UP_LEFT :
        (a >= n1575 && a < n2025) ? LEFT :
        (a >= n2025 && a < n2475) ? DOWN_LEFT :
        (a >= n2475 && a < n2925) ? DOWN :
        (a >= n2925 && a < n3375) ? DOWN_RIGHT :
        RIGHT
    );
};


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/vec3/src/index.js */

var mathf = require(216),
    isNumber = require(21);


var vec3 = exports;


vec3.ArrayType = typeof(Float32Array) !== "undefined" ? Float32Array : mathf.ArrayType;


vec3.create = function(x, y, z) {
    var out = new vec3.ArrayType(3);

    out[0] = isNumber(x) ? x : 0;
    out[1] = isNumber(y) ? y : 0;
    out[2] = isNumber(z) ? z : 0;

    return out;
};

vec3.copy = function(out, a) {

    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];

    return out;
};

vec3.clone = function(a) {
    var out = new vec3.ArrayType(3);

    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];

    return out;
};

vec3.set = function(out, x, y, z) {

    out[0] = isNumber(x) ? x : 0;
    out[1] = isNumber(y) ? y : 0;
    out[2] = isNumber(z) ? z : 0;

    return out;
};

vec3.add = function(out, a, b) {

    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    out[2] = a[2] + b[2];

    return out;
};

vec3.sub = function(out, a, b) {

    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    out[2] = a[2] - b[2];

    return out;
};

vec3.mul = function(out, a, b) {

    out[0] = a[0] * b[0];
    out[1] = a[1] * b[1];
    out[2] = a[2] * b[2];

    return out;
};

vec3.div = function(out, a, b) {
    var bx = b[0],
        by = b[1],
        bz = b[2];

    out[0] = a[0] * (bx !== 0 ? 1 / bx : bx);
    out[1] = a[1] * (by !== 0 ? 1 / by : by);
    out[2] = a[2] * (bz !== 0 ? 1 / bz : bz);

    return out;
};

vec3.sadd = function(out, a, s) {

    out[0] = a[0] + s;
    out[1] = a[1] + s;
    out[2] = a[2] + s;

    return out;
};

vec3.ssub = function(out, a, s) {

    out[0] = a[0] - s;
    out[1] = a[1] - s;
    out[2] = a[2] - s;

    return out;
};

vec3.smul = function(out, a, s) {

    out[0] = a[0] * s;
    out[1] = a[1] * s;
    out[2] = a[2] * s;

    return out;
};

vec3.sdiv = function(out, a, s) {
    s = s !== 0 ? 1 / s : s;

    out[0] = a[0] * s;
    out[1] = a[1] * s;
    out[2] = a[2] * s;

    return out;
};

vec3.lengthSqValues = function(x, y, z) {

    return x * x + y * y + z * z;
};

vec3.lengthValues = function(x, y, z) {
    var lsq = vec3.lengthSqValues(x, y, z);

    return lsq !== 0 ? mathf.sqrt(lsq) : lsq;
};

vec3.invLengthValues = function(x, y, z) {
    var lsq = vec3.lengthSqValues(x, y, z);

    return lsq !== 0 ? 1 / mathf.sqrt(lsq) : lsq;
};

vec3.cross = function(out, a, b) {
    var ax = a[0],
        ay = a[1],
        az = a[2],
        bx = b[0],
        by = b[1],
        bz = b[2];

    out[0] = ay * bz - az * by;
    out[1] = az * bx - ax * bz;
    out[2] = ax * by - ay * bx;

    return out;
};

vec3.dot = function(a, b) {

    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
};

vec3.lengthSq = function(a) {

    return vec3.dot(a, a);
};

vec3.length = function(a) {
    var lsq = vec3.lengthSq(a);

    return lsq !== 0 ? mathf.sqrt(lsq) : lsq;
};

vec3.invLength = function(a) {
    var lsq = vec3.lengthSq(a);

    return lsq !== 0 ? 1 / mathf.sqrt(lsq) : lsq;
};

vec3.setLength = function(out, a, length) {
    var x = a[0],
        y = a[1],
        z = a[2],
        s = length * vec3.invLengthValues(x, y, z);

    out[0] = x * s;
    out[1] = y * s;
    out[2] = z * s;

    return out;
};

vec3.normalize = function(out, a) {
    var x = a[0],
        y = a[1],
        z = a[2],
        invlsq = vec3.invLengthValues(x, y, z);

    out[0] = x * invlsq;
    out[1] = y * invlsq;
    out[2] = z * invlsq;

    return out;
};

vec3.inverse = function(out, a) {

    out[0] = a[0] * -1;
    out[1] = a[1] * -1;
    out[2] = a[2] * -1;

    return out;
};

vec3.lerp = function(out, a, b, x) {
    var lerp = mathf.lerp;

    out[0] = lerp(a[0], b[0], x);
    out[1] = lerp(a[1], b[1], x);
    out[2] = lerp(a[2], b[2], x);

    return out;
};

vec3.min = function(out, a, b) {
    var ax = a[0],
        ay = a[1],
        az = a[2],
        bx = b[0],
        by = b[1],
        bz = b[2];

    out[0] = bx < ax ? bx : ax;
    out[1] = by < ay ? by : ay;
    out[2] = bz < az ? bz : az;

    return out;
};

vec3.max = function(out, a, b) {
    var ax = a[0],
        ay = a[1],
        az = a[2],
        bx = b[0],
        by = b[1],
        bz = b[2];

    out[0] = bx > ax ? bx : ax;
    out[1] = by > ay ? by : ay;
    out[2] = bz > az ? bz : az;

    return out;
};

vec3.clamp = function(out, a, min, max) {
    var x = a[0],
        y = a[1],
        z = a[2],
        minx = min[0],
        miny = min[1],
        minz = min[2],
        maxx = max[0],
        maxy = max[1],
        maxz = max[2];

    out[0] = x < minx ? minx : x > maxx ? maxx : x;
    out[1] = y < miny ? miny : y > maxy ? maxy : y;
    out[2] = z < minz ? minz : z > maxz ? maxz : z;

    return out;
};

vec3.transformMat3 = function(out, a, m) {
    var x = a[0],
        y = a[1],
        z = a[2];

    out[0] = x * m[0] + y * m[3] + z * m[6];
    out[1] = x * m[1] + y * m[4] + z * m[7];
    out[2] = x * m[2] + y * m[5] + z * m[8];

    return out;
};

vec3.transformMat4 = function(out, a, m) {
    var x = a[0],
        y = a[1],
        z = a[2];

    out[0] = x * m[0] + y * m[4] + z * m[8] + m[12];
    out[1] = x * m[1] + y * m[5] + z * m[9] + m[13];
    out[2] = x * m[2] + y * m[6] + z * m[10] + m[14];

    return out;
};

vec3.transformMat4Rotation = function(out, a, m) {
    var x = a[0],
        y = a[1],
        z = a[2];

    out[0] = x * m[0] + y * m[4] + z * m[8];
    out[1] = x * m[1] + y * m[5] + z * m[9];
    out[2] = x * m[2] + y * m[6] + z * m[10];

    return out;
};

vec3.transformProjection = function(out, a, m) {
    var x = a[0],
        y = a[1],
        z = a[2],
        d = x * m[3] + y * m[7] + z * m[11] + m[15];

    d = d !== 0 ? 1 / d : d;

    out[0] = (x * m[0] + y * m[4] + z * m[8] + m[12]) * d;
    out[1] = (x * m[1] + y * m[5] + z * m[9] + m[13]) * d;
    out[2] = (x * m[2] + y * m[6] + z * m[10] + m[14]) * d;

    return out;
};

vec3.transformProjectionNoPosition = function(out, a, m) {
    var x = a[0],
        y = a[1],
        z = a[2],
        d = x * m[3] + y * m[7] + z * m[11] + m[15];

    d = d !== 0 ? 1 / d : d;

    out[0] = (x * m[0] + y * m[4] + z * m[8]) * d;
    out[1] = (x * m[1] + y * m[5] + z * m[9]) * d;
    out[2] = (x * m[2] + y * m[6] + z * m[10]) * d;

    return out;
};

vec3.transformQuat = function(out, a, q) {
    var x = a[0],
        y = a[1],
        z = a[2],
        qx = q[0],
        qy = q[1],
        qz = q[2],
        qw = q[3],

        ix = qw * x + qy * z - qz * y,
        iy = qw * y + qz * x - qx * z,
        iz = qw * z + qx * y - qy * x,
        iw = -qx * x - qy * y - qz * z;

    out[0] = ix * qw + iw * -qx + iy * -qz - iz * -qy;
    out[1] = iy * qw + iw * -qy + iz * -qx - ix * -qz;
    out[2] = iz * qw + iw * -qz + ix * -qy - iy * -qx;

    return out;
};

vec3.positionFromMat4 = function(out, m) {

    out[0] = m[12];
    out[1] = m[13];
    out[2] = m[14];

    return out;
};

vec3.scaleFromMat3 = function(out, m) {

    out[0] = vec3.lengthValues(m[0], m[3], m[6]);
    out[1] = vec3.lengthValues(m[1], m[4], m[7]);
    out[2] = vec3.lengthValues(m[2], m[5], m[8]);

    return out;
};

vec3.scaleFromMat4 = function(out, m) {

    out[0] = vec3.lengthValues(m[0], m[4], m[8]);
    out[1] = vec3.lengthValues(m[1], m[5], m[9]);
    out[2] = vec3.lengthValues(m[2], m[6], m[10]);

    return out;
};

vec3.equal = function(a, b) {
    return !(
        a[0] !== b[0] ||
        a[1] !== b[1] ||
        a[2] !== b[2]
    );
};

vec3.notEqual = function(a, b) {
    return (
        a[0] !== b[0] ||
        a[1] !== b[1] ||
        a[2] !== b[2]
    );
};

vec3.str = function(out) {
    return "Vec3(" + out[0] + ", " + out[1] + ", " + out[2] + ")";
};

vec3.string = vec3.toString = vec3.str;


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/vec4/src/index.js */

var mathf = require(216),
    isNumber = require(21);


var vec4 = exports;


vec4.ArrayType = typeof(Float32Array) !== "undefined" ? Float32Array : mathf.ArrayType;


vec4.create = function(x, y, z, w) {
    var out = new vec4.ArrayType(4);

    out[0] = isNumber(x) ? x : 0;
    out[1] = isNumber(y) ? y : 0;
    out[2] = isNumber(z) ? z : 0;
    out[3] = isNumber(w) ? w : 1;

    return out;
};

vec4.copy = function(out, a) {

    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];

    return out;
};

vec4.clone = function(a) {
    var out = new vec4.ArrayType(4);

    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];

    return out;
};

vec4.set = function(out, x, y, z, w) {

    out[0] = isNumber(x) ? x : 0;
    out[1] = isNumber(y) ? y : 0;
    out[2] = isNumber(z) ? z : 0;
    out[3] = isNumber(w) ? w : 1;

    return out;
};

vec4.add = function(out, a, b) {

    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    out[2] = a[2] + b[2];
    out[3] = a[3] + b[3];

    return out;
};

vec4.sub = function(out, a, b) {

    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    out[2] = a[2] - b[2];
    out[3] = a[3] - b[3];

    return out;
};

vec4.mul = function(out, a, b) {

    out[0] = a[0] * b[0];
    out[1] = a[1] * b[1];
    out[2] = a[2] * b[2];
    out[3] = a[3] * b[3];

    return out;
};

vec4.div = function(out, a, b) {
    var bx = b[0],
        by = b[1],
        bz = b[2],
        bw = b[3];

    out[0] = a[0] * (bx !== 0 ? 1 / bx : bx);
    out[1] = a[1] * (by !== 0 ? 1 / by : by);
    out[2] = a[2] * (bz !== 0 ? 1 / bz : bz);
    out[3] = a[3] * (bw !== 0 ? 1 / bw : bw);

    return out;
};

vec4.sadd = function(out, a, s) {

    out[0] = a[0] + s;
    out[1] = a[1] + s;
    out[2] = a[2] + s;
    out[3] = a[3] + s;

    return out;
};

vec4.ssub = function(out, a, s) {

    out[0] = a[0] - s;
    out[1] = a[1] - s;
    out[2] = a[2] - s;
    out[3] = a[3] - s;

    return out;
};

vec4.smul = function(out, a, s) {

    out[0] = a[0] * s;
    out[1] = a[1] * s;
    out[2] = a[2] * s;
    out[3] = a[3] * s;

    return out;
};

vec4.sdiv = function(out, a, s) {
    s = s !== 0 ? 1 / s : s;

    out[0] = a[0] * s;
    out[1] = a[1] * s;
    out[2] = a[2] * s;
    out[3] = a[3] * s;

    return out;
};

vec4.lengthSqValues = function(x, y, z, w) {

    return x * x + y * y + z * z + w * w;
};

vec4.lengthValues = function(x, y, z, w) {
    var lsq = vec4.lengthSqValues(x, y, z, w);

    return lsq !== 0 ? mathf.sqrt(lsq) : lsq;
};

vec4.invLengthValues = function(x, y, z, w) {
    var lsq = vec4.lengthSqValues(x, y, z, w);

    return lsq !== 0 ? 1 / mathf.sqrt(lsq) : lsq;
};

vec4.dot = function(a, b) {

    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
};

vec4.lengthSq = function(a) {

    return vec4.dot(a, a);
};

vec4.length = function(a) {
    var lsq = vec4.lengthSq(a);

    return lsq !== 0 ? mathf.sqrt(lsq) : lsq;
};

vec4.invLength = function(a) {
    var lsq = vec4.lengthSq(a);

    return lsq !== 0 ? 1 / mathf.sqrt(lsq) : lsq;
};

vec4.setLength = function(out, a, length) {
    var x = a[0],
        y = a[1],
        z = a[2],
        w = a[3],
        s = length * vec4.invLengthValues(x, y, z, w);

    out[0] = x * s;
    out[1] = y * s;
    out[2] = z * s;
    out[3] = w * s;

    return out;
};

vec4.normalize = function(out, a) {
    var x = a[0],
        y = a[1],
        z = a[2],
        w = a[3],
        lsq = vec4.invLengthValues(x, y, z, w);

    out[0] = x * lsq;
    out[1] = y * lsq;
    out[2] = z * lsq;
    out[3] = w * lsq;

    return out;
};

vec4.inverse = function(out, a) {

    out[0] = a[0] * -1;
    out[1] = a[1] * -1;
    out[2] = a[2] * -1;
    out[3] = a[3] * -1;

    return out;
};

vec4.lerp = function(out, a, b, x) {
    var lerp = mathf.lerp;

    out[0] = lerp(a[0], b[0], x);
    out[1] = lerp(a[1], b[1], x);
    out[2] = lerp(a[2], b[2], x);
    out[3] = lerp(a[3], b[3], x);

    return out;
};

vec4.min = function(out, a, b) {
    var ax = a[0],
        ay = a[1],
        az = a[2],
        aw = a[3],
        bx = b[0],
        by = b[1],
        bz = b[2],
        bw = b[3];

    out[0] = bx < ax ? bx : ax;
    out[1] = by < ay ? by : ay;
    out[2] = bz < az ? bz : az;
    out[3] = bw < aw ? bw : aw;

    return out;
};

vec4.max = function(out, a, b) {
    var ax = a[0],
        ay = a[1],
        az = a[2],
        aw = a[3],
        bx = b[0],
        by = b[1],
        bz = b[2],
        bw = b[3];

    out[0] = bx > ax ? bx : ax;
    out[1] = by > ay ? by : ay;
    out[2] = bz > az ? bz : az;
    out[3] = bw > aw ? bw : aw;

    return out;
};

vec4.clamp = function(out, a, min, max) {
    var x = a[0],
        y = a[1],
        z = a[2],
        w = a[3],
        minx = min[0],
        miny = min[1],
        minz = min[2],
        minw = min[3],
        maxx = max[0],
        maxy = max[1],
        maxz = max[2],
        maxw = max[3];

    out[0] = x < minx ? minx : x > maxx ? maxx : x;
    out[1] = y < miny ? miny : y > maxy ? maxy : y;
    out[2] = z < minz ? minz : z > maxz ? maxz : z;
    out[3] = w < minw ? minw : w > maxw ? maxw : w;

    return out;
};

vec4.transformMat4 = function(out, a, m) {
    var x = a[0],
        y = a[1],
        z = a[2],
        w = a[3];

    out[0] = x * m[0] + y * m[4] + z * m[8] + w * m[12];
    out[1] = x * m[1] + y * m[5] + z * m[9] + w * m[13];
    out[2] = x * m[2] + y * m[6] + z * m[10] + w * m[14];
    out[3] = x * m[3] + y * m[7] + z * m[11] + w * m[15];

    return out;
};

vec4.transformProjection = function(out, a, m) {
    var x = a[0],
        y = a[1],
        z = a[2],
        w = a[3],
        d = x * m[3] + y * m[7] + z * m[11] + w * m[15];

    d = d !== 0 ? 1 / d : d;

    out[0] = (x * m[0] + y * m[4] + z * m[8] + w * m[12]) * d;
    out[1] = (x * m[1] + y * m[5] + z * m[9] + w * m[13]) * d;
    out[2] = (x * m[2] + y * m[6] + z * m[10] + w * m[14]) * d;
    out[3] = (x * m[3] + y * m[7] + z * m[11] + w * m[15]) * d;

    return out;
};

vec4.positionFromMat4 = function(out, m) {

    out[0] = m[12];
    out[1] = m[13];
    out[2] = m[14];
    out[3] = m[15];

    return out;
};

vec4.scaleFromMat4 = function(out, m) {

    out[0] = vec4.lengthValues(m[0], m[4], m[8], m[12]);
    out[1] = vec4.lengthValues(m[1], m[5], m[9], m[13]);
    out[2] = vec4.lengthValues(m[2], m[6], m[10], m[14]);
    out[3] = vec4.lengthValues(m[3], m[7], m[11], m[15]);

    return out;
};

vec4.equal = function(a, b) {
    return !(
        a[0] !== b[0] ||
        a[1] !== b[1] ||
        a[2] !== b[2] ||
        a[3] !== b[3]
    );
};

vec4.notEqual = function(a, b) {
    return (
        a[0] !== b[0] ||
        a[1] !== b[1] ||
        a[2] !== b[2] ||
        a[3] !== b[3]
    );
};

vec4.str = function(out) {
    return "Vec4(" + out[0] + ", " + out[1] + ", " + out[2] + ", " + out[3] + ")";
};

vec4.string = vec4.toString = vec4.str;


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/color/src/colorNames.js */

module.exports = {
    aliceblue: "#f0f8ff",
    antiquewhite: "#faebd7",
    aqua: "#00ffff",
    aquamarine: "#7fffd4",
    azure: "#f0ffff",
    beige: "#f5f5dc",
    bisque: "#ffe4c4",
    black: "#000000",
    blanchedalmond: "#ffebcd",
    blue: "#0000ff",
    blueviolet: "#8a2be2",
    brown: "#a52a2a",
    burlywood: "#deb887",
    cadetblue: "#5f9ea0",
    chartreuse: "#7fff00",
    chocolate: "#d2691e",
    coral: "#ff7f50",
    cornflowerblue: "#6495ed",
    cornsilk: "#fff8dc",
    crimson: "#dc143c",
    cyan: "#00ffff",
    darkblue: "#00008b",
    darkcyan: "#008b8b",
    darkgoldenrod: "#b8860b",
    darkgray: "#a9a9a9",
    darkgreen: "#006400",
    darkkhaki: "#bdb76b",
    darkmagenta: "#8b008b",
    darkolivegreen: "#556b2f",
    darkorange: "#ff8c00",
    darkorchid: "#9932cc",
    darkred: "#8b0000",
    darksalmon: "#e9967a",
    darkseagreen: "#8fbc8f",
    darkslateblue: "#483d8b",
    darkslategray: "#2f4f4f",
    darkturquoise: "#00ced1",
    darkviolet: "#9400d3",
    deeppink: "#ff1493",
    deepskyblue: "#00bfff",
    dimgray: "#696969",
    dodgerblue: "#1e90ff",
    firebrick: "#b22222",
    floralwhite: "#fffaf0",
    forestgreen: "#228b22",
    fuchsia: "#ff00ff",
    gainsboro: "#dcdcdc",
    ghostwhite: "#f8f8ff",
    gold: "#ffd700",
    goldenrod: "#daa520",
    gray: "#808080",
    green: "#008000",
    greenyellow: "#adff2f",
    grey: "#808080",
    honeydew: "#f0fff0",
    hotpink: "#ff69b4",
    indianred: "#cd5c5c",
    indigo: "#4b0082",
    ivory: "#fffff0",
    khaki: "#f0e68c",
    lavender: "#e6e6fa",
    lavenderblush: "#fff0f5",
    lawngreen: "#7cfc00",
    lemonchiffon: "#fffacd",
    lightblue: "#add8e6",
    lightcoral: "#f08080",
    lightcyan: "#e0ffff",
    lightgoldenrodyellow: "#fafad2",
    lightgrey: "#d3d3d3",
    lightgreen: "#90ee90",
    lightpink: "#ffb6c1",
    lightsalmon: "#ffa07a",
    lightseagreen: "#20b2aa",
    lightskyblue: "#87cefa",
    lightslategray: "#778899",
    lightsteelblue: "#b0c4de",
    lightyellow: "#ffffe0",
    lime: "#00ff00",
    limegreen: "#32cd32",
    linen: "#faf0e6",
    magenta: "#ff00ff",
    maroon: "#800000",
    mediumaquamarine: "#66cdaa",
    mediumblue: "#0000cd",
    mediumorchid: "#ba55d3",
    mediumpurple: "#9370d8",
    mediumseagreen: "#3cb371",
    mediumslateblue: "#7b68ee",
    mediumspringgreen: "#00fa9a",
    mediumturquoise: "#48d1cc",
    mediumvioletred: "#c71585",
    midnightblue: "#191970",
    mintcream: "#f5fffa",
    mistyrose: "#ffe4e1",
    moccasin: "#ffe4b5",
    navajowhite: "#ffdead",
    navy: "#000080",
    oldlace: "#fdf5e6",
    olive: "#808000",
    olivedrab: "#6b8e23",
    orange: "#ffa500",
    orangered: "#ff4500",
    orchid: "#da70d6",
    palegoldenrod: "#eee8aa",
    palegreen: "#98fb98",
    paleturquoise: "#afeeee",
    palevioletred: "#d87093",
    papayawhip: "#ffefd5",
    peachpuff: "#ffdab9",
    peru: "#cd853f",
    pink: "#ffc0cb",
    plum: "#dda0dd",
    powderblue: "#b0e0e6",
    purple: "#800080",
    red: "#ff0000",
    rosybrown: "#bc8f8f",
    royalblue: "#4169e1",
    saddlebrown: "#8b4513",
    salmon: "#fa8072",
    sandybrown: "#f4a460",
    seagreen: "#2e8b57",
    seashell: "#fff5ee",
    sienna: "#a0522d",
    silver: "#c0c0c0",
    skyblue: "#87ceeb",
    slateblue: "#6a5acd",
    slategray: "#708090",
    snow: "#fffafa",
    springgreen: "#00ff7f",
    steelblue: "#4682b4",
    tan: "#d2b48c",
    teal: "#008080",
    thistle: "#d8bfd8",
    tomato: "#ff6347",
    turquoise: "#40e0d0",
    violet: "#ee82ee",
    wheat: "#f5deb3",
    white: "#ffffff",
    whitesmoke: "#f5f5f5",
    yellow: "#ffff00",
    yellowgreen: "#9acd32"
};


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/is_nan/src/index.js */

var isNumber = require(21);


module.exports = Number.isNaN || function isNaN(value) {
    return isNumber(value) && value !== value;
};


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/i18n/src/index.js */

var isArray = require(17),
    isString = require(18),
    isObject = require(30),
    format = require(224),
    fastSlice = require(195),
    has = require(22),
    defineProperty = require(51);


var translationCache = global.__I18N_TRANSLATIONS__;


if (!translationCache) {
    translationCache = {};
    defineProperty(global, "__I18N_TRANSLATIONS__", {
        configurable: false,
        enumerable: false,
        writable: false,
        value: translationCache
    });
}


module.exports = create(false, false);


function create(flatMode, throwMissingError) {

    flatMode = !!flatMode;
    throwMissingError = !!throwMissingError;


    function i18n(locale, key) {
        return i18n.translate(locale, key, fastSlice(arguments, 2));
    }

    i18n.create = create;

    i18n.translate = function(locale, key, args) {
        var translations = translationCache[locale] || null;

        if (translations === null) {
            throw new Error("i18n(key[, locale[, ...args]]) no translations for " + locale + " locale");
        }
        if (!isString(key)) {
            throw new TypeError("i18n(key[, locale[, ...args]]) key must be a String");
        }

        args = isArray(args) ? args : [];

        if (flatMode === true) {
            return translateFlat(key, translations, args);
        } else {
            return translate(key, translations, args);
        }
    };

    i18n.flatMode = function(value) {
        flatMode = !!value;
    };

    i18n.throwMissingError = function(value) {
        throwMissingError = !!value;
    };

    i18n.reset = function() {
        flatMode = false;
        throwMissingError = false;
    };

    i18n.has = function(locale, key) {
        if (has(translationCache[locale], key)) {
            return true;
        } else {
            return false;
        }
    };

    i18n.add = function(locale, object) {
        var translations = translationCache[locale] || (translationCache[locale] = {}),
            localHas, key;

        if (isObject(object)) {
            localHas = has;

            for (key in object) {
                if (localHas(object, key)) {
                    if (localHas(translations, key)) {
                        throw new TypeError("i18n.add(locale, object) cannot override " + locale + " translation with key " + key);
                    } else {
                        translations[key] = object[key];
                    }
                }
            }
        } else {
            throw new TypeError("i18n.add(locale, object) object must be an Object");
        }
    };

    function missingTranslation(key) {
        if (throwMissingError) {
            throw new Error("i18n(locale, key) missing translation for key " + key);
        } else {
            return "--" + key + "--";
        }
    }

    function translate(key, translations, args) {
        var origKey = key,
            keys = key.split("."),
            length = keys.length - 1,
            i = 0,
            value = translations[keys[i]];


        while (i++ < length) {
            key = keys[i];

            if (isObject(value)) {
                value = value[key];

                if (value == null) {
                    return missingTranslation(origKey);
                }
            } else {
                return missingTranslation(origKey);
            }
        }

        if (value == null || isObject(value)) {
            return missingTranslation(origKey);
        } else {
            return args.length !== 0 ? format.array(value, args) : value;
        }
    }

    function translateFlat(key, translations, args) {
        var value = translations[key];

        if (value == null || isObject(value)) {
            return missingTranslation(key);
        } else {
            return args.length !== 0 ? format.array(value, args) : value;
        }
    }

    return i18n;
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/is_regexp/src/index.js */

var isObject = require(30);


var objectToString = Object.prototype.toString;


module.exports = isRegExp;

/**
   isRegExp takes a value and returns true if the value is a RegExp.
   All other values return false

   @param {Any} any primitive or object
   @returns {Boolean}

   @example
     isRegExp(/regex/); // returns true
     isRegExp(null);    // returns false
     isRegExp({});      // returns false
*/
function isRegExp(value) {
    return (
        isObject(value) &&
        objectToString.call(value) === "[object RegExp]"
    ) || false;
}


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/prop_types/src/en.js */

module.exports = {
    "prop_types.regexp": "Invalid %s of value %s supplied to %s, expected RexExp.",
    "prop_types.instance_of": "Invalid %s of type %s supplied to %s, expected instance of %s.",
    "prop_types.one_of": "Invalid %s of value %s supplied to %s, expected one of %s.",
    "prop_types.is_required": "Required %s was not specified in %s.",
    "prop_types.primitive": "Invalid %s of type %s supplied to %s expected %s.",
    "prop_types.anonymous": "anonymous"
};


},
function(require, exports, module, undefined, global) {
/* ../../node_modules/format/src/index.js */

var isString = require(18),
    isObject = require(30),
    isPrimitive = require(15),
    isArrayLike = require(53),
    isFunction = require(16),
    indexOf = require(54),
    fastSlice = require(195);


var reFormat = /%([a-z%])/g,
    toString = Object.prototype.toString;


module.exports = format;


function format(str) {
    return baseFormat(str, fastSlice(arguments, 1));
}

format.array = baseFormat;

function baseFormat(str, args) {
    var i = 0,
        length = args ? args.length : 0;

    return (isString(str) ? str + "" : "").replace(reFormat, function(match, s) {
        var value, formatter;

        if (match === "%%") {
            return "%";
        }
        if (i >= length) {
            return "";
        }

        formatter = format[s];
        value = args[i++];

        return value != null && isFunction(formatter) ? formatter(value) : "";
    });
}

format.s = function(value) {
    return String(value);
};

format.d = function(value) {
    return Number(value);
};

format.j = function(value) {
    try {
        return JSON.stringify(value);
    } catch (e) {
        return "[Circular]";
    }
};

function inspectObject(value, inspected, depth, maxDepth) {
    var out, i, il, keys, key;

    if (indexOf(inspected, value) !== -1) {
        return toString.call(value);
    }

    inspected[inspected.length] = value;

    if (isFunction(value) || depth >= maxDepth) {
        return toString.call(value);
    }

    if (isArrayLike(value) && value !== global) {
        depth++;
        out = [];

        i = -1;
        il = value.length - 1;
        while (i++ < il) {
            out[i] = inspect(value[i], inspected, depth, maxDepth);
        }

        return out;
    } else if (isObject(value)) {
        depth++;
        out = {};
        keys = utils.keys(value);

        i = -1;
        il = keys.length - 1;
        while (i++ < il) {
            key = keys[i];
            out[key] = inspect(value[key], inspected, depth, maxDepth);
        }

        return out;
    }

    return isFunction(value.toString) ? value.toString() : value + "";
}

function inspectPrimitive(value) {
    return isNumber(value) ? Number(value) : String(value);
}

function inspect(value, inspected, depth, maxDepth) {
    return isPrimitive(value) ? inspectPrimitive(value) : inspectObject(value, inspected, depth, maxDepth);
}

format.o = function(value) {
    try {
        return JSON.stringify(inspect(value, [], 0, 5), null, 2);
    } catch (e) {
        return "[Circular]";
    }
};

format.inspect = format.o;


}], null, void(0), (new Function("return this;"))()));