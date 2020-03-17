import React, { Component } from 'react'

interface Props {

}
interface State {

}

export default class WithdrawComplete extends Component<Props, State> {
    state = {}
    componentDidMount() {
        setTimeout(function () {
            window.location.href = process.env.REACT_APP_FRONT_URI!;
        }, 5000);
    }
    render() {
        return (
            <div>
                회원 탈퇴가 완료되었습니다.<br />
                그동안 이용해주셔서 감사합니다.
            </div>
        )
    }
}
