import React, { Component } from "react";
import { getDetails } from "../googleSignIn/config";

class ProfileAvatar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userProfile: null
        }
    }

    componentDidMount() {
        // Fetch user details when component mounts
        this.fetchUserDetails();
    }

    fetchUserDetails = () => {
        const { userId } = this.props.data;
        getDetails(userId).then(res => {
            this.setState({ userProfile: res });
        }).catch(error => {
            console.error('Error fetching user details:', error);
        });
    }

    render() {
        const { userId } = this.props.data;
        const { userProfile } = this.state;

        return (
            <div>
                {userProfile ? (
                    <div>
                        <img style={{borderRadius: '50px'}} src={userProfile.avatar} alt="User Avatar" width={30} />
                        <span style={{paddingLeft: '10px'}}>{userProfile.name}</span>
                    </div>
                ) : ''}
            </div>
        )
    }
}

export default ProfileAvatar;