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

  timeOptions: EChartsOption = {};
  cmdOptions: EChartsOption = {};

  constructor(private commandStatsService: CommandStatsService) {} 

  ngOnInit() {
    this.loadData();
  }

  private loadData() {
    this.commandStatsService.getToiletStats().subscribe((data: ToiletStats[]) => {
      this.toiletStats = data;
      this.updateTimeChart();
    });
  }

  onProductChange() {
    this.updateCommandChart();
  }

  onPeriodChange() {
    this.updateCommandChart();
  }

  private updateTimeChart() {
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
        data: this.toiletStats?.map(t => t.productCode) || []
      },
      yAxis: {
        type: 'value',
        name: 'Number of Uses'
      },
      series: [
        {
          name: 'Morning',
          type: 'bar',
          data: this.toiletStats?.map(t => t.statistics.morning)
        },
        {
          name: 'Afternoon',
          type: 'bar',
          data: this.toiletStats?.map(t => t.statistics.afternoon)
        },
        {
          name: 'Evening',
          type: 'bar',
          data: this.toiletStats?.map(t => t.statistics.evening)
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

    this.cmdOptions = {
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        type: 'scroll'
      },
      series: [
        {
          name: 'Commands',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '14',
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: topCommands.map(([name, value]) => ({
            name: name.replace('STATUS', ''),
            value: value
          }))
        }
      ]
    };
  }
}
