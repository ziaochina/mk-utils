import moment from 'moment'

function stringToMoment(v) {
    if (!v)
        return v
    return moment(new Date(v))
}

function momentToString(v, format) {
    if (!v)
        return v
    return moment(v).format(format)
}

function getThisWeekRange(format = 'YYYY-MM-DD') {
    return [
        moment().startOf('week').format(format),
        moment().endOf('week').format(format)
    ]
}

function getLastWeekRange(format = 'YYYY-MM-DD') {
    return [
        moment().subtract(1, 'week').startOf('week').format(format),
        moment().subtract(1, 'week').endOf('week').format(format)
    ]
}

function getThisMonthRange(format = 'YYYY-MM-DD') {
    return [
        moment().startOf('month').format(format),
        moment().endOf('month').format(format),
    ]
}

function getLastMonthRange(format = 'YYYY-MM-DD'){
    return [
        moment().subtract(1, 'month').startOf('month').format(format),
        moment().subtract(1, 'month').endOf('month').format(format),
    ]
}

function getThisYearRange(format = 'YYYY-MM-DD'){
    return [
        moment().startOf('year').format(format),
        moment().endOf('year').format(format),
    ]
}

function getLastYearRange(format = 'YYYY-MM-DD'){
    return [
        moment().subtract(1, 'year').startOf('year').format(format),
        moment().subtract(1, 'year').endOf('year').format(format),
    ]
}

export default {
    stringToMoment,
    momentToString,
    getThisWeekRange,
    getLastWeekRange,
    getThisMonthRange,
    getLastMonthRange,
    getThisYearRange,
    getLastYearRange
}