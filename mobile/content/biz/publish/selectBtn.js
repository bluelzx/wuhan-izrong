/**
 * Created by cui on 16/4/5.
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

var SelectBtn = React.createClass({
    getInitialState(){
        return {}
    },
    render: function () {
        //this.props.dataList
        return (
            <View style={{flexDirection: 'row'}}>
                {this.props.dataList.map((item, i) => {
                    return (
                        <TouchableHighlight onPress={(this.props.defaultData == i )? null : () => this.props.change(i)}
                                            underlayColor='rgba(21,55,87,0)'>
                            <View
                                style={{alignItems:'center',justifyContent:'center',marginLeft:10,width:70,height: 40,borderRadius:5, backgroundColor:(this.props.defaultData == i )? '#817fc9' : '#102a42'}}>
                                <Text style={{ fontWeight: 'bold', color:'white',}}>
                                    {item}
                                </Text>
                            </View>
                        </TouchableHighlight>
                    );
                })}
            </View>
        )
    },
});

var styles = StyleSheet.create({});

module.exports = SelectBtn;
