import { YoutubeMusic } from '../src/'

const youtubeMusic = new YoutubeMusic()

test('Get API key', async () => {
  expect(await youtubeMusic.apiKey).not.toBe(null || undefined || '')
})

test('Find 80s playlists', async () => {
  expect((await youtubeMusic.findPlaylists('80s')).length).toBeGreaterThan(0)
})

test('Get songs from playlist', async () => {
  expect((await youtubeMusic.getSongs('RDCLAK5uy_khNGopKCT_t38MZ1W7z4kERrqprkXovxo')).length).toBeGreaterThan(0)
})
