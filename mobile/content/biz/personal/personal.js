/**
 * Created by baoyinghai on 16/4/3.
 */

'use strict';

var React = require('react-native');
var {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Dimensions,
  Image,
  TouchableHighlight,
  }=React;
var NavBarView = require('../../framework/system/navBarView');
var Validation = require('../../comp/utils/validation')

var WhitePage = React.createClass({
  getInitialState: function () {
    return {
      userName: "用户名",
      orgName: "所属机构"

    }
  },
  componentDidMount() {

  },

  componentWillUnmount: function () {

  },

  toPage: function (name) {
    const { navigator } = this.props;
    if (navigator) {
      navigator.push({comp: name})
    }
  },
  returnImg: function () {

  },

  render: function () {
    let {title}  = this.props;
    return (
      <NavBarView navigator={this.props.navigator} fontColor='#ffffff' backgroundColor='#1151B1'
                  contentBackgroundColor='#18304D' title='个人' showBack={false} showBar={true}>
        <ScrollView automaticallyAdjustContentInsets={false} horizontal={false}>
          <View style={{backgroundColor:"#18304b",height:10}}/>
          <View style={{backgroundColor:'#162a40'}}>
            <TouchableHighlight activeOpacity={0.8} underlayColor='#18304b'
                                onPress={()=>this.toPage()}>
              <View style={styles.layout}>
                <View style={{flexDirection:'row'}}>
                  <Image style={styles.head} resizeMode="cover" source={this.returnImg()}/>
                  <View style={{marginLeft:20,marginTop:10}}>
                    <Text style={{fontSize: 18,color: '#ffffff'}}>{this.state.userName}</Text>
                    <Text style={{fontSize: 18,color: '#ffffff',marginTop:10}}>{this.state.orgName}</Text>
                  </View>
                </View>
              </View>
            </TouchableHighlight>
          </View>
          <View style={{backgroundColor:"#18304b",height:10}}/>

        </ScrollView>
      </NavBarView>
    );
  }
});

var styles = StyleSheet.create({
  layout: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    height: 84
  },
  head: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderColor: '#cccccc',
    borderWidth: 1,
    marginLeft: 20
  }
});


module.exports = WhitePage;
