/**
 * Created by baoyinghai on 16/4/3.
 */

'use strict';

let React = require('react-native');
let {
    ListView,
    TouchableHighlight,
    Text,
    TextInput,
    View,
    ScrollView,
    ActionSheetIOS,
    Platform,
    Dimensions,
    Image,
    StyleSheet,
    TouchableOpacity,
    InteractionManager,
    CameraRoll,
    ToastAndroid,
    DeviceEventEmitter
    }=React;

let { Alert ,Button } = require('mx-artifacts');
let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;
let NavBarView = require('../../framework/system/navBarView');
let SelectBtn = require('./selectBtn');
let Remarks = require('./remarks');
let SelectBusiness1 = require('./selectBusiness1');
let ImagePicker = require('../../comp/utils/imagePicker');
let Input = require('../../comp/utils/input');
let Adjust = require('../../comp/utils/adjust');
let Validation = require('../../comp/utils/validation');
let MyBusiness = require('../home/myBusiness');
let dismissKeyboard = require('react-native-dismiss-keyboard');


let AppStore = require('../../framework/store/appStore');
let MarketAction = require('../../framework/action/marketAction');
let MarketStore = require('../../framework/store/marketStore');
let ImAction = require('../../framework/action/imAction');
let UserPhotoPicModule = require('NativeModules').UserPhotoPicModule;
let bizOrientationUnit = ['收', '出'];
let termUnit = ['日', '月', '年'];
let amountUnit = ['万', '亿'];
import Share from 'react-native-share';
let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
let Publish = React.createClass({
    getInitialState(){
        let filterItems = AppStore.getFilters().filterItems;
        let categaryAndItem = MarketStore.getCategoryAndItem(filterItems);
        let item = this.removeDisplayCodeIsAllObj(categaryAndItem);

        let myCategory = AppStore.getCategory();
        let myItem = AppStore.getItem();

        return {
            filterItems: filterItems,
            bizOrientationDefault: 0,
            termDefault: 0,
            amountDefault: 0,
            termText: '',
            amountText: '',
            amountTextDigit: 8,
            rateText: '',
            remarkText: '',
            disabled: false,
            //networt
            term: '',
            rate: '',
            remark: '',
            bizOrientation: 'IN',
            bizCategory: myCategory != null ? myCategory : item.length == 0 ? [] : item[0],
            bizItem: myItem != null ? myItem : item.length == 0 ? [] : item[0].itemArr[1],
            amount: 0,
            fileUrlList: [],

            keyboardSpace: 0,
        }
    },

    componentDidMount: function () {
        //// Keyboard events监听
        DeviceEventEmitter.addListener('keyboardWillShow', this.updateKeyboardSpace);
        DeviceEventEmitter.addListener('keyboardWillHide', this.resetKeyboardSpace);
    },

    componentWillUnmount: function () {
        DeviceEventEmitter.removeAllListeners('keyboardWillShow');
        DeviceEventEmitter.removeAllListeners('keyboardWillHide');
    },

    // Keyboard actions
    updateKeyboardSpace: function (frames) {
        const keyboardSpace = frames.endCoordinates.height//获取键盘高度
        this.setState({
            keyboardSpace: keyboardSpace,
        });
    },

    resetKeyboardSpace: function () {
        this.refs['scroll'].scrollTo({y: 0})
    },

    render: function () {
        let {title, param}  = this.props;
        let isFromIM = param ? param.isFromIM : false;
        let isFromMyBusiness = param ? param.isFromMyBusiness : false;
        return (
            <NavBarView navigator={this.props.navigator} fontColor='#ffffff' backgroundColor='#1151B1'
                        contentBackgroundColor='#18304D' title='发布新业务' showBack={true} showBar={true}
                        actionButton={isFromIM || isFromMyBusiness ? null : this.renderToMyBiz}>
                <View style={{height:isFromIM ? screenHeight-64 : screenHeight-64,backgroundColor:'#153757'}}>
                    <View style={{flex:1}}>
                        <ScrollView ref="scroll"
                                    keyboardShouldPersistTaps={true}
                        >
                            {this.renderSelectOrg()}
                            {this.renderBusinessType()}
                            {this.renderTimeLimit()}
                            {this.renderAmount()}
                            {this.renderRate()}
                            {this.renderAddImg(isFromIM)}
                            {this.renderRemarks(isFromIM)}
                        </ScrollView>
                        {this.renderReleaseBtn(isFromIM)}
                    </View>
                </View>
            </NavBarView>
        );
    },
    _bizOrientationDataChange (index) {
        this.setState({
            bizOrientationDefault: index,
            bizOrientation: (index == 0) ? 'IN' : 'OUT'
        });

    },
    _termDataChange (index) {
        this.setState({
            termDefault: index,
            term: (index == 0) ? Number(this.state.termText) : (index == 1) ? Number(this.state.termText) * 30 : Number(this.state.termText) * 365
        });

    },
    _amountDataChange (index) {
        this.setState({
            amountDefault: index,
            amount: (index == 0) ? Number(this.state.amountText) * 10000 : Number(this.state.amountText) * 100000000,
            amountTextDigit: (index == 0) ? 8 : 4,
        });

    },

    _onChangeText(key, value){
        this.setState({[key]: value});
        if (key == 'termText') {
            this.setState({term: (this.state.termDefault == 0) ? Number(value) : (this.state.termDefault == 1) ? Number(value) * 30 : Number(value) * 365});
        } else if (key == 'amountText') {
            this.setState({amount: (this.state.amountDefault == 0) ? Number(value) * 10000 : Number(value) * 100000000});
        } else {
            this.setState({rate: Number(value)});
        }
    },

    renderSelectOrg: function () {
        return (
            <TouchableOpacity onPress={()=>this.toPage(SelectBusiness1)} activeOpacity={0.8} underlayColor="#f0f0f0">
                <View
                    style={{width: screenWidth-20,marginLeft:10,marginTop:10,borderRadius:5,height:36,backgroundColor:'#4fb9fc',alignItems: 'center',justifyContent:'space-between',flexDirection: 'row'}}>
                    <Text
                        style={{fontSize:16,marginLeft:10,color:'white'}}>{(this.state.bizCategory == '' && this.state.bizItem == '') ? '资金业务 - 同业存款' : this.state.bizCategory.displayName + '-' + this.state.bizItem.displayName}</Text>
                    <Image style={{margin:10,width:16,height:16}}
                           source={require('../../image/market/next.png')}
                    />
                </View>
            </TouchableOpacity>
        )
    },
    renderBusinessType: function () {
        return (
            <View style={{flexDirection:'column',marginTop:10}}>
                <View style={{flexDirection:'row'}}>
                    <Text style={{marginLeft:10, color:'white'}}>{'方向'}</Text>
                    <Text style={{color:'red'}}>{'*'}</Text>
                </View>
                <View style={{marginTop:10,flexDirection:'row'}}>
                    <SelectBtn dataList={bizOrientationUnit} defaultData={this.state.bizOrientationDefault}
                               change={this._bizOrientationDataChange}/>
                </View>
            </View>
        )
    },
    renderTimeLimit: function () {
        return (
            <View style={{flexDirection:'column',marginTop:10}}>
                <Text style={{marginLeft:10, color:'white'}}>{'期限'}</Text>
                <View style={{marginTop:10,flexDirection:'row'}}>
                    <Input containerStyle={{backgroundColor:'#0a1926',borderRadius:5,marginLeft:10,height:40}}
                           iconStyle={{}} placeholderTextColor='#325779'
                           inputStyle={{width:Adjust.width(100),height:40,marginLeft:10,color:'#ffd547'}}
                           placeholder='天数' maxLength={3} field='termText' inputType="numeric"
                           onChangeText={this._onChangeText}
                           onFocus={() => this.refs['scroll'].scrollTo({y:60})}
                    />
                    <SelectBtn dataList={termUnit} defaultData={this.state.termDefault} change={this._termDataChange}/>

                </View>
            </View>
        )
    },
    renderAmount: function () {
        return (
            <View style={{flexDirection:'column',marginTop:10}}>
                <Text style={{marginLeft:10, color:'white'}}>{'金额'}</Text>
                <View style={{marginTop:10,flexDirection:'row'}}>
                    <Input containerStyle={{backgroundColor:'#0a1926',borderRadius:5,marginLeft:10,height:40}}
                           iconStyle={{}} placeholderTextColor='#325779'
                           inputStyle={{width:Adjust.width(100),height:40,marginLeft:10,color:'#ffd547'}}
                           placeholder='1万-1000亿' maxLength={this.state.amountTextDigit} field='amountText'
                           inputType="numeric"
                           onChangeText={this._onChangeText} ref="amountInput"
                           onFocus={() => this.refs['scroll'].scrollTo({y:120})}
                    />
                    <SelectBtn dataList={amountUnit} defaultData={this.state.amountDefault}
                               change={this._amountDataChange}/>

                </View>
            </View>
        )
    },
    renderRate: function () {
        return (
            <View style={{flexDirection:'column',marginTop:10}}>
                <Text style={{marginLeft:10, color:'white'}}>{'利率'}</Text>
                <View style={{alignItems:'center',marginTop:10,flexDirection:'row'}}>
                    <Input containerStyle={{backgroundColor:'#0a1926',borderRadius:5,marginLeft:10,height:40}}
                           iconStyle={{}} placeholderTextColor='#325779'
                           inputStyle={{width:Adjust.width(100),height:40,marginLeft:10,color:'#ffd547'}}
                           placeholder='0-99.99' maxLength={5} field='rateText' inputType="numeric"
                           onChangeText={this._onChangeText} ref="rateInput"
                           onFocus={() => this.refs['scroll'].scrollTo({y:160})}
                    />
                    <Text style={{marginLeft:10,fontWeight: 'bold', color:'white'}}>{'%'}</Text>
                </View>
            </View>
        )
    },
    renderAddImg (isFromIM) {
        if (!isFromIM) {
            return (
                <View style={{flexDirection:'column',marginTop:10}}>
                    <Text style={{marginLeft:10, color:'white'}}>{'添加图片'}</Text>
                    <View style={{alignItems:'center',marginTop:10,flexDirection:'row'}}>
                        <View style={{width:((screenWidth-60)/5 + 10) * this.state.fileUrlList.length}}>
                            <ListView style={{}} scrollEnabled={false} horizontal={true}
                                      dataSource={ds.cloneWithRows(this.state.fileUrlList)}
                                      renderRow={this.renderImgItem}/>
                        </View>
                        {this.renderAdd()}
                    </View>
                </View>

            )
        }
    },
    renderAdd (){
        if (this.state.fileUrlList.length < 5) {
            return (
                <ImagePicker
                    type="all"
                    onSelected={(response) => {this.handleSendImage(response, 10)}}
                    onError={(error) => this.handleImageError(error)}
                    title="选择图片"
                    fileId="publish1"
                    allowsEditing={true}
                    style={{width:(screenWidth-60)/5,height:(screenWidth-60)/5,marginLeft:10,borderRadius:5,borderWidth:1,borderColor:'white'}}
                >
                    <Image
                        style={{width:(screenWidth-60)/5-2,height:(screenWidth-60)/5-2,borderRadius:5}}
                        source={require('../../image/market/addImage.png')}
                    />
                </ImagePicker>
            );
        }
    },
    renderImgItem: function (rowData, sectionID, rowID) {
        return (
            <ImagePicker
                longPress={() => this._longPress(rowID)}
                type="all"
                onSelected={(response) => {this.handleSendImage(response, rowID)}}
                onError={(error) => this.handleImageError(error)}
                title="选择图片"
                style={{width:(screenWidth-60)/5,height:(screenWidth-60)/5,marginLeft:10,borderRadius:5,borderWidth:1,borderColor:'white'}}
            >
                <Image
                    style={{flex:1,width:(screenWidth-60)/5-2,height:(screenWidth-60)/5-2,borderRadius:5}}
                    source={{uri:rowData}}
                />
            </ImagePicker>
        )
    },
    renderRemarks: function (isFromIM) {
        if (!isFromIM) {
            return (
                <View style={{marginTop:10,marginBottom:10}}>
                    <TouchableHighlight onPress={() => this.toRemarks(Remarks)} underlayColor='rgba(129,127,201,0)'>
                        <View
                            style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',height: 40, backgroundColor: '#102a42'}}>
                            <Text style={{marginLeft:10, fontWeight: 'bold', color:'white'}}>
                                {'备注'}
                            </Text>
                            <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                                <Text style={{marginRight:10, fontWeight: 'bold', color:'#325779'}}
                                      numberOfLines={1}>{(this.state.remarkText == '') ? '20字以内' : this.state.remarkText}
                                </Text>
                                <Image style={{margin:10,width:16,height:16}}
                                       source={require('../../image/market/next.png')}
                                />
                            </View>
                        </View>
                    </TouchableHighlight>
                </View>
            )
        }
    },
    renderReleaseBtn: function (isFromIM) {
        return (
            <View style={{height:44}}>
                <Button
                    containerStyle={{height:44,borderRadius:0,backgroundColor:"#4fb9fc"}}
                    style={{fontSize: 15, color: '#ffffff',}}
                    disabled={this.state.disabled}
                    onPress={() => this._pressPublish()}
                >
                    {isFromIM ? '发送' : '发布'}
                </Button>
            </View>
        )
    },

    renderToMyBiz: function () {
        return (
            <TouchableOpacity style={{width: 150 ,marginLeft: -20}} onPress={()=>this.toMyBiz()}>
                <Text style={{color: '#ffffff'}}>我的业务</Text>
            </TouchableOpacity>
        );
    },

    _pressPublish: function () {
        if (!Validation.isTerm(this.state.termText)) {
            Alert('期限：请输入大于0的整数');
        } else if (!Validation.isAmount(this.state.amountText)) {
            Alert('金额：请输入正确的浮点数');
        } else if (!Validation.isRate(this.state.rateText)) {
            Alert('利率：请输入0-99.99之间的小数');
        } else if (this.state.amount > 100000000000) {
            Alert('您输入的金额过大');
        } else {
            this.addBizOrder();
        }
    },

    callBackCategoryAndItem: function (category, item) {
        this.setState({
            bizCategory: category,
            bizItem: item
        });
        AppStore.saveCategory(category);
        AppStore.saveItem(item);
    },

    callBackRemarks: function (remarkText) {
        this.setState({
            remark: remarkText,
            remarkText: remarkText
        })
    },

    toPage: function (name) {
        if (this.state.filterItems.length != 0) {
            const { navigator } = this.props;
            if (navigator) {
                navigator.push({
                    comp: name,
                    param: {
                        filterItems: this.state.filterItems,
                        callBackCategoryAndItem: this.callBackCategoryAndItem
                    }
                })
            }
        }
    },

    toRemarks: function (name) {
        const { navigator } = this.props;
        if (navigator) {
            navigator.push({
                comp: name,
                param: {
                    callBackRemarks: this.callBackRemarks,
                    remarkText: this.state.remarkText
                },
            })
        }
    },

    toMyBiz: function () {
        const { navigator } = this.props;
        if (navigator) {
            navigator.push({comp: MyBusiness, param: {fromPublish: true}});
        }
    },

    addBizOrder: function () {
        dismissKeyboard();
        let {title, param}  = this.props;
        let params = {
            id: '',
            term: this.state.term,
            rate: this.state.rate / 100,
            remark: this.state.remark,
            bizOrientation: this.state.bizOrientation,
            bizCategory: this.state.bizCategory.displayCode,
            bizItem: this.state.bizItem.displayCode,
            amount: this.state.amount,
            fileUrlList: this.state.fileUrlList
        };
        let item = {
            bizCategory: (this.state.bizCategory == '' && this.state.bizItem == '') ? '资金业务 - 同业存款' : this.state.bizCategory.displayName + '-' + this.state.bizItem.displayName,
            bizOrientation: params.bizOrientation,
            term: params.term,
            amount: params.amount,
            rate: params.rate
        };
        if (param ? param.isFromIM : false) {
            this.props.navigator.pop();
            param.callBack(item);
        } else {
            this.props.exec(
                ()=> {
                    return MarketAction.addBizOrder(params).then((response)=> {
                        Alert('发布成功, 是否分享?', () => {
                            this.shareDialog(item)
                        }, () => {
                        }, '分享', '不分享');
                        this.props.navigator.resetTo({comp: 'tabView', tabName: 'market'});
                    }).catch(
                        (errorData) => {
                            throw errorData;
                        }
                    );
                }
            );
        }
    },
    _longPress (rowId){
        if (Platform.OS === 'ios') {
            let options = [
                '保存图片',
                '删除图片',
                '返回'
            ];
            ActionSheetIOS.showActionSheetWithOptions({
                    options: options,
                    cancelButtonIndex: 2,
                    destructiveButtonIndex: 1,
                },
                (buttonIndex) => {
                    if (buttonIndex == 0) {
                        CameraRoll.saveImageWithTag('file://' + this.state.fileUrlList[rowId]).then(
                            (data) => {
                                Alert('保存成功')
                            },
                            (err) => {
                                console.log('CameraRoll,err' + err);
                            }
                        );
                    } else if (buttonIndex == 1) {
                        let arr = this.state.fileUrlList;
                        arr[rowId] = 0;
                        this.setState({fileUrlList: _.compact(arr)})
                    }
                });
        } else {
            UserPhotoPicModule.showSaveImgDialog(
                (index) => {
                    switch (index) {
                        case 0:
                            CameraRoll.saveImageWithTag('file://' + this.state.fileUrlList[rowId]).then(
                                (data) => {
                                    ToastAndroid.show('保存成功', ToastAndroid.SHORT);
                                },
                                (err) => {
                                    ToastAndroid.show('保存失败', ToastAndroid.SHORT);
                                }
                            );
                            break;
                        case 1:
                            let arr = this.state.fileUrlList;
                            arr[rowId] = 0;
                            this.setState({fileUrlList: _.compact(arr)});
                            break;
                        default:
                            break;
                    }
                }
            );
        }
    },
    shareDialog (data) {
        let amount = data.amount == '' ? '--' : data.amount / 10000 + '万';
        let shareContent = '我利用[渤海银通]分享了一个业务信息给您：' + data.bizCategory + '  ' + (data.bizOrientation == 'IN' ? '入' : '出') + '  ' +
            (data.term == '' ? '--' : data.term + '天') + '  ' +
            amount + '  ' + data.rate == 0 ? '--' : numeral(data.rate * 100).format('0,0.00') + '%';
        Share.open({
            share_text: shareContent,
            share_URL: Platform.OS === 'android' ? shareContent : "http://google.cl",
            title: "Share Link"
        }, (e) => {
            console.log(e);
        });
    },

    handleSendImage(uri, index) {
        ImAction.uploadImage(uri)
            .then((response) => {
                let arr = this.state.fileUrlList;
                if (index > 5) {
                    arr.push(uri);
                } else {
                    arr[index] = uri;
                }
                this.setState({
                    fileUrlList: arr
                });
            }).catch((errorData) => {
            console.log('Image upload error ' + JSON.stringify(errorData));
        });
    },

    handleImageError(error) {
        console.log('Image select error ' + JSON.stringify(error));
        Alert('图片选择失败');
    },

    removeDisplayCodeIsAllObj: function (arr) {
        let itemArr = [];
        if (!!arr) {
            arr.forEach(function (item) {
                if (item.displayCode != 'ALL') {
                    itemArr.push(item);
                }
            });
            return (
                itemArr
            );
        }
    }

});

module.exports = Publish;
