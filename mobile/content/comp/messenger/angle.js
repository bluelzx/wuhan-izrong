import React, {Text, View, Animated, Image, StyleSheet} from 'react-native';

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
          borderLeftColor: this.props.color
        };
        break;
      case 'up':
        customStyle = {
          borderTopWidth: 0,
          borderBottomColor: this.props.color,
          width:0,
        };
        break;
    }

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
