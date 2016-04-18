/**
 * Created by cui on 16/3/31.
 */
let React = require('react-native');
let {
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

let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;

let FilterSelectBtn = require('./filterSelectBtn');

let directionData = ['出', '收'];
let limitData = ['隔夜', '1周', '2周', '3周', '1个月', '2个月', '3个月', '半年', '≥半年'];
let amountData = ['3000万以下', '3000万-5000万', '5000万-1亿', '1亿以上'];

let data = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

let RadioControl = React.createClass({
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

let styles = StyleSheet.create({});

module.exports = RadioControl;
