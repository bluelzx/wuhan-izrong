import React, {View, Text, StyleSheet, TouchableHighlight, Image} from 'react-native';
import Bubble from './bubble';
import ErrorButton from './errorButton';
import Angle from './angle';
//import {NameCircular} from '../../biz/im/nameCircular';
let HeaderPic = require('../../biz/im/headerPic');
let DictStyle = require('../../constants/dictStyle');

var styles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems:'center'
  },
  name: {
    color: '#aaaaaa',
    fontSize: 12,
    marginLeft: 55,
    marginBottom: 5,
  },
  nameInsideBubble: {
    color: '#666666',
    marginLeft: 0
  },
  imagePosition: {
    height: 30,
    width: 30,
    alignSelf: 'flex-end',
    marginLeft: 8,
    marginRight: 8,
  },
  image: {
    alignSelf: 'center',
    borderRadius: 3,
  },
  imageLeft: {
  },
  imageRight: {
  },
  spacer: {
    width: 10,
  },
  status: {
    color: '#aaaaaa',
    fontSize: 12,
    textAlign: 'right',
    marginRight: 15,
    marginBottom: 10,
    marginTop: -5,
  },
});

export default class Message extends React.Component {

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    Object.assign(styles, this.props.styles);
  }

  renderName(name, displayNames, diffMessage){
    if (displayNames === true) {
      if (diffMessage === null || name !== diffMessage.name) {
        return (
          <Text style={[styles.name,
            this.props.displayNamesInsideBubble ? styles.nameInsideBubble : null
            ]}>
            {name}
          </Text>
        );
      }
    }
    return <View></View>;
  }

  renderImage(rowData, rowID, diffMessage, forceRenderImage, onImagePress){
    return (
      <HeaderPic name={rowData.name}
                 photoFileUrl={rowData.image}  certified={rowData.certified}
                 style={[styles.imagePosition, styles.image, (rowData.position === 'left' ? styles.imageLeft : styles.imageRight)]}/>
    );
    //if (rowData.image !== undefined && rowData.image !== null) {
    //  if (forceRenderImage === true) {
    //    diffMessage = null; // force rendering
    //  }
    //
    //  if (diffMessage === null || (diffMessage != null && (rowData.name !== diffMessage.name || rowData.id !== diffMessage.id))) {
    //    if (typeof onImagePress === 'function') {
    //
    //      //return (
    //      //  <NameCircular name={rowData.name} style={[styles.imagePosition, styles.image, (rowData.position === 'left' ? styles.imageLeft : styles.imageRight)]}/>
    //      //);
    //      return (
    //        <TouchableHighlight
    //          underlayColor='transparent'
    //          onPress={() => onImagePress(rowData, rowID)}
    //        >
    //          <View>
    //            <HeaderPic name={rowData.name}
    //                       photoFileUrl={rowData.image}  certified={rowData.certified}
    //                       style={[styles.imagePosition, styles.image, (rowData.position === 'left' ? styles.imageLeft : styles.imageRight)]}/>
    //          </View>
    //        </TouchableHighlight>
    //      );
    //
    //      //return (
    //      //  <TouchableHighlight
    //      //    underlayColor='transparent'
    //      //    onPress={() => onImagePress(rowData, rowID)}
    //      //  >
    //      //    <Image source={rowData.image} style={[styles.imagePosition, styles.image, (rowData.position === 'left' ? styles.imageLeft : styles.imageRight)]}/>
    //      //  </TouchableHighlight>
    //      //);
    //    } else {
    //
    //      return (
    //        <HeaderPic name={rowData.name}
    //                   photoFileUrl={rowData.image}  certified={rowData.certified}
    //                   style={[styles.imagePosition, styles.image, (rowData.position === 'left' ? styles.imageLeft : styles.imageRight)]}/>
    //      );
    //      //return (
    //      //  <Image source={rowData.image} style={[styles.imagePosition, styles.image, (rowData.position === 'left' ? styles.imageLeft : styles.imageRight)]}/>
    //      //);
    //    }
    //  } else {
    //    return (
    //      <View style={styles.imagePosition}/>
    //    );
    //  }
    //}
    //return (
    //  <View style={styles.spacer}/>
    //);
  }

  renderErrorButton(rowData, rowID, onErrorButtonPress){
    if (rowData.status === 'ErrorButton') {
      return (
        <ErrorButton
          onErrorButtonPress={onErrorButtonPress}
          rowData={rowData}
          rowID={rowID}
          styles={styles}
        />
      );
    }
    return <View></View>;
  }

  renderStatus(status){
    if (this.props.renderStatus && status !== 'ErrorButton' && typeof status === 'string') {
      if (status.length > 0) {
        return (
          <View>
            <Text style={styles.status}>{status}</Text>
          </View>
        );
      }
    }
    return <View></View>;
  }

  _renderAngle(rowData) {
    if (rowData.position === 'left') {
      return (
        <Angle direction='left' color={this.props.leftBackgroundColor} />
      );
    }

    let bgColor = this.props.rightBackgroundColor;
    //if (rowData.status === 'ErrorButton') {
    //  bgColor = this.props.errorBackgroundColor;
    //}
    return (
      <Angle direction='right' color={bgColor} />
    );
  }

  render(){

    var {
      rowData,
      rowID,
      onErrorButtonPress,
      position,
      displayNames,
      diffMessage,
      forceRenderImage,
      onImagePress,
      onMessageLongPress,
      } = this.props;

    var flexStyle = {};
    var RowView = Bubble;
    if ( rowData.content.length > 40 ) {
      flexStyle.flex = 1;
    }

    if ( rowData.view ) {
      RowView = rowData.view;
    }

    var messageView = (
      <View>
        {position === 'left' && !this.props.displayNamesInsideBubble ? this.renderName(rowData.name, displayNames, diffMessage) : null}
        <View style={[styles.rowContainer, {
            justifyContent: position==='left'?"flex-start":"flex-end"
          }]}>
          {position === 'left' ? this.renderImage(rowData, rowID, diffMessage, forceRenderImage, onImagePress) : null}
          {position === 'right' ? this.renderErrorButton(rowData, rowID, onErrorButtonPress) : null}
          {position === 'left' ? this._renderAngle(rowData) : null}
          <RowView
            {...rowData}
            renderCustomText={this.props.renderCustomText}
            name={position === 'left' && this.props.displayNamesInsideBubble ? this.renderName(rowData.name, displayNames, diffMessage) : null}
            leftBackgroundColor={this.props.leftBackgroundColor}
            rightBackgroundColor={this.props.rightBackgroundColor}
            errorBackgroundColor={/*this.props.errorBackgroundColor*/this.props.rightBackgroundColor}
          />
          {position === 'right' ? this._renderAngle(rowData) : null}
          {rowData.position === 'right' ? this.renderImage(rowData, rowID, diffMessage, forceRenderImage, onImagePress) : null}
        </View>
        {rowData.position === 'right' ? this.renderStatus(rowData.status) : null}
      </View>
    );

    if (typeof onMessageLongPress === 'function') {
      return (
        <TouchableHighlight
          underlayColor='transparent'
          onLongPress={() => onMessageLongPress(rowData, rowID)}>
          {messageView}
        </TouchableHighlight>
      );
    } else {
      return messageView;
    }
  }
}

Message.propTypes = {
  leftBackgroundColor: React.PropTypes.string,
  rightBackgroundColor: React.PropTypes.string,
  errorBackgroundColor: React.PropTypes.string
};


Message.defaultProps = {
  leftBackgroundColor: DictStyle.imChat.leftBackgroundColor,
  rightBackgroundColor:  DictStyle.imChat.rightBackgroundColor,
  errorBackgroundColor: '#e01717'
};

