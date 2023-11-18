/*******************************************************************************

  - Cached Fetch

*******************************************************************************/
export default class
{
  #name;
  #expire;
  enabled;

  constructor(name,expire = 1209600)
  {
    if(!name)
      throw new Error('require constructor argument for cache name');

    this.enabled = true;
    if(!globalThis?.isSecureContext || !globalThis?.caches)
      this.enabled = false;

    this.#name = name;
    this.#expire = expire;
  }

  fetch(url,params = null)
  {
    return this.enabled ? this.#cachedFetch(url,params) : fetch(url,params);
  }

  // clear all cache
  async clear()
  {
    if(this.enabled)
    {
      const cache = await caches.open(this.#name);
      const requests = Array.from(await cache.keys());
      return Promise.all(requests.map(req => cache.delete(req)));
    }
    else
    {
      return false;
    }
  }

  // use Cache API and cache expire 2 weeks
  async #cachedFetch(url,params = null)
  {
    let rv;
    const cache = await caches.open(this.#name);
    const today = Math.ceil(new Date().getTime() / 1000);
    let response = await cache.match(url);

    if(!response || ((parseInt(response.headers.get('cache-timestamp') || -1) + this.#expire <= today)))
    {
      response = await fetch(url,params);
      await this.#addex(url,response);

      response = await cache.match(url);
    }

    return response;
  }

  // add cache cloned response
  async #addex(url,response)
  {
    if (!response.ok)
      throw new TypeError("bad response status");

    const cache = await caches.open(this.#name);
    const headers = new Headers(response.headers);
    headers.append('Cache-Timestamp',Math.ceil(new Date().getTime() / 1000));
    const blob = await response.blob();

    await cache.put(
      url,
      new Response(blob, {
        status: response.status,
        statusText: "",
        headers
      })
    );

    return response;
  }
}
