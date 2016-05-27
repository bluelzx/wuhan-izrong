/**
 * Created by vison on 16/5/26.
 */
'use strict';

let React = require('react-native');
let {
  View,
  StyleSheet,
  Styles,
  Image,
  } = React;

var qiniu = require('react-native-qiniu');
let ImagePicker = require('../comp/utils/imagePicker');

let QiniuTest = React.createClass({

  uploadUserPoto: function (response) {
    qiniu.conf.ACCESS_KEY = 'iCduUao0AIuRdTqd3_4oqwzU8doDU3vh0sMF1CzD';
    qiniu.conf.SECRET_KEY = 'UtrtzaV8CAXgRkajynOnghX24NrS70Qs0RJozPcZ';

    var putPolicy = new qiniu.auth.PutPolicy2(
      {scope: "wuhan-fas-img:ios.jpg"}
    );
    var uptoken = putPolicy.token();
    qiniu.rpc.uploadImage(response, 'ios.jpg', uptoken, function (resp) {
      console.log(JSON.stringify(resp));
    });
  },

  returnImage: function () {

  },


  render: function () {
    let {title} = this.props;
    return (

      <ImagePicker
        type="all"
        onSelected={(response) => this.uploadUserPoto(response)}
        onError={(error) => Alert(error)}
        title="选择图片"
        fileId="userPhoto"
        allowsEditing={true}
        style={styles.head}
      >
      </ImagePicker>
    );
  }
});

let styles = StyleSheet.create({
  layout: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    height: 84,
    borderBottomWidth: 0.5,
    borderBottomColor: '#0a1926',
  },

  head: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderColor: '#cccccc',
    borderWidth: 1
  },
  certified: {
    width: 15,
    height: 15
  },
  headText: {
    color: '#FF0000',
    fontSize: 50,
    fontStyle: 'italic',
    textAlignVertical: 'center',
    textAlign: 'center',
    fontWeight: 'bold'
  },

  borderTop: {
    borderTopWidth: 1
  },
  listLayout: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 51,
    paddingLeft: 16,

  },
  circle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginTop: 1,
    marginRight: 16
  },
  title: {
    fontSize: 18
  },
  bottomStyle: {
    height: 1,
    marginLeft: 20
  }
});


module.exports = QiniuTest;
