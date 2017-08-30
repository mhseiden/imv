// @flow
import React, { PureComponent } from 'react';
import platform from 'platform';

import LoadingScreen from './LoadingScreen.js';
import VideoContainer from './VideoContainer.js';
import './App.css';

const LOAD_EVENT = "canplay";
const AUDIO_URL = "https://www.dropbox.com/s/k2tyb3tt61ctay0/AboutToday_5min.mp3?dl=1";
const VIDEO_HEIGHT = 524;
const VIDEO_WIDTH = 699;
const VIDEO_URLS = [
  "https://www.dropbox.com/s/2u0ri73e73oyurs/CapeCod_5min_Cropped.mp4?dl=1",
  "https://www.dropbox.com/s/req19nfgv7p8maz/Fireworks_5min_Cropped_720p.mp4?dl=1",
  "https://www.dropbox.com/s/kho6vlu5n9fhhan/Timelapse_5min_Cropped.mp4?dl=1"
];

function createVideoElement(url: string): any {
  const v = (document.createElement('video'): any);
  v.src = url;
  v.autoplay = null;
  v.loop = true;
  v.preload = 'auto';
  v.controls = null;
  return v;
}

function createAudioElement(url: string): any {
  const a = (document.createElement('audio'): any);
  a.src = url;
  a.autoplay = null;
  a.loop = true;
  a.preload = 'auto';
  a.controls = null;
  return a;
}

type State = {|
  isSupported: bool,
  isLoading: bool,
  videos: Array<any>,
  audio: any,
|};

class App extends PureComponent<{}, State> {
  constructor(props: {}) {
    super(props);
   
    const isSupported =
      (platform.name === 'Chrome') ||
      (platform.name === 'Firefox');

    this.state = {
      isSupported: isSupported,
      isLoading: true,
      videos: isSupported
        ? VIDEO_URLS.map(url => createVideoElement(url))
        : null,
      audio: isSupported
        ? createAudioElement(AUDIO_URL)
        : null,
    };
  }

  componentDidMount() {
    if (!this.state.isSupported) {
      return;
    }

    const media = [this.state.audio].concat(this.state.videos)
    Promise.all(media.map(v => {
      return new Promise((res, rej) => {
        if (v.readyState === 4) {
          return res();
        }

        const handler = function() {
          v.removeEventListener(LOAD_EVENT, handler);
          res();
        };
        v.addEventListener(LOAD_EVENT, handler);
      });
    }))
    .then(() => {
      this.setState({ isLoading: false });
    });
  }

  render() {
    const { isSupported, isLoading, videos, audio } = this.state;

    if (!isSupported) {
      return (
        <div className="container">
          <div className="header">
            <h1 className="title">Unsupported Browser!</h1>
            <p>In order to experience this interactive music video, please use the latest version of Chrome or Firefox</p>
          </div>
        </div>
      );
    }

    return (
      <div className="container">
        <div className="header">
          <h1 className="title">Today</h1>
        </div>
        { isLoading 
          ? <LoadingScreen />
          : <VideoContainer
              height={VIDEO_HEIGHT}
              width={VIDEO_WIDTH}
              videos={videos}
              audio={audio}
            />
        }
      </div>
    );
  }
}

export default App;
