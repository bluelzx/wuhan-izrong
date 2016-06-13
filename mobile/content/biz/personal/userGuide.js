/**
 * Created by vison on 16/5/5.
 */
'use strict';

let React = require('react-native');
let {
    StyleSheet,
    Image,
    View,
    Text,
    Platform,
    TouchableOpacity
    } = React;
let {Device} = require('mx-artifacts');
let NavBarView = require('../../framework/system/navBarView');
let ViewPager = require('react-native-viewpager');

var PAGES = [
    require('../../image/guide/1.png'),
    require('../../image/guide/2.png'),
    require('../../image/guide/3.png'),
    require('../../image/guide/4.png'),
    require('../../image/guide/5.png'),
    require('../../image/guide/6.png')
];

let UserGuide = React.createClass({
    getInitialState: function () {
        let dataSource = new ViewPager.DataSource({
            pageHasChanged: (p1, p2) => p1 !== p2
        });
        return {
            dataSource: dataSource.cloneWithPages(PAGES)
        };
    },
    renderReturn: function () {
        if (Platform.OS == 'ios') {
            return (<TouchableOpacity style={{position: 'absolute',top:30,left:20,padding:10}}
                                      activeOpacity={0.8}
                                      onPress={()=>{
                            const { navigator } = this.props;
                            if (navigator) {
                              navigator.pop();
                            }
                          }}>
                <Text style={{fontSize:16,color:'#ffffff',textAlign:'center'}}>返回</Text>
            </TouchableOpacity>)
        }else{
            return (<TouchableOpacity style={{position: 'absolute',top:18,left:20,padding:10}}
                                      activeOpacity={0.8}
                                      onPress={()=>{
                            const { navigator } = this.props;
                            if (navigator) {
                              navigator.pop();
                            }
                          }}>
                <Text style={{fontSize:16,color:'#ffffff',textAlign:'center'}}>返回</Text>
            </TouchableOpacity>)
        }
    },

    renderPage: function (data:Object) {
        return (
            <View>
                <Image
                    style={styles.page}
                    source={data}
                    resizeMode='stretch'
                />
                {this.renderReturn()}

            </View>

        );
    },

    render: function () {
        return (
            <ViewPager
                dataSource={this.state.dataSource}
                renderPage={this.renderPage}
                isLoop={true}
                autoPlay={false}
            />
        );
    }
});

let styles = StyleSheet.create({
    page: {
        height: Device.height,
        width: Device.width
    }
});
module.exports = UserGuide;
