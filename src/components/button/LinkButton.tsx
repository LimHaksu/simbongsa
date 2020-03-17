import React, { ReactElement } from "react";
import { Link } from "react-router-dom";
import { Button } from "semantic-ui-react";
// import "assets/mycss/";
interface Props {
  placeholder: string;
  link: string;
  inverted?: boolean;
  disabled?: boolean;
  width?: number;
  height?: number;
}

export default function LinkButton({
  link,
  placeholder,
  disabled,
  inverted = false,
  width,
  height
}: Props): ReactElement {
  return (
    <div>
      <Link to={link}>
        {inverted && <Button inverted color="orange" width={width} height={height}>
          {placeholder}
        </Button>}
        {!inverted && <Button color="orange" width={width} height={height}>
          {placeholder}
        </Button>}
      </Link>
    </div>
  );
}
