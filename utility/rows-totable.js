/*****************************************************************************
 * object to table element
 * fn: filter function. prototype: function fn(v); 
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
  let {headers,labels,retType} = options;

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

  const thead = ['<thead>','<tr>',...labels.map(th => `<th>${th}</th>`),'</tr>','</thead>'];
  const tbody = ['<tbody>',...rows.map(tr => ['<tr>',...Array.from(headers).map(column => `<td>${Type.isMap(tr) ? tr.get(column) : tr[column]}</td>`),'</tr>']),'</tbody>'];
  const html = [thead,tbody].flat(Infinity);

  return retType === 'HTMLElement' ? strCreateTable(html.join('')) : ['<table>',html,'</table>'].flat().join('\n');
}

function strCreateTable(html)
{
  const table = document.createElement('table');
  table.insertAdjacentHTML('afterbegin',html);

  return table;
}