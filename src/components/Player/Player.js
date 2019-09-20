import React, { Component } from 'react';
import {
  View,
  StatusBar,
} from 'react-native';
import Header from '../Header/Header';
import AlbumArt from '../AlbumArt/AlbumArt';
import TrackDetails from '../TrackDetails/TrackDetails';
import SeekBar from '../Slider/Slider';
import Controls from '../Controls/Controls';
import Video from 'react-native-video';


export default class Player extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      paused: true,
      totalLength: 1,
      currentPosition: 0,
      selectedTrack: 0,
      repeatOn: false,
      shuffleOn: false,
      tracks: [],
      // isChanging: false
    };
    this.setSongsToState = this.setSongsToState.bind(this);
  }

  static navigationOptions = {
    header: null
  }

  componentDidMount() {
    const receivedState = this.props.navigation.getParam('state');
    const {
      paused,
      tracks,
      selectedTrack,
    } = receivedState;
    if (this.state.tracks.length == 0) {
      this.setState(prevState => ({
        ...prevState,
        paused,
        selectedTrack,
        tracks: [...tracks]
      }));
    } else {
      // this.setSongsToState();
    }
  }

  setSongsToState() {
    iTunes.getTracks({
      fields: ['persistentId', 'title', 'artist', 'albumTitle', 'genre', 'artwork', 'lyrics', 'duration', 'assetUrl']
    }).then((tracks) => {
      this.setState(prevState => ({
        ...prevState,
        tracks
      }))
    }).catch(error => {
      alert(error);
    });
  }

  setDuration(data) {
    // console.log(totalLength);
    this.setState({ totalLength: Math.floor(data.duration) });
  }

  setTime(data) {
    //console.log(data);
    this.setState({ currentPosition: Math.floor(data.currentTime) });
  }

  seek(time) {
    time = Math.round(time);
    this.refs.audioElement && this.refs.audioElement.seek(time);
    this.setState({
      currentPosition: time,
      paused: false,
    });
  }

  onBack() {
    if (this.state.currentPosition < 10 && this.state.selectedTrack > 0) {
      this.refs.audioElement && this.refs.audioElement.seek(0);
      this.setState({ isChanging: true });
      setTimeout(() => this.setState({
        currentPosition: 0,
        paused: false,
        totalLength: 1,
        isChanging: false,
        selectedTrack: this.state.selectedTrack - 1,
      }), 0);
    } else {
      this.refs.audioElement.seek(0);
      this.setState({
        currentPosition: 0,
      });
    }
  }

  onForward() {
    if (this.state.selectedTrack < this.state.tracks.length - 1) {
      this.refs.audioElement && this.refs.audioElement.seek(0);
      this.setState({ isChanging: true });
      setTimeout(() => this.setState({
        currentPosition: 0,
        totalLength: 1,
        paused: false,
        isChanging: false,
        selectedTrack: this.state.selectedTrack + 1,
      }), 0);
    }
  }

  showTrackList() {
    this.props.navigation.navigate('Tracks');
  }

  render() {
    const { tracks } = this.state;
    const track = !!tracks && this.state.tracks[this.state.selectedTrack];
    const video = this.state.isChanging ? null :  (
      <Video
        source={{ uri: track && track.assetUrl }}          // Can be a URL or a local file.
        ref="audioElement"
        key={track && track.persistentId}
        paused={this.state.paused}                // Pauses playback entirely.
        resizeMode="cover"                        // Fill the whole screen at aspect ratio.
        repeat={true}                             // Repeat forever.
        onLoadStart={this.loadStart}              // Callback when video starts to load
        onLoad={this.setDuration.bind(this)}      // Callback when video loads
        onProgress={this.setTime.bind(this)}      // Callback every ~250ms with currentTime
        onEnd={this.onEnd}                        // Callback when playback finishes
        onError={this.videoError}                 // Callback when video cannot be loaded
        style={styles.audioElement}
        playWhenInactive={true}
        playInBackground={true}
      />
    );

    return (
      <View style={styles.container}>
        <StatusBar hidden={true} />
        <Header message="Playing From Charts" onQueuePress={this.showTrackList.bind(this)} />
        <AlbumArt url={track && track.artwork} />
        <TrackDetails title={track && track.title} artist={track && track.artist} />
        <SeekBar
          onSeek={this.seek.bind(this)}
          trackLength={this.state.totalLength}
          onSlidingStart={() => this.setState({ paused: true })}
          currentPosition={this.state.currentPosition} />
        <Controls
          onPressRepeat={() => this.setState({ repeatOn: !this.state.repeatOn })}
          repeatOn={this.state.repeatOn}
          shuffleOn={this.state.shuffleOn}
          forwardDisabled={this.state.selectedTrack === this.state.tracks.length - 1} // TODO - add condition for shuffle
          onPressShuffle={() => this.setState({ shuffleOn: !this.state.shuffleOn })}
          onPressPlay={() => this.setState({ paused: false })}
          onPressPause={() => this.setState({ paused: true })}
          onBack={this.onBack.bind(this)}
          onForward={this.onForward.bind(this)}
          paused={this.state.paused}
        />
        {video}
      </View>
    )
  }
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: 'rgb(0, 0, 0)',
    // backgroundColor: '#fff',
  },
  audioElement: {
    height: 0,
    width: 0,
  }
};

