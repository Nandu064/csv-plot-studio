"use client";

import { Suspense, useCallback } from "react";
import dynamic from "next/dynamic";
import type { PlotParams } from "react-plotly.js";

const Plot = dynamic(() => import("react-plotly.js"), {
  ssr: false,
});

export interface PlotlyChartProps extends PlotParams {
  onPointClick?: (row: string[]) => void;
}

function PlotlyChartInner({ onPointClick, ...props }: PlotlyChartProps) {
  const handleClick = useCallback(
    (event: any) => {
      // Plotly passes event.points[0].customdata with the full row
      const customdata = event?.points?.[0]?.customdata;
      if (customdata && Array.isArray(customdata) && onPointClick) {
        onPointClick(customdata);
      }
    },
    [onPointClick]
  );

  return (
    <Plot
      {...props}
      onClick={handleClick}
      config={{
        displaylogo: false,
        responsive: true,
        ...props.config,
      }}
      useResizeHandler
      style={{ width: "100%", height: "100%", ...props.style }}
    />
  );
}

export function PlotlyChart(props: PlotlyChartProps) {
  return (
    <Suspense
      fallback={
        <div style={{ padding: "2rem", textAlign: "center", color: "#888" }}>
          Loading chart...
        </div>
      }
    >
      <PlotlyChartInner {...props} />
    </Suspense>
  );
}
