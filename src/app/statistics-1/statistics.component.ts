import { Component } from '@angular/core';
import { CommandStatsService, ProductData, ParamsDistribution } from '../service/command-stats.service';
import { CommonModule } from '@angular/common';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-statistics-1',
  standalone: true,
  imports: [
    CommonModule,
    NgxEchartsDirective,
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
  templateUrl: './statistics-1.component.html',
  styleUrl: './statistics-1.component.scss'
})

export class Statistics1Component {

  productData: ProductData | undefined;
  functionCounts: { [year: string]: { [functionName: string]: number } } = {};

  selectedYear: string = '';
  chartOption: any;
  toiletStats: string[] = ["NUMI2.0"];
  selectedProduct: string = this.toiletStats[0];


  constructor( private commandStatsService: CommandStatsService) {}

  ngOnInit() {
    // this.commandStatsService.getProductData().subscribe((data: ProductData) => {
    //   this.productData = data;
    //   console.log(this.productData);
    // });

    this.commandStatsService.getProductFunctions().subscribe((data: { [year: string]: { [functionName: string]: number } }) => {
      this.functionCounts = data;
      console.log(this.functionCounts);

      const years = this.getFunctionCounts(this.functionCounts);
      if (years.length > 0) {
        this.selectedYear = years[0];
        this.updateChart();
      }
    });

  }

  updateChart() {
    const functionNames = this.getFunctionNames(this.selectedYear);
    const values = functionNames.map(name => ({
      name: name,
      value: this.functionCounts[this.selectedYear][name]
    }));
  
    this.chartOption = {
      title: {
        text: `${this.selectedYear}年功能使用统计`,
        left: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        top: 'middle'
      },
      series: [{
        name: '功能使用',
        type: 'pie',
        radius: '50%',
        data: values,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }]
    };
  }

  // Watch for year changes
  onYearChange() {
    console.log(this.selectedYear);
    if (this.selectedYear) {
      this.updateChart();
    }
  }

  getYears(paramsDistribution: ParamsDistribution): string[] {
    return Object.keys(paramsDistribution);
  }

  getFunctionCounts(functionCounts: { [year: string]: { [functionName: string]: number } }): string[] {
    return Object.keys(functionCounts);
  }

  getFunctionNames(year: string): string[] {
    return Object.keys(this.functionCounts[year]);
  }

  onProductChange() {
    // this.updateChart();
  }
  
}
