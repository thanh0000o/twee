const musicUrl = (number: number) =>
  `${import.meta.env.BASE_URL}music/lost-${String(number).padStart(2, '0')}.mp3`;

// To change the public playlist, edit this list and the matching files in public/music.
export const tracks = Array.from({ length: 10 }, (_, index) => ({
  title: `Lost ${index + 1}`,
  artist: 'Orca',
  album: 'The Lost Tapes',
  src: musicUrl(index + 1),
}));