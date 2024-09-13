import { Controller, Post } from "sdk/http"
import { FunctionParamsDTO, FunctionResultDTO } from "./function-data-dto"

@Controller
class SnowflakeUDFService {

    @Post("/")
    public executeFunction(dto: FunctionParamsDTO): FunctionResultDTO {
        const resultRows: [number, any][] = [];

        dto.data.forEach((rowData) => {
            const rowIndex: number = rowData[0];

            const params: any[] = rowData.slice(1);

            const countryIsoCode: string = params[0]; // example: DE
            const fromDate: string = params[1]; // YYYY-MM-DD
            const toDate: string = params[2]; // YYYY-MM-DD
            const totalLeaveDays = this.calculateDays(countryIsoCode, fromDate, toDate);
            const functionReturnValue = totalLeaveDays;

            const resultRow: [number, any] = [rowIndex, functionReturnValue];

            resultRows.push(resultRow);
        });
        return {
            data: resultRows
        };
    }

    private calculateDays(countryIsoCode: string, fromDate: string, toDate: string): number {
        const from = new Date(fromDate);
        const to = new Date(toDate);

        // Ensure the period is inclusive
        to.setDate(to.getDate() + 1);

        let totalLeaveDays = 0;

        for (let date = new Date(from); date < to; date.setDate(date.getDate() + 1)) {
            // Check if the day is a weekday (0=Sunday, 6=Saturday)
            if (this.isWeekDay(date)) {
                totalLeaveDays++;
            }
        }

        return totalLeaveDays;
    }

    private isWeekDay(date: Date): boolean {
        const dayOfWeek = date.getDay();
        return dayOfWeek !== 0 && dayOfWeek !== 6; // 0=Sunday, 6=Saturday)
    }

}
