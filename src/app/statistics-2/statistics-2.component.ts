import { Component } from '@angular/core';
import { ToiletStats } from '../service/command-stats.service';
import { CommandStatsService } from '../service/command-stats.service';
import { CommonModule } from '@angular/common';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import { EChartsOption } from 'echarts';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
@Component({
  selector: 'app-statistics-2',
  standalone: true,
  imports: [
    NgxEchartsDirective,
    CommonModule,
    MatCardModule,
    MatSelectModule,
    MatOptionModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatTooltipModule,
    FormsModule
  ],
  providers: [provideEchartsCore( {echarts: () => import('echarts')})],
  templateUrl: './statistics-2.component.html',
  styleUrl: './statistics-2.component.scss'
})

export class Statistics2Component {
  toiletStats: ToiletStats[] | undefined;
  selectedProduct: ToiletStats | null = null;
  selectedPeriod: 'morning' | 'afternoon' | 'evening' = 'morning';
  selectedYear: string = '2024';

  timeOptions: EChartsOption = {};
  cmdOptions: EChartsOption = {};

  totalDevices: number = 2399;

  constructor(private commandStatsService: CommandStatsService) {} 

  ngOnInit() {
    this.loadData();
  }

  private loadData() {
    this.commandStatsService.getToiletStats().subscribe((data: ToiletStats[]) => {
      this.toiletStats = data;
      console.log(this.toiletStats);
      this.updateTimeChart();
    });
  }

  onProductChange() {
    this.updateTimeChart();
    this.updateCommandChart();
  }

  onPeriodChange() {
    this.updateCommandChart();
  }

  onYearChange() {
    this.updateCommandChart();
  }

  private updateTimeChart() {
    if (!this.selectedProduct) return;
    const statistics = this.toiletStats?.filter(t => t.productCode === this.selectedProduct?.productCode);
    this.timeOptions = {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' }
      },
      legend: {
        data: ['Morning', 'Afternoon', 'Evening']
      },
      xAxis: {
        type: 'category',
        data: statistics?.map(t => t.productCode) || []
      },
      yAxis: {
        type: 'value',
        name: 'Number of Uses'
      },
      series: [
        {
          name: 'Morning',
          type: 'bar',
          data: statistics?.map(t => t.statistics.morning)
        },
        {
          name: 'Afternoon',
          type: 'bar',
          data: statistics?.map(t => t.statistics.afternoon)
        },
        {
          name: 'Evening',
          type: 'bar',
          data: statistics?.map(t => t.statistics.evening)
        }
      ]
    };
  }

  private updateCommandChart() {
    if (!this.selectedProduct || !this.selectedPeriod) return;

    const cmdStats = this.selectedProduct.cmdStatistics[this.selectedPeriod];
    const topCommands = Object.entries(cmdStats)
      .sort(([,a], [,b]) => (b as number) - (a as number));
      // .slice(0, 10);

    const top15Commands = topCommands.slice(0, 15);

    this.cmdOptions = {
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'horizontal',
        right: '5%',
        type: 'scroll',
        width: '45%',
      },
      grid: [{
        left: '8%',
        right: '50%',
        top: '10%',
        bottom: '10%'
      }],
      xAxis: [{
        gridIndex: 0,
        type: 'value',
        position: 'top'
      }],
      yAxis: [{
        gridIndex: 0,
        type: 'category',
        data: top15Commands.map(([name]) => name.replace(/STATUS[_]?\d+_/i, '')),
        inverse: true
      }],
      series: [
        {
          name: 'Top 15 Commands',
          type: 'bar',
          xAxisIndex: 0,
          yAxisIndex: 0,
          data: top15Commands.map(([, value]) => value),
          itemStyle: {
            borderRadius: [0, 4, 4, 0]
          },
          label: {
            show: true,
            position: 'right',
            formatter: '{c}',
            fontSize: 12
          }
        },
        {
          name: 'Commands Distribution',
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['75%', '50%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: true,
            formatter: '{b}: {c} ({d}%)',
            fontSize: 12
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '14',
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: true,
            length: 10,
            length2: 20
          },
          data: topCommands.map(([name, value]) => ({
            name: name.replace(/STATUS[_]?\d+_/i, ''),
            value: value
          }))
        }
      ]
    };
  }
}
