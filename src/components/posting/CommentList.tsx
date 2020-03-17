import React from 'react';
import Comment from './Comment';
import storage from 'lib/storage'
import * as PostingApi from 'lib/api/PostingApi'
interface Props {
    inP_id: number;
    updateFlag : boolean;
}

interface States {
    comments: Array<any>
    updateFlagByComment : boolean
}


class CommentList extends React.Component<Props, States> {
    state = { comments : [], updateFlagByComment : false }
    componentDidMount(){
        PostingApi.getComment(this.props.inP_id)
            .then((res: any) => {
                if (res.data.data.length > 0) {
                    const data = res.data.data.map((d: any) => {
                        return { c_id: d.c_id, p_id: d.p_id, c_content: d.c_content, m_id: d.m_id, userId: d.userId }
                    })
                    this.setState({
                        comments: data
                    })
                }
            })
    }
    setUpdateFlag = (flag : boolean) =>{
        this.setState({updateFlagByComment : flag});
    }
    componentDidUpdate(){
        const { updateFlag } = this.props;
        const { updateFlagByComment } = this.state;
        if(updateFlag){
            PostingApi.getComment(this.props.inP_id)
            .then((res: any) => {
            if (res.data.data.length > 0) {
                const data = res.data.data.map((d: any) => {
                    return { c_id: d.c_id, p_id: d.p_id, c_content: d.c_content, m_id: d.m_id, userId: d.userId }
                })
                this.setState({
                    comments: data
                })
            }
        })
        }
        if(updateFlagByComment){
            this.setState({updateFlagByComment: false},()=>{
                PostingApi.getComment(this.props.inP_id)
                .then((res: any) => {
                if (res.data.data.length > 0) {
                    const data = res.data.data.map((d: any) => {
                        return { c_id: d.c_id, p_id: d.p_id, c_content: d.c_content, m_id: d.m_id, userId: d.userId }
                    })
                    this.setState({
                        comments: data
                    })
                }else{
                    this.setState({comments : []})
                }
                })
            })
        }
    }
    render() {
        const prints = this.state.comments.map((comment : any, i) => {
            return (
                <Comment
                    comment={comment}
                    inP_id={comment.p_id}
                    key={i}
                    setUpdateFlag={this.setUpdateFlag}
                />
            )
        })

        return (
            <div>
                {this.state.comments.length > 0 ?
                    (prints)
                    : (<div style={{ color: 'rgb(185, 185, 185)' }}>첫번째 댓글을 작성해보세요.</div>)}
            </div>
        )
    }
};

export default CommentList;