(async()=>{

const db = require('./dao/db');
let result = await db.UserInfo.findAll();

result.forEach(e=>{
    console.log(e);
});
 
})();