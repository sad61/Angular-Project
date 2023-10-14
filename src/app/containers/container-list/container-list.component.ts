import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Container } from '../container';
import { ContainersService } from '../services/containers.service';
import { ContainersComponent } from '../containers.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-container-list',
  templateUrl: './container-list.component.html',
  styleUrls: ['./container-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContainerListComponent {
  @Input() containers: Container[] | null = [];
  @Input() xesque: number = 0;

  @Output() selectedContainer = new EventEmitter<Container>();

  @ViewChild(ContainersComponent) container!: ContainersComponent;

  constructor(
    private containersService: ContainersService,
    private router: Router
  ) {}

  selectContainer(container: Container) {
    container.booked = !container.booked;
    this.selectedContainer.emit(container);
  }

  deleteContainer(container: Container) {}

  onButtonClick() {
    this.router.navigate(['./employee']);
  }
}
