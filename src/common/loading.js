import React from 'react';
import './loading.scss';
import loadingGif from '../assets/1481.gif';
import { Component } from 'react';
import NavBar from '../pages/landingpages/navbar';

class Loading extends Component {
  constructor(props) {
    super(props);
    // this.state = {
    //   isloading: true
    // }
  }
  // componentDidMount() {
  //   console.log('dasfs', this.props.height);
  //   // this.timer = setTimeout(() => {
  //   //   this.setState({ isloading: false });
  //   // }, 10000);
  // }
  // componentWillUnmount() {
  //   clearTimeout(this.timer);
  // }
  render () {
    // const { isloading } = this.state;
    return (
      <div className="loading" style={{ height: this.props.height }}>
        {/* {
          isloading ? <img src={loadingGif} /> : ''
        } */}
        <img src={loadingGif} />
      </div>
    );
  }
};

export default Loading;