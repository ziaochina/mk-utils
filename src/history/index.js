import * as history from 'history'

const hashHistory = history.createHashHistory()

const listerners = {}

function listen(selfApp, handler) {
    if (!listerners[selfApp]) {
        listerners[selfApp] = []
    }

    var h = listerners[selfApp].find(o => o.listen == handler)
    if (!h) {
        
        h = handler
        var unlisten = hashHistory.listen((location, action) => {
            const childApp = getChildApp(selfApp, location.pathname)
            handler(childApp, location, action)
        })

        listerners[selfApp].push({
            listen: h,
            unlisten
        })
    }
}

function unlisten(selfApp, handler){
    if (!listerners[selfApp]) 
        return

    const index = listerners[selfApp].findIndex(o => o.listen == handler)

    if(index == -1)
        return 

    listerners[selfApp][index].unlisten()
    listerners[selfApp].splice(index,1)
}


function getChildApp(selfApp) {
    const pathname = hashHistory.location.pathname + hashHistory.location.search
    if (!pathname || pathname == '/' || pathname.indexOf(selfApp) == -1)
        return 

    const segs = pathname.split('/')

    const selfIndex = segs.findIndex( s => s.indexOf(selfApp) != -1)

    if(segs.length -1 == selfIndex)
        return

    const ret = segs[selfIndex + 1]

    return ret == '/' ? undefined : ret
}

function pushChildApp(selfApp, childApp){
    const pathname = hashHistory.location.pathname
    if (!pathname || pathname == '/' || pathname.indexOf(selfApp) == -1){
        hashHistory.push(`/${selfApp}/${childApp}`)
        return
    }
    
    const segs = pathname.split('/')

    const selfIndex = segs.findIndex( s => s.indexOf(selfApp) != -1)

    if(segs.length -1 == selfIndex){
        segs.push(childApp)
    }
    else{
        segs.splice(selfIndex + 1, segs.length - selfIndex, childApp)
        //segs[selfIndex + 1] = childApp
    }

    if(pathname == segs.join('/'))
        return

    hashHistory.push(segs.join('/'))
}


export default {
    listen,
    unlisten,
    getChildApp,
    pushChildApp,
    location: hashHistory.location
}