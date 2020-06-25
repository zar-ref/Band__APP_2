import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-zone',
  templateUrl: './admin-zone.component.html',
  styleUrls: ['./admin-zone.component.scss']
})
export class AdminZoneComponent implements OnInit {

  private userSub: Subscription;
  private adminToken: string;
  private adminName: string



  constructor(private authService: AuthService , private router: Router) { }

  ngOnInit() {
   
  }

}
