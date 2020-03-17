import React, { Component } from "react";
import List from "./List";
import data from "./Data";
import "./ListUp.scss";

interface Props {

}
interface State {
  data: any
}
export default class ListUp extends Component<Props, State> {
  state = { data };
  rotate = () =>
    this.setState(state => ({ data: this.arrayRotate(state.data, false) }));
  arrayRotate = (arr: any, reverse: any) => {
    if (reverse) arr.unshift(arr.pop());
    else arr.push(arr.shift());
    return arr;
  };
  componentDidMount() {
    setInterval(this.rotate, 4000);
  }
  render() {
    return (
      <List
        className="main-list"
        items={this.state.data}
        keys={(d: any) => d.name}
        heights={(d: any) => d.height}
        config={{ mass: 4, tension: 50, friction: 40 }}
      >
        {(item: any) => {
          return (
            <div className="main-list-cell">
              <div
                className="main-list-details"
                style={{ backgroundImage: item.css }}
              >
                <div id="head">{item.head1}</div>
                <div id="head">{item.head2}</div>
                <div id="head">{item.head3}</div>
                <p>{item.line2}</p>
                <p>{item.line3}</p>
                <p>{item.line4}</p>
                <h2>{item.name}</h2>
              </div>
            </div>
          );
        }}
      </List>
    );
  }
}
