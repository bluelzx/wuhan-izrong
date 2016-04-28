import React, {Text, View, Animated, Image, StyleSheet, TouchableOpacity, Dimensions} from 'react-native';
import {MSG_CONTENT_TYPE} from '../../constants/dictIm';
import _ from 'lodash';
import numeral from 'numeral';
let screenWidth = Dimensions.get('window').width;
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
  textLeft: {},
  textRight: {
    color: '#fff',
  }
});
import Share from 'react-native-share';
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

  _onLongPress(shareContent) {
    console.log('onLongPress');
    Share.open({
      share_text: shareContent,
      share_URL: "http://google.cl",
      title: "Share Link"
    }, (e) => {
      console.log(e);
    });
  }

  _getLength(str) {
    return str.replace(/[^\x00-\xff]/g, '01').length;
  }

  render() {

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

    if (this.props.contentType === MSG_CONTENT_TYPE.IMAGE) {
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

    if (this.props.contentType === MSG_CONTENT_TYPE.NAMECARD) {
      let data = JSON.parse(this.props.content);
      return (
        <View style={[styles.bubble, customStyle, {width:300}]}>
          <Text
            style={[{flexWrap:'wrap'},styles.text, (this.props.position === 'left' ? styles.textLeft : styles.textRight)]}>{data.realName + '--' + data.orgBeanName}</Text>
          <View style={{flexDirection:'row'}}>
            <Text
              style={[styles.text, (this.props.position === 'left' ? styles.textLeft : styles.textRight)]}>手机:</Text>
            <Text
              style={[{flexWrap:'wrap'},styles.text, (this.props.position === 'left' ? styles.textLeft : styles.textRight)]}>{data.mobileNumber}</Text>
          </View>
          <View style={{flexDirection:'row'}}>
            <Text
              style={[styles.text, (this.props.position === 'left' ? styles.textLeft : styles.textRight)]}>座机:</Text>
            <Text
              style={[{flexWrap:'wrap'},styles.text, (this.props.position === 'left' ? styles.textLeft : styles.textRight)]}>{data.phoneNumber}</Text>
          </View>
          <View style={{flexDirection:'row'}}>
            <Text
              style={[styles.text, (this.props.position === 'left' ? styles.textLeft : styles.textRight)]}>微信:</Text>
            <Text
              style={[{flexWrap:'wrap'},styles.text, (this.props.position === 'left' ? styles.textLeft : styles.textRight)]}>{data.weChatNo}</Text>
          </View>
          <View style={{flexDirection:'row'}}>
            <Text
              style={[styles.text, (this.props.position === 'left' ? styles.textLeft : styles.textRight)]}>邮箱:</Text>
            <Text
              style={[{flexWrap:'wrap'},styles.text, (this.props.position === 'left' ? styles.textLeft : styles.textRight)]}>{data.email}</Text>
          </View>
          <View style={{flexDirection:'row'}}>
            <Text
              style={[styles.text, (this.props.position === 'left' ? styles.textLeft : styles.textRight)]}>部门:</Text>
            <Text
              style={[{flexWrap:'wrap'},styles.text, (this.props.position === 'left' ? styles.textLeft : styles.textRight)]}>{data.department}</Text>
          </View>
          <View style={{flexDirection:'row'}}>
            <Text
              style={[styles.text, (this.props.position === 'left' ? styles.textLeft : styles.textRight)]}>职位:</Text>
            <Text
              style={[{flexWrap:'wrap'},styles.text, (this.props.position === 'left' ? styles.textLeft : styles.textRight)]}>{data.jobTitle}</Text>
          </View>
        </View>
      )
    }

    if (this.props.contentType === MSG_CONTENT_TYPE.BIZINFO) {
      let data = JSON.parse(this.props.content);
      let amount = data.amount == '' ? '0元' : data.amount / 10000 + '万';
      let shareContent = data.bizCategory + '  ' + (data.bizOrientation == 'IN' ? '入' : '出') + '  ' +
        (data.term == '' ? '0天' : data.term + '天') + '  ' +
        amount + '  ' + numeral(data.rate * 100).format('0,0.00') + '%';
      return (
        <TouchableOpacity onLongPress={() => this._onLongPress(shareContent)} activeOpacity={0.7}>
          <View style={[styles.bubble, customStyle]}>
            <Text
              style={[styles.text, (this.props.position === 'left' ? styles.textLeft : styles.textRight), {paddingBottom: 5}]}>{data.bizCategory}</Text>
            <View
              style={{borderTopWidth: 1, borderTopColor: '#cccccc', paddingTop: 15, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
              <Image style={{}}
                     source={data.bizOrientation == 'IN' ? require('../../image/market/receive.png') : require('../../image/market/issue.png')}/>
              <View style={{width: screenWidth * 0.6, flex: 1, flexDirection: 'row'}}>
                <Text style={[styles.text, (this.props.position === 'left' ? styles.textLeft : styles.textRight),
                  {flex: 1, textAlign: 'center'}]}>
                  {data.term == '' ? '0天' : data.term + '天'}
                </Text>
                <Text style={[styles.text, (this.props.position === 'left' ? styles.textLeft : styles.textRight),
                  {flex: 1, textAlign: 'center'}]}>
                  {amount}
                </Text>
                <Text style={[styles.text, (this.props.position === 'left' ? styles.textLeft : styles.textRight),
                  {flex: 1, textAlign: 'center'}]}>
                  {numeral(data.rate * 100).format('0,0.00') + '%'}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      )
    }


    var flexStyle = {};
    //if ( this.props.text.length > 40 ) {
    if (this._getLength(this.props.content) > 40) {
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
