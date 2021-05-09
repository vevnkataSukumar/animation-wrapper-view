import { Animated, Easing, ToastAndroid, View } from 'react-native';
import React from 'react';
import { BaseAnimationWrapper } from './BaseAnimationWrapper';

import { ScaleAnimationConfig } from '../../data/ScaleAnimationConfig';
import { AnimationWrapperProps } from '../../Types';
import getEasingFunction from "../Utils";

interface ScaleAnimationState {
    scale: Animated.Value;
}

export interface ScaleAnimationProps extends AnimationWrapperProps {
    animationConfig: ScaleAnimationConfig ;
}

export class ScaleAnimationWrapper extends BaseAnimationWrapper<ScaleAnimationProps, ScaleAnimationState> {
    private _scaleAnimation: Animated.CompositeAnimation;

    public constructor(props: ScaleAnimationProps) {
        super(props);
        this.state = this.getAnimationStateFromProps(props);

        const { animationConfig } = this.props;
        this.state.scale.setValue(animationConfig.fromScale ?? 1);
        this._scaleAnimation = Animated.timing(this.state.scale, {
            duration: animationConfig.animationDuration,
            toValue: animationConfig.toScale,
            easing: getEasingFunction(animationConfig.interpolationDef),
            useNativeDriver: false
        });
    }

    public UNSAFE_componentWillReceiveProps(nextProps: ScaleAnimationProps, _nextContext: any): void {
        if (nextProps !== this.props) {
            const nextState: ScaleAnimationState | null = this.getAnimationStateFromProps(nextProps);
            if (null != nextState) {
                this.setState(nextState);
            }
        }
    }

    public startAnimation(): void {
        this.animationStarted();
        this._scaleAnimation.reset();
        this._scaleAnimation.start(() => { this.animationFinished() });
    }

    public stopAnimation(): void {
        this._scaleAnimation.stop();
    }

    public resetAnimation(): void {
        this.stopAnimation();
        this.state.scale.setValue(this.props.animationConfig.fromScale ?? 1);
    }

    public finishAnimation = () => {
        this.stopAnimation();
        this.state.scale.setValue(this.props.animationConfig.toScale);
    }

    protected renderAnimation(content: React.ReactNode): React.ReactNode {
        const scale = this.state.scale;

        return (
            <Animated.View
                style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    transform: [
                        { scale }
                    ]
                }}>
                {content}
            </Animated.View>
        );
    }

    protected getAnimationStateFromProps(props: ScaleAnimationProps): ScaleAnimationState {
        return {
            scale: new Animated.Value(props.animationConfig.fromScale ?? 1)
        };
    }
}