// import React, { Component } from 'react';

// import {
//   AppRegistry,
//   StyleSheet,
//   Text,
//   View,
//   NativeModules,
//   NativeAppEventEmitter
// } from 'react-native';

// import Button from 'react-native-button';

// const MediaManager = NativeModules.MediaManager;

// export default class Player extends Component {
//   componentWillMount() {
//     this.setState({
//       songPlaying: undefined
//     });

//     this.subscription = NativeAppEventEmitter.addListener('SongPlaying', this.onSongPlaying);
//   }

//   componentWillUnmount() {
//     this.subscription.remove();
//   }

//   onSongPlaying = (songPlaying) => {
//     this.setState({
//       songPlaying
//     });
//   }

//   onShowSongsPress() {
//     MediaManager.showSongs();
//   }

//   render() {
//     console.log(this.state)
//     return (
//       <View style={styles.container} >
//         <Button
//           containerStyle={styles.buttonContainer}
//           style={styles.buttonStyle}
//           onPress={this.onShowSongsPress}>
//             Pick Song
//           </Button>

//           <Text style={styles.instructions}>Song Playing</Text>
//           <Text style={styles.welcome}>{this.state.songPlaying}</Text>
//       </View>
//     )
//   }
// }

// const styles = StyleSheet.create({
//   constainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: 'center'
//   },
//   buttonContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: 'center'
//   },
//   buttonStyle: {
//     width: 100,
//     height: 50,
//     marginTop: 300,
//     marginLeft: 50,
//     marginRight: 50,
//     paddingTop: 15,
//     color: '#fff',
//     borderWidth: 1,
//     // borderColor: '#ccc',
//     borderRadius: 5,
//     backgroundColor: '#ccc'
//   },
//   instructions: {
//     justifyContent: "center",
//     alignItems: 'center',
//     marginTop: 250,
//     marginLeft: 50,
//     marginRight: 50
//   },
//   welcome: {
//     justifyContent: "center",
//     alignItems: 'center',
//     marginTop: 50,
//     marginLeft: 50,
//     marginRight: 50,
//     color: '#333'
//   }
// });

// import React, { Component } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
// } from 'react-native';

// // import * as RNFileSystem from 'react-native-fs';
// // import MusicFiles from 'react-native-get-music-files';
// import Video from 'react-native-video';

// export default class Player extends Component {
//   state = {
//     tracks: []
//   }
//   componentDidMount() {
//     // // RNFileSystem.readDir(RNFileSystem.MainBundlePath).then(files => files.map(file => console.log(file.path)));
//     // MusicFiles.getAll({
//     //   // persistentId: true,
//     //   blured: true,    // works only when 'cover' is set to true
//     //   artist: true,
//     //   duration: true,  //default : true
//     //   cover: true,    //default : true,
//     //   genre: true,
//     //   title: true,
//     //   cover: true,
//     //   assetUrl: true,
//     //   // minimumSongDuration: 10000, // get songs bigger than 10000 miliseconds duration,
//     //   fields: ['persistentId', 'title', 'albumTitle', 'genre', 'lyrics', 'duration', 'assetUrl'] // for iOs Version
//     // }).then(tracks => {
//     //   // do your stuff...
//     //   tracks && tracks.map(t => console.log(t, '------>>>>>'));
//     //   // console.log(tracks, '------>>>>>')
//     //   this.setState({
//     //     tracks: tracks
//     //   });
//     // }).catch(errors => {
//     //   // catch the error
//     //   console.log(errors)
//     // });
//   }

//   render() {
//     return (
//       <View style={styles.container}>
//         {/* {this.state.tracks && this.state.tracks.forEach(track => {
//           <Text style={styles.text}>{track.title}</Text>
//         })} */}
//         <Video
//           // source={music}          // Can be a URL or a local file.
//           source={{ uri: 'ipod-library://item/item.mp3?id=2675740036798661366' }}          // Can be a URL or a local file.
//           ref="audioElement"
//           key={'track.audioUrl'}
//           // paused={this.state.paused}                // Pauses playback entirely.
//           resizeMode="cover"                           // Fill the whole screen at aspect ratio.
//           // repeat={true}                             // Repeat forever.
//           // onLoadStart={this.loadStart}              // Callback when video starts to load
//           // onLoad={this.setDuration.bind(this)}      // Callback when video loads
//           // onProgress={this.setTime.bind(this)}      // Callback every ~250ms with currentTime
//           // onEnd={this.onEnd}                        // Callback when playback finishes
//           // onError={this.videoError}                 // Callback when video cannot be loaded
//           // style={styles.audioElement}
//         />
//         {/* ); */}
//       </View>
//     )
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     color: '#333'
//   },
//   text: {
//     color: '#333'
//   }
// });

// assetUrl: 'ipod-library://item/item.mp3?id=2675740036798661366'