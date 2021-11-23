import {
  Component,
  OnChanges,
  OnDestroy,
  OnInit,
  QueryList,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewChildren
} from '@angular/core';
import {Router} from '@angular/router';
import {NbIconConfig, NbMenuItem, NbMenuService, NbPopoverDirective, NbSidebarService} from '@nebular/theme';
import {NbWindowService} from '@nebular/theme';
import {AuthenticationService} from '../../../_services';
import {speedDialFabAnimations} from './speed-dial-fab.animations';
import {ObjectifV2Component} from '../patient/objectif-v2/objectif-v2.component';
import {Subscription} from 'rxjs';
import {PatientDataBetweenComponentsService} from '../../../_services/PatientDataBetweenComponentsService';
import {PatientDto} from '../../../dto/patient/PatientDto';
import {ExamencliniqueComponent} from "../patient/examenclinique/examenclinique.component";


@Component({
  selector: 'app-side-bar-fab-button',
  templateUrl: './side-bar-fab-button.component.html',
  styleUrls: ['./side-bar-fab-button.component.scss'],
  animations: speedDialFabAnimations
})
export class SideBarFabButtonComponent implements OnInit, OnDestroy, OnChanges {

  title = 'IPOD-SANTE';
  currentRole = localStorage.getItem('currentRole');
  disabledIconConfig: NbIconConfig = {icon: 'settings-2-outline', pack: 'eva'};


  @ViewChild('escClose', {read: TemplateRef}) escCloseTemplate: TemplateRef<HTMLElement>;
  @ViewChild('disabledEsc', {read: TemplateRef}) disabledEscTemplate: TemplateRef<HTMLElement>;
  @ViewChildren(NbPopoverDirective) popover: QueryList<NbPopoverDirective>;

  toggleOn = false;
  toggleOff = true;
  selectedItem: string;

  MENU_ITEMS1: NbMenuItem[] = [
    {
      title: 'Accueil',
      link: '/listpatient',
      icon: 'home-outline',
      home: true,
    }, /*
    {
      title: 'Profile',
      icon: 'person-outline',
      link: '/profile',
    },*/
  ];

  MENU_ITEMS2: NbMenuItem[] = [
    {
      title: 'Guide',
      icon: 'bulb-outline',
      url: 'https://sway.office.com/L1oSmMGRpJHiiFh9?authoringPlay=true&publish',
      target: '_blank',
    },
    {
      title: 'Deconnexion',
      icon: 'log-out-outline',
    }
  ];

  fabButtons = [
    {
      icon: 'file-add-outline',
      title: 'Objectif',
    },
    {
      icon: 'file-add-outline',
      title: 'Fitbit',
    },
    {
      icon: 'file-add-outline',
      title: 'Examen clinique',
    },
    {
      icon: 'file-add-outline',
      title: 'Bilan lipide',
    },
  ];
  buttons = [];
  fabTogglerState = 'inactive';

  message: string;
  subscription: Subscription;
  patient: PatientDto;

  constructor(private windowService: NbWindowService,
              private router: Router,
              private sidebarService: NbSidebarService,
              private menuService: NbMenuService,
              private authService: AuthenticationService,
              private data: PatientDataBetweenComponentsService) { }


  ngOnInit(){
    this.getSelectedItem();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.subscription = this.data.currentMessage.subscribe(message => message = this.patient.toString());
  }

  toggle() {
    this.sidebarService.toggle(true, 'left');
    if (this.toggleOn) {
      this.toggleOff = true;
      this.toggleOn = false;
    } else if (this.toggleOff) {
      this.toggleOn = true;
      this.toggleOff = false;
    }
  }

  showItems() {
    this.fabTogglerState = 'active';
    this.buttons = this.fabButtons;
    setTimeout(() => {
      this.openPopover();
    }, 5);
  }

  hideItems() {
    this.fabTogglerState = 'inactive';
    this.buttons = [];
    this.closePopover();
  }

  onToggleFab() {
    if (this.buttons.length) {
      this.hideItems();
    } else {
      this.showItems();
    }
  }

  openWindow(window: string) {
    let component;
    let title;
    if (window === 'Objectif'){
      component = ObjectifV2Component;
      title = 'Objectif';
      console.log(this.message);
    } else if (window === 'Fitbit'){
      component = ObjectifV2Component;
      title = 'Fitbit';
    } else if (window === 'Examen clinique'){
      component = ExamencliniqueComponent;
      title = 'Examen clinique';
    } else if (window === 'Bilan lipide'){
      component = ObjectifV2Component;
      title = 'Bilan lipide';
    } else if (window === 'Barrieres et solutions'){
      component = ObjectifV2Component;
      title = 'Barrieres et solutions';
    }
    this.windowService.open(component, {title});
  }

  openPopover() {
    this.popover.toArray().forEach(elm => elm.show());
  }

  closePopover() {
    this.popover.toArray().forEach(elm => elm.hide());
  }

  logOut() {
    this.authService.logout();
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  getSelectedItem() {
    this.menuService.onItemClick().subscribe((data) => {
      console.log('**********************' + data.item.title);

      if (data.item.title === 'Deconnexion') {
        this.logOut();
      }
    });

  }

  updatePatient() {
    this.data.changeMessage('Hello from Sibling');
  }

}