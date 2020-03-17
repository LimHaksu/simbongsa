import React from "react";
import axios from "axios";
import { connect } from "react-redux";
import * as postingActions from "redux/modules/posting";
import * as userActions from "redux/modules/user"
import { bindActionCreators } from "redux";
import GoBackButton from "components/button/GoBackButton";
import { Form, TextArea , Container, Button } from "semantic-ui-react";
import storage from "lib/storage";

import './PostForm.css'

const restBaseApi = process.env.REACT_APP_REST_BASE_API!;
let token = storage.get("token");

class PostingForm extends React.Component<any, any> {
    state = {
        p_status: "1"
    };

    handleChange = (e: any) => {
        this.setUserInfo()
        const { PostingActions } = this.props;
        var { id, value } = e.target;
        PostingActions.changeInput({
            id,
            value,
            form: "posting"
        });
    }

    setUserInfo() {
        const { userId, m_id } = this.props.user.toJS()
        const { PostingActions } = this.props;
        PostingActions.changeInput({
            id: "m_id",
            value: m_id,
            form: "posting"
        })
        PostingActions.changeInput({
            id: "userId",
            value: userId,
            form: "posting"
        })
    }
    componentWillMount() {
        const { PostingActions } = this.props;
        PostingActions.initializeForm("posting");
    }

    handleFileSelect = (e: any) => {
        const { PostingActions } = this.props;
        var id = e.target.id;
        var value = e.target.files;
        for (let i = 0; i < value.length; i++) {
            PostingActions.changeFileInput(value[i]);
        }
    };

    handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            p_status: e.target.value
        });
    };


    handleSubmit = async (e: any) => {
        e.preventDefault();
        const { p_content, m_id } = this.props.form.toJS();
        const { selectedfiles } = this.props
        var v_id = this.props.match.params.id
        var p_status = this.state.p_status

        const files = new FormData()
        for (let j = 0; j < selectedfiles.length; j++) {
            files.append("files", selectedfiles[j])
        }
        const post = {
            p_content,
            v_id,
            p_status,
            m_id,
        }

        await axios.post(restBaseApi + "/rest/Post", post,
            { headers: { Authorization: "Bearer " + token } })
            .then(res => {
                console.log(res)
            })
            .catch(err => console.log(err))

        await axios.post(restBaseApi + "/rest/PostFile", files,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: "Bearer " + token
                }
            })
            .then(res => {
                console.log(res)
            })
            .catch(err => console.log(err))

        this.goListPage();
    }

    goListPage() {
        var v_id = this.props.match.params.id
        this.props.history.push(`/${v_id}/postinglist`);
        window.location.reload(true);

    }

    render() {
        const { selectedFiles, p_content } = this.props.form;
        var v_id = this.props.match.params.id

        return (
            <Container>
            <Form>
                <label>
                    <input type="radio" value="1" checked={this.state.p_status === "1"}
                        onChange={this.handleStatusChange}
                    />
                    모집
            </label>
                <label>
                    <input type="radio" value="2" checked={this.state.p_status === "2"}
                        onChange={this.handleStatusChange}
                    />
                    후기
            </label>
                <TextArea
                    value={p_content}
                    className="posting"
                    name="content"
                    id="p_content"
                    placeholder="내용을 입력하세요."
                    onChange={this.handleChange} />
                <input
                    type="file"
                    id="files"
                    multiple
                    accept='image/*'
                    onChange={this.handleFileSelect}
                    value={selectedFiles}
                />
                <div className="buttons">
                    <Button onClick={this.handleSubmit}>
                        게시글 등록하기
            </Button>

                    <GoBackButton
                        text="취소하기"
                    />
                </div>
            </Form>
            </Container>
        );
    }
}


export default connect(
    (state: any) => ({
        form: state.posting.getIn(["posting", "form"]),
        selectedfiles: state.posting.get("selectedfiles"),
        result: state.posting.get("result"),
        user: state.user.get("loggedInfo")
    }),
    dispatch => ({
        PostingActions: bindActionCreators(postingActions, dispatch)
    })
)(PostingForm);
