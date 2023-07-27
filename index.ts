import { search } from "./src/search";
import { parseLinks } from "./src/parsing";
import { type options } from "./src/search";

export const get = async (options: options) => {
    const links = await search(options)
    const results = await parseLinks(links, options.type)
    return results
}


export default {
    get
}