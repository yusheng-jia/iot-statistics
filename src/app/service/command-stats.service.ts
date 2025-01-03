import { Injectable } from "@angular/core";

interface ChainLinkFunction{
  chain: number,
  link: number,
  functionName: string
}

interface CommandStats {
  cmdCode: string;
  totalUsage: number;
  yearlyUsage: { [year: string]: number };
  functionDistribution: {
    [functionName: string]: number;
  };
  unknownCombinations: Array<{ chain: number; link: number; count: number }>;
}

interface ProductStats{
  productCode: string;
  commands: CommandStats[];
}


@Injectable({
  providedIn: 'root'
})
export class CommandStatsService {

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

  analyzeProductData(data: any): ProductStats[] {
    return data.rows.map((row: { productCode: any; datas: any; }) => {
      return {
        productCode: row.productCode,
        commands: this.analyzeCommands(row.datas)
      };
    });
  }

  analyzeCommands(paramsData: any): CommandStats[] {
    return Object.entries(paramsData).map(([cmdCode, data]) => {
      const functionDistribution: { [key: string]: number } = {};
      const unknownCombinations: Array<{ chain: number; link: number; count: number }> = [];
      let totalUsage = 0;
      const yearlyUsage: { [year: string]: number } = {};

      Object.entries(data as { [key: string]: unknown[] }).forEach(([year, params]) => {
        yearlyUsage[year] = params.length;
        totalUsage += params.length;
        params.forEach((param: unknown) => {
          if (typeof param !== 'object' || param === null) return;
          const typedParam = param as { chain: unknown; link: unknown };
          const chain = Number(typedParam.chain);
          const link = Number(typedParam.link);
          
          const foundFunction = this.functionMap.find(f =>
            f.chain === chain && f.link === link
          );

          if (foundFunction) {
            functionDistribution[foundFunction.functionName] = 
              (functionDistribution[foundFunction.functionName] || 0) + 1;
          } else {
            const existingUnknown = unknownCombinations.find(u => 
              u.chain === chain && u.link === link
            );

            if (existingUnknown) {
              existingUnknown.count++;
            } else {
              unknownCombinations.push({ chain, link, count: 1 });
            }
          }
        });
      });

      return {
        cmdCode,
        totalUsage,
        yearlyUsage,
        functionDistribution,
        unknownCombinations
      };
    });
  }

  // addFunctionMapping(chain: number, link: number, functionName: string): void {
  //   this.functionMap.push({ chain, link, functionName });
  // }

  // getUnknownCombinations(cmdStats: CommandStats[]): Array<{ chain: number; link: number; count: number }> {
  //   return cmdStats.reduce((acc, cmd) => {
  //     return [...acc, ...cmd.unknownCombinations];
  //   }, [] as Array<{ chain: number; link: number; count: number }>);
  // }
}