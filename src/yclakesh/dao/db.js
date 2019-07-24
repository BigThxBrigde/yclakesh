const Sequelize = require('sequelize');
const Config = require('../config');

// 
const db = new Sequelize(Config.CONNECTION_STRING, {
    define:{
        timestamps: false
    }
});

const UserInfo = db.import('./models/user_info');
const MemberInfo = db.import('./models/member_info');
const QRCodeInfo = db.import('./models/qrcode_info');

// epxort
module.exports = {
    UserInfo: UserInfo,
    MemberInfo: MemberInfo,
    QRCodeInfo: QRCodeInfo
};