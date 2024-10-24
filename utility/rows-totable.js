/*****************************************************************************
 * object to table element
 * rowFilter or cellFilter : filter function. prototype: function fn(row) : returns start tag string(tr or td)
 *      in filter function, pass HTMLTableCellElement to v
 * 
 *  rows: array of plain object or Map
 *  options 
 *     headers: array of object keys 
 *     labels: plain object or Map of header label association
 *     retType: if specified 'HTMLElement' return HTMLTableElement instance
*****************************************************************************/
import * as Type from './type.js';

export default function(rows,options = {})
{
  let {headers,labels,retType,rowFilter,cellFilter} = options;

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

  const trs = rows.map(row => {
    let sTr = '<tr>',eTr = '</tr>';
    if (rowFilter && Type.isFunction(rowFilter))
      sTr = rowFilter(row);

    if(!sTr.match(/^<tr[^>]*>$/i))
      sTr = '<tr error>';

    const columns = Array.from(headers).map(columnName => {
      let sTd = '<td>',eTd = '</td>';
      const cellValue = Type.isMap(row) ? row.get(columnName) : row[columnName]
      if (cellFilter && Type.isFunction(cellFilter))
        sTd = cellFilter([columnName, cellValue])

      if(!sTd.match(/^<td[^>]*>$/i))
        sTd = '<td>';

      return [sTd, cellValue, eTd];
    });

    return [sTr, ...columns, eTr];
  });

  const html = [
    ['<thead>', '<tr>', ...labels.map(th => `<th>${th}</th>`), '</tr>', '</thead>'],
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