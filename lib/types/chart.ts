export type ChartType = 'scatter' | 'line' | 'bar' | 'histogram' | 'box' | 'violin' | 'scatter3d' | 'surface';

export interface ChartConfig {
  id: string;
  type: ChartType;
  title: string;
  xColumn: string;
  yColumns: string[];
  zColumn?: string;
  colorByColumn?: string;
  samplingEnabled: boolean;
  maxPoints?: number;
  datasetSignature: string;
}

export interface ChartSpec extends ChartConfig {
  createdAt: number;
  updatedAt: number;
}
