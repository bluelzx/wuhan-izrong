/**
 * Created by wen on 5/16/16.
 */

'use strict';

let React = require('react-native');

let {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    TouchableHighlight,
    Dimensions,
    ListView
    } = React;

let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;
let { Device,Alert } = require('mx-artifacts');

let NavBarView = require('../../framework/system/navBarView');
let DictStyle = require('../../constants/dictStyle');

let GroupNotifyList = React.createClass({

    getInitialState: function () {
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        return {
            dataSource: ds.cloneWithRows(['row 1', 'row 2']),
        };
    },

    deleteSession: function (sessionId) {
        SessionStore.deleteSession(sessionId);
    },

    render: function () {
        return (
            <NavBarView navigator={this.props.navigator}
                        title='群通知'
                        showBack={true}
            >
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={this._renderRow}
                />
            </NavBarView>
        );
    },

    _renderRow: function (rowData, sectionID, rowID) {
        return (
            <TouchableOpacity
                //onLongPress={() => Alert('确定删除该条记录?', ()=>{this.deleteSession(item.sessionId)},()=>{})}
                style={[Styles.rowDirection,Styles.rowContainer]}
                {...this.props}
            >
                <Image style={Styles.imageStyle} resizeMode="cover" source={require('../../image/im/groupNotify.png')}/>

                <View style={[Styles.textContainer]}>
                    <View style={[Styles.rowDirection,{marginTop:10 ,height:25,alignItems:'center'}]}>

                        <Text style={{color:DictStyle.colorSet.imTitleTextColor}}>{'群主名称'}</Text>

                        <Text numberOfLines={1}
                              style={{marginTop:5,color:'#687886'}}
                        >
                            {' -' + '组织名称'}
                        </Text>
                    </View>

                    <View style={{height:40,justifyContent:'center'}}>
                        <Text style={{color:'#687886'}}
                              numberOfLines={2}
                        >
                            {'邀请您加入' + '一二三四' + '群聊' + '一二三四' + '群聊' + '一二三四' + '群聊' + '一二三四' + '群聊' +
                            '一二三四' + '群聊' + '一二三四' + '群聊' + '一二三四' + '群聊'}
                        </Text>
                    </View>
                </View>

                <TouchableHighlight underlayColor="#16cbfa"
                                    onPress={() => {}}
                                    style={{borderRadius:10}}
                >
                    <View style={[Styles.handleButton]}>
                        <Text style={{color:'white'}}>接受</Text>
                    </View>
                </TouchableHighlight>

            </TouchableOpacity>


        );
    }

});

let Styles = StyleSheet.create({

    rowDirection: {
        flexDirection: 'row'
    },

    rowContainer: {
        paddingHorizontal: 10,
        height: 80,
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomColor: DictStyle.colorSet.demarcationColor,
        borderBottomWidth: 0.5
    },

    imageStyle: {
        width: 40,
        height: 40,
        borderRadius: 20
        //marginRight:10,
        //marginLeft:10
    },

    textContainer: {
        height: 80,
        width: screenWidth - 160
    },

    handleButton: {
        width: 80,
        height: 30,
        backgroundColor: '#27b8f3',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#1095ef',
        alignItems: 'center',
        justifyContent: 'center'
    }
});

module.exports = GroupNotifyList;