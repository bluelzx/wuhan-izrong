/**
 * Created by baoyinghai on 16/4/6.
 */

let React = require('react-native');
const {Image, View, Platform, Text} = React;

let HeaderPic = React.createClass({

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
    let {source, style, badge, showBadge=true} = this.props;
    return (
     <Image source={source} style={style}>
       {this.unReadIcon(badge, showBadge)}
     </Image>
    );
  }
});
module.exports = HeaderPic;
