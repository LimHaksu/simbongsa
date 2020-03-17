import React, { Component, Fragment } from "react";
import {
    Dropdown, Icon
} from "semantic-ui-react";
import "./CategoryContainer.css"
import temp2 from "lib/json/temp2.json"
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as searchActions from "redux/modules/search";
import { Button } from "semantic-ui-react"
interface Props {
    categorys: any;
    SearchActions: any;
    input: any;
    key: any;
}
interface State { }
class CategorySelection extends Component<Props, State> {
    state = {};
    findKey = (options: any, value: any) => {
        const result = options.find((option: any) =>
            option.value === value
        )
        return result.key
    }
    handleChange = (e: any, data: any) => {
        const { SearchActions, categorys } = this.props;
        const splitValue = data.value.split('/')
        const check = categorys.filter((category: any) => category.text === splitValue[1]);

        if (check.size === 0 && categorys.size < 3) {

            SearchActions.changeInput({ input: splitValue[1], key: splitValue[0] });
            if (e.key !== "ArrowDown" && e.key !== "ArrowUp") {
                if (data.value !== []) {
                    SearchActions.insert({ form: "category", text: splitValue[1], key: splitValue[0] });
                    SearchActions.changeInput({ input: "", key: '' });
                }
            }

        };
    }
    handleInsert = () => {
        const { SearchActions, input, key } = this.props;
        SearchActions.insert({ form: "category", text: input, key: key });
        SearchActions.changeInput({ input: "", key: "" });
    }
    handleRemove = (id: number) => {
        const { SearchActions } = this.props;
        SearchActions.remove({ form: "category", id: id });
    };
    handleKeyDown = (event: any, data: any) => {
        const { SearchActions, categorys, input, key } = this.props;
        if (event.key === "Enter") {
            const check = categorys.filter((category: any) => category.text === input);
            if (check.size === 0 && categorys.size < 3) {
                if (input !== "") {
                    SearchActions.insert({ form: "category", text: input, key: key });
                    SearchActions.changeInput({ input: "", key: '' });
                }
            }
        }
    };
    render() {
        const {
            handleChange,
            handleRemove,
            handleKeyDown
        } = this;
        const { categorys, input, key } = this.props;
        const categoryItems = categorys.map((category: any) => {
            const { id, checked, text } = category;
            return (
                <LocationItem
                    id={id}
                    checked={checked}
                    text={text}
                    onRemove={handleRemove}
                    key={id}
                />
            );
        });


        return (

            <Fragment>
                <div style={{ "margin": 1 }} >
                    <Dropdown
                        // placeholder={placeholder}
                        value={input}
                        placeholder="봉사종류를 입력해주세요."
                        search
                        selection
                        onChange={handleChange}
                        options={temp2}
                        onKeyDown={handleKeyDown}
                        style={{width:210}}
                    // disabled={todos.size === 3}
                    ></Dropdown>
                </div>
                {categoryItems}
            </Fragment>
        );
    }
}
const LocationItem = ({ id, text, onRemove }: any) => (
    <div style={{
        width: 200,
        textDecoration: 'none',
        padding: 0,
        marginTop: 15,
        marginBottom: 15,

    }}>
        <Button className="ulBtn" color='orange' size='mini'><div style={{ display: 'flex', justifyContent: 'space-around' }}>{text}<Icon size="big" name="delete" onClick={() => onRemove(id)} /></div></Button>
    </div >

);
export default connect(
    ({ search }: any) => ({
        input: search.get("input"),
        categorys: search.get("categorys"),
        key: search.get("key")
    }),
    dispatch => ({
        SearchActions: bindActionCreators(searchActions, dispatch)
    })
)(CategorySelection);
