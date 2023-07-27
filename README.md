# my-anime-list

Barebones library for scraping myanimelist.net

Requires Cheerio

Import mal and then use it like this
```ts
mal.get({ name: "death note", type: "anime", count: 10 })
```

Type supports either anime or manga, and count supports <= 10
