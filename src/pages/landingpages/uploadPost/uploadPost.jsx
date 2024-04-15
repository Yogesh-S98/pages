import React, { Component } from "react";
import Button from 'react-bootstrap/Button';

class UploadPosts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedFile: null,
            imageUrl: null
        }
        this.inputRef = React.createRef();
        this.handleFileChange = this.handleFileChange.bind(this);
        this.submitProp = this.submitProp.bind(this);
    }
    handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        for (let file of files) {
        this.setState({
                selectedFile: file,
                imageUrl: URL.createObjectURL(file)
            })
        }
    };
    handleClick = () => {
        // Trigger the file input
        this.inputRef.current.click();
    };
    submitProp = () => {
        this.props.submitPost(this.state.selectedFile);
        // this.props.submitPost(this.state.selectedFile);
    }
    render() {
    // const [selectedFile, setSelectedFile] = useState(null);
    // const [imageUrl, setImageUrl] = useState(null);
    // const inputRef = useRef(null);
    return (
        <div>
            <div style={{padding: '10px'}}>
                <input
                    type="file"
                    accept="image/png, image/jpeg"
                    onChange={this.handleFileChange}
                    style={{ display: 'none' }} // Hide the input
                    ref={this.inputRef} // Reference to the input element
                />
                <div style={{border: '2px dashed #dedede', padding: '10px'}}>
                <Button onClick={this.handleClick}>Select Post</Button>
                {this.state.imageUrl && <img width={200} src={this.state.imageUrl} alt="Selected" />}
                
                </div>
                </div>
            <div style={{display: 'flex', justifyContent:'end'}}>
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