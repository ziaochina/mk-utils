
function build(nodes = [], root = { id: 0 }) {
    if (typeof root != "object") {
        root = { id: root }
    }

    root.children = nodes
        .filter(n => n.parentId == root.id)
        .map(c => build(nodes, c))

    return root
}

function find(nodes, childPropName, matchFn) {
    for (let n of nodes) {
        if (matchFn(n) === true) {
            return n
        }

        if (n[childPropName]) {
            let f = find(n[childPropName], childPropName, matchFn)
            if (f)
                return f
        }
    }
    return
}

function map(nodes, childPropName, newChildPropName, mapFun) {
    var ret = []
    for (let n of nodes) {
        //map不改变原来对象
        let o = { ...n }
        if (o[childPropName]) {
            o[newChildPropName || childPropName] = map(o[childPropName], childPropName, newChildPropName, mapFun)
            if (newChildPropName && newChildPropName != childPropName)
                delete o[childPropName]
        }
        ret.push(mapFun(o))
    }

    return ret
}


function loopTreeChildrenInternal(data, childrenProp, keyProp, titleProp, codeProp) {
    if (!data) return null
    var ret = data.map((item) => {
        if (item[childrenProp] && item[childrenProp].length) {
            return {
                name: item[keyProp],
                component: 'Tree.TreeNode',
                key: item[keyProp],
                title: (codeProp && typeof(codeProp) == 'string') ? `(${item[codeProp]})${item[titleProp]}` : item[titleProp],
                children: loopTreeChildrenInternal(item[childrenProp], childrenProp, keyProp, titleProp, codeProp)
            }
        }
        return {
            name: item[keyProp],
            component: 'Tree.TreeNode',
            key: item[keyProp],
            title: (codeProp && typeof(codeProp) == 'string')  ? `(${item[codeProp]})${item[titleProp]}` : item[titleProp]
        }
    })
    return ret
}

function loopTreeChildren(data, childrenProp = 'children', keyProp = 'id', titleProp = 'name', codeProp = 'code') {
    var ret = {
        _isMeta: true,
        value: loopTreeChildrenInternal(data, childrenProp, keyProp, titleProp, codeProp)
    }
    return ret;
}


function loopTreeSelectChildren(data, childrenProp = 'children', keyProp = 'id', titleProp = 'name') {
    if (!data)
        return

    var ret = {
        _isMeta: true,
        value: map(data, childrenProp, '', (n) => ({
            name: n[keyProp],
            component: 'TreeSelect.TreeNode',
            key: n[keyProp],
            title: n[titleProp],
            value: n[keyProp],
            children: n[childrenProp]
        }))
    }
    return ret
}



function findById(nodes, id, idProp = 'id', childrenProp = 'children') {
    var ret = find(nodes, childrenProp, n => n[idProp] == id)
    return ret
}


export default {
    build,
    find,
    findById,
    map,
    loopTreeChildren,
    loopTreeSelectChildren
}