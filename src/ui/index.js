import tree from '../tree'
import React from 'react'

function iconButton(key, title, icon, onClickHandlerName, type, fontFamily, ext = {}) {
    var ret = {
        name: key,
        component: 'Button',
        className: 'common-icon-button',
        type: type || "softly",
        iconFontFamily: fontFamily || 'awesome',
        title: title,
        icon: icon || 'plus',
        ...ext
    }
    if (onClickHandlerName)
        ret.onClick = `{{$${onClickHandlerName}(data)}}`
    return ret
}

function button(key, title, onClickHandlerName, type, ext = {}) {
    return {
        name: key,
        component: 'Button',
        type: type || 'blueSky',
        children: title,
        onClick: `{{$${onClickHandlerName}(data)}}`,
        ...ext
    }
}

function sortMenuItem(key, title, bindPath, selecedClassName, ext = {}) {
    return {
        name: key,
        component: 'Menu.Item',
        key: key,
        className: `{{${bindPath || 'data.filter.orderby'} == '${key}' ? '${selecedClassName || 'sort-selected'}':'' }}`,
        children: [title, {
            name: 'checked',
            component: 'Icon',
            type: 'check',
            _visible: `{{${bindPath || 'data.filter.orderby'} == '${key}'}}`
        }],
        ...ext
    }
}

function gridSelectColumn(gridName, bindPath, fieldName, ext = {}) {
    return {
        name: 'select',
        component: 'DataGrid.Column',
        columnKey: 'select',
        width: 40,
        fixed: true,
        header: {
            name: 'header',
            component: 'DataGrid.Cell',
            children: {
                name: 'cb',
                component: 'Checkbox',
                checked: `{{$isSelectAll('${gridName}')}}`,
                onChange: `{{$selectAll('${gridName}')}}`
            }
        },
        cell: {
            name: 'cell',
            component: 'DataGrid.Cell',
            _power: '({rowIndex})=>rowIndex',
            children: {
                name: 'checkbox',
                component: 'Checkbox',
                checked: `{{${bindPath}[_rowIndex].${fieldName}}}`,
                onChange: `{{ (e, option) => $sf('${bindPath}.' + _rowIndex + '.${fieldName}', e.target.checked ) }}`,
            }
        },
        ...ext
    }
}

function gridDelColumn(bindPath, delHandlerName, ext = {}) {
    return {
        name: 'del',
        component: 'DataGrid.Column',
        columnKey: 'del',
        fixed: true,
        width: 40,
        header: {
            name: 'header',
            component: 'DataGrid.Cell',
            children: '操作'
        },
        cell: {
            name: 'cell',
            component: 'DataGrid.Cell',
            _power: '({rowIndex})=>rowIndex',
            children: [{
                name: 'del',
                component: 'Icon',
                showStyle: 'showy',
                type: 'close',
                style: {
                    fontSize: 18
                },
                title: '删除',
                onClick: `{{$${delHandlerName}(${bindPath}[_rowIndex])}}`
            }]
        },
        ...ext
    }

}

function gridColumn(key, title, width, isFlexGrow,
    align, isLink, bindPath, idFieldName, showFieldName,
    linkClickHandlerName, ext = {}) {
    var ret = {
        name: key,
        component: 'DataGrid.Column',
        columnKey: key,
        flexGrow: isFlexGrow || 1,
        width: width || 100,
        header: {
            name: 'header',
            component: 'DataGrid.Cell',
            children: title
        },
        cell: {
            name: 'cell',
            component: 'DataGrid.Cell',
            className: `f-table-cell f-table-cell-${align || 'left'}`,
            _power: '({rowIndex})=>rowIndex',
            children: [{
                name: 'link',
                component: '::a',
                children: '{{data.list[_rowIndex].code}}',
                onClick: '{{$modify(data.list[_rowIndex].id)}}'
            }]
        },
        ...ext
    }

    if (isLink) {
        ret.cell.children = {
            name: 'link',
            component: '::a',
            children: `{{${bindPath}[_rowIndex].${showFieldName}}}`,
            onClick: `{{$${linkClickHandlerName}(${bindPath}[_rowIndex])}}`
        }
    }
    else {
        ret.cell.children = `{{${bindPath}[_rowIndex].${showFieldName}}}`
    }

    return ret
}

function loopTreeChildrenInternal(data, childrenName) {
    if (!data) return null
    var ret = data.map((item) => {
        if (item[childrenName] && item[childrenName].length) {
            return {
                name: item.id,
                component: 'Tree.TreeNode',
                key: item.id,
                title: item.name,
                children: loopTreeChildrenInternal(item[childrenName], childrenName)
            }
        }
        return {
            name: item.id,
            component: 'Tree.TreeNode',
            key: item.id,
            title: item.name
        }
    })
    return ret
}

function loopTreeChildren(data, childrenName = 'children') {
    var ret = {
        _isMeta: true,
        value: loopTreeChildrenInternal(data, childrenName)
    }
    return ret;
}

function inputFormItem(key, title, required = false, bindPath, ext = {}) {
    return {
        name: key,
        component: 'Form.Item',
        label: title,
        required: required,
        //validateStatus: "{{data.other.error.name?'error':'success'}}",
        //help: '{{data.other.error.name}}',
        children: [{
            name: key,
            component: 'Input',
            value: `{{${bindPath}}}`,
            onChange: `{{(e)=>$sf('${bindPath}',e.target.value)}}`,
        }],
        ...ext
    }
}

function treeSelectFormItem(key, title, required = false, bindPath,
    dsPath, loopChildrenHandlerName, changeHandlerName, focusHandlerName, ext = {}) {
    return {
        name: key,
        component: 'Form.Item',
        label: title,
        required: required,
        //validateStatus: "{{data.other.error.customerGroup?'error':'success'}}",
        //help: '{{data.other.error.customerGroup}}',
        children: [{
            name: key,
            component: 'TreeSelect',
            treeDefaultExpandAll: true,
            dropdownStyle: { maxHeight: 400, overflow: 'auto' },
            onChange: `{{$${changeHandlerName}(data)}}`,
            onFocus: `{{$${focusHandlerName}(data)}}`,
            value: `{{{
                return (${dsPath} && ${bindPath} && ${bindPath}.id) || (${bindPath} && ${bindPath}.name) || ''
            }}}`,
            children: `{{$${loopChildrenHandlerName}(${dsPath})}}`,
        }],
        ...ext
    }   
}


function loopTreeSelectChildren(ds) {
    if (!ds)
        return

    var ret = {
        _isMeta: true,
        value: tree.map(ds, 'children', '', (n) => ({
            name: n.id,
            component: 'TreeSelect.TreeNode',
            key: n.id,
            title: n.name,
            value: n.id,
            children: n.children
        }))
    }
    return ret
}


function toToastContent(msg){
    return  ( <ul style={{ textAlign: 'left' }}>
        {msg.map(o => <li>{o}</li>)}
    </ul>)
}

export default {
    iconButton,
    button,
    sortMenuItem,
    gridSelectColumn,
    gridDelColumn,
    gridColumn,
    loopTreeChildren,
    inputFormItem,
    treeSelectFormItem,
    loopTreeSelectChildren,
    toToastContent
}