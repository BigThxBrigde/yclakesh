module.exports = {
    Random: (() => {

        const random = {};
        let contains = [];

        random.serialId = (options) => {
            let prefix = options.prefix || '';
            let length = (options.length || 10) - prefix.length;
            let start = options.start || 0;
            let count = options.count || 100;
            let result = [];

            for (let index = start; index < count; index++) {
                result.push(`${prefix}${_pad(index, '0', length)}`);
            }

            return result;
        };

        random.randomCode = (options) => {
            let length = options.length;
            let max = Math.pow(10, length) - 1;
            return _pad(random.next(0, max), '0', length);
        }

        random.next = (min, max) => {

            while (true) {
                let rnd = _next(min, max);
                if (!contains.find((e, i) => e === rnd)) {
                    contains.push(rnd);
                    return rnd;
                }
            }
        };

        let _next = (min, max) => {
            if (max === undefined) {
                return parseInt(Math.random() * min + 1, 10);
            }
            return parseInt(Math.random() * (max - min + 1) + min, 10);
        };

        let _pad = (num, padChar, length) => {
            return `${Array.apply(null, { length: length }).fill(padChar).join('') + num}`.slice(-length);
        };
        return random;
    })()
};
