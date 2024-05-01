import React, { Component } from "react";
import { getDetails } from "../googleSignIn/config";
import { Link } from "react-router-dom";

class ProfileAvatar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userProfile: null
        }
        this.fetchUserDetails = this.fetchUserDetails.bind(this);
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
                        <Link to={`/profile/${userProfile.uid}`} style={{ textDecoration: 'none', color: 'black' }}>
                        <img style={{borderRadius: '50px'}} src={userProfile.avatar} alt="User Avatar" width={30} height={30} />
                        <span style={{paddingLeft: '10px', fontWeight: 600}}>{userProfile.name}</span>
                        </Link>
                    </div>
                ) : ''}
            </div>
        )
    }
}

export default ProfileAvatar;