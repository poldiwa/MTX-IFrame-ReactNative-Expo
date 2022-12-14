import { useRef } from 'react';
import { Linking } from 'react-native';
import { WebView } from 'react-native-webview';

export default function App() {
  const webViewRef = useRef(null);
  return (
    <WebView
      onMessage={(event) => {
        let postMessage = JSON.parse(event.nativeEvent.data)
        console.log(postMessage)
        // looks like yodlee is directly sending it to the ReactNativeWebview 
        // can be something we can tell to yodlee but we can just relay it for now

        // @see: https://developer.yodlee.com/docs/fastlink/4.0/mobile/ReactNative
        if (postMessage.type == "POST_MESSAGE") {
          webViewRef.current.injectJavaScript(`window.postMessage(${JSON.stringify(postMessage.data)});`);
        }

        // yodlee and ninja
        if (postMessage.type == "OPEN_EXTERNAL_URL" || postMessage.event == "open_url") {
          Linking.openURL(postMessage.url || postMessage.data.url)
        }

        // we'll do something what yodlee do and check for ReactNativeWebview and postmessage with it
        // so you dont have to convert the events, 
        // events are 
        // EXIT
        // ENROLLMENT_SUCCESS
        // ENROLLMENT_FAILED
        // ERROR
        // SESSION_EXPIRED
        // PLAYER_RETRIEVED
        if (postMessage.namespace == "mtx" && postMessage.event == "PLAYER_RETRIEVED") {
          // do something
          console.log('log from react native')
          // alert('alert from react native')
        }
      }}
      ref={webViewRef}
      // source={{ uri: 'http://192.168.1.154:4200/7/1001/dashboard/?linkedId=7HT9UKXG2MMCZV9ZKTEEVFSPR5KV8R' }}
      source={{ uri: 'https://www.morongoquikcash.com/' }}
      // source={{ uri: 'http://192.168.1.154:4200/7/1004/dashboard/?linkedId=WQFH9GTSRMG8R7MDPPUKAD3HRU4JN4' }}
    />
  );
} 