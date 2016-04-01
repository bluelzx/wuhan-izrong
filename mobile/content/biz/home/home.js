'use strict';

var React = require('react-native');
var {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Dimensions,
  Image
  }=React

var NavBarView = require('../../framework/system/navBarView');
var width = Dimensions.get('window').width;
var ViewPager = require('react-native-viewpager');

var PAGES = [
  'https://images.unsplash.com/photo-1441742917377-57f78ee0e582?h=1024',
  'https://images.unsplash.com/photo-1441716844725-09cedc13a4e7?h=1024',
  'https://images.unsplash.com/photo-1441448770220-76743f9e6af6?h=1024',
  'https://images.unsplash.com/photo-1441260038675-7329ab4cc264?h=1024'
];


var Home = React.createClass({

  getInitialState: function () {
    var dataSource = new ViewPager.DataSource({
      pageHasChanged: (p1, p2) => p1 !== p2,
    });

    return {
      dataSource: dataSource.cloneWithPages(PAGES),
    };
  },

  componentWillMount(){
    //this.toArray();
  },

  componentDidMount() {
    //setInterval(this.set, 20)
  },

  returnItem: function (border,url,text) {
    if (border){
      return(
        <View style={styles.borderTableItem}>
          <Image></Image>
          <Text></Text>
        </View>
      );
    }else{
      return (
        <View style={{flex:1,flexDirection:"column"}}>
          <Image></Image>
          <Text></Text>
        </View>
      );
    }
  },


  render() {
    return (
      <NavBarView navigator={this.props.navigator} title="首页" showBack={false} showBar={true}>
        <ScrollView automaticallyAdjustContentInsets={false} horizontal={false}>
          <View style={{marginTop:30}}>
            <ViewPager
              style={[this.props.style,styles.viewPager]}
              dataSource={this.state.dataSource}
              renderPage={this._renderPage}
              onChangePage={this._onChangePage}
              isLoop={true}
              autoPlay={true}/>
            <View style={}>
              <View style={{flex:1,flexDirection:"row",borderBottomColor:"#000000",borderBottomWidth:1}}>
                {this.returnItem(false)}
                {this.returnItem(true)}
                {this.returnItem(false)}
              </View>
              <View style={{flex:1,flexDirection:"row"}}>
                {this.returnItem(false)}
                {this.returnItem(true)}
                {this.returnItem(false)}
              </View>
            </View>
          </View>
        </ScrollView>
      </NavBarView>
    );
  },

  _renderPage: function (data:Object) {
    return (
      <Image
        style={styles.page}
        source={{uri:data}}/>
    );
  },

  _onChangePage: function (page) {

  },

});

var styles = StyleSheet.create({
  page: {
    width: width,
    height: 200
  },
  text: {
    fontSize: 20,
    textAlign: 'center'
  },
  viewPager: {
    height: 200
  },
  topBar: {
    height: 50,
    backgroundColor: "#0e63af",
    justifyContent: "center"
  },
  borderTableItem:{
    flex:1,
    flexDirection:"column",
    borderRightColor:"#000000",
    borderLeftColor:"#000000",
    borderLeftWidth:1,
    borderRightWidth:1
  },
  menu:{
    height: width/3*2,
    flexDirection:"column",
    backgroundColor: "#162a40",
    justifyContent: "center"
  }
});


module.exports = Home;
