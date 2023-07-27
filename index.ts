import { search } from "./src/search";
import { parseLinks } from "./src/parsing";
import { type options } from "./src/search";

export const get = async (options: options) => {
    const links = await search(options)
    const results = await parseLinks(links, options.type)
    return results
}

get({ name: "death note", type: "manga"}).then(res => console.log(res))

export default {
    get
}