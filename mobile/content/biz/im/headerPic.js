/**
 * Created by baoyinghai on 16/4/6.
 */

let React = require('react-native');
const {Image, View, Platform, Text, StyleSheet} = React;

let HeaderPic = React.createClass({

  unReadIcon: function(badge, showBadge){
    if(showBadge) {
      if (badge < 100000 && badge > 0) {
        return (
          <View style={[{marginLeft:22,width:18,height:18,borderRadius:9,backgroundColor:'red',
                flexDirection:'row',justifyContent:'center',alignItems:'center'},badge > 99 && {height:20,width:(Platform.OS === 'ios')?24:22,marginLeft:18}]}>
            <Text style={{color:'white',fontSize:11}}>{badge > 99 ? "99+" : badge}</Text>
          </View>
        )
      }else if (badge / 100000 > 0) {
        return (
          <View style={[styles.badgeNoNumber]}>
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
    let {source, style, badge, showBadge=true} = this.props;
    return (
     <Image source={source} style={style}>
       {this.unReadIcon(badge, showBadge)}
     </Image>
    );
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
  }
});
module.exports = HeaderPic;
