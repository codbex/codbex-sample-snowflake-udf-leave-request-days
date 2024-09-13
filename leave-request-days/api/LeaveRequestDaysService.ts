import { Controller, Post } from "sdk/http"
import { FunctionParamsDTO, FunctionResultDTO } from "./function-data-dto"

@Controller
class SnowflakeService {

    @Post("/")
    public sendData(dto: FunctionParamsDTO): FunctionResultDTO {
        const resultRows: [number, any][] = [];

        dto.data.forEach((rowData) => {
            const rowIndex: number = rowData[0];

            const params: any[] = rowData.slice(1);

            // YYYY-MM-DD
            const fromDate: string = params[0]; // 2023-09-01
            const toDate: string = params[1]; // 2023-09-05
            console.log(`Received fromDate [${fromDate}] and toDate [${toDate}] for index ${rowIndex}`);
            const functionReturnValue = params.join("|");

            const resultRow: [number, any] = [rowIndex, functionReturnValue];

            resultRows.push(resultRow);
        });
        return {
            data: resultRows
        };

    }

}
