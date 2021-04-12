# ytm-search

<p align="center">
  <img src="https://github.com/stilleur/ytm-search/actions/workflows/node.js.yml/badge.svg" alt="Build Status">
  <img src="https://img.shields.io/npm/dm/ytm-search.svg?sanitize=true" alt="Downloads">
  <img src="https://img.shields.io/npm/v/ytm-search.svg?sanitize=true" alt="Version">
  <img src="https://img.shields.io/npm/l/vue.svg?sanitize=true" alt="License">
</p>

**ytm-search** allows you to search playlists and retrieve the associated musics from Youtube Music.

## Getting started

```ts
const ytm = new YoutubeMusic()
const playlists = await ytm.findPlaylists('80s')
const musics = await ytm.getMusics(playlists[0].playlistId)
```
