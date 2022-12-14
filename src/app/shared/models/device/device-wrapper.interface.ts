import { GetLanguageCodeResult } from "@capacitor/device";

export interface DeviceWrapper {
	getLanguageCode(): Promise<GetLanguageCodeResult>;
}	