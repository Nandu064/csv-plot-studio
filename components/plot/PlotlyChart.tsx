"use client";

import { Suspense, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import type { PlotParams } from "react-plotly.js";
import type * as Plotly from "plotly.js-dist-min";
import { ChartLoader } from "./ChartLoader";

const Plot = dynamic(() => import("react-plotly.js"), {
  ssr: false,
  loading: () => <ChartLoader />,
});

export interface PlotlyChartProps extends PlotParams {
  onPointClick?: (row: string[]) => void;
  pointCount?: number;
}

function PlotlyChartInner({ onPointClick, ...props }: PlotlyChartProps) {
  const plotElementRef = useRef<HTMLElement | null>(null);

  // Callback when Plotly plot is initialized
  const handleInitialized = useCallback(
    (_figure: unknown, graphDiv: Readonly<HTMLElement>) => {
      plotElementRef.current = graphDiv as HTMLElement;

      if (!onPointClick) {
        return;
      }

      const handlePlotlyClick = (event: Readonly<Plotly.PlotMouseEvent>) => {
        // Only handle clicks on actual data points, not the container
        if (!event?.points || event.points.length === 0) {
          return;
        }

        // Plotly passes event.points[0].customdata with the full row
        const point = event.points[0];
        const customdata = point?.customdata;

        if (customdata && Array.isArray(customdata)) {
          onPointClick(customdata as string[]);
        }
      };
      // Cast to any because Plotly adds the 'on' method to the HTMLElement
      (
        graphDiv as unknown as {
          on: (
            event: string,
            handler: (data: Plotly.PlotMouseEvent) => void
          ) => void;
        }
      ).on("plotly_click", handlePlotlyClick);
    },
    [onPointClick]
  );

  return (
    <Plot
      {...props}
      onInitialized={handleInitialized}
      config={{
        displaylogo: false,
        responsive: true,
        ...props.config,
      }}
      useResizeHandler
      style={{ width: "100%", height: "100%" }}
    />
  );
}

export function PlotlyChart(props: PlotlyChartProps) {
  const { pointCount, ...plotProps } = props;

  return (
    <Suspense fallback={<ChartLoader pointCount={pointCount} />}>
      <PlotlyChartInner {...plotProps} />
    </Suspense>
  );
}
