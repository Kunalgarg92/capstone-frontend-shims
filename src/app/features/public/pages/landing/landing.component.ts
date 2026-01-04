import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { HeroComponent } from '../../../../shared/ui/hero/hero.component';
import { ServiceCardComponent } from '../../../../shared/ui/service-card/service-card.component';
import { FooterComponent } from '../../../../shared/components/footer/footer.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, HeaderComponent, HeroComponent, ServiceCardComponent, FooterComponent],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
})
export class LandingComponent {
  services = [
    {
      title: 'Policy Management',
      description: 'Create, manage, renew and suspend insurance policies easily.',
    },
    {
      title: 'Claims Processing',
      description: 'End-to-end claim lifecycle with approvals and payouts.',
    },
    {
      title: 'Hospital Network',
      description: 'Manage hospitals, treatments, and cashless claims.',
    },
    {
      title: 'Analytics & Reports',
      description: 'Real-time dashboards with premium vs payout insights.',
    },
  ];
}
