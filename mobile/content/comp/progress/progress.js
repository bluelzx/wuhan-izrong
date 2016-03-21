'use strict';

var React = require('react-native');

var {
  View,
  ActivityIndicatorIOS
  } = React;


var ProgressMixin = {
  getInitialState() {
    return {
      is_progress_visible: false
    };
  },

  showProgress() {
    this.setState({
      is_progress_visible: true
    });
  },

  dismissProgress() {
    this.setState({
      is_progress_visible: false
    });
  },

  childContextTypes: {
    showProgress: React.PropTypes.func,
    dismissProgress: React.PropTypes.func
  },

  getChildContext() {
    return {
      showProgress: this.showProgress,
      dismissProgress: this.dismissProgress
    };
  },
};

var Progress = React.createClass({

  contextTypes: {
    showProgress: React.PropTypes.func,
    dismissProgress: React.PropTypes.func
  },

  statics: {
    Mixin: ProgressMixin
  },

  propTypes: {
    isDismissible: React.PropTypes.bool,
    isVisible: React.PropTypes.bool.isRequired,
    color: React.PropTypes.string,
    overlayColor: React.PropTypes.string,
    panelColor: React.PropTypes.string,
  },

  getDefaultProps() {
    return {
      isDismissible: false,
      color: '#000',
      size: 'large',
      overlayColor: 'rgba(0, 0, 0, 0)',
      panelColor: 'rgba(0, 0, 0, 0.3)',
    };
  },

  render() {
    // Return early if not visible
    if (!this.props.isVisible) {
      return <View />;
    }

    return (
      <View
        key="Progress"
        style={[{
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: this.props.overlayColor,
        }]}
        underlayColor={this.props.overlayColor}
        activeOpacity={1}
      >
        <ActivityIndicatorIOS
          style={[{
            marginTop: 200,
            width: 150,
            height: 100,
            borderRadius: 16,
            backgroundColor: this.props.panelColor
          }]}
          color={this.props.color}
          size={this.props.size}
        />
      </View>
    );
  }
});


module.exports = Progress;
