/**
 * Created by baoyinghai on 16/4/6.
 */

let React = require('react-native');
const {Image, View, Platform, Text, StyleSheet} = React;
let _ = require('lodash');
let NameCircular = require('./nameCircular').NameCircular;
let AppStore = require('../../framework/store/appStore');
let Cache = require('../../comp/fileCache/fileCache');

let LoadExtendImage = require('../../comp/utils/loadExtendImage');

let HeaderPic = React.createClass({

  //imgSrc:{},
  //
  //requireImg: function (photoFileUrl) {
  //  if (!this.imgSrc[photoFileUrl]) {
  //    this.imgSrc[photoFileUrl] = (
  //      <Image style={[styles.head]} resizeMode="cover" source={require('../../image/im/groupHeaderPic.png')}/>
  //    );
  //  };
  //  return this.imgSrc[photoFileUrl];
  //},

  returnImage: function () {
  },

  unReadIcon: function(badge, showBadge){
    if(showBadge) {
      if ((badge < 100000 && badge > 0) || badge % 100000 > 0) {
        return (
          <View style={[{position:'absolute',top:0,right:0,width:18,height:18,borderRadius:9,backgroundColor:'red',
                flexDirection:'row',justifyContent:'center',alignItems:'center'},badge % 100000 > 99 && {height:20,width:(Platform.OS === 'ios')?24:22,marginLeft:18}]}>
            <Text style={{color:'white',fontSize:11}}>{badge % 100000 > 99 ? "99+" : badge % 100000}</Text>
          </View>
        )
      }else if (badge / 100000 > 0) {
        return (
          <View style={[styles.badgeNoNumber,{position:'absolute',top:0,right:0}]}>
          </View>
        )
      } else {
        return (
          <View></View>
        );
      }
    }else{
      return <View></View>;
    }
  },

  render: function () {
    let {name, photoFileUrl, badge, certified = false, source=false, showBadge=false} = this.props;

    if (!_.isEmpty(photoFileUrl)) {
        return (
          <View>
            <LoadExtendImage jobMode="load"
                             source={{uri: photoFileUrl}}
                             style={styles.head}
                             navigator = {{navigator:AppStore.getNavigator()}}
            />
            {this.unReadIcon(badge, showBadge)}
              {(()=>{
              if(certified){
                return (
                  <Image style={[styles.certified,{position: 'absolute',bottom:0,right:0}]}
                         resizeMode="cover" source={require('../../image/user/certificated.png')}>
                  </Image>
                );
              }else{
                return null;
              }
            })()}
          </View>
        );
    }else if(!!source){
      return (
        <View>
          <Image style={[styles.head]} resizeMode="cover" source={source}/>
          {this.unReadIcon(badge, showBadge)}
        </View>
      );
    }else {
      return (
        <NameCircular name={name} badge={badge} isV={certified}/>
      );
    }
  }
});

let styles = StyleSheet.create({
  badgeNoNumber: {
    flexDirection: 'row',
    justifyContent: 'center',
    top: 1,
    right: 2,
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 5,
    alignItems: 'center',
    backgroundColor: '#ff0000',
  },
  head: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderColor: '#cccccc',
    borderWidth: 1
  },
  certified:{
    width: 15,
    height: 15
  }
});
module.exports = HeaderPic;
