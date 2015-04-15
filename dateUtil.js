/**
 * handle date format
 * 时间格式化工具
 * format.toDateString(new Date(),'yyyy-MM-dd hh:mm:ss')
 * format.parseDate('2012-01-02','yyyy-MM-dd')》2012年1月2号所对应的Date对象;
 * format.formatDate('2012-01-02','yyyy-MM-dd','yyyy/MM/dd')》2012/01/02;
 * Created by liugb on 15/4/15.
 */
var format =
{
    REGEXP_DATE: /(yyyy|MM|dd|hh|mm|ss|S)/g,
    DATE_FORMAT_PARSER :{
        'yyyy': {
            formatter: function(date) {
                return date.getFullYear(); //得到四位年份
            },
            parser: function(date, src, pos) { //date为日期类型的实例，src源日期形式的字符串，pos开始截取的索引
                var y = format._getNextNumber(src, pos, 4); //得到4位数字形式的字符串
                date.setFullYear(parseInt(y, 10)); //设置日期的年份
                return y.length - 4; //返回实际年份的长度与标准年份长度的差
            }
        },
        'MM': { //月
            formatter: function(date) {
                return format.leftPadZero((date.getMonth() + 1).toString(), 2);
            },
            parser: function(date, src, pos) {
                var m = format._getNextNumber(src, pos, 2);
                date.setMonth(parseInt(m, 10) - 1);
                return m.length - 2;
            }
        },
        'dd': { //日
            formatter: function(date) {

                return format.leftPadZero(date.getDate().toString(), 2);
            },
            parser: function(date, src, pos) {
                var d = format._getNextNumber(src, pos, 2);
                date.setDate(parseInt(d, 10));
                return d.length - 2;
            }
        },
        'hh': { //小时
            formatter: function(date) {
                return format.leftPadZero(date.getHours().toString(),2);//date.getHours().toString().leftPadZero(2);
            },
            parser: function(date, src, pos) {
                var h = format._getNextNumber(src, pos, 2);
                date.setHours(parseInt(h, 10));
                return h.length - 2;
            }
        },
        'mm': { //分钟
            formatter: function(date) {
                return format.leftPadZero(date.getMinutes().toString(),2);//date.getMinutes().toString().leftPadZero(2);
            },
            parser: function(date, src, pos) {
                var m = format._getNextNumber(src, pos, 2);
                date.setMinutes(parseInt(m, 10));
                return m.length - 2;
            }
        },
        'ss': { //秒
            formatter: function(date) {
                return  format.leftPadZero(date.getSeconds().toString(),2);//date.getSeconds().toString().leftPadZero(2);
            },
            parser: function(date, src, pos) {
                var s = format._getNextNumber(src, pos, 2);
                date.setSeconds(parseInt(s, 10));
                return s.length - 2;
            }
        },
        'S': { //毫秒
            formatter: function(date) {
                return format.leftPadZero(date.getMilliseconds(),3);//date.getMilliseconds().toString().leftPadZero(3);
            },
            parser: function(date, src, pos) {
                var s = format._getNextNumber(src, pos, 3);
                date.setMilliseconds(parseInt(s, 10));
                return s.length - 3;
            }
        }
    },
    /**
     *重复指定次的字符串
     *@param {string} str   需要被操作的字符串
     *@param {number} count   对本字符串的重复次数
     *@return {string}   重复指定次数后的字符串
     */
    times : function(str, count) {
        return count < 1 ? '' : new Array(count + 1).join(str);
    },
    /**
     * 在字符串左侧按指定的个数补0
     * @param {string} str   需要被操作的字符串
     * @param {number} width   补充的0的个数
     * @return {string}    补充0后的字符串
     */
    leftPadZero : function(str, width) {
        var pad = width - str.length;
        return pad > 0 ? this.times('0', pad) + str : str;
    },

    /**
     * 得到指定字符串中开始位置和指定长度的字符串
     * @param {string} src    要转换的由数字组成的字符串
     * @param {number} pos    开始位置的索引
     * @param {number} maxLength    截取字符的长度
     * @return {string} 转换后的金额字符串
     */
    _getNextNumber : function(src, pos, maxLength) {
        var tmp = src.substr(pos, maxLength);
        for (var i = 0, len = tmp.length; i < len; i++) {
            //检查tmp中是否包含非数字字符，从开始检查直至检查到非数字为止，则返回非数字之前的字符串
            if ('0123456789'.indexOf(tmp.charAt(i)) == -1) {
                return tmp.substr(0, i);
            }
        }
        return tmp;
    },

    /**
     * 获得日期形式的字符串
     * @param {Date} date    要设置的日期实例
     * @param {string} format    日期形式的串
     * @return {string}     按format格式转换后的日期字符串
     * @exp format.toDateString(new Date(Date.parse(Date.parse("Jul 8, 20012"))),'yyyy-MM-dd')》2012-07-08
     */
    toDateString : function(date, formatStr) {
        try {
            return formatStr.replace(format.REGEXP_DATE, function(pattern) {
                if (format.DATE_FORMAT_PARSER[pattern]) {
                    return format.DATE_FORMAT_PARSER[pattern].formatter(date);
                } else {
                    return pattern;
                }
            });
        } catch (e) {
            throw new Error('Invalid Date leaded to \n' + e);
        }
        return null;
    },

    /**
     * 获得日期形式的字符串
     * @param {string} value    日期形式的字符串
     * @param {string} format    日期形式的串
     * @return {Date}     按format格式转换后的日期
     * @exp format.parseDate('2012-01-02','yyyy-MM-dd')》2012年1月2号所对应的Date对象;
     */
    parseDate : function(value, formatStr) {
        try {
            var date = new Date(1970, 0, 1, 0, 0, 0, 0);
            var regexp = /yyyy|MM|dd|hh|mm|ss/g;
            var shift = 0;
            var result;
            while ((result = regexp.exec(formatStr)) !== null) {
                var pattern = result[0];
                var position = result.index + shift;
                if (format.DATE_FORMAT_PARSER[pattern])
                    shift += format.DATE_FORMAT_PARSER[pattern].parser(date, value, position);
            }
            // 加上result为空的判断,为了解决传入的字符串格式不正确的问题
            // IE下用isNaN来判断，其它浏览器通过Invalid Date来判断
            if (date == "Invalid Date" || isNaN(date)) {
                return null;
            }
            return date;
        } catch (e) {
            throw new Error(e);
        }
        return null;
    },

    /*将日期由当前格式转换为指定格式
     * @param {string} value转换前的日期
     * @param {string} fromFormat转换前的格式
     * @param {string} toFormat转换后的格式
     * @return {string} 参数toFormat所指定格式
     * @exp format.formatDate('2012-01-02','yyyy-MM-dd','yyyy/MM/dd')》2012/01/02;
     */
    formatDate : function(value, fromFormat, toFormat) {
        return this.toDateString(format.parseDate(value, fromFormat), toFormat);
    }
};

