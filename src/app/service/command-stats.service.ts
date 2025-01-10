import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map, Observable } from "rxjs";

interface Distribution {
  [year: string]: number;
  total: number;
}

interface ParamsDistributionItem {
  chain?: number;
  link?: number;
  TEMP?: string;
  OP?: string;
  LUMI?: number;
  THEME?: string;
  MSP?: string;
  VOL?: number;
  BASS?: number;
  TRE?: number;
  BAL?: number;
}

export interface ParamsDistribution {
  [year: string]: ParamsDistributionItem[];
}

export interface DataItem {
  cmdCode: string;
  distribution: Distribution;
  paramsDistribution: ParamsDistribution;
}

export interface ProductData {
  productCode: string;
  datas: DataItem[];
}

export interface ChainLinkFunction {
  chain: number;
  link: number;
  functionName: string;
}

export interface ToiletStats {
  productCode: string;
  statistics: {
    morning: number;
    afternoon: number;
    evening: number;
  };
  cmdStatistics: {
    morning: {
      [key: string]: number;
    };
    afternoon: {
      [key: string]: number;
    };
    evening: {
      [key: string]: number;
    };
  };
}

@Injectable({
  providedIn: 'root'
})

export class CommandStatsService {

  productData: ProductData | undefined;
  functionCounts: { [year: string]: { [functionName: string]: number } } = {};

  constructor(private http: HttpClient) {}

  private functionMap: ChainLinkFunction[] = [
    { chain: 60, link: 61, functionName: 'Toilet Power Save Mode' },
    { chain: 63, link: 50, functionName: 'Auto Lid' },
    { chain: 64, link: 30, functionName: 'Auto Flush' },
    { chain: 65, link: 0, functionName: 'Night Light' },
    { chain: 67, link: 12, functionName: 'Micro Wave' },
    { chain: 67, link: 20, functionName: 'Long time seat' },
    { chain: 68, link: 20, functionName: 'Auto Deodorize' },
    { chain: 68, link: 21, functionName: 'Auto UV' },
    { chain: 68, link: 22, functionName: 'Setting Welcome' },
  ];
  

  getProductData(): Observable<ProductData> {
    return this.http.get<ProductData>('/iot-statistics/assets/numi2.json').pipe(
      map((data: any) => data.rows[0])
    );
  }

  getProductFunctions(): Observable<{ [year: string]: { [functionName: string]: number } }> {
    return new Observable(observer => {
      this.getProductData().subscribe({
        next: (data: ProductData) => {
          this.productData = data;
          this.calculateFunctionCounts();
          observer.next(this.functionCounts);
          observer.complete();
        },
        error: (error) => observer.error(error)
      });
    });
  }

  calculateFunctionCounts() {
    if (!this.productData || !this.productData.datas) {
      return;
    }

    this.productData.datas.forEach(dataItem => {
      for (const year in dataItem.distribution) {
        if (year !== 'total' && dataItem.cmdCode !== 'MEM_READ') { // 排除 total
          this.functionCounts[year] = this.functionCounts[year] || {};
          this.functionCounts[year][dataItem.cmdCode] = (this.functionCounts[year][dataItem.cmdCode] || 0) + dataItem.distribution[year];
        }
      }
      for (const year in dataItem.paramsDistribution) {
        dataItem.paramsDistribution[year].forEach(param => {
          if (param.chain !== undefined && param.link !== undefined) {
            const functionName = this.getFunctionName(param.chain, param.link) || 'Unknown Function'; // 处理未找到的情况
            this.functionCounts[year] = this.functionCounts[year] || {};
            this.functionCounts[year][functionName] = (this.functionCounts[year][functionName] || 0) + 1;
          }
        });
      }
    });

    // console.log(this.functionCounts);
  }

  getFunctionName(chain: number, link: number): string {
    const func = this.functionMap.find(f => f.chain === chain && f.link === link);
    return func ? func.functionName : 'Unknown Function';
  }

  getToiletStats(): Observable<ToiletStats[]> {
    return this.http.get<any>('/iot-statistics/assets/ttt.json').pipe(
      map(jsonData => {
        const toiletStats: ToiletStats[] = [];
        jsonData.rows.forEach((row: any) => {
          toiletStats.push({
            productCode: row.productCode,
            statistics: {
              morning: row.statistics.morning,
              afternoon: row.statistics.afternoon,
              evening: row.statistics.evening
            },
            cmdStatistics: {
              morning: row.cmdStatistics.morning,
              afternoon: row.cmdStatistics.afternoon,
              evening: row.cmdStatistics.evening
            }
          });
        });
        return toiletStats;
      })
    );
  }
}
