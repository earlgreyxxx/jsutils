/*****************************************************************************
 * object to table element
 * fn: filter function. prototype: function fn(v); 
 *      in filter function, pass HTMLTableCellElement to v
*****************************************************************************/
import * as Type from './type.js';

export default function(rows,options = {})
{
  let {headers,retType} = options;

  if(!Type.isArray(rows) || rows.length == 0)
    return;

  rows = rows.filter(row => Type.isPlainObject(row) || Type.isMap(row));
  if(!Type.isArray(headers))
    headers = rows.reduce((hs,row) => {
      (Type.isMap(row) ? row.keys() : Object.keys(row)).forEach(column => hs.add(column));
      return hs;
    },new Set);

  const thead = ['<thead>','<tr>',...Array.from(headers).map(th => `<th>${th}</th>`),'</tr>','</thead>'];
  const tbody = ['<tbody>',...rows.map(tr => ['<tr>',...Array.from(headers).map(column => `<td>${Type.isMap(tr) ? tr.get(column) : tr[column]}</td>`),'</tr>']),'</tbody>'];
  const html = [thead,tbody].flat(Infinity);

  console.log(['<table>', html, '</table>'].flat().join('\n'));
  return;

  return retType === 'HTMLElement' ? strCreateTable(html.join('')) : ['<table>',html,'</table>'].flat().join('\n');
}

function strCreateTable(html)
{
  const table = document.createElement('table');
  temp.insertAdjacentHTML('afterbegin',html);

  return table;
}