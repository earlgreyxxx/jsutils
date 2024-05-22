/***********************************************************************
  Shuffle array
***********************************************************************/
export const shuffle = (arr,initArray = []) => arr.reduce(reducer,initArray).filter(v => v !== undefined);

function reducer(rv, current)
{
  rv[publish(rv)] = current;
  return rv;
}

const randomContainer = new Uint16Array(1);
function publish(check)
{
  let index;
  do {
    index = self.crypto.getRandomValues(randomContainer).at(0);
  } while (check[index] !== undefined);

  return index;
}
