import React, {Text, View, Animated, Image, StyleSheet, TouchableOpacity, Dimensions, Platform} from 'react-native';
import {MSG_CONTENT_TYPE} from '../../constants/dictIm';
import _ from 'lodash';
import numeral from 'numeral';


let screenWidth = Dimensions.get('window').width;
let Lightbox = require('../lightBox/Lightbox');
let AppStore = require('../../framework/store/appStore');
let { Spinner, Button, Alert, Device } = require('mx-artifacts');
let {ImageSize50,ImageSize100} = require('../../../config');

let styles = StyleSheet.create({
  bubble: {
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: '#E9E9E9'
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

    //if (this.props.renderCustomText) {
    //  return this.props.renderCustomText(this.props);
    //}
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
      //if(this.props.content == 'UUUU'){
      //  return (
      //    <View style={[styles.bubble, customStyle,
      //         this.props.position=='left'&&{borderTopRightRadius: 5,borderRightWidth:0.5},
      //this.props.position!='left'&&{borderTopLeftRadius: 5,borderLeftWidth:0.5}]}>
      //      <View style={{
      //          flex: 1,
      //          width: 100,
      //          height: 100
      //          }}>
      //            <Text>图片加载中...</Text>
      //      </View>
      //    </View>
      //  );
      //}else {
      let flag = (this.props.content.substring(0, 5) === 'UUUUU');
      let uri = this.props.content + ImageSize100;
        return (
          <View style={[styles.bubble, customStyle,
               this.props.position=='left'&&{borderTopRightRadius: 5,borderRightWidth:0.5},
      this.props.position!='left'&&{borderTopLeftRadius: 5,borderLeftWidth:0.5}]}>
            <Lightbox underlayColor='#44B5E6'
                      imageSource={{uri:this.props.content}}
                      navigator={AppStore.getNavigator()}>
              <Image style={{
                flex: 1,
                width: 100,
                height: 100
                }}
                     source={{uri: flag?this.props.content.substring(5,this.props.content.length):uri}}
              />
            </Lightbox>
          </View>
        );
      //}
    }

    if (this.props.contentType === MSG_CONTENT_TYPE.NAMECARD) {
      let data = JSON.parse(this.props.content);
      let nameCardStyle = this.props.position === 'left' ? styles.textLeft : styles.textRight;
      let nullDesc = '--';
      return (
        <View style={[styles.bubble, customStyle, {flex:1},
         this.props.position=='left'&&{borderTopRightRadius: 5,borderRightWidth:0.5},
      this.props.position!='left'&&{borderTopLeftRadius: 5,borderLeftWidth:0.5}]}>
          <Text
            style={[{flexWrap:'wrap'},styles.text, nameCardStyle]}>{data.realName + '--' + data.orgBeanName}</Text>
          <Text style={[{borderTopWidth:0.5,borderColor:'#cccccc',marginVertical:4}]}>

          </Text>
          <View style={{flexDirection:'row'}}>
            <Text
              style={[styles.text, nameCardStyle]}>手机:</Text>
            <Text
              style={[{flexWrap:'wrap',flex:5},styles.text, nameCardStyle]}>{data.mobileNumber ? data.mobileNumber : nullDesc}</Text>
          </View>
          <View style={{flexDirection:'row'}}>
            <Text
              style={[styles.text,nameCardStyle]}>座机:</Text>
            <Text
              style={[{flexWrap:'wrap',flex:5},styles.text, nameCardStyle]}>{data.phoneNumber ? data.phoneNumber : nullDesc}</Text>
          </View>
          {
            /*

             <View style={{flexDirection:'row'}}>
             <Text
             style={[styles.text, nameCardStyle]}>微信:</Text>
             <Text
             style={[{flexWrap:'wrap',flex:5},styles.text, nameCardStyle]}>{data.weChatNo?data.weChatNo:nullDesc}</Text>
             </View>
             <View style={{flexDirection:'row'}}>
             <Text
             style={[styles.text, nameCardStyle]}>QQ:</Text>
             <Text
             style={[{flexWrap:'wrap',flex:5},styles.text, nameCardStyle]}>{data.qqNo?data.qqNo:nullDesc}</Text>
             </View>
             */
          }
          <View style={{flexDirection:'row'}}>
            <Text
              style={[styles.text, nameCardStyle]}>邮箱:</Text>
            <Text
              style={[{flexWrap:'wrap',flex:5},styles.text, nameCardStyle]}>{data.email ? data.email : nullDesc}</Text>
          </View>
          <View style={{flexDirection:'row'}}>
            <Text
              style={[styles.text, nameCardStyle]}>部门:</Text>
            <Text
              style={[{flexWrap:'wrap',flex:5},styles.text, nameCardStyle]}>{data.department ? data.department : nullDesc}</Text>
          </View>
          <View style={{flexDirection:'row'}}>
            <Text
              style={[styles.text, nameCardStyle]}>职位:</Text>
            <Text
              style={[{flexWrap:'wrap',flex:5},styles.text, nameCardStyle]}>{data.jobTitle ? data.jobTitle : nullDesc}</Text>
          </View>
        </View>
      )
    }

    if (this.props.contentType === MSG_CONTENT_TYPE.BIZINFO) {
      let data = JSON.parse(this.props.content);
      let amount = data.amount == '' ? '--' : (data.amount > 99999999 ? data.amount / 100000000 + '亿' : data.amount / 10000 + '万');
      let dayNum;
      if (data.term == '' || data.term == 0) {
        dayNum = '--'
      } else if (data.term % 365 == 0) {
        dayNum = parseInt(data.term / 365) + '年';
      } else if (data.term % 30 == 0) {
        dayNum = parseInt(data.term / 30) + '月';
      } else if (data.term == 1) {
        dayNum = '隔夜';
      } else {
        dayNum = data.term + '日';
      }
      let rate = data.rate == 0 ? '--' : (numeral(data.rate * 100).format('0,0.00') + '%');
      //let shareContent = '我利用[渤海银通]分享了一个业务信息给您：' + data.bizCategory + '  ' + (data.bizOrientation == 'IN' ? '入' : '出') + '  ' + dayNum + '  ' + amount + '  ' + rate;
      let shareContent = data.bizCategory + '  ' + '业务方向:  ' + (data.bizOrientation == 'IN' ? '收' : '出') + '\n'
        + '金额:' + amount + '\n' + '期限:' + dayNum + '\n' + '利率:' + rate + '\n' + '——来自爱资融APP';
      return (
        <TouchableOpacity onLongPress={() => this._onLongPress(shareContent)} activeOpacity={0.7}>
          <View style={[styles.bubble, customStyle,
           this.props.position=='left'&&{borderTopRightRadius: 5,borderRightWidth:0.5},
      this.props.position!='left'&&{borderTopLeftRadius: 5,borderLeftWidth:0.5}]}>
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
      <View style={[styles.bubble, customStyle, flexStyle,
      this.props.position=='left'&&{borderTopRightRadius: 5,borderRightWidth:0.5},
      this.props.position!='left'&&{borderTopLeftRadius: 5,borderLeftWidth:0.5}]}>
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
