# ytm-search

<p align="center">
  <a href="https://github.com/stilleur/ytm-search/actions/workflows/node.js.yml"><img src="https://github.com/stilleur/ytm-search/actions/workflows/node.js.yml/badge.svg" alt="Build Status"></a>
  <a href="https://www.npmjs.com/package/ytm-search"><img src="https://img.shields.io/npm/dm/ytm-search.svg?sanitize=true" alt="Downloads"></a>
  <a href="https://www.npmjs.com/package/ytm-search"><img src="https://img.shields.io/npm/v/ytm-search.svg?sanitize=true" alt="Version"></a>
  <a href="https://www.npmjs.com/package/ytm-search"><img src="https://img.shields.io/npm/l/ytm-search.svg?sanitize=true" alt="License"></a>
</p>

**ytm-search** allows you to search playlists and retrieve the associated musics from Youtube Music.

## Getting started

```ts
const ytm = new YoutubeMusic()
const playlists = await ytm.findPlaylists('80s')
const musics = await ytm.getMusics(playlists[0].playlistId)
```
