const exceptions = []

function error(err){
    console.error(err)
    exceptons.unshift(error)
}

export default {
   error
}