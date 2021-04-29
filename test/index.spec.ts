import { YoutubeMusic } from '../src/'
import randomWords from 'random-words'

const ytm = new YoutubeMusic()

test('Find 80s playlists', async () => {
  const playlists = await ytm.findPlaylists('80s')
  expect(playlists.length).toBeGreaterThan(0)
})

test('Find random playlists', async () => {
  const searchValue = randomWords({ exactly: 1, wordsPerString: 2 })[0]
  const playlists = await ytm.findPlaylists(searchValue)
  expect(playlists.length).toBeGreaterThan(0)
})

test('Get musics from a playlist', async () => {
  const musics = await ytm.getMusics('RDCLAK5uy_khNGopKCT_t38MZ1W7z4kERrqprkXovxo')
  expect(musics.length).toBeGreaterThan(0)
})
