/**
 * Created by cui on 16/3/31.
 */
var React = require('react-native');
var {
    ListView,
    TouchableHighlight,
    Text,
    View,
    Platform,
    Dimensions,
    Image,
    StyleSheet,
    TouchableOpacity,
    InteractionManager
    } = React;

var screenWidth = Dimensions.get('window').width;
var screenHeight = Dimensions.get('window').height;

var FilterSelectBtn = require('./filterSelectBtn');

var directionData = ['出', '收'];
var limitData = ['隔夜', '1周', '2周', '3周', '1个月', '2个月', '3个月', '半年', '≥半年'];
var amountData = ['3000万以下', '3000万-5000万', '5000万-1亿', '1亿以上'];

var data = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

var RadioControl = React.createClass({
    getInitialState: function () {
        return {
        };
    },
    render: function () {
        return (
            <View>
                <FilterSelectBtn typeTitle={'方向'} dataList={directionData} section={3}/>
                <FilterSelectBtn typeTitle={'期限'} dataList={limitData} section={3}/>
                <FilterSelectBtn typeTitle={'金额'} dataList={amountData} section={2}/>
            </View>
        )
    },
});

var styles = StyleSheet.create({});

module.exports = RadioControl;