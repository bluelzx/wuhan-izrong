/**
 * Created by vison on 16/4/5.
 */
'use strict';

let React = require('react-native');
let {
  StyleSheet,
  TouchableHighlight,
  Text,
  View,
  Image,
  Platform
  } = React;
let AppStore = require('../../framework/store/appStore');
//let UserStore = require('../../framework/store/userStore');
let LoginAction = require('../../framework/action/loginAction');
//let Register_checkPhone = require('./register_checkPhone');
//let Forget_checkPhone = require('./forget_checkPhone');
let NavBarView = require('../../framework/system/navBarView');
let dismissKeyboard = require('react-native-dismiss-keyboard');
let Input = require('../../comp/utils/input');
let { Alert, Button } = require('mx-artifacts');
let PhotoPicker = require('NativeModules').PhotoPickerModule;
let UserPhotoPicModule = require('NativeModules').UserPhotoPicModule;

let Register_uploadNameCard = React.createClass({
  getStateFromStores() {
    return {
      url:'',
      imageSource:''
    };
  },
  getInitialState: function () {
    return this.getStateFromStores();
  },
  componentDidMount() {
    AppStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function () {
    AppStore.removeChangeListener(this._onChange);
  },
  _onChange: function () {
    this.setState(this.getStateFromStores());
  },

  toPage: function (name) {
    const { navigator } = this.props;
    if (navigator) {
      navigator.push({comp: name})
    }
  },
  selectPhoto: function () {
    if(Platform.OS == 'android'){
     // PhotoPicker.showImagePic(true,'nameCard',(response)=>console.log('Response = ', response));
      UserPhotoPicModule.showImagePic(true,'nameCard',
        (response)=>{
          console.log('Response = ', response);
          this.setState({
            imageSource: response.uri
          });
          LoginAction.uploadNameCard(
            {['photoStoreId']: this.state.imageSource},
            ()=>Alert("上传成功"),
            ()=> Alert("上传失败")
          )
        });
    }
  },

  returnImage: function () {
    if (this.state.imageSource == ''){
      return (
        <TouchableHighlight style={styles.nameCard} activeOpacity={0.8} underlayColor='#18304b'
                            onPress={()=>this.selectPhoto()}>
          <View style={styles.imageArea}>
            <Image
              resizeMode='cover'
              source={require("../../image/login/nameCard.png")}/>
            <Text style={{color:'#ffffff'}}>点击上传名片</Text>
          </View>
        </TouchableHighlight>
      );
    }else{
      return (
        <TouchableHighlight style={styles.nameCard} activeOpacity={0.8} underlayColor='#18304b'
                            onPress={()=>this.selectPhoto()}>
          <Image style={{flexDirection:'column',flex:1,alignItems:'center',justifyContent:'space-around'}}
                 resizeMode='cover'
                 source = {{uri:this.state.imageSource}}
          />
        </TouchableHighlight>
      );
    }
  },

  render: function () {
    return (
      <NavBarView navigator={this.props.navigator} fontColor='#ffffff' backgroundColor='#1151B1'
                  contentBackgroundColor='#18304D' title='上传名片' showBack={true} showBar={true}>
        <View style={[{flexDirection: 'column'}, styles.paddingLR]}>
          {this.returnImage()}
          <Button
            containerStyle={{marginTop:20,backgroundColor:'#1151B1'}}
            style={{fontSize: 20, color: '#ffffff'}}
            styleDisabled={{color: 'red'}}
            onPress={()=>Alert("注册完成")}>
            完成
          </Button>
        </View>
      </NavBarView>
    )
  }
});
let styles = StyleSheet.create({
  paddingLR: {
    paddingLeft: 12,
    paddingRight: 12
  },
  nameCard: {
    backgroundColor: '#0a1926',
    borderWidth: 1,
    borderColor: '#1151B1',
    height: 200,
    marginTop: 20,
    borderRadius: 6
  },
  imageArea:{
    flexDirection:'column',
    flex:1,
    alignItems:'center',
    justifyContent:'space-around'
  }
});

module.exports = Register_uploadNameCard;
