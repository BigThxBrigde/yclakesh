(async () => {
    let UserInfo = require('./dao/db').UserInfo;

    var result = await UserInfo.find();

    console.log(result);

    await UserInfo.add({
        params: [['test2', 'test2', '0'], ['test1', 'test1', '0']]
    });

    await UserInfo.add({
        params: [['test3', 'test3', '0']]
    });

    result = await UserInfo.find();
    console.log(result);

    await UserInfo.update({
        update: "set name=?",
        filter: " name=?",
        params: ['test3', 'test2']
    });

    result = await UserInfo.find();
    console.log(result);

    await UserInfo.delete({
        filter: "name like 'test%'"
    });

    result = await UserInfo.find();
    console.log(result);
})();