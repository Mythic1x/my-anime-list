import { load } from "cheerio"
class Media {
    title: string
    synopsis: string
    ranked: string
    score: string
    popularity: string
    genres: string[]
    themes: string[]
    demographics: string[]
    cover: string
    constructor(title: string, synopsis: string, ranked: string, score: string, populartiy: string, genres: string[], themes: string[], demographics: string[], cover: string) {
        this.title = title
        this.synopsis = synopsis
        this.ranked = ranked
        this.score = score
        this.popularity = populartiy
        this.genres = genres
        this.themes = themes
        this.demographics = demographics
        this.cover = cover
    }

}


class Anime extends Media {
    rating: string
    duration: string
    aired: string
    episodes: string
    constructor(title: string, synopsis: string, ranked: string, score: string, populartiy: string, genres: string[], themes: string[], demographics: string[], cover: string, rating: string, duration: string, aired: string, episodes: string) {
        super(title, synopsis, ranked, score, populartiy, genres, themes, demographics, cover)
        this.rating = rating
        this.duration = duration
        this.aired = aired
        this.episodes = episodes
    }
}

class Manga extends Media {
    volumes: string
    chapters: string
    published: string
    constructor(title: string, synopsis: string, ranked: string, score: string, populartiy: string, genres: string[], themes: string[], demographics: string[], cover: string, volumes: string, chapters: string, published: string) {
        super(title, synopsis, ranked, score, populartiy, genres, themes, demographics, cover)
        this.volumes = volumes
        this.chapters = chapters
        this.published = published
    }
}

export const parseLinks = async (links: string[], type?: "anime" | "manga") => {
    const results = []
    const htmls = await Promise.all(links.map(link => fetch(link).then(res => res.text())))
    for (const body of htmls) {
        const $ = load(body)
        let title = $('.h1-title').text()
        let score = $('[class^="score-label score-"]').text().trim()
        let synopsis = $('[itemprop="description"]').text().replace("[Written by MAL Rewrite]", "")
        let ranked = $('.numbers.ranked').text().trim()
        let popularity = $('.numbers.popularity').text().trim()
        //remove whitespace and newlines, then convert to an array
        let genres: string[] = $('.spaceit_pad:contains("Genre")').text().trim().replaceAll("\n", "").split(" ")
        let themes: string[] = $('.spaceit_pad:contains("Theme")').text().trim().replaceAll("\n", "").split(" ")
        let demographics: string[] = $('.spaceit_pad:contains("Demographic")').text().trim().replaceAll("\n", "").split(" ")
        let cover = $('.lazyload').attr('data-src') as string
        if (type === "anime" || !type) {
            let rating = $('.spaceit_pad:contains("Rating")').text().trim().replaceAll("\n", "") || "Unrated"
            let duration = $('.spaceit_pad:contains("Duration")').text().trim().replaceAll('\n', "")
            let aired = $('.spaceit_pad:contains("Aired")').text().trim().replaceAll('\n', "")
            let episodes = $('.spaceit_pad:contains("Episodes")').text().trim().replaceAll('\n', "")
            results.push(new Anime(title, synopsis, ranked, score, popularity, genres, themes, demographics, cover, rating, duration, aired, episodes))
        } else if (type === 'manga') {
            let chapters = $('.spaceit_pad:contains("Chapters")').text().trim()
            let published = $('.spaceit_pad:contains("Published")').text().trim().replaceAll('\n', "")
            let volumes = $('.spaceit_pad:contains("Volumes")').text().trim()
            results.push(new Manga(title, synopsis, ranked, score, popularity, genres, themes, demographics, cover, volumes, chapters, published))
        } else {
            throw new Error("Invalid type")
        }
    }
    return results
}