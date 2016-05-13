import React, {Text, View, Animated, Image, StyleSheet, TouchableOpacity, Dimensions, Platform} from 'react-native';
import {MSG_CONTENT_TYPE} from '../../constants/dictIm';
import _ from 'lodash';
import numeral from 'numeral';

let PicViewer = require('../utils/picViewer');
let screenWidth = Dimensions.get('window').width;
let Lightbox = require('../lightBox/Lightbox');

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
      share_URL: Platform.OS === 'android' ? shareContent : "http://google.cl",
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

          //<Lightbox underlayColor='#44B5E6'
          //          imageSource={{uri:this.props.content}}>
          //    <View style={[styles.bubble, customStyle]}>
          //        <Image
          //            style={{
          //      flex: 1,
          //      width: 100,
          //      height: 100,
          //      }}
          //            source={{uri: this.props.content}}
          //        ></Image>
          //    </View>
          //</Lightbox>


      );
    }

    if (this.props.contentType === MSG_CONTENT_TYPE.NAMECARD) {
      let data = JSON.parse(this.props.content);
      let nameCardStyle = this.props.position === 'left' ? styles.textLeft : styles.textRight;

      return (
        <View style={[styles.bubble, customStyle, {flex:1}]}>
          <Text
            style={[{flexWrap:'wrap'},styles.text, nameCardStyle]}>{data.realName + '--' + data.orgBeanName}</Text>
          <View style={[{height:0,flex:1,borderWidth:0.5,borderColor:'#fff',marginVertical:4},this.props.position === 'left' && {borderColor:'#000'}]}></View>
          <View style={{flexDirection:'row'}}>
            <Text
              style={[styles.text, nameCardStyle]}>手机:</Text>
            <Text
              style={[{flexWrap:'wrap',flex:5},styles.text, nameCardStyle]}>{data.mobileNumber?data.mobileNumber:'未填写'}</Text>
          </View>
          <View style={{flexDirection:'row'}}>
            <Text
              style={[styles.text,nameCardStyle]}>座机:</Text>
            <Text
              style={[{flexWrap:'wrap',flex:5},styles.text, nameCardStyle]}>{data.phoneNumber?data.phoneNumber:'未填写'}</Text>
          </View>
          <View style={{flexDirection:'row'}}>
            <Text
              style={[styles.text, nameCardStyle]}>微信:</Text>
            <Text
              style={[{flexWrap:'wrap',flex:5},styles.text, nameCardStyle]}>{data.weChatNo?data.weChatNo:'未填写'}</Text>
          </View>
          <View style={{flexDirection:'row'}}>
            <Text
              style={[styles.text, nameCardStyle]}>QQ:</Text>
            <Text
              style={[{flexWrap:'wrap',flex:5},styles.text, nameCardStyle]}>{data.qqNo?data.qqNo:'未填写'}</Text>
          </View>
          <View style={{flexDirection:'row'}}>
            <Text
              style={[styles.text, nameCardStyle]}>邮箱:</Text>
            <Text
              style={[{flexWrap:'wrap',flex:5},styles.text, nameCardStyle]}>{data.email?data.email:'未填写'}</Text>
          </View>
          <View style={{flexDirection:'row'}}>
            <Text
              style={[styles.text, nameCardStyle]}>部门:</Text>
            <Text
              style={[{flexWrap:'wrap',flex:5},styles.text, nameCardStyle]}>{data.department?data.department:'未填写'}</Text>
          </View>
          <View style={{flexDirection:'row'}}>
            <Text
              style={[styles.text, nameCardStyle]}>职位:</Text>
            <Text
              style={[{flexWrap:'wrap',flex:5},styles.text, nameCardStyle]}>{data.jobTitle?data.jobTitle:'未填写'}</Text>
          </View>
        </View>
      )
    }

    if (this.props.contentType === MSG_CONTENT_TYPE.BIZINFO) {
      let data = JSON.parse(this.props.content);
      let amount = data.amount == '' ? '--' : (data.amount > 99999999 ? data.amount / 100000000 + '亿' : data.amount / 10000 + '万');
      let dayNum;
      if (data.term == '') {
        dayNum = '--'
      } else if (data.term % 365 == 0) {
        dayNum = parseInt(data.term / 365) + '年';
      } else if (data.term % 30 == 0) {
        dayNum = parseInt(data.term / 30) + '月';
      }else {
        dayNum = data.term + '日';
      }
      let rate = data.rate == 0 ? '--' : (numeral(data.rate * 100).format('0,0.00') + '%');
      let shareContent = '我利用[渤海银通]分享了一个业务信息给您：' + data.bizCategory + '  ' + (data.bizOrientation == 'IN' ? '入' : '出') + '  ' + dayNum + '  ' + amount + '  ' + rate;
      return (
        <TouchableOpacity onLongPress={() => this._onLongPress(shareContent)} activeOpacity={0.7}>
          <View style={[styles.bubble, customStyle]}>
            <Text
              style={[styles.text, (this.props.position === 'left' ? styles.textLeft : styles.textRight), {paddingBottom: 5}]}>{data.bizCategory}</Text>
            <View
              style={{borderTopWidth: 1, borderTopColor: '#cccccc', paddingTop: 15, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
              <Image style={{}}
                     source={data.bizOrientation == 'IN' ? require('../../image/market/receive.png') : require('../../image/market/issue.png')}/>
              <View style={{width: screenWidth * 0.5, flex: 1, flexDirection: 'row'}}>
                <Text style={[styles.text, (this.props.position === 'left' ? styles.textLeft : styles.textRight),
                  {flex: 1, textAlign: 'center'}]}>
                  {dayNum}
                </Text>
                <Text style={[styles.text, (this.props.position === 'left' ? styles.textLeft : styles.textRight),
                  {flex: 1, textAlign: 'center'}]}>
                  {amount}
                </Text>
                <Text style={[styles.text, (this.props.position === 'left' ? styles.textLeft : styles.textRight),
                  {flex: 1, textAlign: 'center'}]}>
                  {rate}
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
  leftBackgroundColor: '#FEFEFE',
  rightBackgroundColor: '#44B5E6',
  errorBackgroundColor: '#e01717'
};
