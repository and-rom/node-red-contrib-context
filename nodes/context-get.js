module.exports = function(RED) {
    var utils = require('./utils')(RED);

    function ContextGetNode(config) {
        RED.nodes.createNode(this, config);

        let node = this;

        node.source = config.source
        node.sourceType = config.sourceType
        node.destination = config.destination

        function getContextVariable(variable, context) {
            switch (context) {
                case 'flow':
                    return node.context().flow.get(variable);
                case 'global':
                    return node.context().global.get(variable);
                default:
                    return null;
            }
        }

        node.on('input', function(msg, send, done) {
            send = send || function() { node.send.apply(node,arguments) }

            let variable = utils.mustache(msg, node.source);

            if (typeof variable !== undefined) {
                let value = getContextVariable(variable, node.sourceType);
                let property = node.destination;

                if (value) {
                    RED.util.setMessageProperty(msg, property, value, true);
                    RED.util.setMessageProperty(msg, 'context', node.sourceType, false);

                } else
                    node.warn("Variable is not set", msg);
            } else {
                node.error("Can't parse source value", msg);
            }

            send(msg);

            if (done) {done();}
        });

    }

    RED.nodes.registerType('context-get', ContextGetNode);
}