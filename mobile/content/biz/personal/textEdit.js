'use strict';

let React = require('react-native');
let {
  StyleSheet,
  View,
  TextInput,
  Text,
  Picker,
  Switch,
  TouchableOpacity
  } = React;
let _ = require('lodash');
let NavBarView = require('../../framework/system/navBarView');
let dateFormat = require('dateformat');
let date = dateFormat(new Date(), 'yyyy-mm-dd');
let dismissKeyboard = require('react-native-dismiss-keyboard');
let { Alert, Button ,Device} = require('mx-artifacts');
let UserInfoAction = require('../../framework/action/userInfoAction');
let AppStore = require('../../framework/store/appStore');

let TextEdit = React.createClass({
  getInitialState: function () {
    let value = this.props.param.value;
    let type = this.props.param.type;
    if (type == 'number') {
      type = 'numeric'
    } else if (type == 'name') {
      type = 'default'
    } else {
      type = 'ascii-capable'
    }
    let year = this.props.param.type == "date" ? (this.props.param.value == '' ? Number(date.split("-")[0]) : Number(this.props.param.value.split("-")[0])) : '';
    let month = this.props.param.type == "date" ? (this.props.param.value == '' ? Number(date.split("-")[1]) : Number(this.props.param.value.split("-")[1])) : '';
    return {
      oldPublicValue: this.props.param.publicValue,
      publicName: this.props.param.publicName,
      oldValue: (value === null || value == '' || value == '未填写') ? '' : this.props.param.value.toString(),
      year: year,
      month: month,
      day: this.props.param.type == "date" ? (this.props.param.value == '' ? Number(date.split("-")[2]) : Number(this.props.param.value.split("-")[2])) : '',
      newValue: this.props.param.value,
      newPublicValue: this.props.param.publicValue,
      type: type,
      tele: this.props.param.type == "telephone" ? (_.isEmpty(this.props.param.value) ? '' : this.props.param.value.split('-')[0] ) : '',
      phone: this.props.param.type == "telephone" ? (_.isEmpty(this.props.param.value) ? '' : this.props.param.value.split('-')[1]) : '',
      yearList: Array(200).fill({}).map((obj, index)=>obj = {name: 1949 + index + "年", value: 1949 + index}),
      monthList: Array(12).fill({}).map((obj, index)=>obj = {name: 1 + index + "月", value: 1 + index}),
      dayList: Array(this.calDay(year, month)).fill({}).map((obj, index)=>obj = {
        name: 1 + index + "日",
        value: 1 + index
      })
    }
  },
  calDay(year, month){
    if (this.state) {
      year = this.state.year;
      month = this.state.month;
    }
    let a = 0;
    if (_.indexOf([1, 3, 5, 7, 8, 10, 12], month) > -1) {
      a = 31;
    } else if (_.indexOf([4, 6, 9, 11], month) > -1) {
      a = 30;
    } else if (month == 2) {
      if (!(year % 4)) {
        a = 29;
      } else {
        a = 28;
      }
    }
    return a;
  },
  setDayList(year, month){
    this.setState({
      dayList: Array(this.calDay(year, month)).fill({}).map((obj, index)=>obj = {
        name: 1 + index + '日',
        value: 1 + index
      })
    });
  },
  button(){
    return (
      <Button func={this.saveValue} content="保存"/>
    );
  },

  changeTime(itemValue, type){
    Promise.resolve(
      this.setState({[type]: itemValue})
      )
      .then(
        this.setDayList(this.state.year, this.state.month)
      );
  },

  updateUserInfo: function () {
    if (this.props.param.type == 'telephone') {
      if (this.state.tele.length > 0 && this.state.phone.length > 0) {
        this.setState({
          newValue: this.state.tele + '-' + this.state.phone
        });
      }
    }
    let data = {};
    if (this.state.newValue != this.state.oldValue) {
      if (this.state.newPublicValue == this.state.oldPublicValue || this.state.publicName == '') {
        data = [{
          column: this.props.param.name,
          value: this.state.newValue
        }];
        this.update(data);
      } else {
        data = [{
          column: this.props.param.name,
          value: this.state.newValue
        },
          {
            column: this.props.param.publicName,
            value: this.state.newPublicValue
          }];
        this.update(data);
      }
    } else if (this.state.newPublicValue != this.state.oldPublicValue) {
      data = [{
        column: this.props.param.publicName,
        value: this.state.newPublicValue
      }];
      this.update(data);
    }
  },

  update: function (data) {
    this.props.exec(() => {
      return UserInfoAction.updateUserInfo(data)
        .then(() => {
          data.forEach((dataItem)=> {
            AppStore.updateUserInfo(dataItem.column, dataItem.value);
          });
          const { navigator } = this.props;
          if (navigator) {
            this.props.navigator.pop();
          }
        }).catch((errorData) => {
          Alert(errorData.msgContent);
        });
    });
  },

  renderUpdate: function () {
    return (
      <TouchableOpacity style={{width:150}}
                        onPress={()=>this.updateUserInfo()}
      >
        <Text style={{color: '#ffffff'}}>完成</Text>
      </TouchableOpacity>
    );

  },

  switchControl: function (open) {
    this.setState({newPublicValue: open});
  },

  renderSwitch: function () {
   // if (this.state.publicName != '') {
      return (
        <View style={{backgroundColor: '#162a40', height:50}}>
          <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
            <Text style={{color: '#ffffff', fontSize: 18, marginLeft: 20}}>公开此信息</Text>
            <Switch style={{margin:20}}
                    value={this.state.newPublicValue}
                    onValueChange={this.switchControl}
            />
          </View>
        </View>
      );
   // }
  },

  render: function () {
    if (this.props.param.type == 'date') {
      return (
        <NavBarView navigator={this.props.navigator} fontColor='#ffffff' backgroundColor='#1151B1'
                    contentBackgroundColor='#18304D' title={this.props.param.title} showBack={true}
                    showBar={true} actionButton={this.renderUpdate}
        >
          <View style={{flexDirection: 'row'}}>
            <View style={{flex:1}}>
              <Picker mode="dropdown"
                      selectedValue={this.state.year}
                      onValueChange={(itemValue)=>this.changeTime(itemValue, 'year')}
              >
                {this.state.yearList.map((obj, index) => (
                    <Picker.Item
                      key={obj.value}
                      value={obj.value}
                      label={obj.name.toString()}
                    />
                  )
                )}
              </Picker>
            </View>
            <View style={{flex: 1}}>
              <Picker
                selectedValue={this.state.month}
                onValueChange={(itemValue)=>this.changeTime(itemValue, 'month')}
              >
                {this.state.monthList.map((obj, index) => (
                    <Picker.Item
                      key={obj.value}
                      value={obj.value}
                      label={obj.name.toString()}
                    />
                  )
                )}
              </Picker>
            </View>
            <View style={{flex:1}}>
              <Picker
                selectedValue={this.state.day}
                onValueChange={(itemValue)=>this.changeTime(itemValue, 'day')}
              >
                {this.state.dayList.map((obj, index) => (
                    <Picker.Item
                      key={obj.value}
                      value={obj.value}
                      label={obj.name.toString()}
                    />
                  )
                )}
              </Picker>
            </View>
          </View>
        </NavBarView>
      );
    } else if (this.props.param.type == 'telephone') {
      return (
        <NavBarView navigator={this.props.navigator} fontColor='#ffffff' backgroundColor='#1151B1'
                    contentBackgroundColor='#18304D' title={this.props.param.title} showBack={true} showBar={true}
                    actionButton={this.renderUpdate}
        >
          <View
            style={{backgroundColor: '#162a40', marginTop: 20, borderBottomWidth: 0.5, borderBottomColor: '#0a1926'}}
          >
            <View style={[styles.view, {flexDirection: 'row'}]}>
              <TextInput style={[styles.text, {width: 80}]} defaultValue={this.state.oldValue.split('-')[0]}
                         keyboardType='numeric'
                         underlineColorAndroid="transparent"
                         maxLength={4}
                         onChangeText={(text) => this.setState({tele: text})}
                         autoFocus={true}
                         autoCapitalize="none"
                         autoCorrect={false}
              />
              <Text style={styles.text}>_</Text>
              <TextInput style={[styles.text, {flex: 1, marginLeft: 10}]}
                         underlineColorAndroid="transparent"
                         defaultValue={this.state.oldValue.split('-')[1]} keyboardType='numeric'
                         maxLength={8}
                         onChangeText={(text) => this.setState({phone: text})}
                         autoCapitalize="none"
                         autoCorrect={false}
              />
            </View>
            {this.renderSwitch()}
          </View>
        </NavBarView>
      );
    } else {
      return (
        <NavBarView navigator={this.props.navigator} fontColor='#ffffff' backgroundColor='#1151B1'
                    contentBackgroundColor='#18304D' title={this.props.param.title} showBack={true} showBar={true}
                    actionButton={this.renderUpdate}
        >
          <View
            style={{backgroundColor: '#162a40', marginTop:20, borderBottomWidth: 0.5, borderBottomColor: '#0a1926'}}
          >
            <View style={styles.view}>
              <TextInput style={styles.text} defaultValue={this.state.oldValue} keyboardType={this.state.type}
                         underlineColorAndroid="transparent"
                         maxLength={this.props.param.maxLength}
                         onChangeText={(text) => this.setState({newValue: text})}
                         autoFocus={true}
                         autoCapitalize="none"
                         autoCorrect={false}
              />
            </View>
            {this.renderSwitch()}
          </View>
        </NavBarView>
      );
    }
  }
});
let styles = StyleSheet.create({
  view: {
    marginTop: 10,
    marginHorizontal: 20
  },
  text: {
    fontSize: 20,
    height: 40,
    color: '#ffffff',
    paddingBottom: 10
  }
});
module.exports = TextEdit;
