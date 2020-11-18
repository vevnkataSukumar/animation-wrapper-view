
import React from 'react';
import { Animated, GestureResponderEvent, TouchableWithoutFeedback, View } from 'react-native';
import { AnimationTriggerType } from '../../models/AnimationTriggerType';
import { AnimationType } from '../../models/AnimationType';
import { AnimationProps } from "../../utils/Interfaces";

export abstract class BaseAnimationWrapper<P extends AnimationProps, S> extends React.PureComponent<P, S> {

    public abstract startAnimation(): void;
    public abstract stopAnimation(): void;
    public abstract resetAnimation(): void;

    public componentDidMount(): void {
        if (this.props.animationConfig && this.props.animationConfig.triggerType === AnimationTriggerType.ON_LOAD) {
            this.startAnimation();
        }
    }

    public render(): React.ReactNode {
        const content = this.props.children;
        if (this.props.animationConfig.type !== AnimationType.DRAGGABLE) {
            return (
                <TouchableWithoutFeedback onPress={this._onPress}>
                    {this.renderAnimation(content)}
                </TouchableWithoutFeedback>
            );
        } else {
            return (
                <View>
                    {this.renderAnimation(content)}
                </View>
            )
        }
    }

    public componentWillUnmount() {
        this.stopAnimation();
    }

    protected animationFinished = () => {
        if (this.props.onAnimationFinish) {
            this.props.onAnimationFinish();
        }
    }

    protected abstract renderAnimation(content: React.ReactNode): React.ReactNode;
    protected abstract getAnimationStateFromProps(animationConfig: P): S;

    private _onPress = (_: GestureResponderEvent) => {
        const pressParam = this.props.animationConfig;
        if (pressParam && pressParam.triggerType === AnimationTriggerType.ON_CLICK) {
            this.startAnimation();
        }
    };
}
