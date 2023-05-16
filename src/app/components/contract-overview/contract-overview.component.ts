import { Component, OnInit  } from '@angular/core';
import { ContractOverviewService } from '../../api';
import { ContractOverviewPageResponse } from '../../api';
import { ContractOverview } from '../../api';
import { CardService } from '../../services/card.service';
import { ModalService } from '../../services/modal.service';
import { filter, map, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-contract-overview',
  templateUrl: './contract-overview.component.html',
  styleUrls: ['./contract-overview.component.scss']
})

export class ContractOverviewComponent implements OnInit {
  cardTitle: string = 'Contract Overview';

  params: any = {
    page: 0,
    size: 1,
    sort: 'UNSORTED'
  }

  contractOverviewPageResponse: ContractOverviewPageResponse = {
    page: 0,
    size: 0,
    numberOfPages: 0,
    numberOfItems: 0,
    sort: ContractOverviewPageResponse.SortEnum.Unsorted,
    overviewItems: []
  }

  contracts: ContractOverview[] = [];
  contractsId: (number | undefined)[] = [0];

  selectedContractId: number = 0;

  displayedColumns: string[] = [
    'contractNo',
    'customer',
    'vehicle',
    'vin',
    'monthlyRate',
    'vehiclePrice',
    'detailsLink'
  ];

  constructor(
    private contractOverviewService: ContractOverviewService,
    public cardService: CardService,
    public modalService: ModalService
  ) {
    this.cardService.contractUpdate$.subscribe(() => {
      this.fetchContracts();
    });
  }

  ngOnInit(): void {
    this.fetchContracts();
  }

  fetchContracts(): void {
    this.contractOverviewService.getContractOveriew(this.params)
    .pipe(
      tap((contractOverviewPageResponse) => {
        this.params.size = contractOverviewPageResponse.numberOfItems;
      }),
      switchMap(() => this.contractOverviewService.getContractOveriew(this.params)),
      filter((contractOverviewPageResponse) => !!contractOverviewPageResponse.overviewItems),
      map((contractOverviewPageResponse) => contractOverviewPageResponse.overviewItems ?? []),
    )
    .subscribe((contracts) => {
      this.contracts = contracts;
    });
  }

  selectContract(id: number): void {
    this.selectedContractId = id;
    this.cardService.open();
  }

}
