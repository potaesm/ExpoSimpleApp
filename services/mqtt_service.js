import { Alert } from 'react-native';
import init from './mqtt';

const broker = 'm16.cloudmqtt.com';
const websocketsPort = 36629;
const clientId = 'web_' + parseInt(Math.random() * 100, 10);
const userName = 'uflnspae';
const password = 'n9YQ433nJ-Qe';

init();

class MqttService {
    static instance = null;
    static getInstance() {
        if (!MqttService.instance) {
            MqttService.instance = new MqttService();
        }
        return MqttService.instance;
    }

    constructor() {
        this.client = new Paho.MQTT.Client(broker, websocketsPort, clientId);
        this.client.onMessageArrived = this.onMessageArrived;
        this.callbacks = {};
        this.onSuccessHandler = undefined;
        this.onConnectionLostHandler = undefined;
        this.isConnected = false;
    }

    connectClient = (onSuccessHandler, onConnectionLostHandler) => {
        this.onSuccessHandler = onSuccessHandler;
        this.onConnectionLostHandler = onConnectionLostHandler;
        this.client.onConnectionLost = () => {
            this.isConnected = false;
            onConnectionLostHandler();
        };
        this.client.connect({
            timeout: 10,
            onSuccess: () => {
                this.isConnected = true;
                onSuccessHandler();
            },
            useSSL: true,
            onFailure: this.onFailure,
            reconnect: true,
            keepAliveInterval: 20,
            cleanSession: true,
            userName: userName,
            password: password,
        });
    };

    onFailure = ({ errorMessage }) => {
        console.info(errorMessage);
        this.isConnected = false;
        Alert.alert('Error', 'Could not connect to MQTT', [
            { text: 'TRY AGAIN', onPress: () => this.connectClient(this.onSuccessHandler, this.onConnectionLostHandler) }
        ], { cancelable: false });
    };

    onMessageArrived = (message) => {
        const { payloadString, topic } = message;
        this.callbacks[topic](payloadString);
    };

    publishMessage = (topic, message) => {
        if (!this.isConnected) {
            console.info('not connected');
            return;
        }
        this.client.publish(topic, message);
    };

    subscribe = (topic, callback) => {
        if (!this.isConnected) {
            console.info('not connected');
            return;
        }
        this.callbacks[topic] = callback;
        this.client.subscribe(topic);
    };

    unsubscribe = (topic) => {
        if (!this.isConnected) {
            console.info('not connected');
            return;
        }
        delete this.callbacks[topic];
        this.client.unsubscribe(topic);
    };
}

export default MqttService.getInstance();