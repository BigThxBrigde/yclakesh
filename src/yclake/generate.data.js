(async () => {
    const { services } = require("./dao/service");
    let result = await services.QRCode.addBatch(200);
    console.log(result);
})();