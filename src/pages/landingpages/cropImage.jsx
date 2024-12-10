import React, { Component } from "react";
import { Col } from "react-bootstrap";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

class ImageCropper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      src: null,
      crop: {
        unit: "%",
        width: 30,
        height: 30,
        x: 10,
        y: 10
      },
      croppedImageUrl: null
    };
  }

  handleImageChange = (e) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      this.setState({ src: reader.result });
    };
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  handleOnCropChange = (crop) => {
    this.setState({ crop });
  };

  handleOnCropComplete = (crop) => {
    const { src } = this.state;
    if (!src || !crop.width || !crop.height) {
      return;
    }
    const image = new Image();
    image.src = src;
    image.onload = () => {
      const canvas = document.createElement("canvas");
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      canvas.width = crop.width;
      canvas.height = crop.height;
      const ctx = canvas.getContext("2d");

      // Draw the cropped portion of the image on the canvas
      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height
      );

      // Convert canvas to base64 URL and set as cropped image
      const croppedImageUrl = canvas.toDataURL("image/jpeg");
      if (croppedImageUrl) {
        this.setState({ croppedImageUrl });
      }
    };
  };

  render() {
    const { src, crop, croppedImageUrl } = this.state;
    return (
      <div>
        <input type="file" onChange={this.handleImageChange} />
        {src && (
          <Col>
            <ReactCrop
              style={{ width: '100%' }}
              src={src}
              crop={crop}
              onChange={this.handleOnCropChange}
              onComplete={this.handleOnCropComplete}>
            </ReactCrop>
          </Col>
        )}
        {croppedImageUrl && (
          <div>
            <h2>Cropped Image:</h2>
            <img alt="Cropped" src={croppedImageUrl} />
          </div>
        )}
      </div>
    );
  }
}

export default ImageCropper;
