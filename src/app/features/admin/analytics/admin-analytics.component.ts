import {
  Component,
  OnInit,
  signal,
  computed,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminUserService } from '../services/admin-user.service';
import { AdminPlanService } from '../services/admin-plan.service';

interface AnalyticsData {
  totalUsers: number;
  userRoles: { [key: string]: number };
  totalPlans: number;
  totalClaims: number;
  claimsStatus: { approved: number; pending: number; rejected: number };
  plans: any[]; // Add plans array
}

@Component({
  selector: 'app-admin-analytics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-analytics.component.html',
  styleUrls: ['./admin-analytics.component.scss'],
})
export class AdminAnalyticsComponent implements OnInit, AfterViewInit {
  @ViewChild('userChart') userChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('claimsChart') claimsChartRef!: ElementRef<HTMLCanvasElement>;

  loading = signal(true);
  data = signal<AnalyticsData | null>(null);
  plansList = signal<any[]>([]);

  totalCustomers = computed(() => this.data()?.userRoles['CUSTOMER'] || 0);
  totalAgents = computed(
    () => this.data()?.userRoles['INSURANCE_AGENT'] || this.data()?.userRoles['AGENT'] || 0
  );
  totalHospitals = computed(() => this.data()?.userRoles['HOSPITAL'] || 0);
  totalOfficers = computed(
    () => this.data()?.userRoles['CLAIMS_OFFICER'] || this.data()?.userRoles['CLAIM_OFFICER'] || 0
  );

  constructor(private userService: AdminUserService, private planService: AdminPlanService) {}

  ngOnInit() {
    this.loadAnalytics();
  }

  ngAfterViewInit() {
    // Charts will init after data loads
  }

  //   loadAnalytics() {
  //     this.loading.set(true);
  //     this.userService.getUsers().subscribe({
  //       next: (users: any[]) => {
  //         this.planService.getPlans().subscribe({
  //           next: (plans: any[]) => {
  //             // Debug: Log raw roles to see backend format
  //             console.log(
  //               'Raw user roles:',
  //               users.map((u) => ({ email: u.email, role: u.role, roleName: u.roleName }))
  //             );

  //             // Handle ALL possible role formats from your backend
  //             const userRoles: { [key: string]: number } = {
  //               CUSTOMER: 0,
  //               AGENT: 0,
  //               INSURANCE_AGENT: 0,
  //               HOSPITAL: 0,
  //               CLAIM_OFFICER: 0,
  //               CLAIMS_OFFICER: 0,
  //             };

  //             users.forEach((user: any) => {
  //               let role = (user.role || user.roleName || 'CUSTOMER').toUpperCase();

  //               // Normalize common variations
  //               if (role.includes('AGENT')) role = 'INSURANCE_AGENT';
  //               if (role.includes('CLAIM') || role.includes('OFFICER')) role = 'CLAIM_OFFICER';

  //               userRoles[role] = (userRoles[role] || 0) + 1;
  //             });

  //             const analytics: AnalyticsData = {
  //               totalUsers: users.length,
  //               userRoles,
  //               totalPlans: plans.length,
  //               totalClaims: 1284,
  //               claimsStatus: { approved: 892, pending: 312, rejected: 80 },
  //               plans: plans.slice(0, 6), // Top 6 plans
  //             };

  //             this.data.set(analytics);
  //             this.plansList.set(plans);
  //             this.loading.set(false);
  //             this.initCharts(); // Init charts after data
  //           },
  //           error: (err) => {
  //             console.error('Plans error:', err);
  //             this.loading.set(false);
  //           },
  //         });
  //       },
  //       error: (err) => {
  //         console.error('Users error:', err);
  //         this.loading.set(false);
  //       },
  //     });
  //   }

