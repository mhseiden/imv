// @flow
import React, { PureComponent } from 'react';
import "./VideoRegion.css";

type Props = {|
  height: number,
  width: number,
  index: number,
  onClick: (number) => void,
|};

export default class VideoRegion extends PureComponent<Props, {}> {
  onClick = () => {
    this.props.onClick(this.props.index);
  }

  render() {
    const { height, width, index } = this.props;
    const style = { height, width };
    return (
      <div
        className="VideoRegion"
        style={style}
        onClick={this.onClick}
      />
    );
  }
}
