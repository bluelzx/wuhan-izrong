/**
 * Created by baoyinghai on 16/4/13.
 */
let React = require('react-native');
const {View, ScrollView} = React;
let NameCircular = require('./nameCircular');

let ChooseList = React.createClass({


  renderMemberView: function(data) {
    return data.map((item, index)=>{
      return (
        <NameCircular key={item.userId} name={item.realName}/>
      );
    });
  },

  render: function(){
    let memberView = new Array();
    let memberList = this.props.memberList;
    for(let userId in memberList){
      if(!!memberList[userId]){
        memberView.push(memberList[userId]);
      }
    }
    return (
      <View style={{backgroundColor:'#1B385E',padding:5, borderBottomWidth:5, borderBottomColor:'#15263A',overflow:'hidden'}}>
        <ScrollView horizontal={true} style={{flexDirection:'row', backgroundColor:'#15263A',overflow:'hidden'}}>
          {this.renderMemberView(memberView)}
        </ScrollView>
      </View>
    );
  }

});

module.exports = ChooseList;
