import React, {View, Text, TouchableHighlight, StyleSheet, Image} from 'react-native';
import { Spinner } from 'mx-artifacts';

let styles = StyleSheet.create({
  errorButtonContainer: {
    position:'absolute',
    right:50,
    bottom:0,
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: '#e6e6eb',
    borderRadius: 15,
    width: 5,
    height: 5,
  },
  errorButton: {
    fontSize: 22,
    textAlign: 'center',
  },
});

export default class ErrorButton extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      isLoading: false,
    };
  }


  componentWillMount() {
    Object.assign(styles, this.props.styles);
  }


  onPress() {
    this.setState({
      isLoading: true,
    });

    this.props.onErrorButtonPress(this.props.rowData, this.props.rowID);
  }

  render() {
    if (this.state.isLoading === true) {
      return (
        <View style={[styles.errorButtonContainer, {
          backgroundColor: 'transparent',
          borderRadius: 0,
        }]}>
          <Spinner color="#ECECEC"/>
        </View>
      );
    }
    return (
      <View style={styles.errorButtonContainer}>
        <TouchableHighlight
          underlayColor='transparent'
          onPress={this.onPress.bind(this)}
        >
          <Image  source={require('../../image/im/sendFail.png')}/>
        </TouchableHighlight>
      </View>
    );
  }
}

ErrorButton.defaultProps = {
  onErrorButtonPress: () => {},
  rowData: {},
  rowID: null,
  styles: {},
};
