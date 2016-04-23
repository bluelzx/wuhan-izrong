/**
 * Created by vison on 16/4/5.
 */
'use strict';

let React = require('react-native');
let {
  StyleSheet,
  Text,
  View,
  Image,
  Platform
  } = React;
let AppStore = require('../../framework/store/appStore');
let LoginAction = require('../../framework/action/loginAction');
let NavBarView = require('../../framework/system/navBarView');
let dismissKeyboard = require('react-native-dismiss-keyboard');
let { Alert, Button } = require('mx-artifacts');
let TabView = require('../../framework/system/tabView');
let ImagePicker = require('../../comp/utils/imagePicker');

let Register_uploadNameCard = React.createClass({

  getStateFromStores() {
    let deviceModel = 'IOS';
    if (Platform.OS != 'ios') {
      deviceModel = 'ANDROID';
    }
    return {
      disabled: true,
      nameCardFileUrl: '',
      deviceModel: deviceModel,
      APNSToken: AppStore.getAPNSToken()
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

  register: function () {
    if (this.state.nameCardFileUrl) {
      dismissKeyboard();
      this.props.exec(() => {
        return LoginAction.register({
          mobileNo: this.props.param.mobileNo,
          realName: this.props.param.realName,
          userName: this.props.param.userName,
          orgId: this.props.param.orgId,
          nameCardFileUrl: this.state.nameCardFileUrl,
          deviceToken: this.state.APNSToken,
          deviceModel: this.state.deviceModel
        }).then((response) => {
          const { navigator } = this.props;
          if (navigator) {
            navigator.push({comp: 'tabView'});
          }
        }).catch((errorData) => {
          throw errorData;
        });
      });
    }
  },

  uploadNameCard: function (uri) {
    this.setState({uri: uri});
    this.props.exec(() => {
      return LoginAction.uploadFile(uri, 'nameCardFile')
        .then((response) => {
          console.log(response);
          this.state.nameCardFileUrl = response.fileUrl;
          this.state.disabled = false;
        }).catch((errorData) => {
          throw errorData;
        });
    });
  },

  returnImage: function () {
    if (this.state.nameCardFileUrl == '') {
      return (
        <ImagePicker
          type="all"
          onSelected={(response) => this.uploadNameCard(response)}
          onError={(error) => Alert(error)}
          title="选择图片"
          style={[styles.imageArea, styles.nameCard]}
        >
          <Image
            resizeMode='cover'
            source={require('../../image/login/nameCard.png')}
          />
          <Text style={{color: '#ffffff'}}>点击上传名片</Text>
        </ImagePicker>
      );
    }
    return (
      <ImagePicker
        type="all"
        onSelected={(response) => this.uploadNameCard(response)}
        onError={(error) => Alert(error)}
        title="选择图片"
        style={[styles.imageArea, styles.nameCard]}
      >
        <Image
          style={{flexDirection: 'column', flex: 1, alignItems: 'center', width: 200, height: 120, justifyContent: 'space-around'}}
          resizeMode='contain'
          source={{uri: this.state.uri, isStatic: true}}
        />
      </ImagePicker>
    );

  },

  render: function () {
    return (
      <NavBarView navigator={this.props.navigator} fontColor='#ffffff' backgroundColor='#1151B1'
                  title='上传名片' showBack={true} showBar={true}
      >
        <View style={[{flexDirection: 'column'}, styles.paddingLR]}>
          {this.returnImage()}
          <Button
            containerStyle={{marginTop: 20, backgroundColor: '#1151B1'}}
            style={{fontSize: 20, color: '#ffffff'}}
            disabled={this.state.disabled}
            onPress={()=>this.register()}
          >
            完成
          </Button>
        </View>
      </NavBarView>
    );
  }
});
let styles = StyleSheet.create({
  paddingLR: {
    paddingLeft: 12,
    paddingRight: 12
  },
  nameCard: {
    borderWidth: 1,
    borderColor: '#1151B1',
    height: 200,
    marginTop: 20,
    borderRadius: 6
  },
  imageArea: {
    flexDirection: 'column',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around'
  }
});

module.exports = Register_uploadNameCard;
