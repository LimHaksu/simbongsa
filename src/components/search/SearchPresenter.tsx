import React, { Fragment } from 'react';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import SearchInput from 'components/input/SearchInput'

interface Iprops {
  volResults: any,
  input: string,
  error: any,
  handleSubmit: any,
  updateTerm: any
}

const SearchPresenter = ({ volResults, input, error, handleSubmit, updateTerm }: Iprops) => {
  return (
    <Fragment>

      <SearchInput id="search" type="text" placeholder="봉사 관련 키워드를 입력하세요." value={input} onChange={updateTerm} nametag="지역 / 봉사" handleSubmit={handleSubmit} ></SearchInput>

    </Fragment>
  )
}
export default SearchPresenter;

