/**
 * Created by baoyinghai on 4/20/16.
 */
let React= require('react-native');
const {View, Text} = React;

let nameColor = {};

let index = 0;

const COLOR_LIST = ['#F3AD2C','#44ABFD','#4A99BC','#1156C0','#A47441','#3EC3A4','#E8004D'];

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
          <View style={[{marginLeft:22,marginTop:-15,width:18,height:18,borderRadius:9,backgroundColor:'red',
                flexDirection:'row',justifyContent:'center',alignItems:'center'},badge>=99&&{height:20,width:(Platform.OS === 'ios')?24:22,marginLeft:18}]}>
            <Text style={{color:'white',fontSize:11}}>{badge >= 99 ? "99+" : badge}</Text>
          </View>
        )
      }
    }else{
      return null;
    }
  },

  render: function() {
    let {name, badge} = this.props;
    let f = !name?'?':name[0];
    return (
      <View style={{backgroundColor: this.getColor(f), height: 40,width: 40,borderRadius: 20,justifyContent:'center',alignItems:'center'}}>
        <View style={{backgroundColor: 'white', height: 38,width: 38,borderRadius: 19,justifyContent:'center',alignItems:'center'}}>
          <View style={{backgroundColor: this.getColor(f), height: 36,width: 36,borderRadius: 18,justifyContent:'center',alignItems:'center'}}>
            {this.unReadIcon(badge,true)}
            <Text style={{color:'white',fontWeight:'900',fontSize:20}}>{f}</Text>
          </View>
        </View>
      </View>
    );
  }
});

module.exports = NameCircular;
