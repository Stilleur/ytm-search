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

  public async getMusics (playlistId: string): Promise<Music[]> {
    const musics: Music[] = []

    try {
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
    } catch (error) {
      console.log(error)
      throw error
    }

    return musics
  }

  public async findPlaylists (searchValue: string): Promise<Playlist[]> {
    const playlists: Playlist[] = []

    try {
      const response = await this.axios.post<SearchResponse>('search', {
        context: YoutubeMusic.context,
        query: searchValue
      })

      const playlistShelf = response.data.contents.sectionListRenderer.contents.find(ms => ms.musicShelfRenderer.title.runs[0].text === 'Playlists')
      for (const playlist of playlistShelf.musicShelfRenderer.contents) {
        const title = playlist.musicResponsiveListItemRenderer.flexColumns[0].musicResponsiveListItemFlexColumnRenderer.text.runs[0].text
        const playlistId = playlist.musicResponsiveListItemRenderer.overlay.musicItemThumbnailOverlayRenderer.content.musicPlayButtonRenderer.playNavigationEndpoint.watchPlaylistEndpoint.playlistId
        const songCount = Number(playlist.musicResponsiveListItemRenderer.flexColumns[1].musicResponsiveListItemFlexColumnRenderer.text.runs[4].text.match(YoutubeMusic.songsRegex)[0])

        playlists.push(new Playlist(title, playlistId, songCount))
      }
    } catch (error) {
      console.log(error)
      throw error
    }

    return playlists
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
