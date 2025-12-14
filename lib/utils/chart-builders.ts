import type { ParsedCSV, ColumnMetadata } from '../types/csv';
import type { ChartConfig } from '../types/chart';
import type * as Plotly from 'plotly.js-dist-min';
import { getChartColor, getTopCategories, isNumericColumn } from '../utils/chart-colors';

interface ChartData {
  data: Partial<Plotly.PlotData>[];
  layout: Partial<Plotly.Layout>;
}

export function buildChartData(
  dataset: ParsedCSV,
  config: ChartConfig,
  filteredRows: string[][]
): ChartData {
  switch (config.type) {
    case 'scatter':
      return buildScatter(dataset, config, filteredRows);
    case 'line':
      return buildLine(dataset, config, filteredRows);
    case 'bar':
      return buildBar(dataset, config, filteredRows);
    case 'histogram':
      return buildHistogram(dataset, config, filteredRows);
    case 'box':
      return buildBox(dataset, config, filteredRows);
    case 'violin':
      return buildViolin(dataset, config, filteredRows);
    case 'scatter3d':
      return buildScatter3D(dataset, config, filteredRows);
    case 'surface':
      return buildSurface(dataset, config, filteredRows);
    default:
      return { data: [], layout: { title: { text: 'Unknown chart type' } } };
  }
}

function buildScatter(dataset: ParsedCSV, config: ChartConfig, rows: string[][]): ChartData {
  const xIndex = dataset.headers.indexOf(config.xColumn);
  const yIndex = config.yColumns.length > 0 ? dataset.headers.indexOf(config.yColumns[0]) : -1;
  
  if (xIndex === -1 || yIndex === -1) {
    return { data: [], layout: { title: { text: 'Select X and Y columns' } } };
  }
  
  const colorByIndex = config.colorByColumn ? dataset.headers.indexOf(config.colorByColumn) : -1;
  const colorByMeta = colorByIndex !== -1 ? dataset.columns[colorByIndex] : undefined;
  
  // Numeric colorBy => use colorscale
  if (colorByIndex !== -1 && isNumericColumn(colorByMeta)) {
    const xData = rows.map(r => r[xIndex]);
    const yData = rows.map(r => r[yIndex]);
    const colorData = rows.map(r => Number(r[colorByIndex]));
    
    return {
      data: [{
        type: 'scatter',
        mode: 'markers',
        x: xData,
        y: yData,
        marker: {
          color: colorData,
          colorscale: 'Viridis',
          showscale: true,
          colorbar: { title: { text: config.colorByColumn } },
          size: 8,
        },
        customdata: rows,
        hovertemplate: `<b>${config.xColumn}</b>: %{x}<br><b>${config.yColumns[0]}</b>: %{y}<br><b>${config.colorByColumn}</b>: %{marker.color}<extra></extra>`,
      }],
      layout: baseLayout(config, config.xColumn, config.yColumns[0]),
    };
  }
  
  // Categorical colorBy => split into traces
  if (colorByIndex !== -1) {
    const categories = getTopCategories(rows, colorByIndex, 12);
    const traces: Partial<Plotly.PlotData>[] = [];
    
    categories.forEach((cat, i) => {
      const subset = rows.filter(r => String(r[colorByIndex]) === cat);
      traces.push({
        type: 'scatter',
        mode: 'markers',
        name: cat,
        x: subset.map(r => r[xIndex]),
        y: subset.map(r => r[yIndex]),
        marker: { color: getChartColor(i, true), size: 8 },
        customdata: subset,
        hovertemplate: `<b>${config.xColumn}</b>: %{x}<br><b>${config.yColumns[0]}</b>: %{y}<br><b>${config.colorByColumn}</b>: ${cat}<extra></extra>`,
      });
    });
    
    // Add "Other" category
    const other = rows.filter(r => !categories.includes(String(r[colorByIndex])));
    if (other.length > 0) {
      traces.push({
        type: 'scatter',
        mode: 'markers',
        name: 'Other',
        x: other.map(r => r[xIndex]),
        y: other.map(r => r[yIndex]),
        marker: { color: '#737373', size: 8 },
        customdata: other,
        hovertemplate: `<b>${config.xColumn}</b>: %{x}<br><b>${config.yColumns[0]}</b>: %{y}<extra></extra>`,
      });
    }
    
    return { data: traces, layout: baseLayout(config, config.xColumn, config.yColumns[0]) };
  }
  
  // Default single series
  const xData = rows.map(r => r[xIndex]);
  const yData = rows.map(r => r[yIndex]);
  
  return {
    data: [{
      type: 'scatter',
      mode: 'markers',
      x: xData,
      y: yData,
      marker: { color: getChartColor(0), size: 8 },
      customdata: rows,
      hovertemplate: `<b>${config.xColumn}</b>: %{x}<br><b>${config.yColumns[0]}</b>: %{y}<extra></extra>`,
    }],
    layout: baseLayout(config, config.xColumn, config.yColumns[0]),
  };
}

