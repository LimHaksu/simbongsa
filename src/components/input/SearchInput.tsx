import React, { ReactElement, Fragment } from "react";
import { Form, Input } from 'semantic-ui-react'
// import "assets/mycss";

interface Props {
  value: string;
  onChange?: (e: React.FormEvent<HTMLInputElement>) => void;
  onEnter?: (e: React.FormEvent<HTMLInputElement>) => void;
  id: string;
  placeholder: string;
  nametag?: string;
  type: string;

  handleSubmit: any
}
export default function SearchInput({
  value,
  onChange,
  id,
  placeholder,
  type,
  onEnter,
  handleSubmit
}: Props): ReactElement {
  return (
    <Fragment>
      <Form>
        <Form.Field>
          <Input
            value={value}
            onChange={onChange}
            id={id}
            placeholder={placeholder}
            type={type}
            autoCapitalize="none"
            onKeyDown={(event: any) => {
              if (event.key === "Enter" && onEnter !== undefined) {
                onEnter(event);
              }
            }}
            fluid
            action={{
              icon: 'search',
              onClick: handleSubmit,
              onKeyUp: (event: any) => {
                if (event.key === "Enter" && onEnter !== undefined) {
                  onEnter(event);
                }
              },
              color: 'orange',

            }} />
        </Form.Field>
      </Form>
    </Fragment>


  );
}
