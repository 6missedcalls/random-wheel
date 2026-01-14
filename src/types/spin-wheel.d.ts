declare module 'spin-wheel' {
  export interface WheelItem {
    label?: string;
    backgroundColor?: string;
    labelColor?: string;
    weight?: number;
    image?: string;
  }

  export interface WheelOptions {
    items?: WheelItem[];
    borderWidth?: number;
    borderColor?: string;
    lineWidth?: number;
    lineColor?: string;
    radius?: number;
    itemBackgroundColors?: string[];
    itemLabelColors?: string[];
    itemLabelRadius?: number;
    itemLabelRadiusMax?: number;
    itemLabelRotation?: number;
    itemLabelAlign?: string;
    itemLabelFont?: string;
    itemLabelFontSizeMax?: number;
    rotationSpeedMax?: number;
    rotationResistance?: number;
    pointerAngle?: number;
    overlayImage?: string;
    isInteractive?: boolean;
  }

  export class Wheel {
    constructor(container: HTMLElement, options?: WheelOptions);
    items: WheelItem[];
    rotation: number;
    onSpin?: () => void;
    onCurrentIndexChange?: (event: { currentIndex: number }) => void;
    onRest?: (event: { currentIndex: number }) => void;
    spin(rotationSpeed?: number): void;
    spinToItem(itemIndex: number, duration?: number, spinToCenter?: boolean, numberOfRevolutions?: number, direction?: number, easingFunction?: (t: number) => number): void;
    stop(): void;
    remove(): void;
  }
}
