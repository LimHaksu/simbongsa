import React from "react";
import SearchContainer from "containers/usersetting/SearchContainer";
import Withdraw from "containers/usersetting/Withdraw";
import Profile from "containers/usersetting/Profile";
import ChangePassword from "containers/usersetting/ChangePassword";
import { Tab } from "semantic-ui-react";

const panes = [
  {
    menuItem: "프 로 필",
    render: () => (
      <Tab.Pane attached={false}>
        <Profile />
      </Tab.Pane>
    )
  },
  {
    menuItem: "선 호 봉 사",
    render: () => (
      <Tab.Pane attached={false}>
        <SearchContainer />
      </Tab.Pane>
    )
  },
  {
    menuItem: "비 밀 번 호",
    render: () => (
      <Tab.Pane attached={false}>
        <ChangePassword />
      </Tab.Pane>
    )
  },
  {
    menuItem: "회 원 탈 퇴",
    render: () => (
      <Tab.Pane attached={false}>
        <Withdraw />
      </Tab.Pane>
    )
  }
];

const UserSettingTab = () => (
  <Tab
    menu={{ fluid: true, vertical: true, tabular: true }}
    grid={{ paneWidth: 14, tabWidth: 2 }}
    panes={panes}
  />
);

export default UserSettingTab;
