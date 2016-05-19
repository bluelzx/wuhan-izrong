/**
 * Created by baoyinghai on 16/4/6.
 */
let React = require('react-native');
const {Text, ScrollView, View, TouchableOpacity} = React;
let NavBarView = require('../../framework/system/navBarView');
let Icon = require('react-native-vector-icons/Ionicons');
let AppStore = require('../../framework/store/appStore');
let DateHelper = require('../../comp/utils/dateHelper');
let SpreadDetail = require('./spreadDetail');

let Spread = React.createClass({

  componentDidMount() {
    AppStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function () {
    AppStore.removeChangeListener(this._onChange);
  },
  _onChange: function () {
    this.setState(this.getStateFromStores());
  },

  getStateFromStores: function() {
    return {data:AppStore.queryAllPlatFormInfo()};
  },

  getInitialState: function(){
    return this.getStateFromStores();
  },

  renderItem: function(item){
    return (
      <TouchableOpacity key={item.infoId} onPress={()=>{this.props.navigator.push({
      comp:SpreadDetail,
      param:{
      item:item
      }
      })}}>
        <View
              style={{flexDirection:'column',backgroundColor:'#FEFEFE',paddingHorizontal:10,margin:10,paddingVertical:10,borderRadius:10}}>
          <Text numberOfLines={1} style={{color:'#8694A0',fontWeight:'bold',fontSize:16}}>{item.title}</Text>
          <Text numberOfLines={3} style={{color:'#8694A0', marginTop:15}}>{item.content}</Text>
          <View
            style={{flexDirection:'row', justifyContent:'space-between',marginTop:10,borderTopWidth:0.5,borderTopColor:'#8694A0',paddingTop:10}}>
            <Text style={{color:'#8694A0'}}>查看详情</Text>
            <View style={{flexDirection:'row', justifyContent:'flex-end',alignItems:'center'}}>
              <Text style={{color:'#8694A0'}}>{DateHelper.descDate(item.createDate)}</Text>
              <Icon name={'ios-arrow-right'} size={18} color={'#8694A0'}/>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  },

  renderBody : function(){
    let ret = [];

    this.state.data.forEach((item)=>{
      ret.push(this.renderItem(item));
    })
    return ret;
  },

  render: function () {
    return (
      <NavBarView
        navigator={this.props.navigator} title='爱资融同业平台'>
        <ScrollView style={{flexDirection: 'column'}}>
        {this.renderBody()}
        </ScrollView>
      </NavBarView>
    );
  }
});
module.exports = Spread;
