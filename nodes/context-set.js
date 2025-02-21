module.exports = function(RED) {
    var utils = require('./utils')(RED);

    function ContextSetNode(config) {
        RED.nodes.createNode(this, config);

        let node = this;

        node.source = config.source
        node.sourceType = config.sourceType
        node.destination = config.destination
        node.destinationType = config.destinationType

        node.on('input', function(msg, send, done) {
            let value = utils.getValue(msg, node.source, node.sourceType);
            let variable = utils.mustache(msg, node.destination)

            if (variable) {
                if (node.destinationType === 'flow') {
                    node.context().flow.set(variable, value);
                } else if (node.destinationType === 'global') {
                    node.context().global.set(variable, value);
                }
            } else
                node.error("Can't parse destination value", msg);

            if (done) {done();}
        });

    }

    RED.nodes.registerType("context-set", ContextSetNode);
}