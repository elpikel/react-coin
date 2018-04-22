import React from 'react';
import { withRouter } from 'react-router-dom';
import { API_URL } from '../../config';
import { handleResponse } from '../../helpers';
import Loading from './Loading';
import './Search.css';

class Search extends React.Component {
  constructor() {
    super();

    this.state = {
      searchQuery: '',
      searchResult: [],
      loading: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleRedirect = this.handleRedirect.bind(this);
  }

  renderSearchResult() {
    const { searchResult, searchQuery, loading } = this.state;

    if(!searchQuery || loading) {
      return '';
    }

    if(searchResult.lenght == 0) {
      return (
        <div className="Search-result-container">
          <div className="Search-no-result">
            No result found.
          </div>
        </div>
      );
    }

    return (
      <div className="Search-result-container">
        {searchResult.map(result => (
          <div
            key={result.id}
            className="Search-result"
            onClick={() => this.handleRedirect(result.id)}>
            {result.name} ({result.symbol})
          </div>
        ))}
      </div>
    );
  }

  handleChange(event) {
    const searchQuery = event.target.value;

    this.setState({searchQuery});

    if(!searchQuery) {
      return '';
    }

    this.setState({loading: true});

    fetch(`${API_URL}/autocomplete?searchQuery=${searchQuery}`)
      .then(handleResponse)
      .then((result) => {
        this.setState({loading: false, searchResult: result});
      });
  }

  handleRedirect(currencyId) {
    this.state = {
      searchQuery: '',
      searchResult: []
    };

    this.props.history.push(`/currency/${currencyId}`);
  }

  render() {
    const { loading, searchQuery } = this.state;

    return (
      <div className="Search">
        <span className="Search-icon" />
        <input
          className="Search-input"
          type="text"
          placeholder="Currency name"
          onChange={this.handleChange}
          value={searchQuery}/>
          { loading && <div className="Search-loading">
            <Loading width='12px' height='12px' />
          </div> }
          {this.renderSearchResult()}
      </div>
    );
  }
}

export default withRouter(Search);
