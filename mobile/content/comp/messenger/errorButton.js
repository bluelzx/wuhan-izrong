import React, {View, Text, TouchableHighlight, StyleSheet, Image, Platform} from 'react-native';
import { Spinner } from 'mx-artifacts';
let DictStyle = require('../../constants/dictStyle');

let styles = StyleSheet.create({
  errorButtonContainer: {
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    width: Platform.OS==='ios'?5:20,
    height: Platform.OS==='ios'?5:20,
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
      isLoading: this.props.isLoading,
    };
  }


  componentWillMount() {
    Object.assign(styles, this.props.styles);
    if(this.state.isLoading == true){
      this.setTimOutFunc();
    }
  }

  componentWillUnmount(){
    this.state.isLoading = false;
  }

  setTimOutFunc(){
    let self = this;
    setTimeout(()=>{
      if(self.state.isLoading === true){
        self.setState({isLoading : false});
      }
    },10000);
  }

  onPress() {
    this.setState({
      isLoading: true,
    });

    this.props.onErrorButtonPress(this.props.rowData, this.props.rowID);
    this.setTimOutFunc();
  }

  render() {
    if (this.state.isLoading === true) {
      return (
        <View style={[styles.errorButtonContainer, {
          backgroundColor: 'transparent',
          borderRadius: 0,
        }]}>
          <Spinner color={DictStyle.imChat.chatTipsTextColor}/>
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
  isLoading:false
};
