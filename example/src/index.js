var virt = require("@nathanfaucett/virt"),
    virtDOM = require("@nathanfaucett/virt-dom"),
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
            virt.createView("div",
                virt.createView(TouchRipple, {
                    style: {
                        background: "#f00",
                        overflow: "hidden",
                        position: "relative",
                        width: "256px",
                        height: "128px"
                    },
                    contentStyle: {
                        fontSize: "16px",
                        padding: "54px 0px",
                        textAlign: "center"
                    },
                }, "Touch Me")
            ),
            virt.createView("div",
                virt.createView(TouchRipple, {
                    style: {
                        background: "#f00",
                        overflow: "hidden",
                        position: "relative",
                        width: "128px",
                        height: "256px"
                    },
                    contentStyle: {
                        fontSize: "16px",
                        padding: "118px 0px",
                        textAlign: "center"
                    },
                }, "Touch Me")
            )
        )
    );
};

virtDOM.render(virt.createView(App), document.getElementById("app"));

