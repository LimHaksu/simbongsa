import React, { ReactElement } from "react";
import { Button } from "semantic-ui-react";
interface Props {
  placeholder?: string;
  action: () => void;
  width?: number;
  height?: number;
}
interface State { }

export default function ActionButton({
  placeholder,
  action,
  width,
  height
}: Props): ReactElement {
  return (
    <div>
      <Button width={width} height={height} color="orange" onClick={action}>
        {placeholder}
      </Button>
    </div>
  );
}
