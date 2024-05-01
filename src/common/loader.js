import React, { Component } from "react";
import LoadingGif from '../assets/loader.gif';
import './loading.scss';

class Loader extends Component {
    render() {
        return (
            <div className="loader">
                <img src={LoadingGif} />
            </div>
        )
    }
}

export default Loader;