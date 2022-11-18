import { StatusBar } from 'expo-status-bar';
import { useRef } from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { WebView } from 'react-native-webview';

export default function App() {
  const webViewRef = useRef(null);
  return (
    <WebView
      onMessage={(event) => {
        let postMessage = JSON.parse(event.nativeEvent.data)

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
      source={{ uri: 'https://markertrax-player-apps.stn-uat.markertrax.com/7/1001/dashboard/?linkedId=ABFXBVFD2NBQKJYDUKHHMPBBK6SNHR' }}
    />
  );
}