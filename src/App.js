import React, { Component } from 'react';
import ApolloClient from 'apollo-boost';
import { ApolloProvider, Query } from 'react-apollo';
import gql from 'graphql-tag';

const client = new ApolloClient({
  uri: 'https://kq84qm3017.lp.gql.zone/graphql'
});

// Fetch GraphQL data with a stateless functional Query component - https://preactjs.com/guide/types-of-components
const Currencies = ({ filter }) => {
  return (
    <Query
      query={gql`
        query overParity($min: Int!) {
          overParity(min: $min) {
            currency
            rate
          }
        }
      `}
      variables={filter}
    >
      {({ loading, error, data }) => {
        if (loading) return <p>Loading...</p>;
        if (error) return <p>Error :(</p>;
        console.log('Filtered by', filter);
        console.log('Data:', data);
        // BUG if changing the state more than twice
        const message = data.overParity ?
            `Found ${data.overParity.length} currencies the USD is ${filter.min}+ times greater than`
            : 'BUG: data is {}';
        return (
          <h3>{message}</h3>
        )
      }}
    </Query>
  );
};


export default class App extends Component {
  state = {
    min: 1,
  };
  updateMin = e => {
    this.setState({ min: e.target.value || 0 });
  };

  render() {
    return (
      <ApolloProvider client={client}>
        <div>
          <h2>Use spiner to change value 3+ times and watch the console</h2>
          <h2>Each change should log the value and the data returned</h2>
          <div>
            <input type="number" min="0" value={this.state.min} onChange={this.updateMin} />
          </div>
          <Currencies filter={this.state} />
        </div>
      </ApolloProvider>
    );
  }
}
