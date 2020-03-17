import React from "react";
import ReactDOM from "react-dom";

interface FProps {
  id: any;
  key: any;
  onChange: any;
  value: any;
}
class FieldEditor extends React.Component<FProps> {
  constructor(props: any) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(event: any) {
    const text = event.target.value;
    this.props.onChange(this.props.id, text);
  }
  render() {
    return (
      <div className="field-editor">
        <input onChange={this.handleChange} value={this.props.value} />
      </div>
    );
  }
}
interface FEProps {
  fields: any;
}
class FormEditor extends React.Component<FEProps> {
  constructor(props: any) {
    super(props);
    this.state = {};
    this.handleFieldChange = this.handleFieldChange.bind(this);
  }
  handleFieldChange(fieldId: any, value: any) {
    this.setState({ [fieldId]: value });
  }
  render() {
    const fields = this.props.fields.map((field: any) => (
      <FieldEditor
        key={field}
        id={field}
        onChange={this.handleFieldChange}
        value={this.state}
      />
    ));
    return (
      <div>
        {fields}
        <div>{JSON.stringify(this.state)}</div>
      </div>
    );
  }
}
// Convert to class component and add abillity to dynamically add/remove fields by having it in state
const App = () => {
  const fields = ["field1", "field2", "anotherField"];
  return <FormEditor fields={fields} />;
};
ReactDOM.render(<App />, document.body);
