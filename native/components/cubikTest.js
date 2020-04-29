import React, { Component } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { WebGLView } from "react-native-webgl";
import THREE from "../theree";

export default class App extends Component {
    onContextCreate = gl => {
        const rngl = gl.getExtension("RN");

        const init = () => {
        };

        const animate = () => {
            gl.flush();
            rngl.endFrame();
        };

        init();
        animate();
    };

    render() {
        return (
            <View
                style={{flex: 1}}
                {...this._panResponder.panHandlers} // Handle camera
            >
                <WebGLView
                    style={StyleSheet.absoluteFillObject}
                    onContextCreate={this.onContextCreate}
                />
            </View>
        );
    }
}