import { YoutubeMusic } from '../src/'

const youtubeMusic = new YoutubeMusic()

test('Find 80s playlists', async () => {
  expect((await youtubeMusic.findPlaylists('80s')).length).toBeGreaterThan(0)
})

test('Get musics from playlist', async () => {
  expect((await youtubeMusic.getMusics('RDCLAK5uy_khNGopKCT_t38MZ1W7z4kERrqprkXovxo')).length).toBeGreaterThan(0)
})
