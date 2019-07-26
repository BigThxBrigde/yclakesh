

module.exports = {
    services: {
        QRCode: (() => {
            const qrcode = {};

            let _readCount = () => {
                return require('./count.json').start;
            };

            let _saveCount = (start) =>{
                let count = require('./count.json');
                count.start = start;
                const fs = require('fs');
                const path = require('path');
                fs.writeFileSync(path.join(__dirname, 'count.js'), JSON.stringify(count));
            }

            qrcode.add = (count) => {

            }
            return qrcode;
        })()
    }
}