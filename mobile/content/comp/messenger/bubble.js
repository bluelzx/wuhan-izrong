import React, {Text, View, Animated, Image, StyleSheet} from 'react-native';

let styles = StyleSheet.create({
  bubble: {
    borderRadius: 5,
    paddingLeft: 14,
    paddingRight: 14,
    paddingBottom: 10,
    paddingTop: 8,
  },
  text: {
    color: '#000',
  },
  textLeft: {
  },
  textRight: {
    color: '#fff',
  }
});

export default class Bubble extends React.Component {

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    Object.assign(styles, this.props.styles);
  }

  renderText(text = "", position) {

    if (this.props.renderCustomText) {
      return this.props.renderCustomText(this.props);
    }
    return (
      <Text style={[styles.text, (position === 'left' ? styles.textLeft : styles.textRight)]}>
        {text}
      </Text>
    );
  }

  _getLength(str) {
    return str.replace(/[^\x00-\xff]/g, '01').length;
  }

  render(){

    let customStyle = {};
    if (this.props.position === 'left') {
      customStyle = {
        marginRight: 30,
        backgroundColor: this.props.leftBackgroundColor,
        alignSelf: 'flex-start'
      };
    } else {
      customStyle = {
        marginLeft: 30,
        backgroundColor: this.props.status === 'ErrorButton' ? this.props.errorBackgroundColor : this.props.rightBackgroundColor,
        alignSelf: 'flex-end'
      };
    }

    if (this.props.contentType === 'image') {
      return (
        <View style={[styles.bubble, customStyle]}>
          <Image
            style={{
              flex: 1,
              width: 100,
              height: 100,
            }}
            source={{uri: this.props.content}}
          ></Image>
        </View>
      );
    }

    var flexStyle = {};
    //if ( this.props.text.length > 40 ) {
    if ( this._getLength(this.props.content) > 40 ) {
      flexStyle.flex = 1;
    }

    return (
      <View style={[styles.bubble, customStyle, flexStyle]}>
        {this.props.name}
        {this.renderText(this.props.content, this.props.position)}
      </View>
    );
  }
}

Bubble.propTypes = {
  position: React.PropTypes.oneOf(['left', 'right']),
  status: React.PropTypes.string,
  contentType: React.PropTypes.string,
  content: React.PropTypes.string,
  renderCustomText: React.PropTypes.func,
  name: React.PropTypes.element,
  leftBackgroundColor: React.PropTypes.string,
  rightBackgroundColor: React.PropTypes.string,
  errorBackgroundColor: React.PropTypes.string
};

Bubble.defaultProps = {
  leftBackgroundColor: '#e6e6eb',
  rightBackgroundColor: '#007aff',
  errorBackgroundColor: '#e01717'
};
