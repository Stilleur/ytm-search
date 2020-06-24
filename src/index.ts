import { launch } from 'puppeteer'
import axios from 'axios'

export class YoutubeMusic {
  readonly hostname = 'music.youtube.com'
  readonly url = `https://${this.hostname}/`
  readonly apiUrl = `${this.url}youtubei/v1/`

  readonly headers = {
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36',
    'content-type': 'application/json',
    referer: this.url
  }

  readonly context = {
    client: {
      clientName: 'WEB_REMIX',
      clientVersion: '0.1',
      hl: 'en',
      gl: 'US'
    }
  }

  readonly axios = axios.create({ baseURL: this.apiUrl, headers: this.headers })
  readonly apiKey: Promise<string>

  readonly songsRegex = new RegExp('^\\d+')

  constructor () {
    this.apiKey = this.getApiKey()
  }

  async getSongs (playlistId: string): Promise<YoutubeSong[]> {
    const songs: YoutubeSong[] = []

    try {
      const response = await this.axios.post<NextResponse>(`next?alt=json&key=${await this.apiKey}`, {
        context: this.context,
        enablePersistentPlaylistPanel: true,
        playlistId,
        isAudioOnly: true
      })

      // TODO
    } catch (error) {
      console.log(error)
      throw error
    }

    return songs
  }

  async findPlaylists (searchValue: string): Promise<YoutubePlaylist[]> {
    const playlists: YoutubePlaylist[] = []

    try {
      const response = await this.axios.post<SearchResponse>(`search?alt=json&key=${await this.apiKey}`, {
        context: this.context,
        query: searchValue
      })

      const playlistShelf = response.data.contents.sectionListRenderer.contents.find(ms => ms.musicShelfRenderer.title.runs[0].text === 'Playlists')
      for (const playlist of playlistShelf.musicShelfRenderer.contents) {
        const title = playlist.musicResponsiveListItemRenderer.flexColumns[0].musicResponsiveListItemFlexColumnRenderer.text.runs[0].text
        const playlistId = playlist.musicResponsiveListItemRenderer.overlay.musicItemThumbnailOverlayRenderer.content.musicPlayButtonRenderer.playNavigationEndpoint.watchPlaylistEndpoint.playlistId
        const songs = Number(playlist.musicResponsiveListItemRenderer.flexColumns[3].musicResponsiveListItemFlexColumnRenderer.text.runs[0].text.match(this.songsRegex)[0])

        playlists.push(new YoutubePlaylist(title, playlistId, songs))
      }
    } catch (error) {
      console.log(error)
      throw error
    }

    return playlists
  }

  private async getApiKey (): Promise<string> {
    const browser = await launch()
    const page = await browser.newPage()
    await page.goto(this.url)

    // @ts-ignore
    // eslint-disable-next-line no-undef
    const apiKey = await page.evaluate(() => { return ytcfg && ytcfg.data_ && ytcfg.data_.INNERTUBE_API_KEY as string })

    browser.close()

    return apiKey
  }
}

export class YoutubeSong {}

export class YoutubePlaylist {
  readonly title: string
  readonly playlistId: string
  readonly songs: number

  constructor (title: string, playlistId: string, songs: number) {
    this.title = title
    this.playlistId = playlistId
    this.songs = songs
  }
}

// eslint-disable-next-line no-unused-vars
class NextResponse {}

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
              }
            }
          }
        }
      }
    }
    flexColumns: MusicResponsiveListItemFlexColumn[]
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
