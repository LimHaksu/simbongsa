import React from 'react';
import CertLabel from 'components/label/CertLabel'
import { Link } from 'react-router-dom'
import { connect } from "react-redux";
import * as volActions from "redux/modules/vol";
import { bindActionCreators } from "redux";
import './Vol.css'
interface Props {
    v_id: number;
    volunteer: any;
}

class Vol extends React.Component<Props & any, any> {
    render() {
        const url = window.location.href;
        const { volunteer } = this.props;
        return (
            <div className="list">
                <CertLabel
                    v_pStatus={volunteer.v_pStatus}
                    v_mBgnD={volunteer.v_mBgnD}
                    v_mEndD={volunteer.v_mEndD}
                    volunteer={volunteer}
                />
                {!url.match(`postinglist`) &&
                <div className="linktodetail">
                    <Link
                        to={{
                            pathname: `vol/${volunteer.v_id}/detail`,
                            state: { volunteer }
                        }}
                    >
                        상세보기</Link>
                </div>
                }
                <div className="listtitle">
                    {volunteer.v_title}
                </div>

            </div>
        )
    }
}

export default connect(
    () => ({
    }),
    dispatch => ({
        VolActions: bindActionCreators(volActions, dispatch)
    })
)(Vol);