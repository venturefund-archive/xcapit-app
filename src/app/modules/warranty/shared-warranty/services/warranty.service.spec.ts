import { TestBed } from "@angular/core/testing";
import { of } from "rxjs";
import { CustomHttpService } from "src/app/shared/services/custom-http/custom-http.service";
import { WarrantyService } from "./warranty.service";

describe('WarrantyService', ()=>{
  let warrantyService: WarrantyService;
  let customHttpServiceSpy: jasmine.SpyObj<CustomHttpService>;

  beforeEach(() => {
    customHttpServiceSpy = jasmine.createSpyObj('CustomHttpService', {
      post: of({}),
    });

    TestBed.configureTestingModule({
      providers: [
        { provide: CustomHttpService, useValue: customHttpServiceSpy },
      ],
    });
    warrantyService = TestBed.inject(WarrantyService);
  });

  it('should be created', () => {
    expect(warrantyService).toBeTruthy();
  });

  it('should call post on http when createWarranty', () => {
    warrantyService.createWarranty({}).subscribe(() => {
      expect(customHttpServiceSpy.post).toHaveBeenCalledTimes(1);
    });
  });
})