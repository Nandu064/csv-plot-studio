declare module 'react-plotly.js' {
  import * as Plotly from 'plotly.js-dist-min';
  import * as React from 'react';

  export interface PlotParams {
    data: Plotly.Data[];
    layout?: Partial<Plotly.Layout>;
    config?: Partial<Plotly.Config>;
    frames?: Plotly.Frame[];
    style?: React.CSSProperties;
    className?: string;
    useResizeHandler?: boolean;
    onInitialized?: (figure: Readonly<Plotly.Figure>, graphDiv: Readonly<HTMLElement>) => void;
    onUpdate?: (figure: Readonly<Plotly.Figure>, graphDiv: Readonly<HTMLElement>) => void;
    onPurge?: (figure: Readonly<Plotly.Figure>, graphDiv: Readonly<HTMLElement>) => void;
    onError?: (err: Readonly<Error>) => void;
    onHover?: (event: Readonly<Plotly.PlotHoverEvent>) => void;
    onUnhover?: (event: Readonly<Plotly.PlotMouseEvent>) => void;
    onClick?: (event: Readonly<Plotly.PlotMouseEvent>) => void;
    onSelected?: (event: Readonly<Plotly.PlotSelectionEvent>) => void;
    onRelayout?: (event: Readonly<Plotly.PlotRelayoutEvent>) => void;
    onSliderChange?: (event: Readonly<Plotly.SliderChangeEvent>) => void;
    onSliderEnd?: (event: Readonly<Plotly.SliderEndEvent>) => void;
    onSliderStart?: (event: Readonly<Plotly.SliderStartEvent>) => void;
    onAnimated?: () => void;
    onAnimatingFrame?: (event: Readonly<Plotly.FrameAnimationEvent>) => void;
    onAnimationInterrupted?: () => void;
    onAutoSize?: () => void;
    onDeselect?: () => void;
    onDoubleClick?: () => void;
    onRedraw?: () => void;
    onWebGlContextLost?: () => void;
    divId?: string;
    revision?: number;
    debug?: boolean;
  }

  export default class PlotlyComponent extends React.Component<PlotParams> {}
}
