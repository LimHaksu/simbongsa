import React, { FunctionComponent } from 'react';
import { Link } from 'react-router-dom';

interface Props {
    to: string
}
const NaviLink: FunctionComponent<Props> = ({ to, children }) => (
    <Link to={to}>{children}</Link>
);

export default NaviLink;