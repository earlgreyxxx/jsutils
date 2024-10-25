/*****************************************************************************
 * object to table element
 * --------------------------------
 *  rows: array of plain object or Map
 *  options 
 *     headers: array of object keys 
 *     labels: plain object or Map of header label association
 *     retType: if specified 'HTMLElement' return HTMLTableElement instance
 * 
 *     rowFilter: (row,index)
 *     cellFilter: (columnname,cellvalue,index)
 *     headerCellFilter: (cellvalue,index)
 *       each filter function is Function or ArrowFunction and returns start tag string(tr,td,th)
*****************************************************************************/
import * as Type from './type.js';

export default function(rows,options = {})
{
  let {headers,labels,retType,rowFilter,cellFilter,headerCellFilter} = options;

  if(!Type.isArray(rows) || rows.length == 0)
    return;

  rows = rows.filter(row => Type.isPlainObject(row) || Type.isMap(row));
  if(!Type.isArray(headers))
    headers = rows.reduce((hs,row) => {
      (Type.isMap(row) ? row.keys() : Object.keys(row)).forEach(column => hs.add(column));
      return hs;
    },new Set);

  if(labels)
  { 
    if(Type.isMap(labels))
      labels = Object.fromEntries(labels.entries())

    if(Type.isPlainObject(labels))
      labels = Array.from(headers).map(column => labels[column] ?? column);
  }
  else
  {
    labels = Array.from(headers);
  }

  const trs = rows.map((row,index) => {
    let sTr = '<tr>',eTr = '</tr>';
    if (rowFilter && Type.isFunction(rowFilter))
    {
      sTr = rowFilter(row,index) ?? '';
      if(!sTr.match(/^<tr[^>]*>$/i))
        sTr = '<tr error>';
    }

    const columns = Array.from(headers).map((columnName,index) => {
      let sTd = '<td>',eTd = '</td>';
      const cellValue = Type.isMap(row) ? row.get(columnName) : row[columnName]
      if (cellFilter && Type.isFunction(cellFilter))
      {
        sTd = cellFilter([columnName, cellValue, index]) ?? '';
        if (!sTd.match(/^<td[^>]*>$/i))
          sTd = '<td>';
      }
      return [sTd, cellValue, eTd];
    });

    return [sTr, ...columns, eTr];
  });

  labels = labels.map((value,index) => {
    let sTh = '<th>',eTh = '</th>';
    if(headerCellFilter && Type.isFunction(headerCellFilter))
    {
      sTh = headerCellFilter(value,index) ?? '';
      if (!sTh.match(/^<th[^>]*>$/i))
        sTh = '<th>';
    }
    return [sTh,value,eTh];
  });

  const html = [
    ['<thead>', '<tr>', ...labels, '</tr>', '</thead>'],
    ['<tbody>', ...trs, '</tbody>']
  ].flat(Infinity);

  return retType === 'HTMLElement' ? strCreateTable(html.join('')) : ['<table>',html,'</table>'].flat().join('\n');
}

function strCreateTable(html)
{
  const table = document.createElement('table');
  table.insertAdjacentHTML('afterbegin',html);

  return table;
}