// "ER_NO_SUCH_TABLE"：表不存在
// "ER_ACCESS_DENIED_ERROR"：访问被拒绝
/**
 * mysql错误码枚举
 *
 * @https://dev.mysql.com/doc/mysql-errors/8.0/en/server-error-reference.html
 */
export enum MySqlErrorCode {
  /**
   * 具有唯一索引或主键的表中插入重复的值时发生了错误
   */
  ER_DUP_ENTRY = 1062,
  ER_NO_REFERENCED_ROW = 1452,
  /**
   * 数据过长
   */
  ER_DATA_TOO_LONG = 1406,
  /**
   * 等待锁超时
   */
  ER_LOCK_WAIT_TIMEOUT = 1205,
  /**
   * 语法错误
   */
  ER_PARSE_ERROR = 1064,
  /**
   * ：表已经存在
   */
  ER_TABLE_EXISTS_ERROR = 1050,
  /**
   * ：字段不存在
   */
  ER_BAD_FIELD_ERROR = 1054,
  /**
   * 非唯一键值
   */
  ER_NONIQ_ERROR = 1175,
  /**
   * 重复键值
   */
  ER_DUP_KEY = 1022,
  /**
   * 外键约束错误
   */
  ER_ROW_IS_REFERENCED_2 = 1451,
}
