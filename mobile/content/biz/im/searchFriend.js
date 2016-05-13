/**
 * Created by baoyinghai on 5/12/16.
 */
let React = require('react-native');
const {View, TextInput, Text, TouchableOpacity, Platform, ScrollView} = React;
let NavBarView = require('../../framework/system/navBarView');
let DictStyle = require('../../constants/dictStyle');
let NameCircular = require('./nameCircular').NameCircular;
let ImUserInfo = require('./imUserInfo');
let SearchFriend = React.createClass({


  getInitialState:function(){
    return {
      dataSource: []
    }
  },

  toOther: function(userId) {
    this.props.navigator.push({
      comp:ImUserInfo,
      param:{userId:userId}
    })
  },

  renderItem: function(data) {
    return (
    <TouchableOpacity key={data.userId}
                      onPress={() => this.toOther(data.userId)}
                      style={{marginHorizontal:10,borderTopWidth:0.5,  borderTopColor: DictStyle.colorSet.demarcationColor}}>
      <View style={{flexDirection:'row', paddingVertical:5, alignItems:'center'}}>
        <NameCircular name={data.realName}/>
        <Text style={{color:DictStyle.colorSet.imTitleTextColor, marginLeft: 10}}>{data.realName + '-'+data.orgValue}</Text>
      </View>
    </TouchableOpacity>
    );
  },

  renderSearchResult: function() {
    let ret = [];
    this.state.dataSource.forEach((item)=>{
      ret.push(this.renderItem(item));
    });
    return ret;
  },

  searchFriend : function(){
    this.setState(
      {dataSource:[{userId:9,realName:'张某某', orgValue:'中国银行'},
      {userId:10,realName:'王某某', orgValue:'中国银行'},
      {userId:11,realName:'李某某', orgValue:'中国银行'}
      ]
      }
    );
  },

  render: function() {

    return (
      <NavBarView
        navigator={this.props.navigator}
        title='搜索好友'
      >
       <View style={{paddingTop:10}}>
         <View style={{flexDirection:'row',justifyContent:'space-between'}}>
           <TextInput
             selectionColor={DictStyle.colorSet.textInputColor}
             style={{paddingHorizontal:5,flex:8,borderRadius:6,color: DictStyle.searchFriend.textInputColor, height:(Platform.OS === 'ios')?30:60,backgroundColor:'#ffffff',marginTop:(Platform.OS === 'ios')?0:-15,marginLeft:10,marginRight:10}}>
           </TextInput>
           <TouchableOpacity style={{flex:1,height:(Platform.OS === 'ios')?30:60,justifyContent:'center',alignItems:'center'}} onPress={()=>this.searchFriend()}><Text style={{color:'#3C62E4'}}>搜索</Text></TouchableOpacity>
         </View>

         {(()=>{

           if(this.state.dataSource && this.state.dataSource.length > 0){
             return (
               <ScrollView style={{flexDirection: 'column',backgroundColor:'#FEFEFE', marginTop:5}}>
                 {this.renderSearchResult()}
               </ScrollView>
             );

           }else{
             return (
               <View style={{flex:1,justifyContent:'center',marginTop:10}}>
                 <Text style={{textAlign:'center',color:'#CBD3DB'}}>输入姓名/机构名以搜索好友</Text>
               </View>
             );
           }

         })()}

         </View>
      </NavBarView>
    );
  }
});

module.exports = SearchFriend;
