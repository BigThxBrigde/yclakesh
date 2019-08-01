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
                    console.error(err);
                    reject({
                        success: false,
                        error: err
                    });
                } else {

                    let sql = options.sql;
                    let params = options.params || [];
                    let useTrans = options.useTransaction || false;

                    if (!sql) {
                        console.error('sql cannot be empty');
                        reject({
                            success: false,
                            error: new Error('sql cannot be empty')
                        });
                    }

                    if (useTrans) {
                        connection.beginTransaction(err => {
                            if (err) {
                                console.error('sql cannot be empty');
                                reject({
                                    success: false,
                                    error: err
                                });
                            } else {

                                connection.query(sql, params, (err, rows) => {

                                    if (err) {
                                        console.error(err);
                                        connection.rollback(() => {
                                            console.error('rollback failed')
                                        })
                                        reject({
                                            success: false,
                                            error: err
                                        });
                                    } else {
                                        connection.commit((error) => {
                                            if (error) {
                                                console.error('commit failed')
                                            }
                                        })
                                        resolve({
                                            success: true,
                                            data: rows
                                        });
                                    }
                                    connection.release();
                                });

                            }
                        });
                    } else {

                        connection.query(sql, params, (err, rows) => {

                            if (err) {
                                console.error(err);
                                reject({
                                    success: false,
                                    error: err
                                });
                            } else {
                                resolve({
                                    success: true,
                                    data: rows
                                });
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
        let useTransaction = options.useTransaction || false;
        let fields = options.fields !== undefined ? options.fields.join(',') : '*';
        let result = await DB.query({
            sql: `SELECT ${fields} FROM USER_INFO ${filter === undefined ? '' : 'WHERE ' + filter}`,
            params: params,
            useTransaction: useTransaction
        });
        if (!result.success) {
            return {
                success : false,
                data : null
            };
        }
        let data = one ? (result.data.length == 0 ? null : result.data[0]) : result.data;
        return {
            success : true,
            data: data
        };
    };

    /**
     * add records
     */
    _.add = async (options) => {

        var options = options || {};
        let params = options.params;
        let useTransaction = options.useTransaction || false;
        if (params === undefined) {
            return;
        }
        let result = await DB.query({
            sql: 'INSERT INTO USER_INFO (NAME, PASSWORD, TYPE) VALUES ?',
            params: [params],
            useTransaction: useTransaction
        });
        return result.success;
    };

    /**
     * update 
     */
    _.update = async (options) => {
        var options = options || {};
        let update = options.update;
        let filter = options.filter;
        let params = options.params;
        let useTransaction = options.useTransaction || false;
        let result = await DB.query({
            sql: `UPDATE USER_INFO ${update} ${filter === undefined ? '' : 'WHERE ' + filter}`,
            params: params,
            useTransaction: useTransaction
        });
        return result.success;
    };

    /**
     * delete 
     */
    _.delete = async (options) => {
        var options = options || {};
        let filter = options.filter;
        let params = options.params;
        let useTransaction = options.useTransaction || false;
        let result = await DB.query({
            sql: `DELETE FROM USER_INFO ${filter === undefined ? '' : 'WHERE ' + filter}`,
            params: params,
            useTransaction: useTransaction
        });
        return result.success;
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
        let useTransaction = options.useTransaction || false;
        let fields = options.fields !== undefined ? options.fields.join(',') : '*';
        let result = await DB.query({
            sql: `SELECT ${fields} FROM MEMBER_INFO ${filter === undefined ? '' : 'WHERE ' + filter}`,
            params: params,
            useTransaction: useTransaction
        });
        if (!result.success) {
            return {
                success : false,
                data : null
            };
        }
        let data = one ? (result.data.length == 0 ? null : result.data[0]) : result.data;
        return {
            success : true,
            data: data
        };
    };

    /**
     * add records
     */
    _.add = async (options) => {

        var options = options || {};
        let params = options.params;
        let useTransaction = options.useTransaction || false;
        if (params === undefined) {
            return;
        }
        let result = await DB.query({
            sql: 'INSERT INTO MEMBER_INFO (NAME, CERTIFICATION) VALUES ?',
            params: [params],
            useTransaction: useTransaction
        });
        return result.success;
    };

    /**
     * update 
     */
    _.update = async (options) => {
        var options = options || {};
        let update = options.update;
        let filter = options.filter;
        let params = options.params;
        let useTransaction = options.useTransaction || false;
        let result = await DB.query({
            sql: `UPDATE MEMBER_INFO ${update} ${filter === undefined ? '' : 'WHERE ' + filter}`,
            params: params,
            useTransaction: useTransaction
        });
        return result.success;
    };

    /**
     * delete 
     */
    _.delete = async (options) => {
        var options = options || {};
        let filter = options.filter;
        let params = options.params;
        let useTransaction = options.useTransaction || false;
        let result = await DB.query({
            sql: `DELETE FROM MEMBER_INFO ${filter === undefined ? '' : 'WHERE ' + filter}`,
            params: params,
            useTransaction: useTransaction
        });
        return result.success;
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
        let useTransaction = options.useTransaction || false;
        let fields = options.fields !== undefined ? options.fields.join(',') : '*';
        let result = await DB.query({
            sql: `SELECT ${fields} FROM QRCODE_INFO ${filter === undefined ? '' : 'WHERE ' + filter}`,
            params: params,
            useTransaction: useTransaction
        });
        if (!result.success) {
            return {
                success : false,
                data : null
            };
        }
        let data = one ? (result.data.length == 0 ? null : result.data[0]) : result.data;
        return {
            success : true,
            data: data
        };
    };

    /**
     * add records
     */
    _.add = async (options) => {

        var options = options || {};
        let params = options.params;
        let useTransaction = options.useTransaction || false;
        if (params === undefined) {
            return false;
        }
        let result = await DB.query({
            sql: 'INSERT INTO QRCODE_INFO (URL, SERIALID, IDENTIFYCODE, FIRSTTIME, QUERYCOUNT, MEMBER) VALUES ?',
            params: [params],
            useTransaction: useTransaction
        });
        return result.success;
    };

    /**
     * update 
     */
    _.update = async (options) => {
        var options = options || {};
        let update = options.update;
        let filter = options.filter;
        let params = options.params;
        let useTransaction = options.useTransaction || false;
        let result = await DB.query({
            sql: `UPDATE MEMBER_INFO ${update} ${filter === undefined ? '' : 'WHERE ' + filter}`,
            params: params,
            useTransaction: useTransaction
        });
        return result.success;
    };

    /**
     * delete 
     */
    _.delete = async (options) => {
        var options = options || {};
        let filter = options.filter;
        let params = options.params;
        let useTransaction = options.useTransaction || false;
        let result = await DB.query({
            sql: `DELETE FROM MEMBER_INFO ${filter === undefined ? '' : 'WHERE ' + filter}`,
            params: params,
            useTransaction: useTransaction
        });
        return result.success;
    };


})(QRCodeInfo);

module.exports = {
    DB: DB,
    UserInfo: UserInfo,
    MemberInfo: MemberInfo,
    QRCodeInfo: QRCodeInfo
};