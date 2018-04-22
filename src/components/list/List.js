import React from 'react';
import Loading from '../common/Loading';
import Table from './Table';
import Pagination from './Pagination';
import { handleResponse } from '../../helpers'
import { API_URL } from '../../config';


class List extends React.Component {
  constructor() {
    super();

    this.state = {
      loading: false,
      currencies: [],
      error: null,
      totalPages: 0,
      page: 1
    };
  }

  componentDidMount() {
    this.setState({loading: true});

    const {page} = this.state;

    this.fetchCurrencies(page);
  }

  fetchCurrencies(page) {
    fetch(`${API_URL}/cryptocurrencies?page=${page}&perPage=20`)
    .then(handleResponse)
    .then((data) => {
      const { currencies, totalPages } = data;
      this.setState({
        loading: false,
        currencies,
        totalPages
      });
    })
    .catch((error) => {
      this.setState({
        error: error.errorMessage,
        loading: false
      });
    });
  }

  handlePaginationClick = (direction) => {
    const nextPage = direction == 'next' ? this.state.page + 1 : this.state.page - 1;

    this.setState({ page: nextPage });

    this.fetchCurrencies(nextPage);
  }

  render() {
    const { loading, error, currencies, page, totalPages } = this.state;

    if(loading) {
      return <div className="loading-container"><Loading/></div>
    }

    if(error) {
      return <div className="error">{error}</div>
    }

    return (
      <div>
        <Table
          currencies={currencies}/>
        <Pagination
          page={page}
          totalPages={totalPages}
          handlePaginationClick={this.handlePaginationClick}/>
      </div>
    );
  }
}

export default List;
