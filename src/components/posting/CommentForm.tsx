import React from 'react';
import storage from "lib/storage";

import { connect } from "react-redux";

import './CommentForm.css'
import * as PostingApi from 'lib/api/PostingApi'
import { Input, Button } from 'semantic-ui-react'

interface Props {
    "inP_id": number;
    handleUpdateFlag : Function;
}

class CommentForm extends React.Component<Props & any, {}> {
    state = {
        "c_content": "",
        "inP_id": "",
        "m_id": this.props.user.toJS().m_id,
    }

    handleChange = (e: any) => {
        this.setState({
            "c_content": e.target.value
        })
    }

    handleClick = () => {
        let comment = {
            'c_content': this.state.c_content,
            'p_id': this.props.inP_id.toString(),
            'm_id': this.props.user.toJS().m_id
        };
        PostingApi.postComment(comment)
            .then((res: any) => {
                this.setState({
                    "c_content": ""
                })
                this.props.handleUpdateFlag(true);
            });
        // window.location.reload(true);
    }

    render() {

        return (
            <div>
                <Input
                    size='small'
                    value={this.state.c_content}
                    onChange={this.handleChange}
                    label={<Button
                        onClick={this.handleClick}
                    >등록</Button>
                    }
                    labelPosition="right"
                />
            </div>
        )
    }
};

export default connect(
    (state: any) => ({
        user: state.user.get("loggedInfo")
    }),

)(CommentForm);