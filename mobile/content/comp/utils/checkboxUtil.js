/**
 * Created by vison on 16/3/23.
 */
'use strict';

let React = require('react-native');
let PropTypes = React.PropTypes;

let {
  StyleSheet,
  Image,
  Text,
  View,
  TouchableHighlight,
  } = React;

let CheckBox = React.createClass({
  //propTypes: {
  //  content: React.PropTypes.String,
  //  checked: React.PropTypes.boolean,
  //  checkedUrl:PropTypes.object,
  //  unCheckedUrl:PropTypes.object,
  //},

  getDefaultProps() {
    return {
      content: '',
      checked: true,
      checkedUrl: '',
      unCheckedUrl: ''
    };
  },

  onChange() {
    this.props.onChange(!this.props.checked);
  },

  render() {
    let source = this.props.unCheckedUrl;
    if (this.props.checked) {
      source = this.props.checkedUrl;
    }
    return (
      <TouchableHighlight onPress={this.onChange} underlayColor="transparent">
        <View style={styles.container1}>
          <Image style={styles.checkbox} source={source}/>
          <View style={styles.labelContainer}>
            <Text style={styles.label}>{this.props.content}</Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  }
});

let styles = StyleSheet.create({
  container1: {
    flexDirection: 'row',
    marginBottom: 5,
    alignItems: 'center',
    marginTop: 20
  },
  checkbox: {
    width: 18,
    height: 18
  },
  labelContainer: {
    marginLeft: 5,
    marginRight: 5
  },
  label: {
    fontSize: 16,
    lineHeight: 20,
    color: 'grey'
  }
});

module.exports = CheckBox;
