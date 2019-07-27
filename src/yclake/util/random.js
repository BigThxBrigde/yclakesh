let uuid = (length, radix) => {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    var uuid = [], i;
    radix = radix || chars.length;

    if (length) {
        // Compact form
        for (i = 0; i < length; i++) uuid[i] = chars[0 | Math.random() * radix];
    } else {
        // rfc4122, version 4 form
        var r;

        // rfc4122 requires these characters
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
        uuid[14] = '4';

        // Fill in random data.  At i==19 set the high bits of clock sequence as
        // per rfc4122, sec. 4.1.5
        for (i = 0; i < 36; i++) {
            if (!uuid[i]) {
                r = 0 | Math.random() * 16;
                uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
            }
        }
    }

    return uuid.join('');
}

module.exports = {
    Random: (() => {

        const random = {};
        let contains = [];


        /**
         * options
         * when number exists, generate one serialid,
         * else generate a serial id collection
         */
        random.serialId = (options) => {
            let prefix = options.prefix || '';
            let length = (options.length || 10) - prefix.length;
            let number = options.number;
            if (number !== undefined) {
                return `${prefix}${_pad(number, '0', length)}`
            }

            let start = options.start || 0;
            let count = options.count || 100;
            let result = [];


            for (let index = start; index < start + count; index++) {
                result.push(`${prefix}${_pad(index, '0', length)}`);
            }

            return result;
        };

        /**
         * generate non-duplicated code.
         */
        random.randomCode = (options) => {
            let length = options.length;
            //let max = Math.pow(10, length) - 1;
            //return _pad(random.next(0, max), '0', length);
            return uuid(length, 10);
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
