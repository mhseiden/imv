// @flow
import React, { PureComponent } from 'react';
import VideoRegion from './VideoRegion.js';
import RenderGrid from './RenderGrid.js';
import "./VideoContainer.css";

const REGIONS_X = 5;
const REGIONS_Y = 4;
const REGION_COUNT = REGIONS_X * REGIONS_Y;

type Props = {|
  width: number,
  height: number,
  videos: Array<any>,
  audio: any,
|};

type State = {|
  renderGrid: ?RenderGrid,
|};

export default class VideoContainer extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { renderGrid: null };
  }

  componentDidMount() {
    const { width, height, videos, audio } = this.props;
    const { canvas } = this.refs;

    const renderGrid = new RenderGrid(canvas, videos, audio, {
      height: height,
      width: width,
      regionsX: REGIONS_X,
      regionsY: REGIONS_Y,
    });

    renderGrid.start().then(() => {
      this.setState({ renderGrid });
    });
  }

  onTogglePlayback = () => {
    if (this.state.renderGrid) {
      if (this.state.renderGrid.active) {
        this.state.renderGrid.stop();
      } else {
        this.state.renderGrid.start(false);
      }
    }
    this.forceUpdate();
  }

  onClickRegion = (idx: number) => {
    if (this.state.renderGrid) {
      this.state.renderGrid.cycleCell(idx);
    }
  }

  onSetVideo = (idx: number) => {
    if (this.state.renderGrid) {
      this.state.renderGrid.setVideo(idx);
    }
  }

  render() {
    const { height, width, audio } = this.props;
    const { renderGrid } = this.state;

    const isActive = (renderGrid == null) || renderGrid.active;

    const regionHeight = height / REGIONS_Y;
    const regionWidth = width / REGIONS_X;

    const innerStyle = {
      height: `${height}px`,
      width: `${width}px`,
    };
    const outerStyle = innerStyle;

    const regions = [];
    for (var i = 0; i < REGION_COUNT; ++i) {
      regions.push(
        <VideoRegion
          key={i}
          index={i}
          height={regionHeight}
          width={regionWidth}
          onClick={this.onClickRegion}
        />
      );
    }

    return (
      <div>
        <div style={outerStyle} className="VideoContainer">
          <div style={innerStyle} className="RegionContainer">
            {regions}
          </div>
          <canvas 
            className="CanvasElement"
            ref={"canvas"}
            width={width}
            height={height}
          />
          <div className="MediaControls">
            <div className="Left">
              <div 
                className="Item"
                onClick={this.onTogglePlayback}
              > { isActive ? "Pause" : "Play" }</div>
            </div>
            <div className="Right">
              <div 
                className="Item"
                onClick={() => this.onSetVideo(0)}
              >Cape Cod &middot;</div>
              <div 
                className="Item"
                onClick={() => this.onSetVideo(1)}
              >Fireworks &middot;</div>
              <div 
                className="Item"
                onClick={() => this.onSetVideo(2)}
              >Boston</div>
            </div>
          </div>
          <div className="ArtistStatement">
            <h2>Artist's Statement</h2>
            <p>This project is about memory. More specifically, this project is about memories I have of Boston and of college life in general. Hopefully there are some pieces we can all relate to.</p>
            <p>Some memories are slow, some move at high speed. When we think back, we glorify certain moments and we minimize others. We fictionalize and we pick our memories apart. We pick and choose which experiences we want to remember, which we choose to ignore, and which memories we want to relive over and over again.</p>
            <p>This project is for you to experience in dierent ways, with dierent points of view, as many times as you want.</p>
            <p><a href="https://www.jamiekaplancreative.com">&nbsp;&mdash; Jamie Kaplan</a></p>
          </div>
        </div>
      </div>
    );
  }
}
