import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminUserService } from '../services/admin-user.service';
import { AdminPlanService } from '../services/admin-plan.service';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-admin-dashboard',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminDashboardComponent implements OnInit {
  users: any[] = [];
  plans: any[] = [];

  activeTab: 'USERS' | 'PLANS' = 'PLANS';

  // Track visibility and edit mode
  showUserForm = false;
  showPlanForm = false;
  isEditMode = false;
  selectedId: number | null = null;

  createUserForm!: FormGroup;
  createPlanForm!: FormGroup;

  constructor(
    private userService: AdminUserService,
    private planService: AdminPlanService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForms();
    this.loadUsers();
    this.loadPlans();
  }

  initForms() {
    this.createUserForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: [''], // Optional during update
      role: ['CUSTOMER', Validators.required],
      active: [true], // Added for update functionality
    });

    this.createPlanForm = this.fb.group({
      name: ['', Validators.required],
      coverageLimit: ['', Validators.required],
      premiumAmount: ['', Validators.required],
      durationYears: ['', Validators.required],
    });
  }

  // --- USER METHODS ---
  openUserForm(user?: any) {
    this.isEditMode = !!user;
    this.selectedId = user ? user.id : null;
    this.showUserForm = true;

    if (user) {
      this.createUserForm.patchValue({
        email: user.email,
        role: user.role,
        active: user.active,
      });
      this.createUserForm.get('password')?.clearValidators();
    } else {
      this.createUserForm.reset({ role: 'CUSTOMER', active: true });
      this.createUserForm.get('password')?.setValidators(Validators.required);
    }
    this.createUserForm.get('password')?.updateValueAndValidity();
  }

  saveUser() {
    if (this.createUserForm.invalid) return;
    const payload = this.createUserForm.value;

    if (this.isEditMode && this.selectedId) {
      // Update payload per your requirements: { role, active }
      const updatePayload = { role: payload.role, active: payload.active };
      this.userService
        .updateUser(this.selectedId, updatePayload)
        .subscribe(() => this.finalizeUserAction());
    } else {
      this.userService.createUser(payload).subscribe(() => this.finalizeUserAction());
    }
  }

  finalizeUserAction() {
    this.showUserForm = false;
    this.loadUsers();
  }

  // --- PLAN METHODS ---
  openPlanForm(plan?: any) {
    this.isEditMode = !!plan;
    this.selectedId = plan ? plan.id : null;
    this.showPlanForm = true;

    if (plan) {
      this.createPlanForm.patchValue(plan);
    } else {
      this.createPlanForm.reset();
    }
  }

  savePlan() {
    if (this.createPlanForm.invalid) return;
    const payload = this.createPlanForm.value;

    if (this.isEditMode && this.selectedId) {
      this.planService
        .updatePlan(this.selectedId, payload)
        .subscribe(() => this.finalizePlanAction());
    } else {
      this.planService.createPlan(payload).subscribe(() => this.finalizePlanAction());
    }
  }

  finalizePlanAction() {
    this.showPlanForm = false;
    this.loadPlans();
  }

  // Common Loaders
  loadUsers() {
    this.userService.getUsers().subscribe((res) => (this.users = res));
  }
  loadPlans() {
    this.planService.getPlans().subscribe((res) => (this.plans = res));
  }
  deleteUser(id: number) {
    this.userService.deleteUser(id).subscribe(() => this.loadUsers());
  }
  deletePlan(id: number) {
    this.planService.deletePlan(id).subscribe(() => this.loadPlans());
  }
}
