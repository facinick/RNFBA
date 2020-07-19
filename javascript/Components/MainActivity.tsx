import React from 'react';
import { Text, View } from 'react-native';
import { connect } from "react-redux";

export class MainActivity extends React.Component<any, any>{

  constructor(props: any) {
    super(props);
    this.state = {

    }
  }

  render() {
    return (<View><Text>MainActivity</Text></View>);
  }
}

const mapStateToProps = (state: any) => ({
  loggedIn: state.loggedIn,
  loginProgressing: state.loginProgressing,
  name: state.name, 
  email: state.email, 
  uid: state.uid
});

export default connect(mapStateToProps)(MainActivity);


