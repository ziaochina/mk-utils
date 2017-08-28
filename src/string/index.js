function trimLeft(str){
    return str.replace(/(^\s*)/g,"")
}

function trimRight(str){
    return str.replace(/(\s*$)/g,"")
}

function trim(str){
    return str.replace(/(^\s*)|(\s*$)/g,"")
}

export default {
    trimLeft,
    trimRight,
    trim
}