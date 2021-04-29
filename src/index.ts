import axios from 'axios'

export class YoutubeMusic {
  private static readonly hostname = 'music.youtube.com'
  private static readonly url = `https://${YoutubeMusic.hostname}/`
  private static readonly apiUrl = `${YoutubeMusic.url}youtubei/v1/`

  private static readonly songsRegex = new RegExp('^\\d+')

  private static readonly headers = {
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36',
    'content-type': 'application/json',
    referer: YoutubeMusic.url
  }

  private static readonly context = {
    client: {
      clientName: 'WEB_REMIX',
      clientVersion: '0.1',
      hl: 'en',
      gl: 'US'
    }
  }

  private readonly axios = axios.create({
    baseURL: YoutubeMusic.apiUrl,
    headers: YoutubeMusic.headers,
    params: { alt: 'json', key: 'AIzaSyC9XL3ZjWddXya6X74dJoCTL-WEYFDNX30' }
  })

  /**
   * Get the musics from the given playlist id.
   * @param playlistId The playlist id.
   * @returns The musics from the given playlist id.
   */
  public async getMusics (playlistId: string): Promise<Music[]> {
    if (!playlistId) throw new TypeError("The argument 'playlistId' is mandatory.")

    const musics: Music[] = []

    const response = await this.axios.post<BrowseResponse>('browse', {
      context: YoutubeMusic.context,
      browseId: `VL${playlistId}`
    })

    for (const music of response.data.contents.singleColumnBrowseResultsRenderer.tabs[0].tabRenderer.content.sectionListRenderer.contents[0].musicPlaylistShelfRenderer.contents) {
      const title = music.musicResponsiveListItemRenderer.flexColumns[0].musicResponsiveListItemFlexColumnRenderer.text.runs[0].text
      const artist = music.musicResponsiveListItemRenderer.flexColumns[1].musicResponsiveListItemFlexColumnRenderer.text.runs[0].text
      const videoId = music.musicResponsiveListItemRenderer.overlay.musicItemThumbnailOverlayRenderer.content.musicPlayButtonRenderer.playNavigationEndpoint.watchEndpoint.videoId
      const duration = music.musicResponsiveListItemRenderer.fixedColumns[0].musicResponsiveListItemFixedColumnRenderer.text.runs[0].text

      musics.push(new Music(title, artist, videoId, duration))
    }

    return musics
  }

  /**
   * Find the playlists related to the given search value.
   * @param searchValue The search value.
   * @returns The playlists related to the given search value.
   * @throws {YoutubeMusicNoPlaylistError} When the search response does not contain any playlist.
   * Happens occasionally even when the request is valid and should have returned some playlists.
   */
  public async findPlaylists (searchValue: string): Promise<Playlist[]> {
    if (!searchValue) throw new TypeError("The argument 'searchValue' is mandatory.")

    const playlists: Playlist[] = []

    const response = await this.axios.post<SearchResponse>('search', {
      context: YoutubeMusic.context,
      query: searchValue
    })

    const musicShelves = response.data.contents.sectionListRenderer.contents
    const musicResponsiveListItems = [].concat.apply([], musicShelves.map(ms => ms.musicShelfRenderer?.contents)) as MusicResponsiveListItem[]
    const playlistResponsiveListItems = musicResponsiveListItems.filter(this.isPlaylistResponsiveListItem)

    for (const playlist of playlistResponsiveListItems) {
      const title = playlist.musicResponsiveListItemRenderer.flexColumns[0].musicResponsiveListItemFlexColumnRenderer.text.runs[0].text
      const playlistId = playlist.musicResponsiveListItemRenderer.overlay.musicItemThumbnailOverlayRenderer.content.musicPlayButtonRenderer.playNavigationEndpoint.watchPlaylistEndpoint.playlistId
      const songCount = Number(playlist.musicResponsiveListItemRenderer.flexColumns[1].musicResponsiveListItemFlexColumnRenderer.text.runs[4].text.match(YoutubeMusic.songsRegex)[0])

      playlists.push(new Playlist(title, playlistId, songCount))
    }

    return playlists
  }

  private isPlaylistResponsiveListItem (musicResponsiveListItem: MusicResponsiveListItem) {
    const musicResponsiveListItemType = musicResponsiveListItem?.musicResponsiveListItemRenderer?.flexColumns[1]?.musicResponsiveListItemFlexColumnRenderer?.text?.runs[0]?.text
    return musicResponsiveListItemType && musicResponsiveListItemType === 'Playlist'
  }
}

export class Music {
  readonly title: string
  readonly artist: string
  readonly videoId: string
  readonly duration: string

  constructor (title: string, artist: string, videoId: string, duration: string) {
    this.title = title
    this.artist = artist
    this.videoId = videoId
    this.duration = duration
  }
}

export class Playlist {
  readonly title: string
  readonly playlistId: string
  readonly songCount: number

  constructor (title: string, playlistId: string, songCount: number) {
    this.title = title
    this.playlistId = playlistId
    this.songCount = songCount
  }
}

export class YoutubeMusicError extends Error {
  constructor (message: string) {
    super(message)
    this.name = 'YoutubeMusicError'
    Object.setPrototypeOf(this, YoutubeMusicError.prototype)
  }
}

export class YoutubeMusicNoPlaylistError extends YoutubeMusicError {
  constructor (message: string) {
    super(message)
    this.name = 'YoutubeMusicNoPlaylistError'
    Object.setPrototypeOf(this, YoutubeMusicNoPlaylistError.prototype)
  }
}

// eslint-disable-next-line no-unused-vars
class BrowseResponse {
  contents: {
    singleColumnBrowseResultsRenderer: {
      tabs: Tab[]
    }
  }
}

// eslint-disable-next-line no-unused-vars
class Tab {
  tabRenderer: {
    content: {
      sectionListRenderer: {
        contents: MusicPlaylistShelf[]
      }
    }
  }
}

// eslint-disable-next-line no-unused-vars
class MusicPlaylistShelf {
  musicPlaylistShelfRenderer: {
    contents: MusicResponsiveListItem[]
  }
}

// eslint-disable-next-line no-unused-vars
class SearchResponse {
  contents: {
    sectionListRenderer: {
      contents: MusicShelf[]
    }
  }
}

// eslint-disable-next-line no-unused-vars
class MusicShelf {
  musicShelfRenderer: {
    title: {
      runs: Run[]
    }
    contents: MusicResponsiveListItem[]
  }
}

// eslint-disable-next-line no-unused-vars
class MusicResponsiveListItem {
  musicResponsiveListItemRenderer: {
    overlay: {
      musicItemThumbnailOverlayRenderer: {
        content: {
          musicPlayButtonRenderer: {
            playNavigationEndpoint: {
              watchPlaylistEndpoint: {
                playlistId: string
              },
              watchEndpoint: {
                videoId: string
              }
            }
          }
        }
      }
    }
    flexColumns: MusicResponsiveListItemFlexColumn[]
    fixedColumns: MusicResponsiveListItemFixedColumn[]
  }
}

// eslint-disable-next-line no-unused-vars
class MusicResponsiveListItemFixedColumn {
  musicResponsiveListItemFixedColumnRenderer: {
    text: {
      runs: Run[]
    }
  }
}

// eslint-disable-next-line no-unused-vars
class MusicResponsiveListItemFlexColumn {
  musicResponsiveListItemFlexColumnRenderer: {
    text: {
      runs: Run[]
    }
  }
}

// eslint-disable-next-line no-unused-vars
class Run {
  text: string
}
