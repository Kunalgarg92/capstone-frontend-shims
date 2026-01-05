import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AgentHeaderComponent } from './agent-header.component';

@Component({
  standalone: true,
  selector: 'app-agent-layout',
  imports: [CommonModule, RouterOutlet, AgentHeaderComponent],
  templateUrl: './agent-layout.component.html',
  styleUrls: ['./agent-layout.component.scss'],
})
export class AgentLayoutComponent {}
