/*
msg = {
    topic: 'topic',
    payload: 'payload',
    parts: {
        one: 'one',
        two: 'two'
    }
}
*/
module.exports = function(RED) {
    var mustache = function(object, val) {
        if (val.indexOf(' ') !== -1) return null;

        if (val.indexOf('{{') !== -1 ) {
            let a = val.match(/({{[^}]+}})/g);
            for (let i = 0; i < a.length; i++) {
                let b = a[i].replace(/[{}]/g, '').replace('msg.', '');
                let c = extract(object, b);
                if (!c) return null;
                val = val.replace(a[i], c);
            }
        }

        return val;
    };

    var extract = function(object, path) {
        let p = path.split('.')
        let v = object;

        for (let i=0; i < p.length; i++) {
            if (v.hasOwnProperty(p[i])) v=v[p[i]]
            else return null;
        }

        return v;
    };

    var getValue = function(msg, value, type) {
        switch (type) {
            case 'msg':
                return RED.util.getMessageProperty(msg, value);
            case 'num':
                return Number(value);
            case 'bool':
                return value === 'true';
            default:
                return value;
        }
    };

    return {
        mustache: mustache,
        getValue: getValue
    };
};
