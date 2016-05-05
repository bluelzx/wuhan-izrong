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
  Animated,
  Dimensions,
  TouchableOpacity
  } = React;
let {height, width} = Dimensions.get('window');
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

  renderPage: function (data:Object) {
    return (
      <View>
        <Image
          style={styles.page}
          source={data}
          resizeMode='stretch'
        />
        <TouchableOpacity style={{position: 'absolute',top:30,left:20}}
                          activeOpacity={0.8}
                          onPress={()=>{
                            const { navigator } = this.props;
                            if (navigator) {
                              navigator.pop();
                            }
                          }}>
          <Text style={{fontSize:16,color:'#ffffff'}}>返回</Text>
        </TouchableOpacity>
      </View>

    );
  },

  render: function () {
    return (
      <ViewPager
        style={this.props.style}
        dataSource={this.state.dataSource}
        renderPage={this.renderPage}
        isLoop={true}
        autoPlay={false}
        animation={(animatedValue, toValue, gestureState) => {
            var duration = 1000;
            return Animated.timing(animatedValue,
            {
              toValue: toValue,
              duration: duration
            });
          }
        }
      />
    );
  }

});

let styles = StyleSheet.create({
  page: {
    height: height,
    width: width
  }
});
module.exports = UserGuide;
