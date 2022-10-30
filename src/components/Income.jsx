import React from 'react';
import node from './boxplot';
import rd3 from 'react-d3-library';
const RD3Component = rd3.Component;

class Income extends React.Component {

    constructor(props) {
      super(props);
      this.state = {d3: ''}
    }
  
    componentDidMount() {
      this.setState({d3: node});
    }
  
    render() {
      return (
      <div className='Income-View'>
        <RD3Component data={this.state.d3} />
      </div>
    )
  }
};

export default Income;