var virt = require("virt"),
    virtDOM = require("virt-dom"),
    TouchRipple = require("../..");


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

