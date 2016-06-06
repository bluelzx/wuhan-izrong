import React, {Text, View, Animated, Image, StyleSheet, Platform} from 'react-native';
let Icon = require('react-native-vector-icons/Ionicons');

export default class Angle extends React.Component {

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    //Object.assign(styles, this.props.styles);
  }

  render() {
    let customStyle = {};
    switch (this.props.direction) {
      case 'left':
        customStyle = {
          borderLeftWidth: 0,
          borderTopWidth: 0,
          borderRightColor: this.props.color
        };
        break;
      case 'right':
        customStyle = {
          borderRightWidth: 0,
          borderTopWidth: 0,
          borderLeftColor: this.props.color,
        };
        break;
      case 'up':
        customStyle = {
          borderTopWidth: 0,
          borderBottomColor: this.props.color,
          width:0
        };
        break;
    }

    if(Platform.OS === 'ios') {
      return (
        <View
          style={[customStyle, {
            //flex: 4,
            borderColor: 'transparent',
            borderWidth: this.props.width,
            marginTop: 0,
            height:0
          }]}
        />
      );
    }else{
      if (this.props.direction == 'up') {
        return (
            <Icon name={'android-arrow-dropup'} size={30} color={this.props.color}/>
        );
      } else {
        return null;
      }
    }
  }
}

Angle.propTypes = {
  direction: React.PropTypes.oneOf(['left', 'right', 'up', 'down']),
  color: React.PropTypes.string,
  width: React.PropTypes.number
};

Angle.defaultProps = {
  direction: 'left',
  color: 'white',
  width: 6
};
