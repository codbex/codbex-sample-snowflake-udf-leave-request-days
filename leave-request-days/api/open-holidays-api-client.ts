import { client, HttpClientRequestOptions } from "sdk/http";
import { dateToString } from "./date-util";

export class OpenHolidaysAPIClient {

    public getPublicHolidays(countryIsoCode: string, fromDate: string, toDate: string): Set<string> {
        const options: HttpClientRequestOptions = {
            params: [
                {
                    name: "countryIsoCode",
                    value: countryIsoCode
                },
                {
                    name: "validFrom",
                    value: fromDate
                },
                {
                    name: "validTo",
                    value: toDate
                }
            ],
            headers: [
                {
                    name: "Accept",
                    value: "application/json"
                }
            ]
        };
        const httpResponse = client.get("https://openholidaysapi.org/PublicHolidays", options);

        if (httpResponse.statusCode != 200) {
            const errorMessage = `Received unexpected response: ${JSON.stringify(httpResponse)}`;
            throw new Error(errorMessage);
        }
        return this.extractPublicHolidays(httpResponse.text);
    }

    private extractPublicHolidays(jsonResponse: string): Set<string> {
        const holidaysResponse: HolidayDTO[] = JSON.parse(jsonResponse);

        const publicHolidays: Set<string> = new Set();

        holidaysResponse.forEach(holiday => {
            const startDate = new Date(holiday.startDate);
            const endDate = new Date(holiday.endDate);

            for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
                const dateString = dateToString(date);
                publicHolidays.add(dateString);
            }
        });
        return publicHolidays;
    }

}

export interface HolidayDTO {
    readonly id: string;
    readonly startDate: string;
    readonly endDate: string;
}
