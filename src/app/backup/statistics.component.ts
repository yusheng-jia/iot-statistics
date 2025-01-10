import { Component } from '@angular/core';
import { EChartsOption } from 'echarts';
import * as echarts from 'echarts';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [
    NgxEchartsDirective, 
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    CommonModule
  ],
  providers: [provideEchartsCore( {echarts: () => import('echarts')})],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.scss'
})
export class StatisticsComponent {
  periods = ['1天', '1周', '1月', '1年'];
  barChartOptions: EChartsOption = {};
  roseChartOptions: EChartsOption = {};
  startDate: Date = new Date();
  endDate: Date = new Date();

  // 模拟数据
  data = {
    '1天': [
      { name: 'Auto Flush', value: 85 },
      { name: 'Eco Flush', value: 80 },
      { name: 'Echo Flush', value: 75 },
      { name: 'Front Wash', value: 70 },
      { name: 'Rear Wash', value: 65 },
      { name: 'Oscillating Spray', value: 60 },
      { name: 'Pulsating Spray ', value: 55 },
      { name: 'Air Dryer ', value: 50 },
      { name: 'Deodorizer', value: 45 },
      { name: 'Night Light', value: 40 },
      { name: 'Auto Lid Open ', value: 35 },
      { name: 'Auto Seat Close', value: 30 },
      { name: 'Temperature Control', value: 25 },
      { name: 'Water Pressure Control ', value: 20 },
      { name: 'Full Flush', value: 15 },
    ],
    '1周': [
      { name: 'Auto Flush', value: 150 },
      { name: 'Eco Flush', value: 140 },
      { name: 'Rear Setting', value: 135 },
      { name: 'Echo Flush', value: 130 },
      { name: 'Front Wash', value: 125 },
      { name: 'Rear Wash', value: 120 },
      { name: 'Oscillating Spray', value: 115 },
      { name: 'Pulsating Spray ', value: 110 },
      { name: 'Air Dryer ', value: 105 },
      { name: 'Deodorizer', value: 100 },
      { name: 'Night Light', value: 95 },
      { name: 'Auto Lid Open ', value: 90 },
      { name: 'Auto Seat Close', value: 85 },
      { name: 'Temperature Control', value: 80 },
      { name: 'Water Pressure Control ', value: 75 },
    ],
    '1月': [
      { name: 'Auto Flush', value: 600 },
      { name: 'Eco Flush', value: 580 },
      { name: 'Front Wash', value: 560 },
      { name: 'Rear Wash', value: 540 },
      { name: 'Oscillating Spray', value: 520 },
      { name: 'Pulsating Spray ', value: 500 },
      { name: 'Air Dryer ', value: 480 },
      { name: 'Deodorizer', value: 460 },
      { name: 'Night Light', value: 440 },
      { name: 'Auto Lid Open ', value: 420 },
      { name: 'Auto Seat Close', value: 400 },
      { name: 'Temperature Control', value: 380 },
      { name: 'Water Pressure Control ', value: 360 },
      { name: 'Full Flush', value: 340 },
      { name: 'Rear Setting', value: 320 },
    ],
    '1年': [
      { name: 'Auto Flush', value: 6800 },
      { name: 'Eco Flush', value: 6600 },
      { name: 'Echo Flush', value: 6400 },
      { name: 'Heated Seat', value: 6200 },
      { name: 'Front Wash', value: 6000 },
      { name: 'Rear Wash', value: 5800 },
      { name: 'Oscillating Spray', value: 5600 },
      { name: 'Pulsating Spray ', value: 5400 },
      { name: 'Air Dryer ', value: 5200 },
      { name: 'Deodorizer', value: 5000 },
      { name: 'Night Light', value: 4800 },
      { name: 'Auto Lid Open ', value: 4600 },
      { name: 'Auto Seat Close', value: 4400 },
      { name: 'Temperature Control', value: 4200 },
      { name: 'Water Pressure Control ', value: 4000 },
    ],
  };

