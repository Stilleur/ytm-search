import { YoutubeMusic } from '../src/'

const youtubeMusic = new YoutubeMusic()

test('Find 80s playlists', async () => {
  const playlists = await youtubeMusic.findPlaylists('80s')
  expect(playlists.length).toBeGreaterThan(0)
})

test('Get musics from playlist', async () => {
  const musics = await youtubeMusic.getMusics('RDCLAK5uy_khNGopKCT_t38MZ1W7z4kERrqprkXovxo')
  expect(musics.length).toBeGreaterThan(0)
})
