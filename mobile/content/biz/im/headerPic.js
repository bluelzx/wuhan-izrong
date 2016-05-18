/**
 * Created by baoyinghai on 16/4/6.
 */

let React = require('react-native');
const {Image, View, Platform, Text, StyleSheet} = React;
let _ = require('lodash');
let NameCircular = require('./nameCircular').NameCircular;


let HeaderPic = React.createClass({


  returnImage: function () {

  },


  unReadIcon: function(badge, showBadge){
    if(showBadge) {
      if (badge > 0) {
        return (
          <View style={[{marginLeft:22,width:18,height:18,borderRadius:9,backgroundColor:'red',
                flexDirection:'row',justifyContent:'center',alignItems:'center'},badge>=99&&{height:20,width:(Platform.OS === 'ios')?24:22,marginLeft:18}]}>
            <Text style={{color:'white',fontSize:11}}>{badge >= 99 ? "99+" : badge}</Text>
          </View>
        )
      }
    }else{
      return <View></View>;
    }
  },

  render: function () {
    let {name, photoFileUrl, badge, certified = true} = this.props;
    if (!_.isEmpty(photoFileUrl)) {

        return (
          <View>
            <Image style={styles.head} resizeMode="cover" source={{uri: photoFileUrl}}/>
            {(()=>{
              if(certified){
                return (
                  <Image style={[styles.certified,{position: 'absolute',bottom:0,right:0}]}
                         resizeMode="cover" source={require('../../image/user/certificated.png')}/>
                );
              }else{
                return null;
              }
            })()}
          </View>
        );

    }else {
      return (
        <NameCircular name={name} badge={badge} isV={certified}/>
      );
    }
  }
});


module.exports = HeaderPic;


let styles = StyleSheet.create({

  head: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderColor: '#cccccc',
    borderWidth: 1
  },
  certified:{
    width: 15,
    height: 15
  }
});