  products = [
    'NUMI2.0 INTELLIGENT TOILET', 
    'Karing2.0 Intelligent Toilet', 
    'C3-500 Smart Seat', 
    'Grooming Mirrored Cabinet', 
    'Verdera Display Mirrored Cabinet', 
    'Underscore bathroom heater',
    'Karess Whirlpool'
  ];

  selectedProduct = 'NUMI2.0 INTELLIGENT TOILET';  // 默认选择A产品
  selectedPeriod = '1天';

  ngOnInit() {
    this.updateChart('1天'); // 默认显示 1 天的数据
  }

  onPeriodChange() {
    this.updateChart(this.selectedPeriod);
  }

  updateChart(period: string) {
    const seriesData = this.data[period as keyof typeof this.data].slice(0, 15);
    this.barChartOptions = {
      title: { 
        text: `[${this.selectedProduct}] Top 15 功能统计 (${period})`,
        left: 'center',
        top: 20,
        textStyle: {
          fontSize: 16,
          fontWeight: 'bold'
        }
      },
      tooltip: { 
        trigger: 'axis',
        axisPointer: { 
          type: 'shadow',
          shadowStyle: {
            color: 'rgba(0,0,0,0.05)'
          }
        },
        formatter: '{b}: {c}次'
      },
      grid: {
        left: '5%',
        right: '5%',
        bottom: '15%',
        top: '15%',
        containLabel: true
      },
      xAxis: { 
        type: 'category',
        data: seriesData.map((item: {name: string}) => item.name),
        axisLabel: {
          interval: 0,
          rotate: 30,
          fontSize: 12,
          color: '#666'
        },
        axisTick: { show: false },
        axisLine: {
          lineStyle: { color: '#ddd' }
        }
      },
      yAxis: { 
        type: 'value',
        nameGap: 30,
        splitLine: {
          lineStyle: {
            type: 'dashed',
            color: '#eee'
          }
        },
        axisLabel: {
          color: '#666'
        }
      },
      series: [
        {
          data: seriesData.map((item: {value: number, name: string}) => ({
            value: item.value,
            name: item.name,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#83bff6' },
                { offset: 0.5, color: '#42A5F5' },
                { offset: 1, color: '#2196F3' }
              ])
            },
            emphasis: {
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#2196F3' },
                  { offset: 0.7, color: '#42A5F5' },
                  { offset: 1, color: '#83bff6' }
                ])
              }
            }
          })),
          type: 'bar',
          barWidth: '40%',
          showBackground: true,
          backgroundStyle: {
            color: 'rgba(180, 180, 180, 0.1)'
          },
          label: {
            show: true,
            position: 'top',
            fontSize: 12,
            color: '#666'
          }
        }
      ]
    };

    this.roseChartOptions = {
      title: { 
        text: `[${this.selectedProduct}] Top 15 功能统计 (${period})`,
        left: 'center',
        top: 20,
        textStyle: {
          fontSize: 16,
          fontWeight: 'bold'
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c}次 ({d}%)'
      },
      legend: {
        top: '90%',
        type: 'scroll',
        orient: 'horizontal'
      },
      series: [
        {
          name: '功能使用',
          type: 'pie',
          roseType: 'area',
          radius: ['20%', '70%'],
          center: ['50%', '50%'],
          itemStyle: {
            borderRadius: 4
          },
          label: {
            show: true,
            formatter: '{b}: {c}'
          },
          data: seriesData.map(item => ({
            name: item.name,
            value: item.value,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#83bff6' },
                { offset: 0.5, color: '#42A5F5' },
                { offset: 1, color: '#2196F3' }
              ])
            }
          }))
        }
      ]
    };
  }

  onDateRangeChange() {
    console.log('Date range:', this.startDate, this.endDate);
  }

  onProductChange() {
    this.updateChart(this.selectedPeriod);
  }

}
