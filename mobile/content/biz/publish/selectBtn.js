/**
 * Created by cui on 16/4/5.
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
let Adjust = require('../../comp/utils/adjust');

let SelectBtn = React.createClass({
    getInitialState(){
        return {}
    },
    render: function () {
        //this.props.dataList
        return (
            <View style={{flexDirection: 'row'}}>
                {this.props.dataList.map((item, i) => {
                    return (
                        <TouchableHighlight key={i} onPress={(this.props.defaultData == i )? null : () => this.props.change(i)}
                                            underlayColor='rgba(21,55,87,0)'>
                            <View
                                style={{alignItems:'center',justifyContent:'center',marginLeft:10,width:Adjust.width(70),height: 40,borderRadius:5, backgroundColor:(this.props.defaultData == i )? '#817fc9' : '#102a42'}}>
                                <Text style={{ fontWeight: 'bold', color:'white'}}>
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

let styles = StyleSheet.create({});

module.exports = SelectBtn;
