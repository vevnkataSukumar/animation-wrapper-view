import React, { Component } from 'react';
import { RippleAnimationWrapper } from './components/RippleAnimationWrapper';
import { ScaleAnimationWrapper } from './components/ScaleAnimationWrapper';
import { BounceAnimationWrapper } from './components/BounceAnimationWrapper';
import { AnimationType } from './models/AnimationType';
import { BaseAnimation } from './models/BaseAnimation';
import { DraggableAnimationWrapper } from './components/DraggableAnimationWrapper';
import { WrapperComponent } from "./Types";
import { AnimationProps } from "./Interfaces";
import { FadeAnimationWrapper } from './components/FadeAnimationWrapper';
import { SlideAnimationWrapper } from './components/SlideAnimationWrapper';
import { WiggleAnimationWrapper } from './components/WiggleAnimationWrapper';
import { BaseAnimationWrapper } from './components/BaseAnimationWrapper';

export abstract class AnimationWrapperView extends React.PureComponent<AnimationProps> {
    private animationWrapper: WrapperComponent | null;
    private animatorRef?: BaseAnimationWrapper<AnimationProps, {}> | null;

    protected constructor(props: AnimationProps) {
        super(props);
        this.animationWrapper = AnimationWrapperView._animationWrapperGenerator(props.animationConfig);
    }

    public UNSAFE_componentWillReceiveProps(nextProps: AnimationProps): void {
        if (this.props.animationConfig !== nextProps.animationConfig) {
            this.animationWrapper = AnimationWrapperView._animationWrapperGenerator(nextProps.animationConfig);
        }
    }

    public triggerAnimation() {
        this.animatorRef?.triggerAnimation();
    }

    public render(): React.ReactNode | undefined {
        this._assertChildType();
        const { children, onAnimationFinish } = this.props;
        const animationConfig = this.props.animationConfig;
        if (this.animationWrapper && children) {
            return (
                <this.animationWrapper
                    ref={this._setRef}
                    animationConfig={animationConfig as any}
                    onAnimationFinish={onAnimationFinish}>
                    {children}
                </this.animationWrapper>
            );
        }

        return;
    }

    private _setRef = (ref: Component<AnimationProps, {}, {}>) => {
        this.animatorRef = ref as BaseAnimationWrapper<AnimationProps, {}>;
    }

    private static _animationWrapperGenerator(animationConfig: BaseAnimation): WrapperComponent {
        switch (animationConfig.type) {
            case AnimationType.BOUNCE:
                return BounceAnimationWrapper;
            case AnimationType.RIPPLE:
                return RippleAnimationWrapper;
            case AnimationType.SCALE:
                return ScaleAnimationWrapper;
            case AnimationType.DRAGGABLE:
                return DraggableAnimationWrapper;
            case AnimationType.FADE_IN:
            case AnimationType.FADE_OUT:
                return FadeAnimationWrapper;
            case AnimationType.SLIDE_IN:
            case AnimationType.SLIDE_OUT:
                return SlideAnimationWrapper;
            case AnimationType.WIGGLE:
                return WiggleAnimationWrapper;
        }
    }

    private _assertChildType = (): void => {
        if (React.Children.count(this.props.children) !== 1) {
            throw new Error('Only one child can be passed to AnimationWrapperView');
        }
    };
}
