/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';
import OneSignal from 'react-native-onesignal';
import { onesignal_app_id } from "modules/constants"

//OneSignal Init Code
OneSignal.setLogLevel(6, 0);
OneSignal.setAppId(onesignal_app_id);
//END OneSignal Init Code

AppRegistry.registerComponent(appName, () => App);
