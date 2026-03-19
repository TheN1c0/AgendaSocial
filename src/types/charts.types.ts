export interface DonutChartProps {
  data: number[]
  labels: string[]
  colors?: string[]
  title?: string
  subtitle?: string
  cutout?: string
  height?: number | string
}

export interface BarDataset {
  label: string
  data: number[]
  color?: string
}

export interface BarChartProps {
  datasets: BarDataset[]
  labels: string[]
  title?: string
  subtitle?: string
  showToggle?: boolean
  periodo?: 'semana' | 'mes'
  onPeriodoChange?: (p: 'semana' | 'mes') => void
  height?: number | string
}

export interface LineChartProps {
  data: number[]
  labels: string[]
  title?: string
  subtitle?: string
  color?: string
  filled?: boolean
  showToggle?: boolean
  periodo?: 'semana' | 'mes'
  onPeriodoChange?: (p: 'semana' | 'mes') => void
  height?: number | string
}

export interface HorizontalBarChartProps {
  data: number[]
  labels: string[]
  title?: string
  subtitle?: string
  colors?: string[]
  height?: number | string
}

export const CHART_COLORS = {
  primary: '#C97A8A',
  secondary: '#E8A0B0',
  light: '#F7E8EC',
  blue: '#378ADD',
  gray: '#888780',
  amber: '#BA7517',
  green: '#1D9E75',
  red: '#E24B4A',
};
