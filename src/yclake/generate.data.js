(async () => {
    const { services } = require("./dao/service");
    let result = await services.QRCode.addBatch(4000000);
    console.log(result);
});

(async () => {
    const path = require('path');
    const { CSV } = require('./util/csv');
    let result = await CSV.export({
        start: 0,
        end: 100,
        fields: ['Url', 'SerialId', 'IdentifyCode'],
        file: `${path.join(__dirname, '../../data/2019_8_1.csv')}`
    });
    console.log(result);
})();