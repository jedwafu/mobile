import React, {
  Alert,
  Component,
  Linking,
  Platform,
  StyleSheet,
  Text,
  View,
  WebView
} from 'react-native';

function runOnEachPage() {

  var url = document.location.href;

  var REDIRECTS = {
    // not yet used
  };

  if (url.startsWith(this.state.baseURL)) {
    let path = url.substring(this.state.baseURL.length);
    let redirect = REDIRECTS[path]
    if (redirect !== undefined) {
      document.location.href = redirect;
    }
  }
  else {
    console.dir({url:url, baseURL: this.state.baseURL})
    window.history.back();
    url;
  }
}

var StaffjoyHome = React.createClass({

  getInitialState() {
    var baseURL;
    let defaultPath = '/auth/native';

    if (this.props.source) {
      // remove trailing slash if present
      baseURL = this.props.source.replace(/\/?$/, '');
    }
    else {
      baseURL = 'https://www.staffjoy.com';
    }

    let url = baseURL + defaultPath;

    return {
      baseURL: baseURL,
      defaultPath: defaultPath,
      url: url
    }
  },

  headers() {
    return {
      uri: this.state.url,
      headers: {
        'X-Staffjoy-Native': Platform.OS
      }
    }
  },

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.statusBarBackground} />
        <WebView
          source={this.headers()}
          style={styles.web}
          onLoad={this.onLoad}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          injectedJavaScript={this.javaScriptToInject()}
          onShouldStartLoadWithRequest={this.onShouldStartLoadWithRequest}
        />
      </View>
    );
  },

  javaScriptToInject() {
    let fn = runOnEachPage.toString();
    fn = fn.replace(RegExp('this.state.baseURL', 'g'), '\'' + this.state.baseURL + '\'');
    fn = fn.replace(/^[^{]*{\s*/,'').replace(/\s*}[^}]*$/,'');
    return fn;
  },

  onLoad(event) {
    let url = event.nativeEvent.jsEvaluationValue;
    if (url !== undefined && url !== '')
    {
      Linking.openURL(url).catch(err => console.error('Unable to open url (' + url + ')', err));
    }
  }

});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: '#F5FCFF',
  },
  statusBarBackground: {
    height: Platform.OS === 'ios' ? 20 : 0,
    backgroundColor: 'white'
  },
  web: {
    flex: 1
  }
});

module.exports = StaffjoyHome;
