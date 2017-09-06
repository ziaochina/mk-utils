const exceptions = []

function error(err){
    console.error(err)
    exceptions.unshift(error)
}

function clear(){
    exceptions.splice(0, exceptions.length)
}

function getExceptions(){
    return exceptions
}


export default {
   error,
   clear,
   getExceptions
}