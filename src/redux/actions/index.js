import {
  FETCH_SONGS_START,
  FETCH_SONGS_ERROR,
  FETCH_SONGS_SUCCESS
} from './types';
// import iTunes from 'react-native-itunes';

export const fetchSongsStart = () => ({
  type: FETCH_SONGS_START
});

export const fetchSongsSuccess = (data) => ({
  type: FETCH_SONGS_SUCCESS,
  data
});

export const fetchSongsError = (error) => ({
  type: FETCH_SONGS_ERROR,
  error
});

export const getSongs = () => async (dispatch) => {
  dispatch(fetchSongsStart());
  try {
    // iTunes.getTracks({
    //   fields: ['persistentId', 'title', 'artist', 'albumTitle', 'genre', 'artwork', 'lyrics', 'duration', 'assetUrl']
    // }).then((tracks) => {
      
    // }).catch(error => {
    //   alert(error)
    // });

    // const songs = await iTunes.getTracks({
    //   fields: ['persistentId', 'title', 'artist', 'albumTitle', 'genre', 'artwork', 'lyrics', 'duration', 'assetUrl']
    // });
    const songs = await Promise.resolve([
      {
        title: 'Promises',
        artist: 'Wiz Khalifa',
        artwork: "https://media.pitchfork.com/photos/5929a9bb5e6ef95969321478/1:1/w_320/f180b23e.jpg",
        assetUrl: "../../assets/flora_secret.mp3",
        persistentId: 1
      },
      {
        title: '...Ready For It?',
        artist: 'Taylor Swift',
        artwork: "https://target.scene7.com/is/image/Target/GUEST_608e5972-e6e0-4fef-b66d-4d83f3eb8f56?wid=488&hei=488&fmt=pjpeg",
        assetUrl: "../../assets/flora_secret.mp3",
        persistentId: 2,
      },
      {
        title: 'Hotline Bling',
        artist: 'Drake',
        artwork: 'https://upload.wikimedia.org/wikipedia/commons/c/c9/Drake_-_Hotline_Bling.png',
        assetUrl: "../../assets/flora_secret.mp3",
        persistentId: 3
      },
    ]);
    return dispatch(fetchSongsSuccess(songs));
  } catch (error) {
    return dispatch(fetchSongsError(error));
  }
}