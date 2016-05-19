/**
 * Created by baoyinghai on 4/20/16.
 */
let React= require('react-native');
const {View, Text, Image, Platform} = React;

let nameColor = {};

let index = 0;

const COLOR_LIST = ['#44B5E6','#A07CEB','#4076D8','#5089EA','#95D158','#FEC840','#E94255'];

let NameCircular = React.createClass({

  getColor: function(f) {
    if(!nameColor[f]){
      if(index > COLOR_LIST.length){
        index = 0;
      }
      nameColor[f] = COLOR_LIST[index];
      index ++ ;
    }
    return nameColor[f];
  },

  unReadIcon: function(badge, showBadge){
    if(showBadge) {
      if (badge > 0) {
        return (
          <View style={[{position:'absolute',marginLeft:25,top:0,width:18,height:18,borderRadius:9,backgroundColor:'red',
                flexDirection:'row',justifyContent:'center',alignItems:'center'},badge>=99&&{height:20,width:(Platform.OS === 'ios')?24:22,marginLeft:18}]}>
            <Text style={{color:'white',fontSize:11}}>{badge >= 99 ? "99+" : badge}</Text>
          </View>
        );
      }
    }else{
      return <View></View>;
    }
  },

  renderV: function(isV) {
    if(isV){
      return (
        <Image style={[{ width: 15, height: 15}, {position: 'absolute',bottom:0,marginLeft:40}]}
             resizeMode="cover" source={require('../../image/user/certificated.png')}/>
      );
    }else{
      return null;
    }
  },

  render: function() {
    let {name, badge, isV = true} = this.props;
    let f = !name?'?':name[0];
    return (
      <View>
        <View
          style={{backgroundColor: this.getColor(f), height: 46,width: 46,borderRadius: 23,justifyContent:'center',alignItems:'center'}}>
          <View
            style={{backgroundColor: 'white', height: 44,width: 44,borderRadius: 22,justifyContent:'center',alignItems:'center'}}>
            <View
              style={{backgroundColor: this.getColor(f), height: 42,width: 42,borderRadius: 21,justifyContent:'center',alignItems:'center'}}>
              <Text style={{color:'white',fontWeight:'900',fontSize:20}}>{f}</Text>
            </View>
          </View>
        </View>
        {this.unReadIcon(badge, true)}
        {this.renderV(isV)}
      </View>
    );
  }
});

let Main = {
  NameCircular:NameCircular
};

module.exports = Main;
