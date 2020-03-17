import React from 'react'
import { connect } from "react-redux";

import { Image, Label, Icon, Divider, Loader } from 'semantic-ui-react'
import Carousel from 'nuka-carousel'

import CommentList from 'components/posting/CommentList'
import CommentForm from 'components/posting/CommentForm'

import './Carousel.css'
import './PostDetail.css'
import * as VolApi from 'lib/api/VolApi';
import * as PostingApi from 'lib/api/PostingApi';
import { Link } from 'react-router-dom';
import Vol from 'components/vol/Vol';
const restBaseApi = process.env.REACT_APP_REST_BASE_API!;


interface Props {
    post: {
        p_id: number,
        p_content: string,
        v_id: number,
        m_id: number,
        p_status: number,
        post_vote_members: Array<any>,
        vote_cnt: number,
        userId: string,
        files: []
    };
    setUpdateFlag : (flag : boolean) => void;
}
interface Istate{
    volunteer: any
    updateFlag : boolean;
}

class PostDetail extends React.Component<Props & any, Istate> {
    state = { volunteer: null , updateFlag : false }
    handleVote(id: number) {
        var { m_id } = this.props.user.toJS()
        const { setUpdateFlag } = this.props;
        var post_vote = {
            p_id: id,
            m_id: m_id
        }
        PostingApi.insertPostVote(post_vote)
            .then((res: any) => {
                setUpdateFlag(true);
            })
            .catch((err: any) => console.log(err))
    }

    cancelVote(p_id: number){
        let { m_id } = this.props.user.toJS()
        const { setUpdateFlag } = this.props;
        PostingApi.deletePostVote(m_id, p_id)
            .then((res: any) => {
                setUpdateFlag(true);
            })
            .catch((err: any) => console.log(err))
    }

    voldetail(v_id: number) {
        VolApi.getVolDetail(v_id)
            .then((res: any) => {
                const data = res.data.data;
                this.setState({
                    volunteer: data,
                });
            })
            .catch((err: any) => console.log(err));
    }
    componentDidMount(){
        var { v_id } = this.props.post
        this.voldetail(v_id)
    }
    componentDidUpdate(prevProps: any) {
        const { updateFlag } = this.state;
        if(updateFlag){
            this.setState({updateFlag : false});
        }
    }
    handleUpdateFlag = (flag : boolean) => {
        this.setState({updateFlag : flag});
    }
    render() {
        var { m_id, userId } = this.props.user.toJS()
        const { volunteer, updateFlag } = this.state
        if(volunteer===null){
            return(
                <div/>
             )
        }
        const images = this.props.post.files.map((file: any, i: number) => {
            return (
                <img key={i} src={restBaseApi + "/uploads/" + file} />
            )
        })
        return (
            <div>
                <div>
                    {this.props.post.files.length > 0 &&
                        <div className="postedImage">
                            <Carousel>{images}</Carousel>
                            <Divider />
                        </div>
                    }
                    <div className="postContent">
                        {this.props.post.p_content.length > 0 ?
                            (<div>{this.props.post.p_content}</div>)
                            : (<div style={{ color: 'rgb(185, 185, 185)' }}>내용이 없는 글입니다.</div>)}
                    </div>
                    <Divider />
                    <div className="label">
                        {this.props.post.p_status==="1" && (
                        this.props.post.post_vote_members.includes(m_id)?
                            (<Label
                                as='a'
                                color='grey'
                                size="large"
                                onClick={(id: any) => this.cancelVote(this.props.post.p_id)}
                            >
                                <Icon name="hand paper" /> {this.props.post.post_vote_members.length} <span style={{ marginLeft: "10px", marginRight: "10px" }}>함께 해요</span>

                            </Label>)
                            : (<Label
                                as='a'
                                color='orange'
                                size="large"
                                onClick={(id: any) => this.handleVote(this.props.post.p_id)}
                            >
                                <Icon name="hand paper" /> {this.props.post.post_vote_members.length} <span style={{ marginLeft: "10px", marginRight: "10px" }}>함께 해요</span>
                            </Label>)
                        )}
                    </div>
                    
                    <Vol volunteer={volunteer} v_id={this.props.post.v_id} ></Vol>
                    {/* <Link to={{ pathname: `/vol/${this.props.post.v_id}/detail` }}>
                        <p style={{ textAlign: "center", padding: "0.5rem", color: "rgb(100, 100, 100)" }}>
                            상세정보로 이동
                        </p>
                    </Link>
                    <Divider /> */}
                    <div className="comment">
                        <CommentList inP_id={this.props.post.p_id} updateFlag={updateFlag}/>
                        <CommentForm inP_id={this.props.post.p_id} handleUpdateFlag={this.handleUpdateFlag} />
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(
    (state: any) => ({
        user: state.user.get("loggedInfo")
    }),
)(PostDetail);