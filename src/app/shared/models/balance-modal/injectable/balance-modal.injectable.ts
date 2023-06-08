import { Injectable } from "@angular/core";
import BalanceModal from "../balance-modal";

@Injectable({ providedIn: 'root' })
export default class BalanceModalInjectable {
    public create(): BalanceModal {
      return new BalanceModal(null,null,null,null,null,null);
    }

}