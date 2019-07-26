const mysql = require('mysql');
const config = require('../config.json');
const DB = {};

((_) => {
    // create a pool
    let pool = mysql.createPool(config.dbconfig);

    /**
     * sql core function
     */
    _.query = (options) => {
        return new Promise((resolve, reject) => {
            pool.getConnection(function (err, connection) {
                if (err) {
                    reject(err);
                } else {

                    let sql = options.sql;
                    let params = options.params || [];
                    let useTrans = options.useTransaction || false;

                    if (!sql) {
                        reject(new Error('sql cannot be empty'));
                    }

                    if (useTrans) {
                        connection.beginTransaction(err => {
                            if (err) {
                                reject(err);
                            } else {

                                connection.query(sql, params, (err, rows) => {

                                    if (err) {
                                        connection.rollback(() => {
                                            console.error('rollback failed')
                                        })
                                        reject(err);
                                    } else {
                                        connection.commit((error) => {
                                            if (error) {
                                                console.error('commit failed')
                                            }
                                        })
                                        resolve(rows);
                                    }
                                    connection.release();
                                });

                            }
                        });
                    } else {

                        connection.query(sql, params, (err, rows) => {

                            if (err) {
                                reject(err);
                            } else {
                                resolve(rows);
                            }
                            connection.release();
                        });
                    }
                }
            })
        })
    };
})(DB);

/**
 * User info
 */
const UserInfo = {};
((_) => {
    /**
     * find record
     * option{
     *   filter: where expression,
     *   one: one recorder or list,
     *   params: filter params
     * }
     */
    _.find = async (options) => {

        var options = options || {};
        var one = options.one || false;
        let filter = options.filter;
        let params = options.params;
        var reuslt = await DB.query({
            sql: `SELECT * FROM USER_INFO ${filter === undefined ? '' : 'WHERE ' + filter}`,
            params: params
        });
        return one ? (reuslt.length == 0 ? null : result[0]) : reuslt;
    };

    /**
     * add records
     */
    _.add = async (options) => {

        var options = options || {};
        let params = options.params;
        if (params === undefined) {
            return;
        }
        await DB.query({
            sql: 'INSERT INTO USER_INFO (NAME, PASSWORD, TYPE) VALUES ?',
            params: [params]
        });
    };

    /**
     * update 
     */
    _.update = async (options) => {
        var options = options || {};
        let update = options.update;
        let filter = options.filter;
        let params = options.params;
        await DB.query({
            sql: `UPDATE USER_INFO ${update} ${filter === undefined ? '' : 'WHERE ' + filter}`,
            params: params
        })

    };

    /**
     * delete 
     */
    _.delete = async (options) => {
        var options = options || {};
        let filter = options.filter;
        let params = options.params;
        await DB.query({
            sql: `DELETE FROM USER_INFO ${filter === undefined ? '' : 'WHERE ' + filter}`,
            params: params
        });
    };

})(UserInfo);

const MemberInfo = {};

((_) => {
    /**
         * find record
         * option{
         *   filter: where expression,
         *   one: one recorder or list,
         *   params: filter params
         * }
         */
    _.find = async (options) => {

        var options = options || {};
        var one = options.one || false;
        let filter = options.filter;
        let params = options.params;
        var reuslt = await DB.query({
            sql: `SELECT * FROM MEMBER_INFO ${filter === undefined ? '' : 'WHERE ' + filter}`,
            params: params
        });
        return one ? (reuslt.length == 0 ? null : result[0]) : reuslt;
    };

    /**
     * add records
     */
    _.add = async (options) => {

        var options = options || {};
        let params = options.params;
        if (params === undefined) {
            return;
        }
        await DB.query({
            sql: 'INSERT INTO MEMBER_INFO (NAME, CERTIFICATION) VALUES ?',
            params: [params]
        });
    };

    /**
     * update 
     */
    _.update = async (options) => {
        var options = options || {};
        let update = options.update;
        let filter = options.filter;
        let params = options.params;
        await DB.query({
            sql: `UPDATE MEMBER_INFO ${update} ${filter === undefined ? '' : 'WHERE ' + filter}`,
            params: params
        })

    };

    /**
     * delete 
     */
    _.delete = async (options) => {
        var options = options || {};
        let filter = options.filter;
        let params = options.params;
        await DB.query({
            sql: `DELETE FROM MEMBER_INFO ${filter === undefined ? '' : 'WHERE ' + filter}`,
            params: params
        });
    };

})(MemberInfo);


const QRCodeInfo = {};
((_) => {

    /**  find record
     * option{
     *   filter: where expression,
     *   one: one recorder or list,
     *   params: filter params
     * }
     */
    _.find = async (options) => {

        var options = options || {};
        var one = options.one || false;
        let filter = options.filter;
        let params = options.params;
        var reuslt = await DB.query({
            sql: `SELECT * FROM QRCODE_INFO ${filter === undefined ? '' : 'WHERE ' + filter}`,
            params: params
        });
        return one ? (reuslt.length == 0 ? null : result[0]) : reuslt;
    };

    /**
     * add records
     */
    _.add = async (options) => {

        var options = options || {};
        let params = options.params;
        if (params === undefined) {
            return;
        }
        await DB.query({
            sql: 'INSERT INTO QRCODE_INFO (URL, SERIALID, IDENTIFYCODE, TYPE, FIRSTTIME, QUERYCOUNT, MEMBER) VALUES ?',
            params: [params]
        });
    };

    /**
     * update 
     */
    _.update = async (options) => {
        var options = options || {};
        let update = options.update;
        let filter = options.filter;
        let params = options.params;
        await DB.query({
            sql: `UPDATE MEMBER_INFO ${update} ${filter === undefined ? '' : 'WHERE ' + filter}`,
            params: params
        })

    };

    /**
     * delete 
     */
    _.delete = async (options) => {
        var options = options || {};
        let filter = options.filter;
        let params = options.params;
        await DB.query({
            sql: `DELETE FROM MEMBER_INFO ${filter === undefined ? '' : 'WHERE ' + filter}`,
            params: params
        });
    };


})(QRCodeInfo);

module.exports = {
    DB: DB,
    UserInfo: UserInfo,
    MemberInfo: MemberInfo,
    QRCodeInfo : QRCodeInfo
};