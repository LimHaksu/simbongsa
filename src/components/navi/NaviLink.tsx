import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const StyledLink = styled(Link)`
`
interface Iprops {
    to: string
}
const NaviLink: React.FunctionComponent<Iprops> = ({ to, children }) => (

    <StyledLink to={to}>{children}</StyledLink>

);

export default NaviLink;