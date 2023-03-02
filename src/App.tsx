import { NavigationContainer } from "@react-navigation/native"
import { appColors } from "assets"
import React from "react"
import { LogBox, SafeAreaView, StatusBar } from "react-native"
import rootSaga from 'reduxsaga/saga'
import {store, sagaMiddleware} from 'reduxsaga/store'
import { Provider } from "react-redux"
import { PersistGate } from "redux-persist/integration/react"
import { persistStore } from "redux-persist"
import { SplashNavigator } from "screens"
import Toast from "react-native-toast-message"

sagaMiddleware.run(rootSaga)
LogBox.ignoreLogs([
    'ViewPropTypes will be removed from React Native.',
    '`new NativeEventEmitter()`'
])


export default () => {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistStore(store)}>
                <NavigationContainer>
                    <SplashNavigator/>
                </NavigationContainer>
            </PersistGate>
            <Toast
                position='bottom' />
        </Provider>
    )
}
