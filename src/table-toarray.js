/*****************************************************************************
 * table to json
 * fn: filter function. prototype: function fn(v); 
 *      in filter function, pass HTMLTableCellElement to v
*****************************************************************************/
import * as Type from './type.js';

export default function(oTable,options = {})
{
  const {fn, headers} = options;

  if(Type.getType(oTable) !== 'HTMLTableElement')
    throw new Error('not table element');

  let heads;
  const rows = [];
  const excludes = new Set;

  if (Array.isArray(headers) && headers.length > 0)
  {
    heads = [...headers];
  }
  else
  {
    const oThead = oTable.tHead;
    if (!oThead)
      throw new Error('thead element not found');

    const tr = oThead.querySelector('thead > tr');
    heads = Array.from(tr.querySelectorAll('tr > *')).map(td => td.dataset?.key && td.dataset.key.length > 0 ? td.dataset.key : td.textContent.trim());
  }

  const oTbodies = oTable.tBodies;
  if (oTbodies.length == 0)
    throw new Error('tbody element not found');

  const oTbody = oTbodies[0];
  const filter = fn || (v => v);

  oTbody.querySelectorAll('tbody > tr').forEach((tr, r) => {
    let row = rows[r] === undefined ? {} : rows[r];

    let oTDs = tr.querySelectorAll('tr > *');
    let columnnum = heads.length;

    for (let c = 0, h = 0; c < columnnum; c++, h++)
    {
      while (heads[h] in row)
        h++;

      let td = oTDs.item(c);
      if (!td)
        continue;

      const colspan = parseInt(td.getAttribute('colspan')) || 1;
      const rowspan = parseInt(td.getAttribute('rowspan')) || 1;
      const text = td.textContent.trim();
      const cellText = filter ? filter.call(td, text) : text;

      if (h < heads.length && !(heads[h] in row))
        row[heads[h]] = cellText;

      if (rowspan > 1)
      {
        for (let i = 1; i < rowspan; i++)
        {
          if (rows[r + i] === undefined)
            rows[r + i] = {};

          rows[r + i][heads[h]] = cellText;
        }
      }

      if (colspan > 1)
        h += (colspan - 1);
    }
    if (rows[r] === undefined)
      rows[r] = row;

    if (tr.dataset?.exclude === 'true')
      excludes.add(r);

  });

  return rows.filter((v, i) => !excludes.has(i));
}
