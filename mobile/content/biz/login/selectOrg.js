/**
 * Created by vison on 16/4/5.
 */
var React = require('react-native');
var {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  View,
  Dimensions
  } = React;
var SelectableSectionsListView = require("../../comp/utils/capsListView/SelectableSectionsListView");
class SelectOrg extends Component {
  render() {
    // inline styles used for brevity, use a stylesheet when possible
    var textStyle = {
      textAlign:'left',
      marginLeft:20,
      color:'#fff',
      fontWeight:'700',
      fontSize:16
    };

    var viewStyle = {
      backgroundColor: '#244266',
      marginTop:-1,
      height:30,
      justifyContent:"center"
    };
    return (
      <View style={viewStyle}>
        <Text style={textStyle}>{this.props.title}</Text>
      </View>
    );
  }
}

class SectionItem extends Component {
  render() {
    return (
      <Text style={{color:"#327efb"}}>{this.props.title}</Text>
    );
  }
}

class Cell extends Component {
  render() {
    return (
      <View style={{height:40,marginLeft:20,justifyContent:"center",borderBottomWidth:1,borderBottomColor:'#122335'}}>
        <Text style={{color:"#FFFFFF",textAlign:"left"}}>{this.props.item}</Text>
      </View>
    );
  }
}

class CapsListView extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      data: {
        A: ['上海安硕织信网络信息技术有限公司','上海安硕织信网络信息技术有限公司','上海安硕织信网络信息技术有限公司'],
        B: ['上海安硕织信网络信息技术有限公司','上海安硕织信网络信息技术有限公司','上海安硕织信网络信息技术有限公司'],
        C: ['上海安硕织信网络信息技术有限公司','上海安硕织信网络信息技术有限公司','上海安硕织信网络信息技术有限公司'],
        D: ['上海安硕织信网络信息技术有限公司','上海安硕织信网络信息技术有限公司','上海安硕织信网络信息技术有限公司'],
        E: ['上海安硕织信网络信息技术有限公司','上海安硕织信网络信息技术有限公司','上海安硕织信网络信息技术有限公司'],
        F: ['上海安硕织信网络信息技术有限公司','上海安硕织信网络信息技术有限公司','上海安硕织信网络信息技术有限公司'],
        G: ['上海安硕织信网络信息技术有限公司','上海安硕织信网络信息技术有限公司','上海安硕织信网络信息技术有限公司'],
        H: [],
        I: ['上海安硕织信网络信息技术有限公司','上海安硕织信网络信息技术有限公司','上海安硕织信网络信息技术有限公司'],
        J: ['上海安硕织信网络信息技术有限公司','上海安硕织信网络信息技术有限公司','上海安硕织信网络信息技术有限公司'],
        K: ['上海安硕织信网络信息技术有限公司','上海安硕织信网络信息技术有限公司','上海安硕织信网络信息技术有限公司'],
        L: ['上海安硕织信网络信息技术有限公司','上海安硕织信网络信息技术有限公司','上海安硕织信网络信息技术有限公司'],
        M: ['some','entries','are here'],
        N: ['some','entries','are here'],
        O: ['some','entries','are here'],
        P: ['some','entries','are here'],
        Q: ['some','entries','are here'],
        R: ['some','entries','are here'],
        S: ['some','entries','are here'],
        T: ['some','entries','are here'],
        U: ['some','entries','are here'],
        V: ['some','entries','are here'],
        X: ['some','entries','are here'],
        Y: ['some','entries','are here'],
        Z: ['some','entries','are here']
      }
    };
  }

  search (){
    console.log("search...");
  }

  render() {
    return (
      <View style={styles.container}>
        <SelectableSectionsListView
          data={this.state.data}
          cell={Cell}
          cellHeight={30}
          sectionListItem={SectionItem}
          sectionHeader={SectionHeader}
          sectionHeaderHeight={22.5}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection:"column",
    backgroundColor:"#1e3754",
    marginTop:20
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('SelectOrg', () => SelectOrg);