function buildLine(dataset: ParsedCSV, config: ChartConfig, rows: string[][]): ChartData {
  const xIndex = dataset.headers.indexOf(config.xColumn);
  const xData = rows.map(r => r[xIndex]);
  const traces: Partial<Plotly.PlotData>[] = [];
  
  config.yColumns.forEach((yCol, idx) => {
    const yIndex = dataset.headers.indexOf(yCol);
    if (yIndex === -1) return;
    
    const yData = rows.map(r => r[yIndex]);
    traces.push({
      type: 'scatter',
      mode: 'lines',
      name: yCol,
      x: xData,
      y: yData,
      line: { color: getChartColor(idx, true), width: 2 },
      customdata: rows,
      hovertemplate: `<b>${config.xColumn}</b>: %{x}<br><b>${yCol}</b>: %{y}<extra></extra>`,
    });
  });
  
  return {
    data: traces,
    layout: baseLayout(config, config.xColumn, config.yColumns[0] || ''),
  };
}

function buildBar(dataset: ParsedCSV, config: ChartConfig, rows: string[][]): ChartData {
  const xIndex = dataset.headers.indexOf(config.xColumn);
  const xData = rows.map(r => r[xIndex]);
  const traces: Partial<Plotly.PlotData>[] = [];
  
  config.yColumns.forEach((yCol, idx) => {
    const yIndex = dataset.headers.indexOf(yCol);
    if (yIndex === -1) return;
    
    const yData = rows.map(r => r[yIndex]);
    traces.push({
      type: 'bar',
      name: yCol,
      x: xData,
      y: yData,
      marker: { color: getChartColor(idx, true) },
      customdata: rows,
      hovertemplate: `<b>${config.xColumn}</b>: %{x}<br><b>${yCol}</b>: %{y}<extra></extra>`,
    });
  });
  
  return {
    data: traces,
    layout: baseLayout(config, config.xColumn, config.yColumns[0] || ''),
  };
}

function buildHistogram(dataset: ParsedCSV, config: ChartConfig, rows: string[][]): ChartData {
  const xIndex = dataset.headers.indexOf(config.xColumn);
  const xData = rows.map(r => r[xIndex]);
  
  return {
    data: [{
      type: 'histogram',
      x: xData,
      marker: { color: getChartColor(0, true) },
      customdata: rows,
      hovertemplate: `<b>${config.xColumn}</b>: %{x}<br><b>Count</b>: %{y}<extra></extra>`,
    }],
    layout: baseLayout(config, config.xColumn, 'Count'),
  };
}

function buildBox(dataset: ParsedCSV, config: ChartConfig, rows: string[][]): ChartData {
  const traces: Partial<Plotly.PlotData>[] = [];
  
  config.yColumns.forEach((yCol, idx) => {
    const yIndex = dataset.headers.indexOf(yCol);
    if (yIndex === -1) return;
    
    const yData = rows.map(r => r[yIndex]);
    traces.push({
      type: 'box',
      name: yCol,
      y: yData,
      marker: { color: getChartColor(idx, true) },
      customdata: rows,
      hovertemplate: `<b>${yCol}</b>: %{y}<extra></extra>`,
    });
  });
  
  return {
    data: traces,
    layout: baseLayout(config, config.xColumn, config.yColumns[0] || ''),
  };
}

