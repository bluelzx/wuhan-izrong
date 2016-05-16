/**
 * Created by wen on 5/16/16.
 */

'use strict';

let React = require('react-native');
const {View, Text, Image,StyleSheet,TouchableOpacity} = React;
let DictStyle = require('../../constants/dictStyle');
let PlainStyle = require('../../constants/dictStyle');
let Icon = require('react-native-vector-icons/Ionicons');

let NotifyHeader = React.createClass({

    unReadIcon: function (badge, showBadge) {
        if (showBadge) {
            if (badge > 0) {
                return (
                    <View style={[{position:'absolute',marginLeft:25,top:0,width:18,height:18,
                                    borderRadius:9,backgroundColor:'red',
                                    flexDirection:'row',justifyContent:'center',alignItems:'center'},
                                    badge>=99&&{height:20,width:(Platform.OS === 'ios')?24:22,marginLeft:18}]}>
                        <Text style={{color:'white',fontSize:11}}>{badge >= 99 ? "99+" : badge}</Text>
                    </View>
                );
            }
        } else {
            return <View></View>;
        }
    },

    render: function () {
        let {badge} = this.props;
        return (

            <TouchableOpacity style={[Styles.containerStyle,Styles.rowDirection]}
                {...this.props}
            >

                <View style={[Styles.rowDirection,{alignItems:'center',width:200}]}>
                    <Image style={Styles.imageStyle} resizeMode="cover" source={this.props.source}/>

                    <Text style={{color:DictStyle.colorSet.imTitleTextColor}}>群通知</Text>
                </View>
                {this.unReadIcon(badge, true)}
                <Icon style={{marginRight: 10}} name="ios-arrow-right" size={25}
                      color={PlainStyle.colorSet.arrowColor}/>

            </TouchableOpacity>
        );
    }
});

let Styles = StyleSheet.create({

    rowDirection: {
        flexDirection: 'row'
    },

    containerStyle: {
        borderBottomColor: DictStyle.colorSet.demarcationColor,
        borderBottomWidth: 0.5,
        height: 60,
        alignItems: 'center',
        justifyContent: 'space-between'
    },

    imageStyle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
        marginLeft: 10
    }

});

module.exports = NotifyHeader;
