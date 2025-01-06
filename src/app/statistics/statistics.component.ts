import { Component } from '@angular/core';
import { CommandStatsService, ProductData, ParamsDistribution } from '../service/command-stats.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-statistics-real',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.scss'
})

export class StatisticsComponent {

  productData: ProductData | undefined;
  functionCounts: { [year: string]: { [functionName: string]: number } } = {};

  constructor( private commandStatsService: CommandStatsService) {}

  ngOnInit() {
    this.commandStatsService.getProductData().subscribe((data: ProductData) => {
      this.productData = data;
      console.log(this.productData);
    });

    this.commandStatsService.getFunctionCounts().subscribe((data: { [year: string]: { [functionName: string]: number } }) => {
      this.functionCounts = data;
    });
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
  
}
