import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html'
})
export class NavbarComponent implements OnInit, OnDestroy {

  userName = '';
  countdown = '';
  private expiryTime?: number;
  private timerId?: any;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadUserInfo();
  }
toggleSidebar(){
  document.body.classList.toggle("sidebar-collapsed");
}
  ngOnDestroy(): void {
    if (this.timerId) {
      clearInterval(this.timerId);
    }
  }

  private loadUserInfo() {
    this.http.get<any>(
      'http://localhost:5128/api/auth/me',
      { withCredentials: true }
    ).subscribe(res => {
      this.userName = res.userName;
      this.expiryTime = new Date(res.expiresAt).getTime();
      this.startTimer();
    });
  }

  private startTimer() {
    if (!this.expiryTime) return;

    this.timerId = setInterval(() => {
      const diff = this.expiryTime! - Date.now();

      if (diff <= 0) {
        this.countdown = 'Expired';
        clearInterval(this.timerId);
        return;
      }

      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);

      this.countdown = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
  }

  logout() {
    this.http.post(
      'http://localhost:5128/api/auth/logout',
      {},
      { withCredentials: true }
    ).subscribe(() => location.href = '/login');
  }
}
