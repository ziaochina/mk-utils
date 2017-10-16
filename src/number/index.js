function getPrecision(value) {
    const valueString = value.toString()
    //取e-后字符转换成int,e-10=>10
    if (valueString.indexOf('e-') >= 0) {
        return parseInt(valueString.slice(valueString.indexOf('e-') + 1), 10)
    }

    let precision = 0;
    //取小数点后字符长度0.0001=>4
    if (valueString.indexOf('.') >= 0) {
        precision = valueString.length - valueString.indexOf('.') - 1
    }
    //否则0
    return precision
}

function format(number, decimals, thousandsSep, decPoint) {
    number = (number + '').replace(/[^0-9+-Ee.]/g, '')

    var n = !isFinite(+number) ? 0 : +number,
        prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
        sep = typeof thousandsSep !== 'string' ? ',' : thousandsSep,
        dec = typeof decPoint !== 'string' ? '.' : decPoint,

        s = '',
        toFixedFix = function (n, prec) {
            var k = Math.pow(10, prec)
            return '' + Math.ceil(n * k) / k
        }

    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.')
    var re = /(-?\d+)(\d{3})/
    while (re.test(s[0])) {
        s[0] = s[0].replace(re, "$1" + sep + "$2")
    }

    if ((s[1] || '').length < prec) {
        s[1] = s[1] || ''
        s[1] += new Array(prec - s[1].length + 1).join('0')
    }
    return s.join(dec)
}

export default {
    getPrecision,
    format
}