import {
    type Screen,
    type Style,
    type Color,
    type KeyEvent,
    styleToCellAttrs,
    stringWidth,
    caps,
} from "@termuijs/core";
import { Widget } from "../base/Widget.js";

export interface RangeInputOptions {
    min?: number;
    max?: number;
    step?: number;
    color?: Color;
    showValue?: boolean;
    value?: [number, number];
}

export class RangeInput extends Widget {
    private _label: string;
    private _value: [number, number];
    private _min: number;
    private _max: number;
    private _step: number;
    private _color: Color;
    private _showValue: boolean;
    private _activeThumb: 0 | 1 = 0;
    focusable = true;

    constructor(
        label: string,
        style: Partial<Style> = {},
        opts: RangeInputOptions = {}
    ) {
        super(style);

        this._label = label;
        this._min = opts.min ?? 0;
        this._max = opts.max ?? 100;
        this._step = opts.step ?? 1;
        this._color = opts.color ?? { type: "named", name: "cyan" };
        this._showValue = opts.showValue ?? true;
        this._value = opts.value ?? [this._min, this._max];
    }

    getValue(): [number, number] {
        return [...this._value] as [number, number];
    }

    setValue(thumb: 0 | 1, val: number): void {
        const clamped = Math.max(this._min, Math.min(this._max, val));
        
        if (thumb === 0) {
            this._value[0] = Math.min(clamped, this._value[1]);
        } else {
            this._value[1] = Math.max(clamped, this._value[0]);
        }
        
        this.markDirty();
    }

    setValues(values: [number, number]): void {
        this._value[0] = Math.max(this._min, Math.min(this._max, values[0]));
        this._value[1] = Math.max(this._value[0], Math.min(this._max, values[1]));
        this.markDirty();
    }

    setLabel(label: string): void {
        this._label = label;
        this.markDirty();
    }

    handleKey(event: KeyEvent): void {
        switch (event.key) {
            case "right":
            case "l":
                this.setValue(this._activeThumb, this._value[this._activeThumb] + this._step);
                break;
            case "left":
            case "h":
                this.setValue(this._activeThumb, this._value[this._activeThumb] - this._step);
                break;
            case "tab":
            case "space":
                this._activeThumb = this._activeThumb === 0 ? 1 : 0;
                this.markDirty();
                event.preventDefault();
                break;
        }
    }

    protected _renderSelf(screen: Screen): void {
        const rect = this._getContentRect();
        const { x, y, width, height } = rect;

        if (width <= 0 || height <= 0) return;

        const attrs = styleToCellAttrs(this._style);

        const leftArrow = caps.unicode ? "◄" : "<";
        const rightArrow = caps.unicode ? "►" : ">";

        const valueStr = this._showValue ? ` [${this._value[0]}-${this._value[1]}]` : "";
        const prefix = `${this._label} ${leftArrow} `;
        const suffix = ` ${rightArrow}${valueStr}`;

        const prefixWidth = stringWidth(prefix);
        const suffixWidth = stringWidth(suffix);

        const trackWidth = Math.max(
            0,
            width - prefixWidth - suffixWidth
        );

        const rangeSpan = Math.max(1, this._max - this._min);
        const ratio0 = (this._value[0] - this._min) / rangeSpan;
        const ratio1 = (this._value[1] - this._min) / rangeSpan;

        const pos0 = Math.round(trackWidth * ratio0);
        const pos1 = Math.round(trackWidth * ratio1);

        screen.writeString(x, y, prefix, {
            ...attrs,
            bold: true,
        });

        const trackX = x + prefixWidth;
        const filledChar = caps.unicode ? "█" : "=";
        const emptyChar = caps.unicode ? "░" : "-";
        const thumbChar = caps.unicode ? "●" : "O";

        for (let i = 0; i < trackWidth; i++) {
            let char = emptyChar;
            let isFilled = false;
            let isThumb = false;
            let isActiveThumb = false;

            if (i === pos0) {
                char = thumbChar;
                isThumb = true;
                if (this._activeThumb === 0) isActiveThumb = true;
            } else if (i === pos1) {
                char = thumbChar;
                isThumb = true;
                if (this._activeThumb === 1) isActiveThumb = true;
            } else if (i > pos0 && i < pos1) {
                char = filledChar;
                isFilled = true;
            }

            let fgColor: Color = { type: "named", name: "brightBlack" };
            
            if (isThumb) {
                if (isActiveThumb && this.isFocused) {
                    fgColor = { type: "named", name: "white" };
                } else {
                    fgColor = this._color;
                }
            } else if (isFilled) {
                fgColor = this._color;
            }

            screen.setCell(trackX + i, y, {
                char,
                fg: fgColor,
            });
        }

        screen.writeString(trackX + trackWidth, y, suffix, {
            ...attrs,
            bold: true,
        });
    }
}