  loadAnalytics() {
    this.loading.set(true);
    this.userService.getUsers().subscribe({
      next: (users: any[]) => {
        this.planService.getPlans().subscribe({
          next: (plans: any[]) => {
            console.log(
              'Raw user roles:',
              users.map((u) => ({ email: u.email, role: u.role, roleName: u.roleName }))
            );

            // Handle ALL possible role formats from your backend
            const userRoles: { [key: string]: number } = {
              CUSTOMER: 0,
              AGENT: 0,
              INSURANCE_AGENT: 0,
              HOSPITAL: 0,
              CLAIM_OFFICER: 0,
              CLAIMS_OFFICER: 0,
            };

            users.forEach((user: any) => {
              let role = (user.role || user.roleName || 'CUSTOMER').toUpperCase();

              // Normalize common variations
              if (role.includes('AGENT')) role = 'INSURANCE_AGENT';
              if (role.includes('CLAIM') || role.includes('OFFICER')) role = 'CLAIM_OFFICER';

              userRoles[role] = (userRoles[role] || 0) + 1;
            });

            console.log('Backend Plan Data Sample:', plans[0]);

            // Inside loadAnalytics() -> next: (plans: any[]) => { ... }
            const analytics: AnalyticsData = {
              totalUsers: users.length,
              userRoles,
              totalPlans: plans.length,
              totalClaims: 1284,
              claimsStatus: { approved: 892, pending: 312, rejected: 80 },
              plans: plans.slice(0, 6).map((p) => ({
                id: p.id,
                name: p.name || 'Unnamed Plan',
                category: p.category || 'Health Insurance', // Default if missing
                price: p.premiumAmount, // <--- MAPPED CORRECTLY
                duration: p.durationYears, // <--- MAPPED CORRECTLY
                limit: p.coverageLimit, // Added this since backend sends it
              })),
            };

            this.data.set(analytics);
            this.plansList.set(plans);
            this.loading.set(false);

            setTimeout(() => {
              this.initCharts();
            }, 0);
          },
          error: (err) => {
            console.error('Plans error:', err);
            this.loading.set(false);
          },
        });
      },
      error: (err) => {
        console.error('Users error:', err);
        this.loading.set(false);
      },
    });
  }

  private initCharts() {
    this.drawUserDonut();
    this.drawClaimsBar();
  }

  private drawUserDonut() {
    const ctx = this.userChartRef.nativeElement.getContext('2d');
    if (!ctx || !this.data()) return;
    const total = Object.values(this.data()!.userRoles).reduce((a, b) => a + (b as number), 0);
    let startAngle = -Math.PI / 2;

    ctx.clearRect(0, 0, 300, 300);

    // Draw slices
    const colors = ['#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
    const roles = ['CUSTOMER', 'INSURANCE_AGENT', 'HOSPITAL', 'CLAIM_OFFICER'];

    roles.forEach((role, i) => {
      const value = this.data()!.userRoles[role] || 0;
      const sliceAngle = (value / total) * 2 * Math.PI;

      ctx.beginPath();
      ctx.arc(150, 150, 110, startAngle, startAngle + sliceAngle);
      ctx.lineWidth = 20;
      ctx.strokeStyle = colors[i];
      ctx.lineCap = 'round';
      ctx.stroke();

      startAngle += sliceAngle;
    });
  }

  private drawClaimsBar() {
    const ctx = this.claimsChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, 300, 200);

    const data = [
      { label: 'Approved', value: 892, color: '#10b981' },
      { label: 'Pending', value: 312, color: '#f59e0b' },
      { label: 'Rejected', value: 80, color: '#ef4444' },
    ];

    const maxHeight = 120;
    const barWidth = 35;
    const gap = 25;

    data.forEach((item, i) => {
      const height = (item.value / 900) * maxHeight;

      // Background bar
      ctx.fillStyle = '#f1f5f9';
      ctx.fillRect(40 + i * (barWidth + gap), 200 - maxHeight, barWidth, maxHeight);

      // Foreground bar
      ctx.fillStyle = item.color;
      ctx.fillRect(40 + i * (barWidth + gap), 200 - height, barWidth, height);

      // Label
      ctx.fillStyle = '#374151';
      ctx.font = '12px Inter';
      ctx.textAlign = 'center';
      ctx.fillText(item.value.toString(), 57.5 + i * (barWidth + gap), 185);
    });
  }
}
