import React, { Component } from "react";
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { filters } from "./filtersList";
import { Col } from "react-bootstrap";
import './uploadPost.scss';

class UploadPosts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            filters: filters,
            selectedFile: null,
            imageUrl: null,
            fileType: Boolean,
            note: '',
            src: '',
            filter: '',
            crop: {
                unit: "%",
                width: 30,
                height: 30,
                x: 10,
                y: 10
            },
            croppedImageUrl: '',
            croppedBlob: null,
        }
        this.imageRef = null;
        this.inputRef = React.createRef();
        this.handleFileChange = this.handleFileChange.bind(this);
        this.submitProp = this.submitProp.bind(this);
    }
    handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        console.log('sdafa', files);
        for (let file of files) {
            this.setState({
                selectedFile: file,
                fileType: file.type === 'video/mp4',
                imageUrl: URL.createObjectURL(file)
            })
        }
    };
    handleClick = () => {
        // Trigger the file input
        this.inputRef.current.click();
    };
    changeImage = () => {
        this.imageRef = '';
        this.state.croppedBlob = null;
        this.state.croppedImageUrl = null;
        this.state.filter = null;
        this.inputRef.current.click();
    }
    updateNote = (event) => {
        this.setState({ note: event.target.value });
    };
    submitProp = () => {
        const { croppedBlob, selectedFile, filter } = this.state;
        const setPost = {
            file: new File([croppedBlob], selectedFile.name, {
                type: croppedBlob.type
            }),
            filter: filter,
            note: this.state.note
        }
        this.props.submitPost(setPost);
        // this.props.submitPost(this.state.selectedFile);
    }
    editFilter = () => {
        this.state.croppedBlob = null;
        this.state.croppedImageUrl = null;
        this.state.filter = null;
        this.handleOnCropChange(this.state.crop);
    }
    handleOnCropChange = (crop) => {
        this.setState({ crop });
    };
    onImageLoaded = (image) => {
        this.imageRef = image;
    };
    handleOnCropComplete = (crop) => {
        // const { src } = this.state;
        if (!this.imageRef || !crop.width || !crop.height) {
            return;
        }
        // const image = new Image();
        // image.src = src;
          const canvas = document.createElement("canvas");
          const scaleX = this.imageRef.naturalWidth / this.imageRef.width;
          const scaleY = this.imageRef.naturalHeight / this.imageRef.height;
          canvas.width = crop.width;
          canvas.height = crop.height;
          const ctx = canvas.getContext("2d");
    
          // Draw the cropped portion of the image on the canvas
          ctx.drawImage(
            this.imageRef,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width,
            crop.height
          );
          canvas.toBlob((blob) => {
            if (blob) {
              this.setState({ croppedBlob: blob });
            }
          });
        
    };
    saveCropImage = () => {
        const { croppedBlob } = this.state;
        if (croppedBlob) {
            const croppedImageUrl = URL.createObjectURL(croppedBlob);
            this.setState({ croppedImageUrl });
        }
    };
    handleFilterChange = (filter) => {
        console.log('adfas');
        this.setState({ filter })
    };
    render() {
    // const [selectedFile, setSelectedFile] = useState(null);
    // const [imageUrl, setImageUrl] = useState(null);
    // const inputRef = useRef(null);
    return (
        <div>
            <div style={{padding: '10px'}}>
                <input
                    type="file"
                    accept="image/png, image/jpeg, video/*"
                    onChange={this.handleFileChange}
                    style={{ display: 'none' }} // Hide the input
                    ref={this.inputRef} // Reference to the input element
                />
                <div style={{border: '2px dashed #dedede', padding: '10px'}}>
                    <div>
                        {
                            this.state.imageUrl ? 
                            <div style={{ display: 'flex' }}>
                                <div style={{ paddingRight: '10px', paddingBottom: '10px' }}>
                                <Button  onClick={this.changeImage}>Change</Button>
                                </div>
                                <div>
                                { !this.state.fileType ?
                                <Button onClick={this.editFilter}>Edit</Button> : '' }
                                </div>
                            </div>
                            :
                            <Button onClick={this.handleClick}>Select Post</Button>
                        }
                    </div>
                    {this.state.imageUrl && !this.state.fileType ? this.state.croppedImageUrl ?
                    <div>
                        <img className="pt-2 filter-image" style={{
                            filter: this.state.filter}} src={this.state.croppedImageUrl} alt="Selected" />
                            { this.state.croppedImageUrl ? 
                                <div className="pt-3 filters" style={{
                                    display: 'flex',
                                    overflowX: 'scroll',
                                    whiteSpace: 'nowrap',
                                  }}>
                                    { this.state.filters.map((item) => (
                                    <Col style={{ padding: '8px' }}>
                                    <img
                                        style={{
                                            filter: item.color, 
                                            width: '50px', 
                                            display: 'inline-block', 
                                            opacity: this.state.filter === item.color ? '0.5' : '' }}
                                        onClick={() => this.handleFilterChange(item.color)}
                                        src={this.state.croppedImageUrl}/> 
                                        <div>{item.name}</div>
                                    </Col>
                                ))}
                                </div> : '' }
                    </div>    :
                        <div>
                            <ReactCrop
                                src={this.state.imageUrl}
                                crop={this.state.crop}
                                onChange={this.handleOnCropChange}
                                onComplete={this.handleOnCropComplete}
                                onImageLoaded={this.onImageLoaded}
                            />
                            <Button onClick={this.saveCropImage}>Save</Button>
                        </div>
                        :
                        <div className="pt-2">
                            { this.state.imageUrl && <video width={400} controls autoPlay>
                                    <source src={this.state.imageUrl} type="video/mp4" />
                                </video>
                            }
                        </div>
                    }
                    <div className="comments-input pt-2">
                        <InputGroup>
                            <Form.Control
                                disabled={!this.state.imageUrl}
                                placeholder="Note"
                                value={this.state.note}
                                onChange={this.updateNote}
                                />
                        </InputGroup>
                    </div>
                </div>
            </div>
            <div style={{display: 'flex', justifyContent:'flex-end'}}>
                <Button
                    style={{margin: '10px'}}
                    onClick={this.submitProp}
                >Post
                </Button>
            </div>
        </div>
    )
};
}

export default UploadPosts;