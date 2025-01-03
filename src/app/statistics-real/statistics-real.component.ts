import { Component } from '@angular/core';
import { CommandStatsService } from '../service/command-stats.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-statistics-real',
  imports: [],
  templateUrl: './statistics-real.component.html',
  styleUrl: './statistics-real.component.scss'
})

export class StatisticsRealComponent {

  constructor(
    private commandStatsService: CommandStatsService,
    private http: HttpClient
  ) {}

  data: any;
  productStats: any; // Changed ProductStats to any since type is not defined

  async ngOnInit() {
    try {
      const response = await fetch('/iot-statistics/assets/numi2.json');  // 添加基础路径
      this.data = await response.json();
      this.productStats = this.commandStatsService.analyzeProductData(this.data);
      console.log(this.productStats);
    } catch (error) {
      console.error('Error loading JSON data:', error);
    }
  }



}
