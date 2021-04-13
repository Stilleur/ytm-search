import { YoutubeMusic, YoutubeMusicNoPlaylistError } from '../src/'

const ytm = new YoutubeMusic()

test('Find 80s playlists', async () => {
  const maxRetryCount = 5
  var retryCount = 0
  var playlists = null

  while (playlists === null && retryCount < maxRetryCount) {
    try {
      playlists = await ytm.findPlaylists('80s')
    } catch (error) {
      if (error instanceof YoutubeMusicNoPlaylistError) {
        retryCount++
        continue
      } else {
        throw error
      }
    }
  }

  expect(playlists.length).toBeGreaterThan(0)
})

test('Get musics from playlist', async () => {
  const musics = await ytm.getMusics('RDCLAK5uy_khNGopKCT_t38MZ1W7z4kERrqprkXovxo')
  expect(musics.length).toBeGreaterThan(0)
})
