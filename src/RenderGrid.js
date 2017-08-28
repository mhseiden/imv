// @flow

type Props = {|
  height: number, // height of each video
  width: number, // width of each video
  regionsX: number, // x-axis region count
  regionsY: number, // y-axis region count
|};

function render() {
  if (!this.active) {
    return;
  }

  const { height, width, regionsX, regionsY } = this.props;
  const regionWidth = width / regionsX;
  const regionHeight = height / regionsY;

  const ctx = this.canvas.getContext("2d");
  for (var i = 0, l = this.cellIndex.length; i < l; ++i) {
    const video = this.videos[this.cellIndex[i]];

    const xOffset = regionWidth * (i % regionsX);
    const yOffset = regionHeight * Math.floor(i / regionsX);

    ctx.drawImage(video,
      xOffset, yOffset,
      regionWidth, regionHeight,
      xOffset, yOffset,
      regionWidth, regionHeight,
    );
  }

  window.requestAnimationFrame(this.boundRender);
}

export default class RenderGrid {
  canvas: any;
  audio: any;
  videos: Array<any>;
  media: Array<any>;

  props: Props;

  active: bool;
  cellIndex: Array<number>;
  boundRender: () => void;

  constructor(canvas: any, videos: Array<any>, audio: any, props: Props) {
    this.canvas = canvas;
    this.videos = videos;
    this.audio = audio;
    this.media = [audio].concat(videos);
    this.props = props;

    this.active = false;
    this.cellIndex = [];
    this.boundRender = render.bind(this);

    const { regionsX, regionsY } = this.props;
    const cells = regionsX * regionsY;
    for (var i = 0; i < cells; ++i) {
      this.cellIndex[i] = 0;
    }
  }

  start(reset: bool = true): Promise<void> {
    this.active = true;
    return Promise.all(this.media.map(v => v.play()))
      .then(() => {
        if (reset) {
          this.media.forEach(v => v.currentTime = 0.0);
        }
        this.boundRender();
      });
  }

  stop() {
    this.active = false;
    this.media.forEach(v => v.pause());
  }

  cycleCell(idx: number) {
    const cell = this.cellIndex[idx];
    if (cell != null) {
      this.cellIndex[idx] = (cell + 1) % this.videos.length;
    }
  }

  setVideo(video: number) {
    if (video < this.videos.length) {
      this.cellIndex = this.cellIndex.map(() => video);
    }
  }
}
