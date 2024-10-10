import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  ChartConfiguration,
  ChartConfigurationCustomTypesPerDataset,
  ChartType,
  Colors,
  DefaultDataPoint,
  Legend,
  LineController,
  LineElement,
  LinearScale,
  PointElement,
  TimeScale,
  Title,
  Tooltip,
  DoughnutController,
  ArcElement,
} from "chart.js";
import { useEffect, useRef } from "react";

import styles from "./chart-styles.module.css";

type UseChartProps<
  TType extends ChartType = ChartType,
  TData = DefaultDataPoint<TType>,
  TLabel = unknown,
> = {
  config:
    | ChartConfiguration<TType, TData, TLabel>
    | ChartConfigurationCustomTypesPerDataset<TType, TData, TLabel>;
  height?: string;
};

// Global registration of commonly used chart components/defaults
Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  BarElement,
  BarController,
  DoughnutController,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  Colors,
);

const defaultChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { position: "bottom" as const } },
};

/** Initialize a canvas with a chartjs chart on it */
export function useChartCanvas({ config, height }: UseChartProps) {
  const chartRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvasContext = chartRef.current?.getContext("2d");
    if (!canvasContext) return () => {}; // No cleanup needed
    const chart = new Chart(canvasContext, {
      ...config,
      options: config.options ?? defaultChartOptions,
    });

    // Cleanup the chart on unmount
    return () => {
      chart.destroy();
    };
  }, [config]);

  return (
    <div className={styles.chartContainer}>
      <canvas ref={chartRef} style={{ height }} />
    </div>
  );
}
