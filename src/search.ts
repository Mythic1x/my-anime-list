import { load } from 'cheerio'
export interface options {
    name: string
    type?: "anime" | "manga"
    count?: number
}
export const search = async (options: options) => {
    let link: string
    let count: number
    let linkResults
    let mediaLinks: string[] = []
    if (options.count && options.count <= 10) {
        count = options.count
    } else {
        count = 10
    }
    if (options.type) {
        link = `https://myanimelist.net/${options.type}.php?q=${options.name.replaceAll(" ", "+")}&cat=${options.type}`
    } else {
        link = `https://myanimelist.net/search/all?cat=all&q=${options.name.replaceAll(" ", "+")}`
    }
    const body = await (await fetch(link)).text()
    const $ = load(body)
    if (options.type === 'manga') {
        linkResults = $('.hoverinfo_trigger.fw-b')
    } else if (options.type === 'anime' || !options.type) {
        linkResults = $('.hoverinfo_trigger.fw-b.fl-l')
    } else {
        throw new Error("invalid type")
    }
    if (!linkResults.attr('href')) throw new Error("No results found")
    linkResults.each((i, element) => {
        if (i > count - 1 || !$(element).attr('href')) return
        mediaLinks.push($(element).attr('href') as string)
    })
    return mediaLinks
}


