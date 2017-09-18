
function build(nodes = [], root = { id: 0 }) {
    if (typeof root != "object") {
        root = { id: root }
    }
    
    root.children = nodes
        .filter(n => n.parentId == root.id)
        .map(c => build(nodes, c))

    return root
}

export default {
    build
}