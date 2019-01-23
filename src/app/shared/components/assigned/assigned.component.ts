import { Component, Input, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AngularFireDatabase } from '@angular/fire/database';

import { Observable } from 'rxjs';

@Component({
  selector: "app-assigned",
  templateUrl: "./assigned.component.html",
  styleUrls: ["./assigned.component.css"]
})
export class AssignedComponent implements OnInit {
  fullDevicesData: any[];
  assignedDevices: any[];
  unAssignedDevices: any[];
  fullDevicesLog: any[];

  items: any[];

  constructor(
    private db: AngularFireDatabase, 
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.db.list('devices')
      .snapshotChanges()
      .subscribe(devices => {
        this.fullDevicesData = devices.map(deviceSnapshot => {
          return { firebaseId: deviceSnapshot.key,  ...deviceSnapshot.payload.val() };
        });
        this.assignedDevices = this.fullDevicesData.filter(device => device.status === 'assigned');
        this.unAssignedDevices = this.fullDevicesData.filter(device => device.status === 'unassigned');
      });
  }

  markDeviceAsAssigned(employeeId, device) {
    const fieldsToUpdate = {
      status: 'assigned', 
      emp_id: employeeId,
      in_time: Date.now()
    }
    this.db.list('devices').update(device.firebaseId, {...fieldsToUpdate});
    this.addEventToTheCollection(device, fieldsToUpdate);
  }

  markDeviceAsUnassigned(device) {
    const fieldsToUpdate = {
      status: 'unassigned', 
      out_time: Date.now()
    }
    this.db.list('devices').update(device.firebaseId, { ...fieldsToUpdate });
    this.addEventToTheCollection(device, fieldsToUpdate);
  }

  private addEventToTheCollection(device, updatedFields) {

    const objectToPush = {
      ...device,
      ...updatedFields
    }

    this.db.list('events')
      .push(objectToPush);
  }

}