function buildViolin(dataset: ParsedCSV, config: ChartConfig, rows: string[][]): ChartData {
  const xIndex = config.xColumn ? dataset.headers.indexOf(config.xColumn) : -1;
  const yIndex = config.yColumns.length > 0 ? dataset.headers.indexOf(config.yColumns[0]) : -1;
  
  if (yIndex === -1) {
    return { data: [], layout: { title: { text: 'Select Y column for violin plot' } } };
  }
  
  const colorByIndex = config.colorByColumn ? dataset.headers.indexOf(config.colorByColumn) : -1;
  
  // If colorBy is specified, split violins by category
  if (colorByIndex !== -1) {
    const categories = getTopCategories(rows, colorByIndex, 8);
    const traces: Partial<Plotly.PlotData>[] = [];
    
    categories.forEach((cat, i) => {
      const subset = rows.filter(r => String(r[colorByIndex]) === cat);
      const yData = subset.map(r => r[yIndex]);
      const xData = xIndex !== -1 ? subset.map(r => r[xIndex]) : undefined;
      
      traces.push({
        type: 'violin',
        name: cat,
        y: yData,
        x: xData,
        line: { color: getChartColor(i, true) },
        fillcolor: getChartColor(i, false),
        opacity: 0.7,
        customdata: subset,
        hovertemplate: `<b>${config.yColumns[0]}</b>: %{y}<br><b>${config.colorByColumn}</b>: ${cat}<extra></extra>`,
      } as Partial<Plotly.PlotData>);
    });
    
    return {
      data: traces,
      layout: baseLayout(config, config.xColumn || '', config.yColumns[0]),
    };
  }
  
  // Single violin
  const yData = rows.map(r => r[yIndex]);
  const xData = xIndex !== -1 ? rows.map(r => r[xIndex]) : undefined;
  
  return {
    data: [{
      type: 'violin',
      name: config.yColumns[0],
      y: yData,
      x: xData,
      line: { color: getChartColor(0, true) },
      fillcolor: getChartColor(0, false),
      opacity: 0.7,
      customdata: rows,
      hovertemplate: `<b>${config.yColumns[0]}</b>: %{y}<extra></extra>`,
    } as Partial<Plotly.PlotData>],
    layout: baseLayout(config, config.xColumn || '', config.yColumns[0]),
  };
}

function buildScatter3D(dataset: ParsedCSV, config: ChartConfig, rows: string[][]): ChartData {
  const xIndex = dataset.headers.indexOf(config.xColumn);
  const yIndex = config.yColumns.length > 0 ? dataset.headers.indexOf(config.yColumns[0]) : -1;
  const zIndex = config.zColumn ? dataset.headers.indexOf(config.zColumn) : -1;
  
  if (xIndex === -1 || yIndex === -1 || zIndex === -1) {
    return { data: [], layout: { title: { text: 'Select X, Y, and Z columns' } } };
  }
  
  const xData = rows.map(r => r[xIndex]);
  const yData = rows.map(r => r[yIndex]);
  const zData = rows.map(r => r[zIndex]);
  
  return {
    data: [{
      type: 'scatter3d',
      mode: 'markers',
      x: xData,
      y: yData,
      z: zData,
      marker: { color: getChartColor(0, true), size: 3 },
      customdata: rows,
      hovertemplate: `<b>${config.xColumn}</b>: %{x}<br><b>${config.yColumns[0]}</b>: %{y}<br><b>${config.zColumn}</b>: %{z}<extra></extra>`,
    }],
    layout: baseLayout(config, config.xColumn, config.yColumns[0]),
  };
}

function buildSurface(dataset: ParsedCSV, config: ChartConfig, rows: string[][]): ChartData {
  const zIndex = config.zColumn ? dataset.headers.indexOf(config.zColumn) : -1;
  
  if (zIndex === -1) {
    return { data: [], layout: { title: { text: 'Select Z column for surface plot' } } };
  }
  
  // Simplified surface - requires 2D grid
  const zData = rows.map(r => [parseFloat(r[zIndex])]);
  
  return {
    data: [{
      type: 'surface',
      z: zData,
      colorscale: 'Viridis',
    }],
    layout: baseLayout(config, config.xColumn, config.yColumns[0] || ''),
  };
}

function baseLayout(config: ChartConfig, xTitle: string, yTitle: string): Partial<Plotly.Layout> {
  return {
    title: config.title ? { text: config.title, font: { size: 18, color: '#171717' } } : undefined,
    paper_bgcolor: '#ffffff',
    plot_bgcolor: '#fafafa',
    font: { color: '#171717', family: 'Inter, system-ui, sans-serif' },
    xaxis: {
      title: { text: xTitle },
      gridcolor: '#e5e5e5',
      zerolinecolor: '#d4d4d4',
      linecolor: '#e5e5e5',
    },
    yaxis: {
      title: { text: yTitle },
      gridcolor: '#e5e5e5',
      zerolinecolor: '#d4d4d4',
      linecolor: '#e5e5e5',
    },
    margin: { l: 60, r: 40, t: 60, b: 60 },
    showlegend: true,
    legend: {
      bgcolor: '#ffffff',
      bordercolor: '#e5e5e5',
      borderwidth: 1,
    },
  };
}
