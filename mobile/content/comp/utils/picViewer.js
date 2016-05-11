/**
 * Created by baoyinghai on 5/10/16.
 */
let React = require('react-native');
let { View, Image, TouchableHighlight} = React;
let AppAction = require('../../framework/action/appAction');

let PicViewer = React.createClass({



  render: function() {

    return (
      <View>
        <TouchableHighlight
          onPress={()=>{AppAction.showPic(this.props.source)}}
          underlayColor="#a9d9d4">
          <Image
            style={{
              flex: 1,
              width: 100,
              height: 100,
            }}
            source={{uri: this.props.source}}
          ></Image>
        </TouchableHighlight>
        </View>
    );
  }
});

module.exports = PicViewer;

